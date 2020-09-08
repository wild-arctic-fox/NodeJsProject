const express = require("express");
const mongoose = require("mongoose");
const handlebar = require("express-handlebars");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const csurf = require("csurf");
const sessVars = require("./middleware/sessVariables");
const errPage = require("./middleware/error404");
const flash = require("connect-flash");
const mainPage = require("./routes/main-page");
const aboutPage = require("./routes/about");
const coursesPage = require("./routes/courses");
const profilePage = require("./routes/profile");
const addCousePage = require("./routes/addCourse");
const cartPage = require("./routes/cart");
const authPage = require("./routes/auth");
const ordersPage = require("./routes/orders");
const config = require('./config/config');


/////////////////////////////////////////////////////////
// Activate  handlebars
/////////////////////////////////////////////////////////
const hbs = handlebar.create({
  defaultLayout: "main",
  extname: config.EXT,
  helpers: require('./utils/hbs_helpers')
});

/////////////////////////////////////////////////////////
// Configure mongo store
/////////////////////////////////////////////////////////
const store = new MongoStore({
    collection:'sessions',
    uri: config.DATA_BASE_URL
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
  secret: config.SECRET, //This is the secret used to sign the session ID cookie
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
app.use("/profile", profilePage);
app.use("/cart", cartPage);
app.use("/", authPage);

app.use(errPage);

/////////////////////////////////////////////////////////
// Create server with MongoDB
/////////////////////////////////////////////////////////
const startServer = async () => {
  try {
    await mongoose.connect(config.DATA_BASE_URL, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true});
    app.listen(config.PORT, () => {
      console.log("First Log");
    });
  } catch (e) {
    throw new Exception(e);
  }
};
startServer();