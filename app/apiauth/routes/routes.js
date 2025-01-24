import {Router} from 'express';
import { ControllerAuth } from '../controllers/controllers_auth.js';

const router = Router();

router.post('/apiauth/autenticar',ControllerAuth.CreateToken);
router.get('/apiauth/obtercredenciais/:dominio',ControllerAuth.GetCredential);
router.get('/apiauth/obterdominios',ControllerAuth.GetDomains);

export default router;