const { Router } = require("express");
const UserModel = require("../dbModels/userModel");
const { Exception } = require("handlebars");
const bcrypt = require('bcryptjs');

/////////////////////////////////////////////////////////
// Router for displaying login or registration form
/////////////////////////////////////////////////////////
const router = Router();

/////////////////////////////////////////////////////////
// Display login and register forms
router.get("/login", async (req, res) => {
  res.render("auth/login", {
    title: "Sign in/up",
    errorEmailIn: req.flash('error_emailin'),
    errorEmail : req.flash('error_email'),
    errorPwd : req.flash('error_pwd'),
    errorPwdMatch : req.flash('error_pwd_match')
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
  try{
    const {emailin:email, passwordin:password} = req.body;
    const existedUser = await UserModel.findOne({email});
    if(existedUser){
      const isEq = await bcrypt.compare(password, existedUser.password)
      if(isEq){
        req.session.isAuth = true; // already sing in
        req.session.user = existedUser;
        req.session.save(err=>{
          if(err){
            throw new Error(err);
          }
          res.redirect("/")
        });
      }else{
        const key = 'error_pwd';
        const message = 'Incorrect password';
        req.flash(key, message);
        res.redirect("/login#login");
      }
    }else{
      const key = 'error_emailin';
      const message = 'Incorrect email';
      req.flash(key, message);
      res.redirect("/login#login");
    }
  }catch(e){
      throw new Exception(e);
  }
});


/////////////////////////////////////////////////////////
// Recieve data to sign up
router.post("/login/signUp", async (req, res) => {
  try{
    const {username:name , email, password1:password, password2} = req.body;
    const existedUser = await UserModel.findOne({email});
    if(existedUser){
      const key = 'error_email';
      const message = 'User with this email already exist';
      req.flash(key, message);
      res.redirect("/login#register");
    }else{
      if(password2 === password){
        const hashedpwd = await bcrypt.hash(password,10);
        const user = new UserModel({name, email, password:hashedpwd, cart:{items:[]}})
        user.save();
        res.redirect("/login#login");
      } else {
        const key = 'error_pwd_match';
        const message = 'Passwords don`t match';
        req.flash(key, message);
        res.redirect("/login#register");
      }
    }
  } catch (e) {
    throw new Exception(e)
  }
});
module.exports = router;
