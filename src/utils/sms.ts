
const config = require('../../config/config.json');
const QcloudSms = require("qcloudsms_js");
class SMS {

    private appid: string;
    private appkey: string;
    private cnAccountTemplateId: string;
    private enAccountTemplateId: string;

    private cnContractTemplateId1: string;
    private enContractTemplateId1: string;

    private cnContractTemplateId2: string;
    private enContractTemplateId2: string;

    private cnContractTemplateId3: string;
    private enContractTemplateId3: string;

    private interval: string;
    private ssender: any = null;
    private accountMap: any = new Map();

    constructor() {


        this.appid = config.sms.appid;
        this.appkey = config.sms.appkey;
        this.cnAccountTemplateId = config.sms.cnAccountTemplateId;
        this.enAccountTemplateId = config.sms.enAccountTemplateId;

        this.cnContractTemplateId1 = config.sms.cnContractTemplateId1;
        this.cnContractTemplateId2 = config.sms.cnContractTemplateId2;
        this.cnContractTemplateId3 = config.sms.cnContractTemplateId3;

        this.interval = config.sms.effectiveinterval;
        this.ssender = config.sms.ssender;

        const qcloudsms = QcloudSms(this.appid, this.appkey);
        this.ssender = qcloudsms.SmsSingleSender();

        this.startDueData();

    }
    /*
    经过测试，sendWithParam 接口不严谨
    */
    private promiseAccountSend(nationcode: string, mobile: string, templateId: string, random: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const params = [random, this.interval];
            if (!this.ssender) {
                const qcloudsms = QcloudSms(this.appid, this.appkey);
                this.ssender = qcloudsms.SmsSingleSender();
            }
            this.ssender.sendWithParam(nationcode, mobile, templateId, params, "", "", "", (err, res, resData) => {
                if (err) {
                    reject(err);
                } else {
                    if (resData.result === 0) {
                        resolve(resData);
                    } else {
                        reject(resData);
                    }
                }
            });
        });
    }
    private promiseContractSend(nationcode: string, mobile: string, templateId: string, params: Array<any>): Promise<any> {
        return new Promise((resolve, reject) => {
            // const params = [random, this.interval];
            if (!this.ssender) {
                const qcloudsms = QcloudSms(this.appid, this.appkey);
                this.ssender = qcloudsms.SmsSingleSender();
            }
            this.ssender.sendWithParam(nationcode, mobile, templateId, params, "", "", "", (err, res, resData) => {
                if (err) {
                    reject(err);
                } else {
                    if (resData.result === 0) {
                        resolve(resData);
                    } else {
                        reject(resData);
                    }
                }
            });
        });
    }
    public async sendSMSContract(templateindex: number, nationcode: string, mobile: string, params: Array<any>): Promise<any> {
        let templateId: string;
        if (templateindex == 1) {

            if (nationcode == "86") {
                templateId = this.cnContractTemplateId1;
            } else {
                templateId = this.cnContractTemplateId1;
            }
        } else if (templateindex == 2) {

            if (nationcode == "86") {
                templateId = this.cnContractTemplateId2;
            } else {
                templateId = this.cnContractTemplateId2;
            }

        } else if (templateindex == 3) {

            if (nationcode == "86") {
                templateId = this.cnContractTemplateId3;
            } else {
                templateId = this.cnContractTemplateId3;
            }

        }
        return await this.promiseContractSend(nationcode, mobile, templateId, params);
    }

    //发送合约短信
    public async sendSMS(nationcode: string, mobile: string, random: string): Promise<any> {
        let templateId: string;
        if (nationcode == "86") {
            templateId = this.cnAccountTemplateId;
        } else {
            templateId = this.enAccountTemplateId;
        }
        return await this.promiseAccountSend(nationcode, mobile, templateId, random);
    }


    private startDueData(): void {

        setInterval(() => {
            this.accountMap.forEach((value, key, mapObj) => {

                const currentTimeStamp = new Date().valueOf() / 1000;
                const timeStamp = value.timeStamp;
                if (currentTimeStamp - timeStamp > 1000 * 60 * 60) {
                   // this.accountMap.delete(key);
                }

            })
        }, 1000 * 60 * 60);

    }

    public insertRecord(nationcode: string, mobile: string, random: string): void {

        const key = mobile;
        const timeStamp = new Date().valueOf() / 1000;
        const value = {
            random,
            timeStamp
        }
        this.accountMap.set(key, value);
    }

    public isOvertime(nationcode: string, mobile: string): boolean {

        const currentTimeStamp = new Date().valueOf() / 1000;
        const value = this.accountMap.get(mobile);
        if (value === undefined) {
            return false;
        }
        const timeStamp = value.timeStamp;
        const datTimeStamp = currentTimeStamp - timeStamp;
        const interval = Number(config.sms.effectiveinterval) * 60;
        if (datTimeStamp > interval) {
            return true;
        }
        return false;

    }

    public isCorrectCode(nationcode: string, mobile: string, random: string): boolean {
        //验证码错误
        const value = this.accountMap.get(mobile)
        if (!value) {
            return false;
        }
        const oldrandom = value.random;
        if (oldrandom === random) {
            return true;
        }
        console.log(`${oldrandom}:${random}`);
        return false;
    }
}
export const sms = new SMS();


