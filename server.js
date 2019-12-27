const express = require('express');
const path = require('path');
const db = require('./db/connect');
const websocket = require('./utils/websocket');
const reptile = require('./utils/reptile');
const poxyRouter = require('./router/poxy');
const userRouter = require('./router/user');
const foodRouter = require('./router/food');
const fileRouter = require('./router/file');
const cookieSessionRouter = require('./router/cookieSession');
var cors = require('cors');
var app = express();
//解决跨域
app.use(cors());
//  http://localhost:3000/public/img/img-1572521703410395.jpeg
app.use('/public', express.static(path.join(__dirname, './apidoc')));
app.use(poxyRouter);
app.use(poxyRouter);
app.use(cookieSessionRouter);
app.use('/user', userRouter);
app.use('/food', foodRouter);
app.use('/file', fileRouter);

//防止redis连接失败导致node进程崩溃
process.on('uncaughtException', (err) => {
    if (err) {
        console.error(err);
    } else {
        process.exit(1);
    }
});
app.listen('3000', () => {
    console.log('开启3000端口服务器');
});

