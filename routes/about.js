const { Router } = require("express");

/////////////////////////////////////////////////////////
// Router for displaying info about ...
/////////////////////////////////////////////////////////
const router = Router();

router.get("/", (req, res) => {
  res.render("about", {
    title: "About us",
    data: {},
  });
});

module.exports = router;
