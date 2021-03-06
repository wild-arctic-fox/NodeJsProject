const { model, Schema } = require("mongoose");

/////////////////////////////////////////////////////////
// User Model Schema
/////////////////////////////////////////////////////////
const userModel = new Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  avatarUrl: String,
  resetToken: String,
  resetDate: Date,
  cart: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1,
        },
        courseId: {
          type: Schema.Types.ObjectId,
          ref: "CourseModel",
          required: true,
        },
      },
    ],
  },
});

module.exports = model("UserModel", userModel);
