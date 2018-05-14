
import * as MongoDB from 'mongodb';
import { mongoConn } from './mongoConn';
import { errors } from "../utils/errors";

export class MongoCandyLog {
    get collection(): MongoDB.Collection {
        return mongoConn.getMongoCollection('candylog');
    }

    public async addCandyLog(mobile: string, ethaddress: string, candyResult: any): Promise<any> {

        if (candyResult._id) {
            delete candyResult._id;
        }
        if (!candyResult.ethaddress) {
            candyResult.ethaddress = ethaddress;
        }
        const obj = Object.assign({ mobile, createdate: new Date() }, candyResult);
        const info = await this.collection.insert(obj);

    }

    public async getErrorTimes(mobile: string): Promise<any> {

        const filter = {
            mobile,
            sent: -1
        };
        const rows = await this.collection.find(filter).count();
        return rows;
    }
}
export const nongoCandyLog = new MongoCandyLog();
