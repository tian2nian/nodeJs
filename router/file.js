const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
var multer = require('multer');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../apidoc/img')
    },
    filename: function (req, file, cb) {
        let {size, originalname, mimetype} = file;
        let types = ['jpg', 'jpeg', 'png', 'gif'];
        // let type = mimetype.split('/')[1];
        // let type = originalname.split('.')[1];
        // if (size > 50000) {
        //     console.log('图片过大');
        // } else if (types.indexOf(type) < 0) {
        //     console.log('图片类型错误');
        // } else {
        cb(null, originalname)
        // }
    }
});

var upload = multer({storage: storage});
/**
 * @apiGroup Food
 * @api {POST} /food/uploadImg  上传菜品图片
 * @apiDescription 上传菜品图片
 * @apiParam {String} img 图片url(必填*)
 * @apiSuccessExample SuccessExample
 * HTTP/1.1 200
 * {err:0,msg:'上传成功'}
 */
router.post('/uploadImg', upload.single('img'), (req, res, next) => {
    let {size, mimetype,originalname} = req.file;
    let types = ['jpg', 'jpeg', 'png', 'gif'];
    let type = mimetype.split('/');
    if (size > 50000) {
        res.send({err: -1, msg: '图片过大'});
    } else if (types.indexOf(type[type.length-1]) < 0) {
        res.send({err: -1, msg: '图片类型错误'});
    } else {
        let url = `/public/img/${originalname}`;
        res.send({err: 0, msg: '上传成功', url: url});
    }
});

module.exports = router;
