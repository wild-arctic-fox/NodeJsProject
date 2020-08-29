const { Router } = require("express");
const CourseModel = require('../models/courseModel');

/////////////////////////////////////////////////////////
// Router for displaying courses
/////////////////////////////////////////////////////////
const router = Router();


/////////////////////////////////////////////////////////
// Router for displaying all courses
router.get("/", async (req, res) => {
  const data = await CourseModel.getAllCourses();
  res.render("courses", {
    title: "All courses",
    data, 
  }); 
}); 


/////////////////////////////////////////////////////////
// Router for displaying course by ID
router.get("/:id", async (req, res) => {
  const data = await CourseModel.getCourseById(req.params.id);
  res.render("course", {
    title: 'Course',
    layout: 'empty',
    data
  }); 
});


/////////////////////////////////////////////////////////
// Router for editing course by ID
router.get("/:id/edit", async (req, res) => {
  const data = await CourseModel.getCourseById(req.params.id);
  res.render("editCourse", {
    title: 'Edit',
    layout: 'empty',
    data
  }); 
});


/////////////////////////////////////////////////////////
// Receive edited data after submit
router.post('/:id/edit',async(req, res)=>{
  await CourseModel.updateCourse(req.body);
  res.redirect('/courses');
})
module.exports = router;