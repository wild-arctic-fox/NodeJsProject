const { Router } = require("express");
const CourseModel = require("../dbModels/courseModel");
const CartModel = require("../models/cartModel");
const UserModel = require("../dbModels/userModel");
const _ = require("lodash");
const { Exception } = require("handlebars");

/////////////////////////////////////////////////////////
// Router for adding course to the cart
/////////////////////////////////////////////////////////
const router = Router();

/////////////////////////////////////////////////////////
// Receive id course after submit
router.post("/add", async (req, res) => {
  // 1 - get course
  const course = await CourseModel.findById(req.body.id);
  // 2 - get course _id
  const courseId = course._id;
  // 3 - get user
  const userId = req.user._conditions._id;
  const user = await UserModel.findById(userId);
  const usersCourses = user.cart.items;
  const sameCourse = usersCourses.find(
    (item) => item.courseId.toString() == courseId.toString()
  );
  // 4 - copy prev items
  const existedItems = _.cloneDeep(usersCourses);
  const newCart = { items: existedItems };
  // 5 - check if exist course in user with same _id
  if (!sameCourse) {
    // 6 - if NO -> add new course in array
    newCart.items.push({ courseId });
  } else {
    // 7 - if YES -> increase count, change item by index
    sameCourse.count++;
    const index = usersCourses.findIndex(
      (item) => item.courseId.toString() == courseId.toString()
    );
    newCart.items[index] = sameCourse;
  }
  // 8 - update user
  await UserModel.findByIdAndUpdate(userId, { cart: newCart });
  res.redirect("/cart");
});

/////////////////////////////////////////////////////////
// Display data in the cart
router.get("/", async (req, res) => {
  const userId = req.user._conditions._id;
  const user = await UserModel.findById(userId);
  user.populate("cart.items.courseId", "name").execPopulate();

  const courses = [];
  for (let i = 0; i < user.cart.items.length; i++) {
    const course = await CourseModel.findById(
      user.cart.items[i].courseId
    ).lean();
    course.count = user.cart.items[i].count;
    courses.push(course);
  }

  const price = calculateSum(courses);

  //display data
  res.render("cart", {
    title: "Cart",
    courses,
    price,
  });
});

/////////////////////////////////////////////////////////
// Remove course by ID from cart (ajax)
router.delete("/delete/:id", async (req, res) => {
  // 1 - get cart with items
  const userId = req.user._conditions._id;
  const user = await UserModel.findById(userId);
  const usersCourses = user.cart.items;

  // 3 - copy prev items
  const existedItems = _.cloneDeep(usersCourses);
  const newCart = { items: existedItems };

  // 4 -  find index & item
  const index = usersCourses.findIndex(
    (item) => item.courseId.toString() == req.params.id.toString()
  );
  const sameCourse = usersCourses.find(
    (item) => item.courseId.toString() == req.params.id.toString()
  );

  // 5 - check quantity
  if (sameCourse.count === 1) {
    // 5 Yes -> remove from array of items
    newCart.items.splice(index, 1);
  } else {
    // 4 No -> reduce counter
    newCart.items[index].count--;
  }
  // // 5 update user`s cart
  await UserModel.findByIdAndUpdate(userId, { cart: newCart });
  const g = await UserModel.findOne({ _id: userId });
  await g.populate("cart.items.courseId").execPopulate(function (err, story) {
    if (err) {
      throw new Exception(err);
    }
    res.json(story.cart.items);
  });
});

////////////////////////////////////////////
// Additional functions
////////////////////////////////////////////

// Calculate Price of courses
const calculateSum = (courses) => {
  return courses.reduce((a, b) => (a += b.price * b.count), 0);
};
////////////////////////////////////////////

module.exports = router;
