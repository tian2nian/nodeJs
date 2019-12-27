const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Food = require('../db/model/Foods');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/**
 * @apiGroup Food
 * @api {GET} /food/login  登录
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
    Food.find({us, ps}).then((data) => {
        if (data.length) {//返回的data是一个数组
            res.send('登录成功');
        } else {
            res.send('登录失败');
        }
    }).catch((err) => {
        console.log(err);
        res.send('登录失败');
    });

});
/**
 * @apiGroup Food
 * @api {GET} /food/getFoods 获取菜品
 * @apiDescription 获取菜品
 * @apiSuccessExample SuccessExample
 * {
    "err": 0,
    "msg": "查询成功",
    "data": [
        {
            "_id": "5dba751eb8c8111f78390902",
            "name": "麻婆豆腐",
            "price": "99",
            "desc": "麻辣可口",
            "type": 1,
            "typeName": "川菜",
            "img": "public/img/mpdf.jpg",
            "__v": 0
        }
    ]
}
 */

router.get('/getFoods', (req, res) => {
    let {page = 1, limit = 2} = req.query;
    Food.find().limit(Number(limit))
    .skip(Number((page - 1) * limit))
    .then((data) => {
        if (data.length) {//返回的data是一个数组
            res.send({
                err: 0,
                page: page,
                hasMore: data.length > limit,
                msg: '查询成功',
                data: data
            });
        } else {
            res.send('暂无菜品');
        }
    })
    .catch((err) => {
        console.log(err);
        res.send('查询失败');
    });
});
/**
 * @apiGroup Food
 * @api {GET} /food/getFoodsByType  分类查询菜品
 * @apiDescription 分类查询菜品
 * @apiParam {String} _id 菜品Id(必填*)
 * @apiSuccessExample SuccessExample
 * {
    "err": 0,
    "msg": "查询成功",
    "data": [
        {
            "_id": "5dba751eb8c8111f78390902",
            "name": "麻婆豆腐",
            "price": "99",
            "desc": "麻辣可口",
            "type": 1,
            "typeName": "川菜",
            "img": "public/img/mpdf.jpg",
            "__v": 0
        }
    ]
}
 */

router.get('/getFoodsByType', (req, res) => {
    let {type} = req.query;
    if (!type) {
        res.send('参数错误');
        return;
    }
    //查询数据库表
    Food.find({type}).then((data) => {
        if (data.length) {//返回的data是一个数组
            res.send({err: 0, msg: '查询成功', data: data});
        } else {
            res.send('该分类暂无菜品');
        }
    }).catch((err) => {
        console.log(err);
        res.send('查询失败');
    });

});
/**
 * @apiGroup Food
 * @api {GET} /food/getFoodsByKeyword 关键字查询菜品
 * @apiDescription 关键字查询菜品
 * @apiParam {String} keyword 查询关键字(必填*)
 * @apiSuccessExample SuccessExample
 * {
    "err": 0,
    "msg": "查询成功",
    "data": [
        {
            "_id": "5dba751eb8c8111f78390902",
            "name": "麻婆豆腐",
            "price": "99",
            "desc": "麻辣可口",
            "type": 1,
            "typeName": "川菜",
            "img": "public/img/mpdf.jpg",
            "__v": 0
        }
    ]
}
 */

router.get('/getFoodsByKeyword', (req, res) => {
    let {keyword} = req.query;
    let kw = new RegExp(keyword);
    if (!keyword) {
        res.send('参数错误');
        return;
    }
    //查询数据库表
    Food.find({$or: [{name: {$regex: kw}}, {desc: {$regex: kw}}]})
    .then((data) => {
        if (data.length) {//返回的data是一个数组
            res.send({err: 0, msg: '查询成功', data: data});
        } else {
            res.send('暂无该菜品');
        }
    }).catch((err) => {
        console.log(err);
        res.send('查询失败');
    });

});

/**
 * @apiGroup Food
 * @api {POST} /food/add  添加
 * @apiDescription 添加菜品
 * @apiParam {String} name 菜名(必填*)
 * @apiParam {String} price 价格(必填*)
 * @apiParam {String} desc 描述(必填*)
 * @apiParam {String} type 菜系(必填*)
 * @apiParam {String} typeName 菜系名(必填*)
 * @apiParam {String} img 图片(必填*)
 * @apiSuccessExample SuccessExample
 * {
    "err": 0,
    "msg": "添加成功"
}
 */

router.post('/add', (req, res) => {
    let {...param} = req.body;
    if (!param.name || !param.price || !param.type) {
        res.send({err: -3, msg: '参数错误'});
        return;
    }
    //查询数据库表
    Food.find(param).then((data) => {
        if (data.length) {
            res.send({err: -1, msg: '菜品已存在'});
        } else {
            //插入一条记录
            Food.insertMany(param)
            .then((data) => {
                console.log(data);
                res.send({err: 0, msg: '添加成功'});
            })
            .catch((err) => {
                console.log(err);
                res.send({err: -2, msg: '添加失败'});
            });

        }
    });

});

/**
 * @apiGroup Food
 * @api {POST} /food/update  修改
 * @apiDescription 修改菜品
 * @apiParam {String} _id 菜名id(必填*)
 * @apiParam {String} name 菜名(必填*)
 * @apiParam {String} price 价格(必填*)
 * @apiParam {String} desc 描述(必填*)
 * @apiParam {String} type 菜系(必填*)
 * @apiParam {String} typeName 菜系名(必填*)
 * @apiParam {String} img 图片(必填*)
 * @apiSuccessExample SuccessExample
 * {
    "err": 0,
    "msg": "修改成功"
}
 */

router.post('/update', (req, res) => {
    let {_id, ...param} = req.body;
    if (!_id || !param.price || !param.type) {
        res.send({err: -3, msg: '参数错误'});
        return;
    }
    Food.updateOne({_id}, param).then((data) => {
        console.log(data);
        res.send({err: 0, msg: '修改成功'});
    }).catch((err) => {
        console.log(err);
        res.send({err: -2, msg: '修改失败'});
    });
});
/**
 * @apiGroup Food
 * @api {POST} /food/del  删除菜品
 * @apiDescription 删除菜品
 * @apiParam {String} _id 菜品Id(必填*)
 * @apiSuccessExample SuccessExample
 * HTTP/1.1 200
 * {err:0,msg:'删除成功'}
 */
router.post('/del', (req, res) => {
    let {_id} = req.body;
    if (!_id) {
        res.send({err: -3, msg: '参数错误'});
        return;
    }
    Food.remove({_id}).then((err) => {
        res.send({err: 0, msg: '删除成功'});
    }).catch((err) => {
        res.send({err: -1, msg: '删除失败'});
    });
});

module.exports = router;
