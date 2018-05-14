
import { utilFunc } from "../utils/func";
import { errors } from "../utils/errors";
import { mongoAccount } from "../model/mongoAccount";
import { nongoContract } from "../model/mongoContract";
import { nongoCandyLog } from "../model/mongoCandyLog";
import { logger } from '../utils/logger';
import { sms } from "../utils/sms";
import { token } from "../utils/token";
import { candy } from "../utils/candy";
import { redisSMS } from '../model/redisSMS';
import {encrypion} from "../utils/encryption";

const config = require('../../config/config.json');
class Account {

    public async sendVerificationCode(ctx: any) {
        const { nationcode, mobile } = ctx.request.body;
        if (!nationcode) {
            const error = errors.Param_Nationcode_Error;
            logger.error(`${error.code}:${error.message}`);
            return ctx.error(error);
        }
        if (!mobile) {
            const error = errors.Param_Mobile_Error;
            logger.error(`${error.code}:${error.message}`);
            return ctx.error(error);
        }

        const random = utilFunc.createRandom(6);
        try {
            const result = await sms.sendSMS(nationcode, mobile, random);
            // sms.insertRecord(nationcode, mobile, random);
            await redisSMS.saveSMScode(mobile, random);
            return ctx.success(result);
        } catch (err) {
            const error = {
                code: errors.Common_SMSFail.code,
                message: err.errmsg
            }
            logger.error(`${error.code}:${error.message}`);
            return ctx.error(error);
        }
    }
    public async createAccount(ctx: any) {

        const { nationcode, mobile, verifictioncode, password } = ctx.request.body;

        if (!nationcode) {
            const error = errors.Param_Nationcode_Error;
            logger.error(`${error.code}:${error.message}`);
            return ctx.error(error);
        }
        if (!mobile) {
            const error = errors.Param_Mobile_Error;
            logger.error(`${error.code}:${error.message}`);
            return ctx.error(error);
        }
        if (!verifictioncode) {
            const error = errors.Param_Verifictioncode_Error;
            logger.error(`${error.code}:${error.message}`);
            return ctx.error(error);
        }
        if (!password) {
            const error = errors.Param_Password_Error;
            logger.error(`${error.code}:${error.message}`);
            return ctx.error(error);
        }
        const jmpassword =  encrypion.md5AesEncrpt(password);

        const vcode = await redisSMS.loadSMScode(mobile);
        if (verifictioncode!==vcode) {
            const error = errors.Common_CodeIncorrect;
            logger.error(`${error.code}:${error.message}`);
            return ctx.error(error);
        }
        await redisSMS.deleteKey(mobile);//删除验证码

        const result = await mongoAccount.isRegistered(mobile);
        if (result) {
            const error = errors.Common_AleardyCreated;
            logger.error(`${error.code}:${error.message}`);
            return ctx.error(error);
        }

        const info = await mongoAccount.createAccount(nationcode, mobile, jmpassword);
        return ctx.success();
    }
    public async isRegistered(ctx: any) {

        const { mobile } = ctx.request.body;

        if (!mobile) {
            const error = errors.Param_Mobile_Error;
            logger.error(`${error.code}:${error.message}`);
            return ctx.error(error);
        }

        const accountInfo = await mongoAccount.isRegistered(mobile)
        const isregistered = !!accountInfo;
        return ctx.success({ isregistered });
    }
    public async login(ctx: any) {

        const { mobile, password } = ctx.request.body;

        if (!mobile) {
            const error = errors.Param_Mobile_Error;
            logger.error(`${error.code}:${error.message}`);
            return ctx.error(error);
        }
        if (!password) {
            const error = errors.Param_Password_Error;
            logger.error(`${error.code}:${error.message}`);
            return ctx.error(error);
        }
        const jmpassword =  encrypion.md5AesEncrpt(password);
        const result = await mongoAccount.login(mobile,jmpassword);

        if (!result) {
            const error = errors.Common_LoginFail;
            logger.error(`${error.code}:${error.message}`);
            return ctx.error(error);
        }

        token.setSignInfo(mobile);
        const accesstoken = token.sign();
        result.accesstoken = accesstoken;
        return ctx.success(result);

    }

    public async resetPassword(ctx: any) {

        const { nationcode, mobile, verifictioncode, password } = ctx.request.body;
        if (!nationcode) {
            const error = errors.Param_Nationcode_Error;
            logger.error(`${error.code}:${error.message}`);
            return ctx.error(error);
        }
        if (!mobile) {
            const error = errors.Param_Mobile_Error;
            logger.error(`${error.code}:${error.message}`);
            return ctx.error(error);
        }
        if (!verifictioncode) {
            const error = errors.Param_Verifictioncode_Error;
            logger.error(`${error.code}:${error.message}`);
            return ctx.error(error);
        }
        if (!password) {
            const error = errors.Param_Password_Error;
            logger.error(`${error.code}:${error.message}`);
            return ctx.error(error);
        }

        const info = await mongoAccount.getNationCodeByMobile(mobile);
        if (!info) {
            const error = errors.Common_UserNotExist;
            logger.error(`${error.code}:${error.message}`);
            return ctx.error(error);
        }

        const vcode = await redisSMS.loadSMScode(mobile);
        if (verifictioncode!==vcode) {
            const error = errors.Common_CodeIncorrect;
            logger.error(`${error.code}:${error.message}`);
            return ctx.error(error);
        }
        await redisSMS.deleteKey(mobile);//删除验证码

        const jmpassword =  encrypion.md5AesEncrpt(password);
        const result = await mongoAccount.resetPassword(nationcode, mobile,jmpassword);
        return ctx.success(result);
    }

    public async sendCandy(ctx: any) {

        const accesstoken = ctx.headers.accesstoken;
        if (!accesstoken) {
            const error = errors.Param_accesstoken_Error;
            logger.error(`${error.code}:${error.message}`);
            return ctx.error(error);
        }

        const { ethaddress } = ctx.request.body;

        if (!ethaddress) {
            const error = errors.Param_EthAddress_Error;
            logger.error(`${error.code}:${error.message}`);
            return ctx.error(error);
        }
        let mobile: string;
        try {
            const decoded = await token.tokenVerify(accesstoken);
            if (decoded.id !== config.token.secretkey) {
                const error = errors.Param_accesstoken_Error;
                logger.error(`${error.code}:${error.message}`);
                return ctx.error(error);
            }
            mobile = decoded.mobile;
        } catch (error) {
            const newerr = {
                code: errors.Common_TokenIncorrect.code,
                message: error.message
            }
            logger.error(newerr.message);
            return ctx.error(newerr);
        }

        //判断地址是否领过糖果
        const info = await mongoAccount.getCandyStateByEthaddress(ethaddress);
        if (info) {
            const error = errors.Common_EthAddressUsed;
            logger.error(`${error.code}:${error.message}`);
            return ctx.error(error);
        }

        //如果领糖日志错误达到三次，取消糖果资格
        const times = await nongoCandyLog.getErrorTimes(mobile);
        if (times >= 3) {
            await mongoAccount.updateCandyByMobile(mobile, -1);
            const error = errors.Common_GetCandyErrorTimesOut;
            logger.error(`${error.code}:${error.message}`);
            return ctx.error(error);

        }
        try {
            let result = await candy.sendCandy(ethaddress);
            result = JSON.parse(result);
            await nongoCandyLog.addCandyLog(mobile, ethaddress, result);

            if (result.sent === -1) {
                const error = errors.Common_EthAddressIncorrect;
                logger.error(`${error.code}:${error.message}`);
                return ctx.error(error);
            }
            //更新数据库
            await mongoAccount.bindCandy(mobile, ethaddress, result.sent, result.earned);
            //如果不等于2，加入定时器
            if (result.sent === 1) {
                candy.add(ethaddress);
            }
            const accesstoken = token.sign();
            result.accesstoken = accesstoken;
            return ctx.success(result);

        } catch (err) {
            const error = errors.Common_Candynoresponse;
            logger.error(`${error.code}:${error.message}`);
            return ctx.error(error);
        }
    }

    public async getCandyState(ctx: any) {

        const accesstoken = ctx.headers.accesstoken;
        if (!accesstoken) {
            const error = errors.Param_accesstoken_Error;
            logger.error(`${error.code}:${error.message}`);
            return ctx.error(error);
        }
        let mobile: string;
        try {
            const decoded = await token.tokenVerify(accesstoken);
            if (decoded.id !== config.token.secretkey) {
                const error = errors.Param_accesstoken_Error;
                logger.error(`${error.code}:${error.message}`);
                return ctx.error(error);
            }
            mobile = decoded.mobile;
        } catch (err) {
            const error = {
                code: errors.Common_TokenIncorrect.code,
                message: err.message
            }
            logger.error(`${error.code}:${error.message}`);
            return ctx.error(error);
        }

        const result = await mongoAccount.getCandyStateByMobile(mobile);
        if (!result) {
            const error = errors.Common_Mobileresponse;
            logger.error(`${error.code}:${error.message}`);
            return ctx.error(error);
        }
        const tk = token.sign();
        result.accesstoken = tk;
        return ctx.success(result);
    }

}
export const account = new Account();


