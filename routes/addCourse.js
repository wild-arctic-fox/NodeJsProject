const { Router } = require("express");
const CourseModel = require('../models/courseModel');

/////////////////////////////////////////////////////////
// Router for adding new Course
/////////////////////////////////////////////////////////
const router = Router();

/////////////////////////////////////////////////////////
// Display empty form
router.get("/", (req, res) => {
  res.render("addCourse", {
    title: "Add Course",
    data: {},
  }); 
});

/////////////////////////////////////////////////////////
// Receive data after submit
router.post('/',async(req, res)=>{
    const courseModel = new CourseModel(req.body);
    await courseModel.save();
    res.redirect('/courses');
})

module.exports = router;
