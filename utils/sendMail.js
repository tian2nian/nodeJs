'use strict';
const nodemailer = require('nodemailer');

 function sendMail(mail,content) {
     //创建发送邮件对象
     let transporter = nodemailer.createTransport({
         host: 'smtp.qq.com',//发送邮箱 node_modules/nodemailer/lib/well-known/services.json
         port: 465,//端口号
         secure: true, // true  465, false  other
         auth: {
             user: '3215158620@qq.com', // 发送方邮箱地址
             pass: 'efietuaxdmbjddgi' //mtp验证码  邮箱-设置--开启服务-POP3/SMTP服务
         }
     });
     let mailObj={
         from: '"Fred Foo 👻" <3215158620@qq.com>', // sender address
         to: mail, // list of receivers
         subject: 'Hello ✔', // Subject line
         text: content, //必须是string
     };

return new  Promise((resolve, reject)=>{
    transporter.sendMail(mailObj, (err, data) => {
        if(err){
            reject(err)
        }else{
            resolve(data)
        }
    });
});

 }

module.exports={sendMail};
