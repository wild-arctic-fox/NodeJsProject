const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
  res.render("courses", {
    title: "All courses",
    data: {}, 
  }); 
}); 

module.exports = router;
