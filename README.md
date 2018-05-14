# koa2-typescript-Account

## 安装配置及部署
* 执行命令 npm install --global gulp 全局安装gulp
* 执行命令 npm install 安装依赖
* 执行命令 gulp 编译代码
* 打开./config/config.json 文件配置mongodb和sms参数
* 执行命令npm start启动服务

## API 接口
* /v1/account/sendverifictioncode
    * 功能： 发送验证码
    * HTTP: POST
    * Body：{nationcode:"86",mobile:"136666666666"}

* /v1/account/createaccount
    * 功能： 创建用户
    * HTTP: POST
    * Body：{nationcode:"86",mobile:"136666666666",verifictioncode:"789567",password:"123456"}

* /v1/account/isregistered
    * 功能： 判断用户是否注册
    * HTTP: POST
    * Body：{nationcode:"86",mobile:"136666666666"}

* /v1/account/login
    * 功能： 登录
    * HTTP: POST
    * Body：{nationcode:"86",mobile:"136666666666",password:"123456"}

* /v1/account/resetpassword
    * 功能： 重置密码
    * HTTP: PUT
    * Body：{nationcode:"86",mobile:"136666666666",verifictioncode:"789567",password:"123456"}

* /v1/account/bindethaddress
    * 功能： 绑定以太坊地址
    * HTTP: PUT
    * Body：{nationcode:"86",mobile:"136666666666",ethaddress:"45546tfhfh"}

## API 接口调用结果
* 失败格式：{status: error.code,errmsg:error.message}
* 成功格式：{status: 0,result:{}}

## API 错误码参考
    const CommonErrorBase       = 10000;
    const ParamErrorBase        = 20000;
    SystemError:                    {code: CommonErrorBase + 0,    message: ''},
    Common_EthAddressNotFind:       {code: CommonErrorBase + 1,    message: '以太坊地址不存在!'},
    Common_AleardyCreated:          {code: CommonErrorBase + 2,    message: '账号已经存在!'},
    Common_LoginFail:               {code: CommonErrorBase + 3,    message: '账号或密码错误!'},
    Common_SMSFail:                 {code: CommonErrorBase + 4,    message: '短信发送接口错误!'},
    Common_OverTime:                {code: CommonErrorBase + 5,    message: '验证超时!'}, 
    Common_CodeIncorrect:           {code: CommonErrorBase + 6,    message: '验证码错误!'},
    Common_TokenIncorrect:          {code: CommonErrorBase + 7,    message: 'token错误!'},

    Param_Nationcode_Error:         {code: ParamErrorBase + 0,     message: 'nationcode 参数错误!'},
    Param_Mobile_Error:             {code: ParamErrorBase + 1,     message: 'mobile 参数错误!'},
    Param_Verifictioncode_Error:    {code: ParamErrorBase + 2,     message: 'verifictioncode 参数错误!'},
    Param_Password_Error:           {code: ParamErrorBase + 3,     message: 'password 参数错误!'},
    Param_EthAddress_Error:         {code: ParamErrorBase + 4,     message: 'ethaddress 地址参数错误'},