const { model, Schema } = require("mongoose");

/////////////////////////////////////////////////////////
// Order Model Schema
/////////////////////////////////////////////////////////
const orderModel = new Schema({
    courses : [
        {
            course: {
                type: Object,
                required: true
            },
            count: {
                type: Number,
                required: true
            }
        }
    ],
    user: {
        name: String,
        userId:{
            type: Schema.Types.ObjectId,
            ref: 'UserModel',
            required: true
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = model("OrderModel", orderModel);
