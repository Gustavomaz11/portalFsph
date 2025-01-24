import Router from 'express';
import fileDirName from '../helpers/file-dir-name.js';
import ambulatorioControllers from '../controllers/ambulatorioControllers.js';

const router = Router();
const {__dirname} = fileDirName(import.meta);

const options = {
    root: __dirname.replace('routers','views')
};

router.set('view engine', 'html');

router.get('/', (req,res) => {
    res.status(200).sendFile('/ambulatorio/menu_ambulatorio.html',options);
});

router.get('/consultorio/medico',(req,res) => {
    res.status(200).sendFile('/ambulatorio/consultorio_medico.html',options);
});

router.post('/consultorio/medico/atendimento', ambulatorioControllers.EditarPrescricaoMedica);
router.post('/consultorio/listar',ambulatorioControllers.AtendimentoConsultorio);
router.post('/consultorio/pesquisardoenca',ambulatorioControllers.ListarCid);
router.post('/consultorio/selecionarcodigo',ambulatorioControllers.SelecionarCodigo);
router.post('/consultorio/salvarcid',ambulatorioControllers.SalvarCid);
router.post('/consultorio/receituario',ambulatorioControllers.Receituario);
router.post('/consultorio/impressaoprescricao',ambulatorioControllers.ImpressaoPrescricao);
router.post('/consultorio/ver_exame',ambulatorioControllers.VerExame);

export default router;
