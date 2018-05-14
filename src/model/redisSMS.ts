import * as ioredis from 'ioredis';
import { logger } from '../utils/logger';

export class RedisSMS {

    private expireSeconds: number;
    private redisInfo: any;
    private redisconn: any

    constructor() {

    }
    //创建一个Redis的连接
    public async connectServer(redisInfo: any): Promise<any> {

        const conn = new ioredis({
            port: redisInfo.port,     // Redis port
            host: redisInfo.host,     // Redis host
            family: 4,                          // 4 (IPv4) or 6 (IPv6)
            password: redisInfo.password,
            db: 0
        });

        return conn;
    }

    public async tryConnectRedisServer(redisInfo: any, expireSeconds: number): Promise<void> {
        const host = redisInfo.host;
        const port = redisInfo.port;
        this.expireSeconds = expireSeconds * 60;

        this.redisInfo = redisInfo;
        try {
            logger.info(`正在尝试连接Redis(${host}:${port} )`);
            this.redisconn = await this.connectServer(redisInfo);
            logger.info(`连接Redis成功( ${host}:${port} )`);
        } catch (error) {
            logger.error(`连接Redis失败!!!!!( ${host}:${port} ): ${error.message}`);
            throw error;
        }
    }


    //判断键是否存在
    public async keyExists(key: string): Promise<boolean> {
        const exists = await this.redisconn.exists(key);
        return exists;
    }

    //设置一个键的过期时间
    public async expireKey(key: string, expireSeconds: number): Promise<void> {
        if (expireSeconds <= 0) {
            return;
        }
        await this.redisconn.expire(key, expireSeconds);
    }
    //在Redis里删除一个键
    public async deleteKey(key: string): Promise<void> {
        await this.redisconn.del(key);
    }

    public async saveSMScode(key: string, value: string): Promise<void> {
        await this.redisconn.set(key, value);
        await this.redisconn.expire(key, this.expireSeconds);
    }

    public async loadSMScode(key: string): Promise<any> {
        const result = await this.redisconn.get(key);
        return result;
    }

}

export const redisSMS = new RedisSMS();