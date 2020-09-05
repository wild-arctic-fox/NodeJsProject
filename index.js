const express = require("express");
const mongoose = require("mongoose");
const handlebar = require("express-handlebars");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const csurf = require("csurf");
const sessVars = require("./middleware/sessVariables");
const mainPage = require("./routes/main-page");
const aboutPage = require("./routes/about");
const coursesPage = require("./routes/courses");
const addCousePage = require("./routes/addCourse");
const cartPage = require("./routes/cart");
const authPage = require("./routes/auth");
const ordersPage = require("./routes/orders");
const flash = require("connect-flash");


// Constans
const PORT = 3000;
const EXT = "hbs"; //handlebars
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

/////////////////////////////////////////////////////////
// Configure mongo store
/////////////////////////////////////////////////////////
const store = new MongoStore({
    collection:'sessions',
    uri: DATA_BASE_URL
});


const app = express();
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");


app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

/////////////////////////////////////////////////////////
// Configure session
/////////////////////////////////////////////////////////
app.use(session({
  secret: 'multiverse', //This is the secret used to sign the session ID cookie
  resave: false, //Forces the session to be saved back to the session store
  saveUninitialized : false, //Forces a session that is "uninitialized" to be saved to the store
  store
}));
app.use(csurf()); // for safety
app.use(flash()); // used for storing messages
app.use(sessVars); //check is user already sign in

/////////////////////////////////////////////////////////
// Add routers
/////////////////////////////////////////////////////////
app.use("/", mainPage);
app.use("/courses", coursesPage);
app.use("/orders", ordersPage);
app.use("/about", aboutPage);
app.use("/addCourse", addCousePage);
app.use("/cart", cartPage);
app.use("/", authPage);


/////////////////////////////////////////////////////////
// Create server with MongoDB
/////////////////////////////////////////////////////////
const startServer = async () => {
  try {
    await mongoose.connect(DATA_BASE_URL, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true});
    app.listen(PORT, () => {
      console.log("First Log");
    });
  } catch (e) {
    throw new Exception(e);
  }
};
startServer();