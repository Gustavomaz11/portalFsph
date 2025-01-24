import Router from 'express';
import chkauth from '../helpers/auth.js'
import fileDirName from '../helpers/file-dir-name.js';
import { CadastrosController } from '../controllers/cadastrosControllers.js';

const { __dirname } = fileDirName(import.meta);
const router = Router();

const options = {
    root: __dirname.replace('routers','views')
}

router.set('view engine', 'html');
//router.use(chkauth);

/***************************************************************************
* Rotas para Menu de Cadastros
****************************************************************************/
router.get('/',(req,res) => {
    res.status(200).sendFile('/cadastros/menu_cadastros.html',options);
});

/***************************************************************************
* Rotas para Tipo Atendimentos
****************************************************************************/
router.get('/tipo-atend/',CadastrosController.TiposAtendimentos);
router.get('/tipo-atend/listar/:nome',CadastrosController.ListarTipoAtend);
router.get('/tipo-atend/editar/:id',CadastrosController.EditarTipoAtend);
router.post('/tipo-atend/salvar',CadastrosController.SalvarTipoAtend);
router.get('/tipo-atend/excluir/:id',CadastrosController.ExcluirTipoAtend);

/****************************************************************************
* Rotas para Conselhos
****************************************************************************/
router.get('/conselhos/',CadastrosController.Conselhos);
router.get('/conselhos/listar/:nome',CadastrosController.ListarConselhos);
router.get('/conselhos/editar/:id',CadastrosController.EditarConselhos);
router.post('/conselhos/salvar',CadastrosController.SalvarConselhos);
router.get('/conselhos/excluir/:id',CadastrosController.ExcluirConselhos);

/****************************************************************************
* Rotas para Enfermarias
****************************************************************************/
router.get('/enfermarias/',CadastrosController.Enfermarias);
router.get('/enfermarias/listar/:nome',CadastrosController.ListarEnfermarias);
router.get('/enfermarias/editar/:id',CadastrosController.EditarEnfermarias);
router.post('/enfermarias/salvar',CadastrosController.SalvarEnfermarias);
router.get('/enfermarias/excluir/:id',CadastrosController.ExcluirEnfermarias);

/****************************************************************************
* Rotas para Leitos
****************************************************************************/
router.get('/leitos/',CadastrosController.Leitos);
router.get('/leitos/listar/:nome',CadastrosController.ListarLeitos);
router.get('/leitos/editar/:id-:enf_id',CadastrosController.EditarLeitos);
router.post('/leitos/salvar',CadastrosController.SalvarLeitos);
router.get('/leitos/excluir/:id-:enf_id',CadastrosController.ExcluirLeitos);

/****************************************************************************
* Rotas para Especialidades
****************************************************************************/
router.get('/especialidades/',CadastrosController.Especialidades);
router.get('/especialidades/aux_especialidade',CadastrosController.ListarAuxEspecialidade);
router.get('/especialidades/listar/:nome',CadastrosController.ListarEspecialidades);
router.get('/especialidades/editar/:id',CadastrosController.EditarEspecialidades);
router.post('/especialidades/salvar',CadastrosController.SalvarEspecialidades);
router.get('/especialidades/excluir/:id',CadastrosController.ExcluirEspecialidades);

/****************************************************************************
* Rotas para Vinculos
****************************************************************************/
router.get('/vinculos/',CadastrosController.Vinculos);
router.get('/vinculos/listar/:nome',CadastrosController.ListarVinculos);
router.get('/vinculos/editar/:id',CadastrosController.EditarVinculos);
router.post('/vinculos/salvar',CadastrosController.SalvarVinculos);
router.get('/vinculos/excluir/:id',CadastrosController.ExcluirVinculos);

/****************************************************************************
* Rotas para Profissionais
****************************************************************************/
router.get('/profissionais/',CadastrosController.Profissionais);
router.get('/profissionais/editar/:id',CadastrosController.EditarProfissionais);
router.get('/profissionais/listar/:nome',CadastrosController.ListarProfissionais);
router.post('/profissionais/salvar',CadastrosController.SalvarProfissionais);
router.get('/profissionais/excluir/:id',CadastrosController.ExcluirProfissionais);

/****************************************************************************
* Rotas para Motivos de Encerramentos
****************************************************************************/
router.get('/motivo_encerra/',CadastrosController.MotivoEncerra);
router.get('/motivo_encerra/listar/:nome',CadastrosController.ListarMotivoEncerra);
router.get('/motivo_encerra/editar/:id',CadastrosController.EditarMotivoEncerra);
router.post('/motivo_encerra/salvar',CadastrosController.SalvarMotivoEncerra);
router.get('/motivo_encerra/excluir/:id',CadastrosController.ExcluirMotivoEncerra);

/****************************************************************************
* Rotas para Regime Atendimentos
****************************************************************************/
router.get('/regime_atend/',CadastrosController.RegimeAtend);
router.get('/regime_atend/listar/:nome',CadastrosController.ListarRegimeAtend);
router.get('/regime_atend/editar/:id',CadastrosController.EditarRegimeAtend);
router.post('/regime_atend/salvar',CadastrosController.SalvarRegimeAtend);
router.get('/regime_atend/excluir/:id',CadastrosController.ExcluirRegimeAtend);

/****************************************************************************
* Rotas para Turnos de Trabalho
****************************************************************************/
router.get('/turnos/',CadastrosController.Turnos);
router.get('/turnos/listar/:nome',CadastrosController.ListarTurnos);
router.get('/turnos/editar/:id',CadastrosController.EditarTurnos);
router.post('/turnos/salvar',CadastrosController.SalvarTurnos);
router.get('/turnos/excluir/:id',CadastrosController.ExcluirTurnos);

/****************************************************************************
* Rotas para Procedimentos
****************************************************************************/
router.get('/procedimentos/',CadastrosController.Procedimentos);
router.get('/procedimentos/listar/:nome',CadastrosController.ListarProcedimentos);
router.get('/procedimentos/editar/:id',CadastrosController.EditarProcedimento);
router.post('/procedimentos/salvar',CadastrosController.SalvarProcedimento);
router.get('/procedimentos/excluir/:id',CadastrosController.ExcluirProcedimento);

/****************************************************************************
* Rotas para Tipo de Prescrição
****************************************************************************/
router.get('/tipos_prescricoes/',CadastrosController.TiposPrescricao);
router.get('/tipos_prescricoes/listar/:nome',CadastrosController.ListarTiposPrecricoes);
router.get('/tipos_prescricoes/editar/:id',CadastrosController.EditarTipoPrescricao);
router.get('/tipos_prescricoes/excluir/:id',CadastrosController.ExcluirTipoPrescricao);
router.post('/tipos_prescricoes/salvar',CadastrosController.SalvarTipoPrescricao);

/****************************************************************************
* Rotas para Tipo de Procedimento
****************************************************************************/
router.get('/tipos_procedimentos/',CadastrosController.TiposProcedimentos);
router.get('/tipos_procedimentos/listar/:nome',CadastrosController.ListarTiposProcedimentos);
router.get('/tipos_procedimentos/editar/:id',CadastrosController.EditarTipoProcedimento);
router.get('/tipos_procedimentos/excluir/:id',CadastrosController.ExcluirTipoProcedimento);
router.post('/tipos_procedimentos/salvar',CadastrosController.SalvarTipoProcedimento);

/****************************************************************************
* Rotas para Procedimento das Especialidade 
****************************************************************************/
router.get('/esp_procedimentos/excluir/:id',CadastrosController.ExcluirEspProcedimento);


router.get('/setores/listar/:nome',CadastrosController.ListarSetores);
router.get('/sexos/listar',CadastrosController.ListarSexos);
router.get('/racas/listar',CadastrosController.ListarRacas);
router.get('/estado_civis/listar',CadastrosController.ListarEstadoCivis);

/****************************************************************************/
export default router;