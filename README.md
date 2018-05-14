# koa2-typescript-jwt-mongodb-redis

##项目说明：
  本工程搭建了一套通过手机注册的restapi,使用了腾讯云的短信功能，如果需要到腾讯云上进行注册，并填写短信模板.使用jwt进行api 权限认证,其原理是双向加密，非常实用于微服务，使用mongodb 保存用户数据，为了支持集群，使用redis保存手机验证码
## 安装配置
* 执行命令 npm install --global gulp 全局安装gulp
* 执行命令 npm install 安装依赖
* 执行命令 gulp 编译代码
* 安装 redis 和mongodb
* 在config/config.json 配置相应参数

##配置文件：


#部署
* 执行命令npm start启动服务
* 也可以使用 pm2 start pm2.json 以集群方式启动.
   



