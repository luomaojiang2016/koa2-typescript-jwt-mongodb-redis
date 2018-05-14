import * as https       from 'https';
import * as http        from 'http';
import * as url         from 'url';
import * as querystring from 'querystring';

import {logger}         from './logger';

export class HttpRequest {
    private static promiseRequest(method: string, href: string, data: any): Promise<string>{        
        return new Promise((resolve, reject) => {
            const urlObject = url.parse(href);

            let options = {
                hostname:   urlObject.hostname,
                port:       urlObject.port,
                method,
                headers: {},
                path: urlObject.path,
                rejectUnauthorized: true
            };

            let postData;
            let query;
            let error;
            switch (method){
                case 'POST':
                case 'PUT':
                    postData = querystring.stringify(data);

                    /*
                    if (urlObject.path !== undefined){
                        options.path    = urlObject.path;
                    }
                    */
                    
                    options.headers = {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Content-Length': Buffer.byteLength(postData)
                    };

                    break;

                case 'GET':
                case 'DELETE':
                    if (data){
                        query = querystring.stringify(data);
                        options.path = options.path + '?' + query;
                    }

                    break;

                default:
                    error = new Error(`${method} not impliment`);
                    reject(error);
                    return;
            }

            let httpx;
            if (urlObject.protocol === 'https:'){
                options.rejectUnauthorized = false;
                httpx = https;
            }else{
                httpx = http;
            }

            const req = httpx.request(options, (res) => {
                //logger.log(`STATUS: ${res.statusCode}`);
                //logger.log(`HEADERS: ${JSON.stringify(res.headers)}`);

                let responseData = '';
                res.setEncoding('utf8');

                res.on('data', (chunk) => {
                    responseData = responseData + chunk;
                    //logger.log(`BODY: ${chunk}`);
                });

                res.on('end', () => {
                    //logger.log('No more data in response.')
                    resolve(responseData);
                });
            });
            
            req.on('error', (error) => {
                //logger.log(`problem with request: ${e.message}`);
                reject(error);
                return;
            });
            
            // write data to request body
            if ((method === 'POST') || (method === 'PUT')){
                const postData = querystring.stringify(data);
                req.write(postData);
            }

            req.end();
        }); 
    }

    public static async get(href: string, data: any): Promise<string>{
        return await HttpRequest.promiseRequest('GET', href, data);
    }

    public static async delete(href: string, data: any): Promise<string>{
        return await HttpRequest.promiseRequest('DELETE', href, data);
    }

    public static async post(href: string, data: any): Promise<string>{
        return await HttpRequest.promiseRequest('POST', href, data);
    }

    public static async put(href: string, data: any): Promise<string>{
        return await HttpRequest.promiseRequest('PUT', href, data);
    }

    static async test(): Promise<void>{
        const data = {
            'adminName' : 'admin',
            'password':   '21232f297a57a5a743894a0e4a801fc3'
        };

        let result;
    
        result = await HttpRequest.post('https://192.168.0.51:8445/api/admin/login', data);
        logger.log(result);
        const resultObject = JSON.parse(result);

        const accessData = {
            accessToken: resultObject.result.accessToken
        };

        result = await HttpRequest.get('https://192.168.0.51:8445/api/admin/mysqlinfo', accessData);
        logger.log(result);

        result = await HttpRequest.get('https://192.168.0.51:8445/api/admin/redisinfo', accessData);
        logger.log(result);
    }
}
