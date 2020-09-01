const { Router } = require("express");
const CourseModel = require("../dbModels/courseModel");
const CartModel = require("../models/cartModel");
const UserModel = require("../dbModels/userModel");
const _ = require("lodash");

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
  // 4 - check if exist course in user with same _id
  if (!sameCourse) {
    // 5 - if NO -> 1) read previous items
    //              2) clone prev array
    //              3) add new course in array
    //              4) update user
    const existedItems = _.cloneDeep(usersCourses);
    const newCart = { items: existedItems };
    newCart.items.push({ courseId, count: 1 });
    await UserModel.findByIdAndUpdate(userId, { cart: newCart });
  } else {
    // 6 - if YES -> 1) find item, need to update
    //               2) find index
    //               3) copy array
    //               4) change item by index
    //               5) update user
    //console.log(sameCourse);
    sameCourse.count++;
    const existedItems = _.cloneDeep(usersCourses);
    const newCart = { items: existedItems };
    const index = usersCourses.findIndex(
      (item) => item.courseId.toString() == courseId.toString()
    );
    newCart.items[index] = sameCourse;
    await UserModel.findByIdAndUpdate(userId, { cart: newCart });
  }
  res.redirect("/cart");
});

/////////////////////////////////////////////////////////
// Display data in the cart
router.get("/", async (req, res) => {
  const userId = req.user._conditions._id;
  const user = await UserModel.findById(userId);
  user.populate("cart.items.courseId").execPopulate();

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
  const cart = await CartModel.deleteCourseFromCart(req.params.id);
  res.json(cart);
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
