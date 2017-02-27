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

## 参考

* [网络爬虫与数据库操作](https://github.com/leizongmin/book-crawler-mysql-cron/blob/master/book.md)
  * 发起一个 HTTP 请求来获取指定 URL 的内容
  * 使用 jQuery 的查询语法来操作网页元素，提取出需要的数据
  * 将数据储存到数据库中，以及从数据库中查询出这些数据
  * 建立一个简单的 Web 服务器来显示这些数据
  * 使用简单的方法来让一些程序在指定的时间自动执行
  * 让程序更稳定地运行
  * 对一些常见的字符编码互相转换
* [神箭手-云爬虫开发平台](http://www.shenjianshou.cn)

  神箭手是一个一站式云端通用爬虫开发平台。海量代理IP、JS自动渲染、防屏蔽、图片云托管、验证码识别.

  [神箭手云爬虫 爬取规则示例](https://github.com/ShenJianShou/crawler_samples)
* [八爪鱼采集器 - 网页数据采集器](http://www.bazhuayu.com/)
* [Finndy+云采集引擎](http://www.finndy.com/?action-engine)
* [Faker](https://github.com/cupools/faker "An experience spider to collect free proxy ip through extensible task")
  * [西刺免费](http://www.xicidaili.com/nn/)
  * [快代理](http://www.kuaidaili.com/free/inha/)