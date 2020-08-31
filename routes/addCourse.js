const { Router } = require("express");
const CourseModel = require("../dbModels/courseModel");
const { Exception } = require("handlebars");

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
router.post("/", async (req, res) => {
  const { name, author, email, price, en, rus, resourses } = req.body;
  const courseModel = new CourseModel({
    name,
    author,
    email,
    price: +price,
    resourses: !!resourses,
    en: !!en,
    rus: !!rus,
  });
  try {
    await courseModel.save();
    res.redirect("/courses");
  } catch (e) {
    throw new Exception(e);
  }
});

module.exports = router;
