const { Router } = require("express");
const CourseModel = require('../dbModels/courseModel');
const auth = require("../middleware/auth");

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
    data,
    userId: req.session.user? req.session.user._id.toString(): null
  }); 
});


/////////////////////////////////////////////////////////
// Router for editing course by ID
router.get("/:id/edit", auth, async (req, res) => {
  const data = await CourseModel.findById(req.params.id).lean();
  if(req.session.user._id.toString() !== data.idUser.toString()){
    return res.redirect('/courses');
  }
  res.render("editCourse", {
    title: 'Edit',
    layout: 'empty',
    data
  }); 
});


/////////////////////////////////////////////////////////
// Receive edited data after submit
router.post('/:id/edit', auth, async(req, res)=>{
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
router.post('/remove', auth, async(req, res)=>{
  await CourseModel.deleteOne({
    _id: req.body.id,
    idUser: req.session.user._id
  });
  res.redirect('/courses');
})


module.exports = router;