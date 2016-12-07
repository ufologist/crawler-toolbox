// 解析 DOM
var cheerio = require('cheerio');

/**
 * show me the money
 * 解析 HTML, 返回一个类似 jQuery 的对来用于解析 DOM 结构
 */
function showMeTheDollar(response) {
    var $ = cheerio.load(response.text, {
        // 中文乱码？不，是 HTML 实体编码！
        // http://www.cnblogs.com/zichi/p/5135636.html
        decodeEntities: false
    });

    return $;
}

// npm install chance
// chance.integer({min: 1, max: 2});
function randomInt(min, max) {
    // https://github.com/sindresorhus/random-int
    return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = {
    showMeTheDollar: showMeTheDollar,
    randomInt: randomInt
};