const { Router } = require("express");
const CourseModel = require('../dbModels/courseModel');

/////////////////////////////////////////////////////////
// Router for displaying courses
/////////////////////////////////////////////////////////
const router = Router();


/////////////////////////////////////////////////////////
// Router for displaying all courses
router.get("/", async (req, res) => {
  const data = await CourseModel.find().lean();
  res.render("courses", {
    title: "All courses",
    data, 
  }); 
}); 


/////////////////////////////////////////////////////////
// Router for displaying course by ID
router.get("/:id", async (req, res) => {
  const data = await CourseModel.findById(req.params.id).lean();
  res.render("course", {
    title: 'Course',
    layout: 'empty',
    data
  }); 
});


/////////////////////////////////////////////////////////
// Router for editing course by ID
router.get("/:id/edit", async (req, res) => {
  const data = await CourseModel.findById(req.params.id).lean();
  res.render("editCourse", {
    title: 'Edit',
    layout: 'empty',
    data
  }); 
});


/////////////////////////////////////////////////////////
// Receive edited data after submit
router.post('/:id/edit',async(req, res)=>{
  const { name, author, email, price, en, rus, resourses } = req.body;
  const courseModel = {
    name,
    author,
    email,
    price: +price,
    resourses: !!resourses,
    en: !!en,
    rus: !!rus,
  };
  await CourseModel.findByIdAndUpdate(req.body.id,courseModel);
  res.redirect('/courses');
});


/////////////////////////////////////////////////////////
// Receive id course, needded to delete & delete it
router.post('/remove',async(req, res)=>{
  await CourseModel.deleteOne({_id:req.body.id});
  res.redirect('/courses');
})


module.exports = router;