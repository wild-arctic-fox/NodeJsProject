const { Router } = require("express");
const CourseModel = require('../models/courseModel');
const CartModel = require('../models/cartModel');

/////////////////////////////////////////////////////////
// Router for adding course to the cart
/////////////////////////////////////////////////////////
const router = Router();


/////////////////////////////////////////////////////////
// Receive id course after submit
router.post('/add', async(req, res)=>{
    const course = await CourseModel.getCourseById(req.body.id);
    await CartModel.addToCart(course);
    res.redirect('/cart');
});


/////////////////////////////////////////////////////////
// Display data in the cart 
router.get('/', async(req, res)=>{
    const {courses,price} = await CartModel.getCart();
    res.render("cart", {
        title: "Cart",
        courses,
        price
    }); 
});


/////////////////////////////////////////////////////////
// Remove course by ID from cart (ajax)
router.delete('/delete/:id',async(req, res)=>{
    const cart = await CartModel.deleteCourseFromCart(req.params.id);
    res.json(cart);
});

module.exports = router;
