const { Router } = require("express");

/////////////////////////////////////////////////////////
// Router for displaying main page
/////////////////////////////////////////////////////////
const router = Router();

router.get("/", (req, res) => {
  res.status(200);
  res.render("index", {
    title: "Main Page",
  });
});

module.exports = router;
