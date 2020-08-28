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
    title: `Course `,
    data
  }); 
});

module.exports = router;
