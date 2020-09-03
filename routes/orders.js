const { Router } = require("express");
const CourseModel = require("../dbModels/courseModel");
const UserModel = require("../dbModels/userModel");


/////////////////////////////////////////////////////////
// Router for displaying orders
/////////////////////////////////////////////////////////
const router = Router();


/////////////////////////////////////////////////////////
// Router for displaying all orders
router.get("/", async (req, res) => {
  res.render("orders", {
    title: "Orders",
    data,
  });
});

router.post("/", async (req, res) => {
    res.redirect("/orders");
});


module.exports = router;
