const USER_NAME = "pJane";
const PASSWORD = "Rr3XE0ztcNYHBexp";
const DATA_BASE_NAME = 'CoursesShop';

module.exports = {
 // Constans
 PORT : 3000,
 EXT : "hbs", //handlebars
 DATA_BASE_URL : `mongodb+srv://${USER_NAME}:${PASSWORD}@cluster0.gehfl.mongodb.net/${DATA_BASE_NAME}?retryWrites=true&w=majority`,
 SECRET : "multiverse"
}