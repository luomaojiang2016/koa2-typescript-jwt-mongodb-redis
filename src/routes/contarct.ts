import {contract} from '../controller/contract';
import * as Router from 'koa-router';
export const contractRouter = new Router();

contractRouter.post('/v1/contract/bindcontract',contract.bindContract);
contractRouter.post('/v1/contract/sendsmsbycontract',contract.sendSmsByContract);
contractRouter.post('/v1/contract/getmobilesbycontracts',contract.getMobilesByContracts);





      


  