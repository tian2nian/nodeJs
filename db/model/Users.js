const mongoose = require('mongoose');

//创建一个Schema对象
var Schema = mongoose.Schema;
//实例化一个Schema对象
var userSchema = new Schema({
    _id: String,//默认主键
    us: {type: String, required: true},
    ps: String,
    age: {type: Number, min: 18, max: 65},
    mail:{type: String, required: true}
});
//将schema对象转为数据模型
var User = mongoose.model('user', userSchema);


// db.user.drop();//删除user表
// db.user.find();//查看user表
module.exports = User;
