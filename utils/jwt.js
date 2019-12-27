//1.用户登录 服务器端产生一个token发送给前端
// 2.前端将token保存 发起数据请求时携带token
// 3.服务端验证token是否合法 合法继续 否则终止操作
// 4.token的应用场景 无状态请求 保持用户的登录状态 第三方登录
const jwt = require('jsonwebtoken');

//定义生成token的私钥
let screct = 'hfdsjfhdjfhjkdfkdf';
//定义载荷(传递数据) 载荷里不要放私密内容
let payload = {
    us: 'jfdkj',
    ps: 'jfdkjfd'
};

//生成token hs256加密
function creatToken(payload={}) {
    payload.ctime = new Date().getTime();
    payload.expires = 1000*60*60*7;
    return jwt.sign(payload, screct);
}

//验证token合法性
function checkToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, screct, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    })
}

module.exports = {creatToken, checkToken};
