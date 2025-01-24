import Router from 'express';
import chkauth from '../helpers/auth.js'
import { apiController } from '../controllers/apiController.js';

const router = Router();

router.set('view engine', 'html');
//router.use(chkauth);

/***************************************************************************
* Rotas para Tipo Atendimentos
****************************************************************************/
router.get('/novo_atendimento',apiController.NovoAtendimento);
router.post('/encontrar_paciente',apiController.EncontrarPaciente);
//router.get('/tipo-atend/listar/:nome',CadastrosController.ListarTipoAtend);
//router.get('/tipo-atend/editar/:id',CadastrosController.EditarTipoAtend);
//router.post('/tipo-atend/salvar',CadastrosController.SalvarTipoAtend);
//router.get('/tipo-atend/excluir/:id',CadastrosController.ExcluirTipoAtend);

export default router