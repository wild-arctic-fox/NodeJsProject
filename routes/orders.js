const { Router } = require("express");
const OrderModel = require("../dbModels/orderModel");
const UserModel = require("../dbModels/userModel");
const { Exception } = require("handlebars");
const auth = require("../middleware/auth");

/////////////////////////////////////////////////////////
// Router for displaying orders
/////////////////////////////////////////////////////////
const router = Router();

/////////////////////////////////////////////////////////
// Router for displaying all orders
router.get("/", auth, async (req, res) => {
  try {
    const order = await OrderModel.find({
      "user.userId": req.session.user._id,
    });

    const orderData = [];
    // form array of necessary data
    for(let i = 0; i < order.length; i++){
        orderData.push(await order[i].populate("user.userId").execPopulate());
    }

    // create normal js array
    const resData = orderData.map((item)=>{
        return {
            name: item.user.name,
            email: item.user.userId.email,
            courses: item.courses.map(i=>({count:i.count, name:i.course.name, price:i.course.price})),
            date: item.date,
            price: item.courses.reduce((a,b)=>(a+=b.count*b.course.price),0)
        }
    })
 
    res.render("orders", {
      title: "Orders",
      orderData: resData
    });
  } catch (e) {
        throw new Exception(e); 
  }
});


/////////////////////////////////////////////////////////
// Move cart data to the order model
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.session.user._id;
    const user = await UserModel.findById(userId);
    const coursesData = await user
      .populate("cart.items.courseId")
      .execPopulate();

    const courses = coursesData.cart.items.map((item) => ({
      count: item.count,
      course: { ...item.courseId._doc },
    }));

    const order = new OrderModel({
      courses,
      user: {
        name: user.name,
        userId,
      },
    });

    await order.save();
    // clear cart
    await UserModel.findByIdAndUpdate(userId, { cart: { items: [] } });

    res.redirect("/orders");
  } catch (e) {
    throw new Exception(e);
  }
});

module.exports = router;
