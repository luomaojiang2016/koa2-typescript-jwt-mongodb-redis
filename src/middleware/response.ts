import {errors} from "../utils/errors";
export class Response {
    static async response(ctx: any, next: any) {
        ctx.error = (error) =>{
            ctx.body = {
                status: error.code,
                errmsg:error.message
            };
        };
        ctx.success = (result) =>{
            ctx.body = {
                status: 0,
                result
            };        
        };
        await next()
    }
}