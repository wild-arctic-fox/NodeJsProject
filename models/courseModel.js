class CourseModel {
    constructor(firsName, lastName, id, price, isHealsy, isEdu, delivery){
        this.delivery = delivery;
        this.firsName = firsName;
        this.lastName = lastName;
        this.id = id;
        this.price = price;
        this.isHealsy = isHealsy;
        this.isEdu = isEdu;
    }

    save(){

    }
}

module.exports = CourseModel;