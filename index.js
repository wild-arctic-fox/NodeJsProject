const express = require("express");
const path = require("path");
const handlebar = require("express-handlebars");
const mainPage = require('./routes/main-page');
const aboutPage = require('./routes/about');
const coursesPage = require('./routes/courses');
const addCousePage = require('./routes/addCourse');

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

app.use(express.static(__dirname +'/public'));
app.use(express.urlencoded({extended:true})); 

app.use('/',mainPage);
app.use('/courses',coursesPage);
app.use('/about',aboutPage);
app.use('/addCourse',addCousePage);
       
