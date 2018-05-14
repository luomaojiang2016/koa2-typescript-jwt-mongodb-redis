import {account} from '../controller/account';
import * as Router from 'koa-router';
export const accountRouter = new Router();

accountRouter.post('/v1/account/sendverifictioncode',account.sendVerificationCode);
accountRouter.post('/v1/account/createaccount',account.createAccount);
accountRouter.post('/v1/account/isregistered',account.isRegistered);
accountRouter.post('/v1/account/login',account.login);
accountRouter.post('/v1/account/resetpassword',account.resetPassword);
accountRouter.post('/v1/account/sendcandy',account.sendCandy);
accountRouter.get('/v1/account/getcandystate',account.getCandyState);

accountRouter.get('/', async (ctx,next) => {
  ctx.body = ctx.request.origin;
})





      


  