const redis = require("redis"),
    client = redis.createClient();
const {promisify} = require('util');
const getAsync = promisify(client.get).bind(client);

function setRedis(key, val) {
    console.log(`保存${key}:${val};`);
    client.set(key, val, 'EX', 5000);
}

async function getRedis(key) {
    let val = await getAsync(key);
    console.log(`获取${key}的值:${val}`);
    return val;
}

module.exports = {setRedis, getRedis};
