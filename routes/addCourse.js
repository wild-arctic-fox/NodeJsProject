const { Router } = require("express");
const CourseModel = require('../models/courseModel');

const router = Router();

router.get("/", (req, res) => {
  res.render("addCourse", {
    title: "Add Course",
    data: {},
  }); 
});

router.post('/',(req, res)=>{
    const courseModel = new CourseModel(...req.body);
    //console.log(req.body)
})

module.exports = router;
