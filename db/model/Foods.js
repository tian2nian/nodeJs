const mongoose = require('mongoose');

//创建一个Schema对象
var Schema = mongoose.Schema;
//实例化一个Schema对象
var foodSchema = new Schema({
    name: {type: String, required: true},
    price: {type: String, required: true},
    desc: {type: String, required: true},
    type: {type: Number, required: true},
    typeName: {type: String, required: true},
    img: {type: String, required: true},
});
//将schema对象转为数据模型
var Food = mongoose.model('food', foodSchema);


// db.user.drop();//删除user表
// db.user.find();//查看user表
module.exports = Food;
