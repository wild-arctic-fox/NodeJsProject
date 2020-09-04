const { Router } = require("express");
const UserModel = require("../dbModels/userModel");

/////////////////////////////////////////////////////////
// Router for displaying login or registration form
/////////////////////////////////////////////////////////
const router = Router();

/////////////////////////////////////////////////////////
// Display login and register forms
router.get("/login", async (req, res) => {
  const user = await UserModel.findById('5f4e8471b74ea91544f5831a');
  req.session.user = user;
  //req.session.isAuth = true;
  req.session.save(err=>{
    if(err){
      throw new Error(err);
    }
    res.render("auth/login", {
      title: "Sign in/up",
    });
  });
});

/////////////////////////////////////////////////////////
// Log out & destroy cookie session data & display login and register forms
router.get("/logout", async (req, res) => {
  req.session.destroy(()=>{
    res.redirect('/login#login');
  })
});


/////////////////////////////////////////////////////////
// Recieve data to sign in
router.post("/login/signIn", async (req, res) => {
  req.session.isAuth = true; // already sing in
  res.redirect("/")
});


/////////////////////////////////////////////////////////
// Recieve data to sign up
router.post("/login/signUp", async (req, res) => {
  res.redirect("/")
});
module.exports = router;
