
const config = require('../../config/config.json');
import * as httpRequest from 'request';
import * as requestPromise from 'request-promise';

import { utilFunc } from "./func";
import { mongoAccount } from "../model/mongoAccount";
class Candy {

    private appid: string;
    private candySet: any = new Set();
    constructor() {
        this.startTimer();
    }

    private httpRequest(url: string, method: string): Promise<any> {
        return new Promise((resolve, reject) => {
            httpRequest({
                url,
                method,
                headers: {
                    "content-type": "application/json",
                }
            }, (error, response, body) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(body)
                }
            });
        });
    }

    private async startTimer(): Promise<any> {
        await utilFunc.sleep(1000 * 60 * 2 );
        for (const value of this.candySet) {
            const result = await this.getCandayStatus(value);
      
            if (result === "2") {
                await mongoAccount.updateCandy(value, 2);
                this.candySet.delete(value);
            }
        }
        await this.startTimer();

    }

    public async sendCandy(ethaddress: string): Promise<any> {
        const url = `${config.candyserver.url}/api/candy/sendToken/${ethaddress}`;
     //   return await this.httpRequest(url, 'POST');

        const options = {
            method: 'POST',
            url
        };

      return await requestPromise(options);

        
    }

    public async getCandayStatus(ethaddress: string): Promise<any> {
        const url = `${config.candyserver.url}/api/candy/getStatus/${ethaddress}`;
       return await this.httpRequest(url, 'GET');
       //return await requestPromise(url);
    }

    public async add(ethaddress: string) {
        this.candySet.add(ethaddress);
    }
}
export const candy = new Candy();


