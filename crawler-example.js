// 系统模块
var fs = require('fs');

var dayjs = require('dayjs');

// HTTP 模块与 DOM 解析, 这是爬虫的核心模块
// HTTP 请求
var request = require('superagent'); // 备选模块 request, 也支持 cookie
// node爬虫之gbk网页中文乱码解决方案
// http://www.cnblogs.com/zichi/p/5157887.html
var charset = require('superagent-charset');
charset(request);
// ENOENT thrown when trying to create a file with an invalid filename
// https://github.com/nodejs/node/issues/8987
var sanitize = require('sanitize-filename');

// encodeURIComponent with charset
// https://github.com/alsotang/urlencode

// 辅组类模块
// 解析命令行参数
var commander = require('commander');
// 命令行输入
var inquirer = require('inquirer');
// 命令行输出的颜色
var chalk = require('chalk');
// 如果有比较复杂的输入选择项, 则使用 commander + inquirer 来处理
commander.version('0.1.0')
         .description('我是一个命令行工具')
         .option('-a, --aa [参数1]', '参数1')
         .option('-b, --bb [参数2]', '参数2')
         .parse(process.argv);
console.log('commander', commander.aa, commander.bb);
// 如果没有传入参数, 则直接提示帮助信息后退出
// if (!process.argv.slice(2).length) {
//     commander.help();
// }

// 提示声
var beep = require('beepbeep'); // 如果要更复杂的播放声音 https://github.com/Marak/play.js
var notifier = require('node-notifier');

// cron 定时任务
var schedule = require('node-schedule');

var crawlerUtil = require('./crawler-util.js');

/**
 * 在请求发出去之前, 做一些通用的默认设置
 * 例如设置统一的超时时间, 统一的 User-Agent 头
 */
function buildAgent(agent) {
    agent.set('User-Agent', 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.104 Safari/537.36 Core/1.53.1708.400 QQBrowser/9.5.9635.400');

    return agent;
}

// HTTP GET
function testGet() {
    var agent = request.get('http://httpbin.org/get');
    buildAgent(agent);

    return agent.query({
                    q: 1,
                    q2: '哈哈'
                })
                .then(function(result) {
                    return result.body;
                });
}
function testGetGb2312Html() {
    var agent = request.get('http://www.best73.com/Corp.html');
    buildAgent(agent);

    return agent.query({
                    q: 1,
                    q2: '哈哈'
                })
                .charset('gb2312')
                .then(crawlerUtil.showMeTheDollar)
                .then(function($) {
                    var title = '';
                    $('head title').each(function() {
                        var $this = $(this);
                        title = $this.text();
                    });

                    return title;
                });
}
// HTTP POST Content-Type: application/x-www-form-urlencoded
function testPostFormUrlEncoded() {
    var agent = request.post('http://httpbin.org/post');
    buildAgent(agent);

    return agent.type('form')
                .send({
                    q: 1,
                    q2: '哈哈'
                })
                .then(function(result) {
                    return result.body;
                });
}
// HTTP POST Content-Type: application/json
function testPostJson() {
    var agent = request.post('http://httpbin.org/post');
    buildAgent(agent);

    return agent.send({
                    q: 1,
                    q2: '哈哈'
                })
                .then(function(result) {
                    return result.body;
                });
}
// 测试通过 Promise 来控制延时任务
function testPromise() {
    return new Promise(function(resolve, reject) {
        testGet().then(function(json) {
            // console.log(json);
            setTimeout(function() {
                resolve(json);
            }, crawlerUtil.randomInt(2000, 3000));
        });
    });
}
// 测试序列任务
function testSequenceRequest() {
    return Array(10).map((v, i) => i).reduce(function(promise, value) {
        return promise.then(function() {
            return testPostJson().then(function(t) {
                console.log(value, t);
                return t;
            });
        });
    }, Promise.resolve());
}
// 测试共享 Cookie
function testAgentCookie() {
    var agent = request.agent();
    agent.get('http://httpbin.org/cookies/set') // 第一个页面
         .query({
             name: 'crawler'
         })
         .then(function(result) {               // 第二个页面, cookie 会一直跟随着
             console.log(1, result.body.cookies);

             return agent.get('http://httpbin.org/cookies').then(function(result) {
                 console.log(2, result.body.cookies);
                 return result.body;
             });
         });
}
// 测试写入文件
function testWriteFile() {
    var dataFileName = '测试中文特殊:/\符号aaa.txt';
    dataFileName = sanitize(dataFileName);
    fs.writeFileSync(dataFileName, dataFileName);
    // fs.appendFileSync();
}
// 测试 Inquirer
function testInquirer() {
    var promps = [];
    promps.push({
        type: 'input',
        name: 'foo',
        message: '请输入',
        validate: function(input) {
            if(!input) {
                return '输入不能为空';
            }
            return true;
        }
    });
    promps.push({
        type: 'list',
        name: 'bar',
        message: '你想用要什么呢',
        choices: [{
            name: 'Text1',
            value: 't1'
        }, {
            name: 'Text2',
            value: 't2'
        }]
    });
    inquirer.prompt(promps).then(function(answers) {
        console.log(answers);
        console.log(chalk.red('我可以做一个命令行工具了...'));
    });
}
function testNotifySound() {
    beep(5, 1000);
}
function testNativeNotifier() {
    notifier.notify({
        title: '标题',
        message: '消息'
    });
}
function testDingdingRobot() {
    var webhook = 'https://oapi.dingtalk.com/robot/send?access_token=';
    var secret = 'SEC';

    return crawlerUtil.sendDingdingRobotMessage(webhook, secret, '消息').then(r => console.log(r));
}
function testDate() {
    var d = dayjs().startOf('month').add(1, 'day').set('year', 2018).format('YYYY-MM-DD HH:mm:ss');
    console.log(d);
}
function testCron() {
    var j = schedule.scheduleJob('*/5 * * * * *', function(){
        console.log(new Date().toLocaleTimeString(), '每 5 秒执行一次...');
        console.log('-----------------');
    });
}

// testNotifySound();
// testNativeNotifier();
// testDate();
// testDingdingRobot();
// testCron();
// testWriteFile();
// testInquirer();
// testAgentCookie();
// testGet().then(function(r) {console.log('testGet', r)});
// testGetGb2312Html().then(function(r) {console.log('testGetGb2312Html', r)});
// testPostFormUrlEncoded().then(function(r) {console.log('testPostFormUrlEncoded', r)});
// testPostJson().then(function(r) {console.log('testPostJson', r)});
// testPromise().then(function(r) {console.log('testPromise', r);});
// testSequenceRequest().then(function() {console.log('over');});