import {Router} from 'express';
import fileupload from 'express-fileupload';
import { ControllerNoticias } from '../controllers/controllers_noticias.js';
import {ControllerAgendamento} from "../controllers/controllers_agendamento.js"
import {ControllerAgendamentoEvento, ControllerAuxEvento} from "../controllers/controller_agendamentoEventos.js"
import {ControllerDepoimento} from "../controllers/controller_depoimento.js"
import { ControllerInterfaceEstoque, ControllerInterfaceEstatista } from '../controllers/controller_interface.js';
import { ControllerFuncionamentos } from '../controllers/controller_funcionamentos.js';
import { ControllerRamal } from "../controllers/controller_ramal.js"
import checkEmails from '../controllers/imap.js';

const router = Router();

// noticia
router.get('/apinoticias/listar/:quantidade',ControllerNoticias.Listar);
router.post('/apinoticias/inserir',fileupload(),ControllerNoticias.Inserir);
router.get('/apinoticias/editar/:id_noticia',ControllerNoticias.Editar);
router.post('/apinoticias/atualizar',fileupload(),ControllerNoticias.Atualizar);
router.get('/apinoticias/excluir/:id_noticia',ControllerNoticias.Excluir);
router.get('/apinoticias/filtro/:unidade/:ativo', ControllerNoticias.filtrar)
router.patch('/apinoticias/alterarstatus', ControllerNoticias.changeStatus)
router.post('/apinoticias/unidades/salvar', ControllerNoticias.SalvarUnidade)

// agendamento doação
router.post("/apiagendamento/adicionar",fileupload(), ControllerAgendamento.create);
router.get("/apiagendamento/pegar", ControllerAgendamento.getAllAgendamentos);
router.patch('/apiagendamento/editar', ControllerAgendamento.edit)
router.delete('/apiagendamento/deletar/:id_agenda', ControllerAgendamento.delete)
router.get('/apiagendamento/pegar/:id_agenda', ControllerAgendamento.getByid)

// agendamento evento 
router.post('/apiagendamentoevento/adicionar', ControllerAgendamentoEvento.create);
router.get('/apiagendamentoevento/pegar/:id_unidade', ControllerAgendamentoEvento.getAll);
router.get('/apiagendamentoevento/pegarbyid/:id_evento', ControllerAgendamentoEvento.getById);
router.get('/apiagendamentoevento/pegardetalhado/:id_unidade_fk/:id_aux_evento', ControllerAgendamentoEvento.getDetalhado);
router.patch('/apiagendamentoevento/editar', ControllerAgendamentoEvento.editEvent);
// auxiliar evento

router.post('/apiagendamentoaux/adicionar', ControllerAuxEvento.create)
router.get('/apiagendamentoaux/pegar', ControllerAuxEvento.getAll)
router.put('/apiagendamentoaux/editar/:id_evento', ControllerAuxEvento.edit)


// ramais 
router.post('/apiramal/adicionar/:id_unidade', ControllerRamal.adicionar)
router.get('/apiramal/pegar/:id_unidade_fk', ControllerRamal.getAll)
router.put('/apiramal/mudarstatus/:id_unidade', ControllerRamal.mudarStatus)
router.patch('/apiramal/editar/:id_unidade', ControllerRamal.edit)

// interface estoque de hemocomponentes
router.get('/apiinterface/estoque',ControllerInterfaceEstoque.Listar);
router.get('/apiinterface/estatistica',ControllerInterfaceEstatista.Listar);

// publicação de depoimento
router.post('/apidepoimento/criar', fileupload(), ControllerDepoimento.create)
router.get('/apidepoimento/listar', ControllerDepoimento.getAll)

// funcionamento unidade
router.get('/apifuncionamento/listar/:id_unidade',ControllerFuncionamentos.Listar);
router.post('/apifuncionamento/inserir',ControllerFuncionamentos.Inserir);

// email
router.get('/apiemail/listar',checkEmails);

export default router;