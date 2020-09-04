const { Router } = require("express");
const CourseModel = require("../dbModels/courseModel");
const UserModel = require("../dbModels/userModel");
const _ = require("lodash");
const auth = require("../middleware/auth");

/////////////////////////////////////////////////////////
// Router for adding course to the cart
/////////////////////////////////////////////////////////
const router = Router();

/////////////////////////////////////////////////////////
// Receive id course after submit
router.post("/add", auth, async (req, res) => {
  // 1 - get course
  const course = await CourseModel.findById(req.body.id);
  // 2 - get course _id
  const courseId = course._id;
  // 3 - get user
  const userId = req.session.user._id;
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
router.get("/", auth, async (req, res) => {
  const userId = req.session.user._id;
  const user = await UserModel.findById(userId);
  
  const coursesData = await user.populate("cart.items.courseId").execPopulate();
  const courses = coursesData.cart.items.map(item=>{
        const {name,author,price,email,resourses,_id,en,rus} = item.courseId;
        return {count:item.count, name,author,price,email,resourses,_id,en,rus};
  })
  const price = calculateSum(courses);

  //display data
  res.render("cart", {
    title: "Cart",
    courses,
    price
  });
});

/////////////////////////////////////////////////////////
// Remove course by ID from cart (ajax)
router.delete("/delete/:id", auth, async (req, res) => {
  // 1 - get cart with items
  const userId = req.session.user._id;
  const user = await UserModel.findById(userId);
  const usersCourses = user.cart.items;

  // 3 - copy prev items
  const existedItems = _.cloneDeep(usersCourses);
  const newCart = { items: existedItems };

  // 4 -  find index & item
  const index = usersCourses.findIndex((item) => item.courseId.toString() == req.params.id.toString());
  const sameCourse = usersCourses.find((item) => item.courseId.toString() == req.params.id.toString());

  // 5 - check quantity
  if (sameCourse.count === 1) {
    // 6 Yes -> remove from array of items
    newCart.items.splice(index, 1);
  } else {
    // 6 No -> reduce counter
    newCart.items[index].count--;
  }
  // 7 update user`s cart
  await UserModel.findByIdAndUpdate(userId, { cart: newCart });
  const userAgain = await UserModel.findById(userId);
  const coursesData = await userAgain.populate("cart.items.courseId").execPopulate();

  const courses = coursesData.cart.items.map(item=>{
        const {name,author,price,email,resourses,_id,en,rus} = item.courseId;
        return {count:item.count, name,author,price,email,resourses,_id,en,rus};
  });
  const price = calculateSum(courses);
  res.json({courses,price});
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
