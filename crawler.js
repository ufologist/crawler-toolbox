// [网络爬虫与数据库操作](https://github.com/leizongmin/book-crawler-mysql-cron/blob/master/book.md)

// 发起一个 HTTP 请求来获取指定 URL 的内容；
// 使用 jQuery 的查询语法来操作网页元素，提取出需要的数据；
// 将数据储存到数据库中，以及从数据库中查询出这些数据；
// 建立一个简单的 Web 服务器来显示这些数据；
// 使用简单的方法来让一些程序在指定的时间自动执行；
// 让程序更稳定地运行；
// 对一些常见的字符编码互相转换。

// 系统模块
var fs = require('fs');

// HTTP 模块与 DOM 解析, 这是爬虫的核心模块
var request = require('superagent');
var charset = require('superagent-charset');
charset(request);

// 日志
var log4js = require('log4js');
log4js.configure({
    appenders: [{
        type: 'console'
    }, {
        type: 'logLevelFilter',
        level: 'warn',
        appender: {
            type: 'dateFile',
            filename: '_runtime_crawler',
            pattern: '-yyyy-MM-dd.log',
            alwaysIncludePattern: true
        }
    }],
    replaceConsole: true
});
var sanitize = require('sanitize-filename');

var crawlerUtil = require('./crawler-util.js');

// 如果一个抛出的异常没有被 try {} catch (err) {} 捕捉到,
// 其会尝试将这些错误交由 uncaughtException 事件处理程序来处理,
// 仅当没有注册该事件处理程序时, 才会最终导致进程直接退出
//
// 有时候, 由于 Node.js 自身的 Bug 或者使用到的第三方 C++ 模块的缺陷而导致一些底层的错误,
// 比如在 Linux 系统下偶尔会发生段错误(segment fault)导致进程崩溃,
// 此时上面提到的处理 uncaughtException 事件的方法就不适用了.
// pm2 是一个功能强大的进程管理器
process.on('uncaughtException', function (err) {
    console.error('uncaughtException: %s', err.stack);
});

// 简单的就直接使用 process.argv
// 复杂的就参考 crawler-example.js 中的 commander + inquirer
var args = process.argv.slice(2);

var userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.104 Safari/537.36 Core/1.53.1708.400 QQBrowser/9.5.9635.400';
// 请求超时时间为 1 个小时
var timeout = 60 * 60 * 1000;

/**
 * 在请求发出去之前, 做一些通用的默认设置
 * 例如设置统一的超时时间, 统一的 User-Agent 头
 */
function buildAgent(agent) {
    agent.set('User-Agent', userAgent)
        //  .set('X-Requested-With', 'XMLHttpRequest') // ajax 请求一般会添加这个头
         .timeout(timeout);

    return agent;
}

// HTTP 请求相关的示例请参考 crawler-example.js