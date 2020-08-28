const { Router } = require("express");
const CourseModel = require('../models/courseModel');

const router = Router();

router.get("/", (req, res) => {
  res.render("addCourse", {
    title: "Add Course",
    data: {},
  }); 
});

router.post('/',async(req, res)=>{
    const courseModel = new CourseModel(req.body);
    await courseModel.save();
    res.redirect('/courses');
})

module.exports = router;
