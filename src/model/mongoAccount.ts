
import * as MongoDB     from 'mongodb';
import {mongoConn}     from './mongoConn';
import { errors } from "../utils/errors";

export class MongoAccount {
    get collection(): MongoDB.Collection {
        return mongoConn.getMongoCollection('account');
    }
    public async createAccount(nationcode: string, mobile: string,password: string): Promise<any>{
        const doc = {
            nationcode,
            mobile,
            password,
            candystate:0,
            earned:0,
            ethaddress:'',
            createdate:new Date()
        };
        const info = await this.collection.insert(doc);
        return info;
    }
    public async isRegistered(mobile: string): Promise<any>{
        const filter = {
            mobile
        };
        const info = await this.collection.findOne(filter);
        return info;
    }
    public async login( mobile: string,password: string): Promise<any>{
        const filter = {
            mobile,
            password
        };
        const info = await this.collection.findOne(filter);
        if (info) {
            if (info._id !== undefined) {
                delete info._id;
            }
            if (info.password !== undefined) {
                delete info.password;
            }
        }
        return info;
    }
    public async resetPassword(nationcode: string, mobile: string,password: string): Promise<any>{
        const filter = {
            nationcode,
            mobile
        };
        const update = {
            $set: {
                password,
                modifydate:new Date()
            }
        };
       return await this.collection.updateOne(filter, update);
    }

    public async bindCandy(mobile: string,ethaddress:string,candystate: number,earned:number): Promise<any>{

        const filter = {
            mobile
        };

        const update = {
            $set: {
                candystate,
                ethaddress,
                earned
            }
        };
       return await this.collection.updateOne(filter, update);
    }

    public async updateCandy(ethaddress:string,candystate: number): Promise<any>{

        const filter = {
            ethaddress
        };

        const update = {
            $set: {
                candystate    
            }
        };
       return await this.collection.updateOne(filter, update);
    }
    public async updateCandyByMobile(mobile:string,candystate: number): Promise<any>{

        const filter = {
            mobile
        };

        const update = {
            $set: {
                candystate    
            }
        };
        const info = await this.collection.updateOne(filter, update);
        return info;
    }
    
    public async getCandyStateByMobile(mobile: string): Promise<any>{

        const filter = {
            mobile
        };
        const info = await this.collection.findOne(filter);
        if(info){
            const candystate =info.candystate;
            const earned =info.earned
            return {candystate,earned}
        }
        return info;
    }  

    public async getNationCodeByMobile(mobile: string): Promise<any>{

        const filter = {
            mobile
        };
        const info = await this.collection.findOne(filter);
        return info;
    } 
    //判断eth 是否已经领过糖果
    public async getCandyStateByEthaddress(ethaddress:string): Promise<any>{

        const filter = {
            ethaddress
        };
        const info = await this.collection.findOne(filter);
        return info;
    } 
}
export const mongoAccount = new MongoAccount();
