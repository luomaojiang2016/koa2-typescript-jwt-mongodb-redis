import * as MongoDB from 'mongodb';
import { logger } from '../utils/logger';
export class MongoConn {

    private mongoInfo: any = null;
    private mongoConn: any = null;

    constructor() {
    }

    //创建一个Mongo的连接
    public async createMongoConnection(mongoInfo: any): Promise<any> {
        this.mongoInfo = mongoInfo;

        let mongoURI = `${mongoInfo.host}:${mongoInfo.port}`;
        if (mongoInfo.user || mongoInfo.password) {
            mongoURI = `${mongoInfo.user}:${mongoInfo.password}@` + mongoURI;
        }
        mongoURI = `mongodb://` + mongoURI;
        const conn = await MongoDB.MongoClient.connect(mongoURI);
        return conn;
    }

    //连接 MongDB 数据库
    public async tryConnectMongoServer(mongoInfo: any): Promise<void> {
        if (this.mongoConn) {
            return;
        }
        try {
            logger.info(`正在尝试连接Mongodb ( ${mongoInfo.host}:${mongoInfo.port} )`);

           
            this.mongoConn = await this.createMongoConnection(mongoInfo);
            logger.info(`连接Mongodb成功( ${mongoInfo.host}:${mongoInfo.port} )`);
   
        } catch (err) {

            throw err;
        }
    }

    public async disconnectServer(): Promise<void> {
        if (this.mongoConn) {
            this.mongoConn.dispose();
            this.mongoConn = null;
        }
    }

    public getMongoCollection(collectionName: string, mongoConnection: any = null): any {

        let conn = mongoConnection;
        if (!conn) {
            conn = this.mongoConn;
        }
        const collection = conn.db(this.mongoInfo.database).collection(collectionName);
        return collection;
    }

}

export const mongoConn = new MongoConn();