const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

// path to JSON file with data
const pathToFile = path.join(__dirname, "..", "courses.json");


/////////////////////////////////////////////////////////
// Model to save courses data
/////////////////////////////////////////////////////////
class CourseModel {

    constructor({ name, author, price, email, en = false, rus = false, resourses = false }) {
      this.author = author;
      this.name = name;
      this.id = uuidv4();
      this.price = price;
      this.email = email;
      this.en = !!en;
      this.rus = !!rus;
      this.resourses = !!resourses;
    }

  /////////////////////////////////////////////////////////
  // Save new course to the file
  async save() {
    const coursesData = await CourseModel.getAllCourses();
    coursesData.push(this);
    return new Promise((resolve, reject) => {
      fs.writeFile(pathToFile, JSON.stringify(coursesData), (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  /////////////////////////////////////////////////////////
  // Save all courses to the file
  static async saveAll(data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(pathToFile, JSON.stringify(data), (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  /////////////////////////////////////////////////////////
  // Return array of existing courses
  static getAllCourses() {
    return new Promise((resolve, reject) => {
      const encoding = "utf-8";
      fs.readFile(pathToFile, encoding, (error, coursesData) => {
        if (error) {
          reject(error);
        } else {
          resolve(JSON.parse(coursesData));
        }
      });
    });
  }

  /////////////////////////////////////////////////////////
  // Return course by ID
  static async getCourseById(id) {
    const coursesData = await CourseModel.getAllCourses();
    let course = null;
    if(coursesData.length){
        course = coursesData.find(item => item.id === id);
    }
    return course;
  }

  /////////////////////////////////////////////////////////
  // Update course by ID
  static async updateCourse({id, name, author, price, email, en, rus, resourses}){
    const allCourses = await CourseModel.getAllCourses();
    const updatedCourses = allCourses.map(item => {
      if(item.id === id){
        return {id,name,author, price, email, en:!!en, rus:!!rus, resourses:!!resourses}
      } else {
        return item;
      }
    });
    await CourseModel.saveAll(updatedCourses);
  }

}

module.exports = CourseModel;
