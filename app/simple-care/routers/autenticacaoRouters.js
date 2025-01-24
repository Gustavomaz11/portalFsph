import Router from 'express';
import fileDirName from '../helpers/file-dir-name.js';
import autenticacaoControllers from '../controllers/autenticacaoControllers.js'

const router = Router();
const {__dirname} = fileDirName(import.meta);

const options = {
    root: __dirname.replace('routers','views')
};

router.set('view engine', 'html');

router.get('/acessar',autenticacaoControllers.TelaAcessar);

router.get('/sair', autenticacaoControllers.Sair);

router.post('/autenticar',autenticacaoControllers.Autenticar);

export default router;