import * as crypto from 'crypto';

export class Encrypion {

    private aeskey: string;

    constructor() {
        this.aeskey = "Toklen2018";
    }

    public aesEncrypt(data: string) {
        const cipher = crypto.createCipher('aes192', this.aeskey);
        let crypted = cipher.update(data, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    }

    public aesDecrypt(encrypted: string) {
        const decipher = crypto.createDecipher('aes192', this.aeskey);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

    public md5AesEncrpt(data: string) {
        const T1 = this.aesEncrypt(data);
        const md5 = crypto.createHash('md5');
        md5.update(T1);
        const str = md5.digest('hex');
        return str;
    }


}

export const encrypion = new Encrypion();