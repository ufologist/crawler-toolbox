var crypto = require('crypto');

// 解析 DOM
var cheerio = require('cheerio');
var request = require('superagent');

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

/**
 * 钉钉机器人加签
 * 
 * @return {string}
 */
function dingdingRobotSign(timestamp, secret) {
    var plainText = timestamp + '\n' + secret;
    var cipherText = crypto.createHmac('sha256', secret)
                           .update(plainText)
                           .digest()
                           .toString('base64');
    return cipherText;
}

/**
 * 推送钉钉机器人消息
 * 
 * @param {string} webhook 
 * @param {string} secret 
 * @param {string | object} message 
 * @param {function} [buildAgent] 
 * 
 * @see https://ding-doc.dingtalk.com/doc#/serverapi2/qf2nxq/e9d991e2
 */
function sendDingdingRobotMessage(webhook, secret, message, buildAgent) {
    var timestamp = Date.now();
    var sign = dingdingRobotSign(timestamp, secret);
    var _webhook = '';
    var _message = typeof message === 'string' ? {
        msgtype: 'text', 
        text: {
            content: message
        }
    } : message;

    if (webhook.indexOf('?') === -1) {
        _webhook = `${webhook}?timestamp=${timestamp}&sign=${encodeURIComponent(sign)}`;
    } else {
        _webhook = `${webhook}&timestamp=${timestamp}&sign=${encodeURIComponent(sign)}`;
    }

    var agent = request.post(_webhook);
    buildAgent && buildAgent(agent);

    return agent.send(_message)
                .then(function(result) {
                    return result.body;
                });
}

module.exports = {
    showMeTheDollar: showMeTheDollar,
    randomInt: randomInt,
    sendDingdingRobotMessage: sendDingdingRobotMessage
};