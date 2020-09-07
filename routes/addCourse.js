const { Router } = require("express");
const CourseModel = require("../dbModels/courseModel");
const { Exception } = require("handlebars");
const auth = require("../middleware/auth");
const {courseValidator} = require('../utils/validators');
const { validationResult } = require('express-validator');


/////////////////////////////////////////////////////////
// Router for adding new Course
/////////////////////////////////////////////////////////
const router = Router();

/////////////////////////////////////////////////////////
// Display empty form
router.get("/", auth, (req, res) => {
  res.render("addCourse", {
    title: "Add Course"
  });
});

/////////////////////////////////////////////////////////
// Receive data after submit
router.post("/", auth, courseValidator, async (req, res) => {
  const { name, author, email, price, en, rus, resourses } = req.body;
  const result = validationResult(req);
    if(!result.isEmpty()){ 
        const {errors} = result
        req.flash('error_course', errors[0].msg)
        //422 Unprocessable Entity («необрабатываемый экземпляр»)
        return  res.status(422).render("addCourse",{
          title: "Add Course",
          data: {},
          errorCourse: req.flash('error_course'),
          values : {name,author,email,
            price: +price,
            resourses: !!resourses,
            en: !!en,
            rus: !!rus,
          }
        });
    }
  const courseModel = new CourseModel({
    name,
    author,
    email,
    price: +price,
    resourses: !!resourses,
    en: !!en,
    rus: !!rus,
    idUser: req.session.user._id
  });
  try {
    await courseModel.save();
    res.redirect("/courses");
  } catch (e) {
    throw new Exception(e);
  }
});

module.exports = router;
