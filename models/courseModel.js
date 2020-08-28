const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

const pathToFile = path.join(__dirname, "..", "courses.json");

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
}

module.exports = CourseModel;
