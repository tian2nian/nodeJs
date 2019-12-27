const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const router = express.Router();
var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//跨域代理
router.get('/poxy', (req, res) => {
    request('http://es6.ruanyifeng.com/#docs/destructuring#%E5%AF%B9%E8%B1%A1%E7%9A%84%E8%A7%A3%E6%9E%84%E8%B5%8B%E5%80%BC', (err, r, body) => {
        if (err) {
            res.send(err);
        } else {
            res.send(body);
        }
    })
});
module.exports = router;

