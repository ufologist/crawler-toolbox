# crawler-toolbox

爬虫工具箱

v0.1.0 2016-12-7

## 用途

* 作为 [HttpToolbox](https://github.com/ufologist/HttpToolbox) 的 Node.js 版
* 列举了爬虫抓取网站的一般场景
* 作为开发爬虫项目的模版

## 依赖

* 爬虫的核心模块: HTTP 与 解析 DOM
  * `superagent` HTTP
  * `cheerio` 解析 DOM
* 日志
  * `log4js`
* 命令行
  * `commander`
  * `inquirer`
  * `chalk`
* 定时任务
  * `node-schedule` cron 定时任务
* 工具
  * `sanitize-filename` 避免写文件时由于非法的文件名造成写入失败
  * `superagent-charset` 针对非 UTF-8 编码的网站
  * `beepbeep` 声音提醒