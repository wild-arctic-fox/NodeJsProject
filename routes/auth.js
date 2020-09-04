const { Router } = require("express");

/////////////////////////////////////////////////////////
// Router for displaying login or registration form
/////////////////////////////////////////////////////////
const router = Router();

router.get("/", async (req, res) => {
  res.render("auth/login", {
    title: "Sign in/up",
  });
});

module.exports = router;
