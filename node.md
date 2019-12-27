# nodeJs学习笔记 
  [视频链接](https://www.bilibili.com/video/av53978941/?p=2)   

## 概念
   + Chrome v8 runtime
   + 事件驱动
   + 非阻塞I/O（正常情况下I/O操作是阻塞的）
     - 网络请求
     - 数据库处理
     - 文件的读写
## 特点
   + 高并发处理（次于Python）
   + npm（node的包管理工具）
## 学习价值
   + 接口API
## 历史由来
   + node选择了JS
## js运行环境
   + 浏览器
     - 基本语法
     - DOM
     - BOM
     - Ajax
   + 服务器
     - 基本语法
     - 操作数据库
     - 操作本地文件
>注意：限制浏览器不能操作数据库和本地文件是出于安全考虑。限制语言能力的并非语言本身，而是运行环境。
## 安装
  + nvm是node版本管理器用来切换当前版本
```
nvm user v10.8.6 
```
## npm
  + 将npm镜像源直接设置为淘宝镜像
```
npm config set registry http://registry.npm.taobao.org 
```
  + 安装淘宝镜像
```
npm i -g cnpm --registry http://registry.npm.taobao.org 
```
## node运行
   + REPL（直接在node命令行写代码）
```
node 文件地址
```
## node模块化
### 内置模块
   + 文件操作fs
   ``` 
   //内部文件直接引入文件名
   const fs = require('fs');
   //文件类型 
   const stat = fs.stat('./',(err,stats)=>{
      if(stats.ifFile()) return 'file';
      else if(stats.ifDirectory()) return 'directory';
   });
   //同步读取文件夹
   let dirs = fs.readdirSync('./');
   //错误优先规范：在回调函数中第一个参数表示错误对象，默认为null
   fs.readdir('./',(err,data)=>{
       console.log(err);
       console.log(data);
   })
   
   //创建文件夹
   fs.mkdir('./test',(err,data)=>{})
   
   //更改文件夹
   fs.mkdir('./oldName','./newName',(err,data)=>{})
   
   //删除文件夹（只能成功删除空的文件夹）
   fs.rmdir('./test',(err,data)=>{})
   
   //读取文件（默认是二进制buffer）
   fs.readFile('./','utf8',(err,data)=>{
   console.log(data.toString('utf8'))
   })
   
   //创建文件
   //1.文件覆盖写入
   fs.writeFile('./',(err,data)=>{})
   //2.文件写入
   fs.appendFile('./',(err,data)=>{})
   
   //删除文件
   fs.unlink('./test',(err)=>{})
   ```

   + 统一资源定位符url（queryString）
   
  ```
  const url = require('url');
  let urlObj = url.parse(urlStr);
  let urlStr = url.format(urlObj);
  ```

```
const qs = require('queryString');
let qsObj = qs.parse(qsStr,#,=);
let qsStr = qs.stringify(qsObj,#,=);
//编码解码不等于加密解密
let escapeStr = qs.escape(unescapeStr);//编码
let unescapeStr = qs.unescape(escapeStr);//解码
```
 ### 第三方模块
   + 消息验证码案例（邮箱nodemailer，手机）
   + 爬虫案例
       1. 获取目标网站（内置http/https）
       2. 分析网站内容（第三方cheerio）
       3. 获取有效信息
   ```
   1.
   
   let http = require('https');
   http.get(url,(res)=>{
       let data='';
       let err='';
       const {stateCode} = res;
       const contentType = res.headers['content-type'];
       if(stateCode!==200){
           err=new Error('请求失败');
       }else if(!/^text\/html/.test(contentType)){
           err=new Error('文件类型错误');
       }
       if(err){
           res.resume();//重置缓存
           return;
       }
   //数据段接收
       res.on('data',(chunk)=>{
           //chunk默认是buffer类型
           data+=chunk.toString('utf8');
       })
   //数据流传输完毕
       res.on('end',()=>{
           //cheerio分析数据
       })
   }).on('error',(err)=>{
   
   })
   
   2.
   
   //cheerio可使用jQ里的选择器
   
   let cheerio = require('cheerio');
   let $ = cheerio.load(htmlStr);
   $('img').each((img)=>{
        console.log(img.attr('src'));
   })
   
   
   ```
   + 写API接口（server/koa、body-parser、router）
        - ip:定位服务器主机
        - port:定位服务器里的程序
        - path
        - method
          - get: req.query、可用浏览器测试
          - post: req.body、可用postman测试、josn、formData、x-www-form-urlencoded
     - 中间件（middlewear）
       - 内置中间件（static）
       - 自定义中间件
       - 第三方中间件
         - body-parser
         - 拦截器（可以写任意多个）
           - 全局 app.use(url,(req,res,next)=>{})）,...
           - 局部 app.get(url,(req,res,next)=>{},(req,res,next)=>{},...,someMethod)）

```
const server = require('server');
//express不能直接解析消息体
const bodyParser = require('body-parser');
//server 实例化
const app = server();
//使用中间件 解析表单数据 x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:false}));
//解析json数据
app.use(bodyParser.json());
//api接口
app.get(url,(req,res)=>{
//get参数
    let {us,ps}=req.query;
    if(us='lfx'&&ps='0506'){
        res.send('登录ok')
    }
})
app.post(url,(req,res)=>{
//post参数  
    let {us,ps}=req.body;
    if(us='lfx'&&ps='0506'){
        res.send('注册ok')
    }
})
//监听端口 开启本地服务器
app.listen(3000,()=>{
    
})
```
### 自定义模块
   + 创建一个模块（一个js文件）
   + 导出这个模块（module.exports）
   ```
   //module.js
   let name={
       sayName(){
           console.log('name') ;   
       }
   }
   module.eports=name;
   
   ```
   + 引入这个模块并调用（require()）

```
//index.js
let module=require('./module');//自定义模块引入文件路径
module.sayName();
```

