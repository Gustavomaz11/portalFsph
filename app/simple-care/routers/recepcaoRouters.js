import Router from 'express';
import fileDirName from '../helpers/file-dir-name.js';
import { RecepcaoController } from '../controllers/recepcaoControllers.js';
import fileUpload from 'express-fileupload';

const router = Router();
const {__dirname} = fileDirName(import.meta);

const options = {
    root: __dirname.replace('routers','views')
};

router.set('view engine', 'html');

router.get('/teste',(req,res) => {
    res.status(200).sendFile('/recepcao/teste.html',options);
})

router.get('/', (req,res) => {
    res.status(200).sendFile('/recepcao/menu_recepcao.html',options);
});

router.get('/atendimentos/consulta_atendimentos', (req,res) => {
    res.status(200).sendFile('/recepcao/consulta_atend.html',options);
})

router.get('/atendimentos',RecepcaoController.NovoAtendimento);
router.post('/atendimentos/listar',RecepcaoController.ListarAtendimentos);
router.post('/atendimentos/edit',RecepcaoController.EditAtendimento);
router.post('/atendimentos/edit_salvar',RecepcaoController.EditAtendSalvar);
router.post('/atendimentos/listar_exames',RecepcaoController.ListarExames);
router.post('/atendimentos/excluir_exames',RecepcaoController.ExcluirExames);
router.post('/atendimentos/listar_pacientes',RecepcaoController.ListarPacientes);
router.post('/atendimentos/encontrar_paciente',RecepcaoController.EncontrarPaciente);
router.get('/atendimentos/novo_paciente',RecepcaoController.NovoPaciente);
router.post('/atendimentos/edit_paciente',RecepcaoController.EditPaciente)
router.post('/atendimentos/salvar_paciente',RecepcaoController.SalvarPaciente)
router.post('/atendimentos/upload',fileUpload(),RecepcaoController.UploadExamesPaciente);
router.post('/atendimentos/remover_upload',RecepcaoController.RemoverUpload);
router.post('/atendimentos/salvar_atendimento',RecepcaoController.SalvarAtendimento);
router.post('/atendimentos/salvar_upload',fileUpload(),RecepcaoController.SalvarUpload);

export default router;