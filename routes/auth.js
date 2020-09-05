const { Router } = require("express");
const UserModel = require("../dbModels/userModel");
const emailTemplate = require("../email/signUpEmail");
const { Exception } = require("handlebars");
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const {SENDGRID_API_KEY} = require('../config/config');

/////////////////////////////////////////////////////////
// Router for displaying login or registration form
/////////////////////////////////////////////////////////
const router = Router();


/////////////////////////////////////////////////////////
// To send emails you need a transporter object
// 
// transporter is going to be an object that is able to send mail
// transport is the transport configuration object, connection url or a transport plugin instance
const transport = sendgrid({auth:{api_key:SENDGRID_API_KEY}});
const transporter = nodemailer.createTransport(transport)


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
          res.redirect("/");
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
        // send email (https://nodemailer.com/message/)
        await transporter.sendMail(emailTemplate(email));
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

/////////////////////////////////////////////////////////
// Display form to reset password
router.get("/login/reset", async (req, res) => {
  res.render("auth/reset", {
    title: "Reset",
    errorEmail : req.flash('error_email'),
  });
});


router.post("/login/reset", async (req, res) => {

});
module.exports = router;
