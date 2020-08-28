const { Router } = require("express");

/////////////////////////////////////////////////////////
// Router for displaying all courses
/////////////////////////////////////////////////////////
const router = Router();

router.get("/", (req, res) => {
  res.render("courses", {
    title: "All courses",
    data: {}, 
  }); 
}); 

module.exports = router;
