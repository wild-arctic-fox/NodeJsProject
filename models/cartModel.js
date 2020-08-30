const path = require("path");
const fs = require("fs");


// path to JSON file with data in the cart
const pathToFile = path.join(__dirname, "..", "cart.json");


/////////////////////////////////////////////////////////
// Model to save courses in the cart
/////////////////////////////////////////////////////////
class CartModel {

  /////////////////////////////////////////////////////////
  // Add course to the cart & count additional data
  static async addToCart(course) {
    const cart = await CartModel.getCart();
    let index = -1;
    if(cart.courses !== undefined){
      index = cart.courses.findIndex((item) => item.id === course.id);
    } else {
      cart.courses = [];
      cart.price = 0;
    }
    if (index !== -1) {
       //increase amount
       const existingCourse = cart.courses.find((item)=>item.id===course.id);
       existingCourse.count++;
       cart.courses[index] = existingCourse;
       cart.price += +existingCourse.price;
     } else {
       //add new course
       let courseData = {...course, count:1};
       cart.courses.push(courseData);
       cart.price += +courseData.price;
     }
     await CartModel.saveToFile(cart);
  }

  /////////////////////////////////////////////////////////
  // Save cart data to the file
  static async saveToFile(data){
    return new Promise((resolve, reject) => {
        fs.writeFile(pathToFile, JSON.stringify(data), (error) => {
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        });
      });
  }

  /////////////////////////////////////////////////////////
  // Return array of data in cart
  static async getCart() {
    return new Promise((resolve, reject) => {
      const encoding = "utf-8";
      fs.readFile(pathToFile, encoding, (error, cartData) => {
        if (error) {
          reject(error);
        } else {
          resolve(JSON.parse(cartData));
        }
      });
    });
  }

  /////////////////////////////////////////////////////////
  // Return cart with deleted course
  static async deleteCourseFromCart(id){
    const cartData = await CartModel.getCart();
    const index = cartData.courses.findIndex(item=>item.id===id);
    const course = cartData.courses.find(item=>item.id===id);
    if(course !== undefined){
      if(course.count > 1){
        //reduce counter
        cartData.courses[index].count--;
      } else {
        //delete element
        cartData.courses.splice(index,1);
      }
      cartData.price -= +course.price;
      await CartModel.saveToFile(cartData);
    }
    return cartData;
  }

}

module.exports = CartModel;
