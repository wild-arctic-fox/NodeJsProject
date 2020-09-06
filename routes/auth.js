const { Router } = require("express");
const UserModel = require("../dbModels/userModel");
const emailTemplate = require("../email/signUpEmail");
const emailResetTemplate = require("../email/resetPwsEmail");
const { Exception } = require("handlebars");
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const {SENDGRID_API_KEY} = require('../config/config');
const {signUpValidator, signInValidator} = require('../utils/validators');
const { validationResult } = require('express-validator');

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
    errorIn: req.flash('error_in'),
    errorUp : req.flash('error_up')
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
router.post("/login/signIn", signInValidator, async (req, res) => {
  try{
    const {emailin:email, passwordin:password} = req.body;
    const existedUser = await UserModel.findOne({email});
    const result = validationResult(req);
    if(!result.isEmpty()){
        const {errors} = result
        req.flash('error_in', errors[0].msg)
        return  res.status(422).redirect("/login#login");
    }
    req.session.isAuth = true; // already sing in
    req.session.user = existedUser;
    req.session.save(err=>{
      if(err){
        throw new Error(err);
      }
      res.redirect("/");
    });
  }catch(e){
      throw new Exception(e);
  }
});


/////////////////////////////////////////////////////////
// Recieve data to sign up
router.post("/login/signUp", signUpValidator, async (req, res) => {
  try{
    const result = validationResult(req);
    if(!result.isEmpty()){
        const {errors} = result
        req.flash('error_up', errors[0].msg)
        //422 Unprocessable Entity («необрабатываемый экземпляр»)
        return  res.status(422).redirect("/login#register");
    }
    const {username:name , email, password1:password} = req.body;
    const hashedpwd = await bcrypt.hash(password,10);
    const user = new UserModel({name, email, password:hashedpwd, cart:{items:[]}})
    user.save();
    res.redirect("/login#login");
    // send email (https://nodemailer.com/message/)
    await transporter.sendMail(emailTemplate(email));
  } catch (e) {
    throw new Exception(e)
  }
});

/////////////////////////////////////////////////////////
// Display form(email) to reset password
router.get("/login/reset", async (req, res) => {
  res.render("auth/reset", {
    title: "Reset",
    errorEmail : req.flash('error_email'),
  });
});


/////////////////////////////////////////////////////////
// Display form to input new password
router.get("/login/password/:token", async (req, res) => {
  const token = req.params.token;
  if(!token){
    return  res.redirect("/login#login");
  }
  try{
    const user = UserModel.findOne({resetToken: token, resetDate: {$gt: Date.now()}});
    if(!user){
      return  res.redirect("/login#login");
    } else {
      res.render("auth/password", {
        title: "Password",
        userId: user.schema.tree._id.toString(),
        token
      });
    }
  }catch(e){
    throw new Exception(e);
  }
});


/////////////////////////////////////////////////////////
// Reset password & clear token`s data
router.post("/login/password", async (req, res) => {
  const token = req.body.token;
  try{
    const user = await UserModel.findOne({resetToken: token, resetDate: {$gt: Date.now()}})
    if(user){
      const pwd = (await bcrypt.hash(req.body.password,10)).toString();
      user.resetToken = undefined;
      user.resetDate = undefined;
      user.password = pwd;
      await user.save();
    } else {
      res.redirect("/login#login");
    }
  }catch(e){
    throw new Exception(e);
  }
});

/////////////////////////////////////////////////////////
// Recieve email and sent tmp key 
router.post("/login/reset", (req, res) => {
  try{
    // 1 - generate random key
    crypto.randomBytes(32, async (err, buffer)=>{
        if(err){
          throw err;
        }
        const token = buffer.toString('hex');
        const email = req.body.email;
        // 2 - check user
        const user = UserModel.findOne({email})
        if(user){
          // 3 - user found
          const resetDate = Date.now() + 3600 * 1000; // 1 hour
          await UserModel.findOneAndUpdate({email}, {resetToken:token, resetDate});
          // 4 - send email
          await transporter.sendMail(emailResetTemplate(email, token));
          res.redirect("/login#login");
        }else{
           // 3 - user not found
           const key = 'error_email';
           const message = 'Incorrect email';
           req.flash(key, message);
           res.redirect("/login/reset");
        }
    });
  } catch(e) {
    throw new Exception(e);
  }
});

module.exports = router;
