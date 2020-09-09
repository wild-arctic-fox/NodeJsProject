const USER_NAME = "pJane";
const PASSWORD = "Rr3XE0ztcNYHBexp";
const DATA_BASE_NAME = 'CoursesShop';

module.exports = {
 // Constans
 HOST : 'http://localhost:3000/', 
 PORT : 3000,
 EXT : "hbs", //handlebars
 DATA_BASE_URL : `mongodb+srv://${USER_NAME}:${PASSWORD}@cluster0.gehfl.mongodb.net/${DATA_BASE_NAME}?retryWrites=true&w=majority`,
 SECRET : "multiverse",
 SENDGRID_API_KEY : "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",
 MAIN_EMAIL: "alena0112358132134@gmail.com"
}