
import { utilFunc } from "../utils/func";
import { errors } from "../utils/errors";

import { nongoContract } from "../model/mongoContract";
import { mongoAccount } from "../model/mongoAccount";
import { sms } from "../utils/sms";
import { token } from "../utils/token";
import { candy } from "../utils/candy";
import { logger } from '../utils/logger';
const config = require('../../config/config.json');
class Contract {

    public async sendSmsByContract(ctx: any) {

        if (ctx.request.origin !== config.url) {
            const error = errors.Common_ApiNotPower;
            logger.error(`${error.code}:${error.message}`);
            return ctx.error(error);
        }

        const { smstype, contract, params } = ctx.request.body;
        if (!contract) {
            const error = errors.Param_contract_Error;
            logger.error(`${error.code}:${error.message}`);
            return ctx.error(error);
        }
        if (!contract) {
            const error = errors.Param_Templateid_Error;
            logger.error(`${error.code}:${error.message}`);
            return ctx.error(error);
        }

        if (!contract) {
            const error = errors.Param_Params_Error;
            logger.error(`${error.code}:${error.message}`);
            return ctx.error(error);
        }

        const info = await nongoContract.getMobileByContract(contract);
        if (!info) {
            const error = errors.Common_ContractIncorrect;
            logger.error(`${error.code}:${error.message}`);
            return ctx.error(error);
        }
        try {
            const result = await sms.sendSMSContract(smstype, info.nationcode, info.mobile, params);
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
    //绑定合约号
    public async bindContract(ctx: any) {

        const { contract, transactiontype } = ctx.request.body;
        if (!contract) {
            const error = errors.Param_contract_Error;
            logger.error(`${error.code}:${error.message}`);
            return ctx.error(error);
        }
        if (!transactiontype) {
            const error = errors.Param_TransactionType_Error;
            logger.error(`${error.code}:${error.message}`);
            return ctx.error(error);
        }
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

        const result = await mongoAccount.getNationCodeByMobile(mobile);
        const info = await nongoContract.addContract(result.nationcode, mobile, contract, transactiontype);
        const tk = token.sign();
        return ctx.success({ accesstoken: tk });
    }

    public async getMobilesByContracts(ctx: any) {

        const { contract } = ctx.request.body;
        if (!contract) {
            const error = errors.Param_contract_Error;
            logger.error(`${error.code}:${error.message}`);
            return ctx.error(error);
        }
        if (!Array.isArray(contract)) {
            const error = errors.Common_ParamsTypeError;
            logger.error(`${error.code}:${error.message}`);
            return ctx.error(error);
        }
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

        const info = await nongoContract.getMobilesByContracts(contract);
        const tk = token.sign();
        info.accesstoken = tk;
        return ctx.success(info);
    }

}
export const contract = new Contract();


