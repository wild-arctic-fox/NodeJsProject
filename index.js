const express = require("express");
const mongoose = require("mongoose");
const handlebar = require("express-handlebars");
const mainPage = require("./routes/main-page");
const aboutPage = require("./routes/about");
const coursesPage = require("./routes/courses");
const addCousePage = require("./routes/addCourse");
const cartPage = require("./routes/cart");
const UserModel = require("./dbModels/userModel");


// Constans
const PORT = 3000;
const EXT = "hbs"; //handlebars
const USER_ID = '5f4e8471b74ea91544f5831a';
const PASSWORD = "Rr3XE0ztcNYHBexp";
const USER_NAME = "pJane";
const DATA_BASE_NAME = 'CoursesShop'
const DATA_BASE_URL = `mongodb+srv://${USER_NAME}:${PASSWORD}@cluster0.gehfl.mongodb.net/${DATA_BASE_NAME}?retryWrites=true&w=majority`;


/////////////////////////////////////////////////////////
// Activate  handlebars
/////////////////////////////////////////////////////////
const hbs = handlebar.create({
  defaultLayout: "main",
  extname: EXT,
});

const app = express();
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(async(req,res,next)=>{
  try {
    const user = UserModel.findById(USER_ID);
    req.user = user;
    next();
  } catch (error) {
    throw new Exception(e);
  }
});

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));


/////////////////////////////////////////////////////////
// Add routers
/////////////////////////////////////////////////////////
app.use("/", mainPage);
app.use("/courses", coursesPage);
app.use("/about", aboutPage);
app.use("/addCourse", addCousePage);
app.use("/cart", cartPage);


/////////////////////////////////////////////////////////
// Create server with MongoDB
/////////////////////////////////////////////////////////
const startServer = async () => {
  try {
    await mongoose.connect(DATA_BASE_URL, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true});
    const user = await UserModel.findOne();
    if(!user){
      //create new user
      const newUser = new UserModel({
        name:'Alyona',
        email:'qwerty@gmail.com',
        cart:{items:[]}
      });
      await newUser.save();
    } else {

    }
    app.listen(PORT, () => {
      console.log("First Log");
    });
  } catch (e) {
    throw new Exception(e);
  }
};
startServer();