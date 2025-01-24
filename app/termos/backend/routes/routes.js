import {Router} from 'express'
import fileupload from 'express-fileupload'
import { Controller } from '../controller/controller.js';

const router = Router();

router.post('/load-main',Controller.Listar);

/*********************************************
* Inserir Termos
*********************************************/
router.post('/termo/inserir',Controller.Inserir);

/*********************************************
* Editar Termos
*********************************************/
router.get('/termo/edit/:id',Controller.Editar);

/*********************************************
* Atualizar Termos
*********************************************/
router.post('/termo/atualizar',Controller.Atualizar);

/*********************************************
* Upload de Anexo
*********************************************/
router.post('/termo/anexar',fileupload(),Controller.Anexar);

/*********************************************
* Listar Anexos
*********************************************/
router.get('/termo/listar-anexos/:id_objeto',Controller.ListarAnexos);

/*********************************************
* Exibir Conteudo do Anexo
*********************************************/
router.get('/termo/exibir-anexos/:id_objeto-:id_anexo', Controller.ExibirAnexo);

/*********************************************
* Excluir Anexo
*********************************************/
router.get('/termo/excluir-anexo/:id_objeto-:id_anexo',Controller.ExcluirAnexo);

export default router;