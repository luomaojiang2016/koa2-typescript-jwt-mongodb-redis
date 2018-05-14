
import * as MongoDB from 'mongodb';
import { mongoConn } from './mongoConn';
import { errors } from "../utils/errors";

export class MongoContract {
    get collection(): MongoDB.Collection {
        return mongoConn.getMongoCollection('contract');
    }
    public async addContract(nationcode: string, mobile: string, contract: string,transactiontype:number): Promise<any> {
        const doc = {
            nationcode,
            mobile,
            contract,
            transactiontype,
            createdate: new Date()
        };
        const info = await this.collection.insert(doc);
        return info;
    }

    public async getMobileByContract(contract: string): Promise<any> {

        const filter = {
            contract
        };
        const info = await this.collection.findOne(filter);
        return info;
    }

    public async getMobilesByContracts(contracts: Array<string>): Promise<any> {

        const cmarray = [];
        for (const contract of contracts) {
            const info = await this.collection.findOne({ contract });
            if (info) {
                const onecm = {
                    contract,
                    transactiontype:info.transactiontype,
                    mobile: info.mobile
                }
                cmarray.push(onecm)
            }

        }
      return {cm:cmarray};
    }
}
export const nongoContract = new MongoContract();
