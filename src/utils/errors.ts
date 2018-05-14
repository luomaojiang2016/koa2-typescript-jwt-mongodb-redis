const CommonErrorBase       = 10000;
const ParamErrorBase        = 20000;
export var errors = {
    
    SystemError:                    {code: CommonErrorBase + 0,    message: ''},
    Common_EthAddressNotFind:       {code: CommonErrorBase + 1,    message: '以太坊地址不存在!'},
    Common_AleardyCreated:          {code: CommonErrorBase + 2,    message: '账号已经存在!'},
    Common_LoginFail:               {code: CommonErrorBase + 3,    message: '账号或密码错误!'},
    Common_SMSFail:                 {code: CommonErrorBase + 4,    message: '短信发送接口错误!'},
    Common_OverTime:                {code: CommonErrorBase + 5,    message: '验证超时!'}, 
    Common_CodeIncorrect:           {code: CommonErrorBase + 6,    message: '验证码错误!'},
    Common_TokenIncorrect:          {code: CommonErrorBase + 7,    message: 'token错误!'},
    Common_Candynoresponse:         {code: CommonErrorBase + 8,    message: '调用糖果api出错!'},
    Common_EthAddressIncorrect:     {code: CommonErrorBase + 9,    message: 'ethaddress 不存在'},
    Common_Mobileresponse:          {code: CommonErrorBase + 10,   message: '无此mobile !'},
    Common_ContractIncorrect:       {code: CommonErrorBase + 11,   message: '无此Contract'},
    Common_EthAddressUsed:          {code: CommonErrorBase + 12,   message: '此地址已经领过糖果!'},
    Common_GetCandyErrorTimesOut:   {code: CommonErrorBase + 13,   message: '领糖果输入错误已超过三次!'},
    Common_UserNotExist:            {code: CommonErrorBase + 14,   message: '用户不存在，请注册！'},
    Common_ParamsTypeError:         {code: ParamErrorBase + 15,     message: '参数必须是一个数组！'},
    Common_ApiNotPower:             {code: ParamErrorBase + 16,     message: '内部接口,无权限访问！'},

    Param_Nationcode_Error:         {code: ParamErrorBase + 0,     message: 'nationcode 参数错误!'},
    Param_Mobile_Error:             {code: ParamErrorBase + 1,     message: 'mobile 参数错误!'},
    Param_Verifictioncode_Error:    {code: ParamErrorBase + 2,     message: 'verifictioncode 参数错误!'},
    Param_Password_Error:           {code: ParamErrorBase + 3,     message: 'password 参数错误!'},
    Param_EthAddress_Error:         {code: ParamErrorBase + 4,     message: 'ethaddress 地址参数错误'},
    Param_accesstoken_Error:        {code: ParamErrorBase + 5,     message: 'accesstoken 参数错误'},
    Param_contract_Error:           {code: ParamErrorBase + 6,     message: 'contract 参数错误'},
    Param_Templateid_Error:         {code: ParamErrorBase + 7,     message: 'SMS 类型参数错误'},
    Param_Params_Error:             {code: ParamErrorBase + 8,     message: 'SMS 参数错误'},
    Param_TransactionType_Error:    {code: ParamErrorBase + 9,     message: 'transactiontype 参数错误'}
    

};

for (const key in errors){
    if (errors.hasOwnProperty(key)){
        errors[key].name = key;
    }
}


