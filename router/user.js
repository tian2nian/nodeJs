const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../db/model/Users');
const myRedis = require('../utils/myRedis');
const jwt = require('../utils/jwt');
const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//退出登录
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.send('退出登录成功');
});
/**
 * @apiGroup User
 * @api {GET} /user/login  登录
 * @apiDescription 用户登录
 * @apiParam {String} us 用户名(必填*)
 * @apiParam {String} ps 用户密码(必填*)
 * @apiSuccessExample SuccessExample
 * HTTP/1.1 200
 * {
 * msg: '登录成功'
 * }
 */

router.get('/login', (req, res) => {
    let {us, ps} = req.query;
    if (!us || !ps) {
        res.send('参数错误');
        return;
    }
    //查询数据库表
    User.find({us, ps})
    .then((data) => {
        if (data.length) {//返回的data是一个数组
            let token = jwt.creatToken();
            res.send({err: 0, msg: '登录成功', token: token});
        } else {
            res.send('登录失败');
        }
    })
    .catch((err) => {
        console.log(err);
        res.send('登录失败');
    });
});

/**
 * @apiGroup User
 * @api {POST} /user/add  注册
 * @apiDescription 用户注册
 * @apiParam {String} us 用户名(必填*)
 * @apiParam {String} ps 用户密码(必填*)
 * @apiParam {String} code 邮箱验证码(必填*)
 * @apiSuccessExample SuccessExample
 * HTTP/1.1 200
 * {
 * msg: '注册成功'
 * }
 */

router.post('/add', async (req, res) => {
    let {us, ps, code, mail} = req.body;
    let yzm = await myRedis.getRedis(mail);
    if (!us || !ps || !code) {
        res.send('参数错误');
        return;
    }
    console.log('验证码', yzm);
    if (code != yzm) {
        res.send('验证码错误');
        return;
    }
    //查询数据库表
    User.find({us, ps})
    .then((data) => {
        if (data.length) {
            res.send('用户已存在');
        } else {
            //插入一条记录
            return User.insertMany({us, ps, code, mail})
        }
    })
    .then((data) => {
        console.log(data);
        res.send('注册成功');
    })
    .catch((err) => {
        console.log(err);
        res.send('注册失败');
    });
});
/**
 * @apiGroup User
 * @api {POST} /user/del  注销账号
 * @apiDescription 删除用户
 * @apiParam {String} us 用户名(必填*)
 * @apiSuccessExample SuccessExample
 * HTTP/1.1 200
 * {
 * msg: '注销成功'
 * }
 */
router.post('/del', (req, res) => {
    let {us} = req.body;
    if (!us) {
        res.send('参数错误');
        return;
    }
    User.findOne({us}, function (err, doc) {
        if (err) {
            res.send('没有该用户');
            return;
        }
        if (doc) {
            doc.remove();
            res.send('注销成功');
        }
    });
});

module.exports = router;
