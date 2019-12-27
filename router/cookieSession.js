const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const myRedis = require('../utils/myRedis');
const sendMail = require('../utils/sendMail');
const jwt = require('../utils/jwt');
var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//解析前端传来的cookie
app.use(cookieParser());
//定义生成token的私钥

//设置cookie
app.use(cookieSession({
    secret: 'session',
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
    resave: true,//即使session没有被修改也要重新保存session值，默认true
    saveUninitialzed: false,//无论有没有session cookie 每次请求都设置个session cookie，默认给个标识为 connect:sid
}));
//登录验证
app.use('/food', (req, res, next) => {//第一个参数如果是根路径'/',可省略
    let {token} = req.headers;
    let ctime = new Date().getTime();
    if (!token) {
        res.send({err: -999, msg: 'no token,请先登录'});//前端以此状态判断是否登录
    } else {
        jwt.checkToken(token)
        .then((r) => {
            console.log(r);
            if (ctime - r.ctime > r.expires) {
                res.send({err: -999, msg: 'token已过期,请重新登录'});//前端以此状态判断是否登录
            }else{
                next();//继续执行
            }
        })
        .catch((err) => {
            res.send({err: -999, msg: '非法token,请重新登录'});//前端以此状态判断是否登录
        })
    }
});

/**
 * @apiGroup User
 * @api {GET} /getCode 获取验证码
 * @apiDescription 获取验证码
 * @apiParam {String} mail 邮箱(必填*)
 * @apiSuccessExample SuccessExample
 * HTTP/1.1 200
 * {
 * msg: '发送成功'
 * }
 */

app.post('/getCode', (req, res) => {
    let {mail} = req.body;
    let code = parseInt(Math.random() * 10000 + 1000).toString();
    if (!mail) {
        res.send('参数错误');
        return;
    }
    sendMail.sendMail(mail, '验证码5分钟后过期：' + code)
    .then((data) => {
        myRedis.setRedis(mail, code);
        res.send('发送成功');
    }).catch((err) => {
        console.log(err);
        res.send('发送失败');
    });
});
module.exports = app;
