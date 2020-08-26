const express = require("express");
const path = require("path");
const handlebar = require("express-handlebars");

// Constans
const PORT = 3000;
const EXT = "hbs"; //handlebars


/////////////////////////////////////////////////////////
// Create server
/////////////////////////////////////////////////////////
const app = express();
app.listen(PORT, () => {
  console.log("qwery");
});

/**
 * 1 param -> url
 * 2 param -> func with 3 args
 */
app.get("/", (req, res) => {
  res.status(200);
  res.render('index');
});

app.get("/about", (req, res) => {
  res.sendfile(path.join(__dirname, "views", "about.html"));
});


/////////////////////////////////////////////////////////
// Activate  handlebars
/////////////////////////////////////////////////////////
const hbs = handlebar.create({
  defaultLayout: "main",
  extname: EXT,
});

app.engine("hbs", hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');
