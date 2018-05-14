import * as jsonwebtoken from 'jsonwebtoken';
const config = require('../../config/config.json');
class Token {
    private interval: number;
    private jwtsecret: string;
    private secretkey: string;
    private mobile: string;

    constructor() {

        this.interval = config.token.effectiveinterval;
        this.jwtsecret = config.token.jwtsecret;
        this.secretkey = config.token.secretkey;
    }

    public setSignInfo( mobile: string) {
        this.mobile = mobile;
    }


    public sign(): string {

        const token = jsonwebtoken.sign({
            id:this.secretkey,
            mobile: this.mobile
        }, this.jwtsecret, { expiresIn: this.interval });
        return token;
    }

    private verify(token: string): Promise<any> {
        return new Promise((resolve, reject) => {
            jsonwebtoken.verify(token, this.jwtsecret, (err, decoded) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });
    }

    public async tokenVerify(token: string): Promise<any> {
        return await this.verify(token);
    }
}
export const token = new Token();


