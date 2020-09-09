const USER_NAME = "pJane";
module.exports = {
 // Constans
 HOST : process.env.HOST,
 PORT : process.env.PORT || 3000,
 EXT : "hbs", //handlebars
 DATA_BASE_URL : process.env.DATA_BASE_URL,
 SECRET : process.env.SECRET,
 SENDGRID_API_KEY : process.env.SENDGRID_API_KEY,
 MAIN_EMAIL: process.env.MAIN_EMAIL
}