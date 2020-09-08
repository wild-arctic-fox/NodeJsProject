const { Router } = require("express");
const upload = require('../middleware/imgDownload')
const auth = require("../middleware/auth");
const UserModel = require("../dbModels/userModel");

/////////////////////////////////////////////////////////
// Router for displaying personal data
/////////////////////////////////////////////////////////
const router = Router();


/////////////////////////////////////////////////////////
// Router for displaying image, email & name
router.get("/", auth, async (req, res) => {
  const user = await UserModel.findById(req.session.user._id).lean();
  res.render("profile", {
    title: "Profile",
    user,
    errorFile: req.flash('error_file')
  });
});


/////////////////////////////////////////////////////////
// Receive file(image) & update user data
router.post("/", auth, async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
        req.flash('error_file', 'Problem with file\n Image types can be jpeg/jpg/png/gif');
        res.redirect("/profile");
    } else {
      if (req.file == undefined) {
        res.redirect("/profile");
      } else {
        const avatarUrl = `uploads/${req.file.filename}`;
        await UserModel.findByIdAndUpdate(req.session.user._id, {avatarUrl}).lean();
        res.redirect("/profile");
      }
    }
  });
});

module.exports = router;
