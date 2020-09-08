const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/auth");
const UserModel = require("../dbModels/userModel");

/////////////////////////////////////////////////////////
// Router for displaying personal data
/////////////////////////////////////////////////////////
const router = Router();



/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
// Set The Storage Engine
/////////////////////////////////////////////////////////
const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("myImage");//name if input type file

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////


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
