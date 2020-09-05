const {MAIN_EMAIL,HOST} = require('../config/config');

module.exports = (email) => {
  return {
    to: email,
    from: MAIN_EMAIL,
    subject: 'Account created',
    html: `
    <h1>Hello !!!</h1>
    <a href="${HOST}" >click me</a>`
  };
};
