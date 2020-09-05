const {MAIN_EMAIL,HOST} = require('../config/config');

module.exports = (email, token) => {
  return {
    to: email,
    from: MAIN_EMAIL,
    subject: 'Reset Password',
    html: `
    <h1>RESET PASSWORD</h1>
    <a href="${HOST}login/password/${token}" >click me</a>`
  };
};
