const { model, Schema } = require("mongoose");


/////////////////////////////////////////////////////////
// Everything in Mongoose starts with a Schema. 
// Each schema maps to a MongoDB collection.
// Course Model Schema
/////////////////////////////////////////////////////////
const courseModel = new Schema({
  name: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  en: Boolean,
  rus: Boolean,
  resourses: Boolean,
});

module.exports = model("CourseModel", courseModel);
