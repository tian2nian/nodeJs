const mongoose = require('mongoose');

//链接数据库
mongoose.connect('mongodb://127.0.0.1:27017/mydb',{useNewUrlParser: true,useUnifiedTopology: true  });
//数据库的链接对象
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('mongoose数据库连接成功')
});
//>show dbs 查看数据库列表
//>show connections 查看数据库表
// mongoose.disconnect(function () {       //断开数据库连接
//     console.log("Mongo is closed!")
// });
