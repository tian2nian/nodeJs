const https = require('https');
const http = require('http');
const cheerio = require('cheerio');//cheerio可使用jQ里的选择器

https.get('https://daohang.qq.com/?fr=hmpage', (res) => {
    let err = '';
    const {stateCode} = res;
    const contentType = res.headers['content-type'];
    if (stateCode !== 200) {
        err = new Error('请求失败');
    } else if (!/^text\/html/.test(contentType)) {
        err = new Error('文件类型错误');
    }
    if (err) {
        res.resume();//重置缓存
        return;
    }
    //数据段接收
    let htmlStr = '';
    res.on('data', (chunk) => {
        //chunk默认是buffer类型
        htmlStr += chunk.toString('utf8');
    });
    //数据流传输完毕
    let $ = cheerio.load(htmlStr);
    console.log(htmlStr);
    res.on('end', (r) => {
        console.log(r);
        $('img').each((img) => {
            console.log(img.attr('src'));
        });
    });
}).on('error', (err) => {

});

module.exports = https;

