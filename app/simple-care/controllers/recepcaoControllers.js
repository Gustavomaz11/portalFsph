import database from '../database/conn.js';
import { Atendimentos, Pacientes,Exames, Racas, Sexos, Estado_Civis, Especialidades,TipoAtend, RegimeAtend } from '../models/classModels.js';
import { DataHora, DataHoraUS } from '../helpers/datetime.js';
import fs from 'fs';
import fileDirName from '../helpers/file-dir-name.js'

const { __dirname } = fileDirName(import.meta);

const options = {
    root: __dirname.replace('controllers','views')
};

/*******************************************************
* Controller para Tipos de Atendimentos
********************************************************/
class RecepcaoController {

    static NovoAtendimento(req,res) {

        res.status(200).sendFile('/recepcao/atendimentos.html',options);
    }

    static async ListarPacientes(req,res) {

        const headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                nome: req.body.nome
            },
            response: {
                pacientes: {}
            }
        }
        
        try {

            void await database.connect();

            const pacientes = new Pacientes(database.connection);

            headers.response.pacientes = await pacientes.Listar(headers.request.nome);
            
        } catch (error) {
            headers.num = 99;                
            headers.msg = error.stack;                
            headers.status = 420;
        }

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response
        });

        void await database.close();

    }

    static async EncontrarPaciente(req,res) {
              
        const headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                cpf: req.body.cpf
            },
            response: {
                pacientes: {},              
            }
        }
    
        try {

            void await database.connect();

            /**************************************** */
            const pacientes = new Pacientes();

            /**************************************** */
            headers.response.pacientes = await pacientes.Buscar(headers.request.cpf);
            
            
        } catch (error) {
            headers.num = 99;                
            headers.msg = error.stack;                
            headers.status = 420;
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response
        });

    }

    static async NovoPaciente(req,res) {

        const headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {},
            response: {
                sexos: {},
                racas: {},
                estado_civis: {}
            }
        }

        try {

            void await database.connect();

            /***************************************/
            const racas = new Racas(database.connection);
            const sexos = new Sexos(database.connection);
            const estado_civis = new Estado_Civis(database.connection);

            /***************************************/
            headers.response.racas = await racas.Listar();
            headers.response.sexos = await sexos.Listar();
            headers.response.estado_civis = await estado_civis.Listar();
            
        } catch(error) {
            headers.num = 99;
            headers.msg = error.stack;
            headers.status = 420;
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response
        });
 
    }

    static async EditPaciente(req,res) {
        
        const headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                id: req.body.id
            },
            response: {
                pacientes: {},
                sexos: {},
                racas: {},
                estado_civis: {}
            }
        }

        try {

            void await database.connect();

            /************************************ */
            const pacientes = new Pacientes(database.connection);
            const sexos = new Sexos(database.connection);
            const racas = new Racas(database.connection);
            const estado_civis = new Estado_Civis(database.connection);

            /************************************ */
            headers.response.pacientes = await pacientes.Buscar(headers.request.id);
            headers.response.sexos = await sexos.Listar();
            headers.response.racas = await racas.Listar();
            headers.response.estado_civis = await estado_civis.Listar();

        } catch (error) {
            headers.num = 99;
            headers.msg = error.stack;
            headers.status = 420;
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response
        });

    }

    static async SalvarPaciente(req,res) {
        
        const headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                id: req.body.id, 
                nome: req.body.nome.toUpperCase(), 
                dtnasc: req.body.dtnasc, 
                nm_mae: req.body.nm_mae.toUpperCase(), 
                nm_pai: req.body.nm_pai.toUpperCase(), 
                natur: req.body.natur.toUpperCase(), 
                nacio: req.body.nacio.toUpperCase(), 
                ender: req.body.ender.toUpperCase(), 
                num: req.body.num, 
                bairro: req.body.bairro.toUpperCase(), 
                cidade: req.body.cidade.toUpperCase(), 
                uf: req.body.uf.toUpperCase(), 
                cep: req.body.cep, 
                rg: req.body.rg, 
                org: req.body.org.toUpperCase(), 
                cns: req.body.cns, 
                cpf: req.body.cpf, 
                cel_1: req.body.cel_1,
                cel_2: req.body.cel_2, 
                email: req.body.email.toLowerCase(), 
                sexo: req.body.sexo, 
                raca: req.body.raca, 
                est_civ: req.body.est_civ                    
            },
            response: {}
        }

        try {

            void await database.connect();
    
            void await database.begin();

            const pacientes = new Pacientes(database.connection);

            void await pacientes.Buscar(headers.request.id);

            if (!pacientes.found) {
                pacientes.dt_cadastro = DataHoraUS();
            }

            pacientes.id = headers.request.id;
            pacientes.nome = headers.request.nome;
            pacientes.dt_nasc = headers.request.dtnasc;
            pacientes.nm_mae = headers.request.nm_mae;
            pacientes.nm_pai = headers.request.nm_pai;
            pacientes.naturalidade = headers.request.natur;
            pacientes.nacionalidade = headers.request.nacio;
            pacientes.endereco = headers.request.ender;
            pacientes.numero = headers.request.num;
            pacientes.bairro = headers.request.bairro;
            pacientes.cidade = headers.request.cidade;
            pacientes.uf = headers.request.uf;
            pacientes.cep = headers.request.cep;
            pacientes.rg_num = headers.request.rg;
            pacientes.rg_org = headers.request.org;
            pacientes.cns = headers.request.cns;
            pacientes.cpf = headers.request.cpf;
            pacientes.celular_i = headers.request.cel_1;
            pacientes.celular_ii = headers.request.cel_2;
            pacientes.email = headers.request.email;
            pacientes.sexo_id = headers.request.sexo;
            pacientes.raca_id = headers.request.raca;
            pacientes.estado_civil_id = headers.request.est_civ;

            void await pacientes.Salvar()

            void await database.commit();

            headers.msg = 'Dados salvo com sucesso!';
            
        } catch (error) {

            void await database.rollback();

            headers.num = 99;
            headers.msg = error.stack;
            headers.status = 420;
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg
        });

    }

    static UploadExamesPaciente(req,res) {

        const headers = {
            num: 0,
            msg:'',
            status: 200,
            uploadPath: 'assets/uploads/',
            request: {
                file: req.files
            }            
        }

        try {

            if (!headers.request.file || Object.keys(headers.request.file).length == 0) {
                throw new Error('Nenhum arquivo recebido.');
            }

            const file = headers.request.file.arquivo;
            
            file.mv(headers.uploadPath + file.name, (err) => {
                if (err) {
                    throw new Error(err)
                }
            });

            headers.msg = 'Upload realizado com sucesso!';

        } catch (error) {
            headers.num = 99;
            headers.msg = error.stack;
            headers.status = 400;
        }

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg
        });    

    }

    static RemoverUpload(req,res) {

        const headers = {
            num: 0,
            msg:'',
            status: 200
        }

        try {
            
            const nome_arquivo = req.body.nome_arquivo;
            const uploadPath = 'assets/uploads/';
            
            fs.unlinkSync(uploadPath + nome_arquivo, (err) => {
                if (err) { throw new Error(err)}
            });

            headers.msg = 'Arquivo removido com sucesso!';

        } catch (error) {
            headers.num = 99;
            headers.msg = error.stack;
            headers.status = 420;
        }

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg
        });

    }

    static async SalvarUpload(req,res) {
        
        const headers = {
            num: 0,
            msg:'',
            status: 200,
            request: {
                file: req.files.arquivo,
                paciente_id: req.body.paciente_id,
                id_atend: req.body.id_atend,
                id: 0,
                nome_exame: req.body.nome_exame.toUpperCase(),
                novo_arquivo: req.body.novo_arquivo.toUpperCase(),
                mimetype: req.body.mimetype.toLowerCase(),
                tipo_arquivo: req.body.tipo_arquivo.toUpperCase(),
                data: DataHoraUS()
            },
            response: {
                exames: {}
            }
        }

        try {

            if (!req.files || Object.keys(req.files).length == 0) {
                throw new Error('Nenhum arquivo recebido.');
            }

            void await database.connect();
            
            void await database.begin();

            const exames = new Exames(database.connection);
            
            void await exames.Buscar(headers.request.paciente_id,headers.request.id)

            if (!exames.found) {
                headers.request.id = await exames.NewCode(headers.request.paciente_id);
            }

            exames.paciente_id = headers.request.paciente_id;
            exames.atend_id = headers.request.id_atend;
            exames.id = headers.request.id;
            exames.nm_exame = headers.request.nome_exame;
            exames.nm_arquivo = headers.request.novo_arquivo;
            exames.mimetype = headers.request.mimetype;
            exames.tipo_arquivo = headers.request.tipo_arquivo;
            exames.dt_inclusao = headers.request.data;
            exames.imagem = headers.request.file.data;

            void await exames.Salvar();

            void await database.commit();

            headers.response.exames = await exames.ListarPorPaciente(headers.request.paciente_id);

            headers.msg = 'Upload realizado com sucesso!';
           
        } catch (error) {

            void await database.rollback();

            headers.num = 99;
            headers.msg = error.stack;
            headers.status = 420;

        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response
        });

    }

    static async SalvarAtendimento(req,res) {

        const headers = {
            num: 0,
            msg:'',
            status: 200,
            uploadPath: 'assets/uploads',
            request: {
                atendimentos: {
                    id_atend: req.body.atendimento.id_atend,
                    tipo_id: req.body.atendimento.tipo_id,
                    observacao: req.body.atendimento.observacao.toUpperCase(),
                    regime_atend_id: req.body.atendimento.regime_atend_id,
                    acompanhante: req.body.atendimento.acompanhante.toUpperCase(),
                    medico_assist: req.body.atendimento.medico_assist.toUpperCase(),
                    crm_assist: req.body.atendimento.crm_assist,
                    esp_assist: req.body.atendimento.esp_assist.toUpperCase(),
                    esp_atend_id: req.body.atendimento.esp_atend_id,
                    exames: req.body.atendimento.exames,
                    preferencia: req.body.atendimento.preferencia
                },
                pacientes: {
                    id: req.body.paciente.id,
                    nm_mae: req.body.paciente.nm_mae.toUpperCase(),
                    nm_pai: req.body.paciente.nm_pai.toUpperCase(),
                    sexo_id: req.body.paciente.sexo_id,
                    raca_id: req.body.paciente.raca_id,
                    estado_civil_id: req.body.paciente.estado_civil_id,
                    endereco: req.body.paciente.endereco.toUpperCase(),
                    bairro: req.body.paciente.bairro.toUpperCase(),
                    cidade: req.body.paciente.cidade.toUpperCase(),
                    uf: req.body.paciente.uf.toUpperCase(),
                    cep: req.body.paciente.cep,
                    celular_i: req.body.paciente.celular_i,
                    celular_ii: req.body.paciente.celular_ii,
                    cpf: req.body.paciente.cpf
                }
            },
            response: {
                atendimentos: {
                    id: 0
                }
            }
        }
        
        try {
            
            void await database.connect();

            void await database.begin();

            /*******************************************/
            const atendimentos = new Atendimentos(database.connection);
            const exames = new Exames(database.connection);
            const pacientes = new Pacientes(database.connection);

            /*******************************************
            * Salvar Dados Atendimentos
            *******************************************/
            const existAtend = await atendimentos.ListarAtendNaoEncerrado(headers.request.pacientes.id);

            if (existAtend) {
                throw new Error('Existe um atendimento anterior que não foi encerrado para esse paciente.');
            }

            void await atendimentos.Buscar(headers.request.atendimentos.id_atend);

            if (!atendimentos.found) {
                atendimentos.data = DataHoraUS();
            }

            atendimentos.id = headers.request.atendimentos.id_atend;
            atendimentos.tipo_id = headers.request.atendimentos.tipo_id;
            atendimentos.paciente_id = headers.request.pacientes.id
            atendimentos.observacao = headers.request.atendimentos.observacao;
            atendimentos.regime_atend_id = headers.request.atendimentos.regime_atend_id;
            atendimentos.acompanhante = headers.request.atendimentos.acompanhante;
            atendimentos.nm_medico_assist = headers.request.atendimentos.medico_assist;
            atendimentos.crm_medico_assist = headers.request.atendimentos.crm_assist;
            atendimentos.esp_medico_assist = headers.request.atendimentos.esp_assist;
            atendimentos.especialidade_atend_id = headers.request.atendimentos.esp_atend_id;
            atendimentos.preferencia = headers.request.atendimentos.preferencia;
            atendimentos.situacao = headers.request.atendimentos.esp_atend_id;
           
            void await atendimentos.Salvar();

            headers.response.atendimentos.id = atendimentos.id;
            
            /************************************************
            * Inclusão da imagem dos Exames no banco de Dados
            *************************************************/
            let i = 0;

            await headers.request.atendimentos.exames.map( async (exame) => {

                if (fs.existsSync(`${headers.uploadPath}/${exame.novo_arquivo}`)) {

                    let image = null;

                    image = fs.readFileSync(`${headers.uploadPath}/${exame.novo_arquivo}`,'base64');

                    image = new Buffer.from(image,'base64');

                    void await exames.Buscar(atendimentos.id,i);

                    if (!exames.found) {
                        exames.id = ++i;
                    }
                    
                    exames.paciente_id = headers.request.pacientes.id
                    exames.atend_id = atendimentos.id;
                    exames.nm_exame = exame.nome_exame.toUpperCase();
                    exames.dt_inclusao = DataHoraUS();
                    exames.nm_arquivo = exame.novo_arquivo.toUpperCase();
                    exames.imagem = image;
                    exames.mimetype = exame.mimetype.toLowerCase();
                    exames.tipo_arquivo = exame.tipo_arquivo.toUpperCase();

                    void await exames.Salvar();
                    
                }

            });

            /*******************************************
            * Salvar Dados Paciente
            *******************************************/
            void await pacientes.Buscar(headers.request.pacientes.id);

            pacientes.id = headers.request.pacientes.id;
            pacientes.nm_mae = headers.request.pacientes.nm_mae;
            pacientes.nm_pai = headers.request.pacientes.nm_pai;
            pacientes.sexo_id = headers.request.pacientes.sexo_id;
            pacientes.raca_id = headers.request.pacientes.raca_id;
            pacientes.estado_civil_id = headers.request.pacientes.estado_civil_id;
            pacientes.endereco = headers.request.pacientes.endereco;
            pacientes.bairro = headers.request.pacientes.bairro;
            pacientes.cidade = headers.request.pacientes.cidade;
            pacientes.uf = headers.request.pacientes.uf;
            pacientes.cep = headers.request.pacientes.cep;
            pacientes.celular_i = headers.request.pacientes.celular_i;
            pacientes.celular_ii = headers.request.pacientes.celular_ii;
            pacientes.cpf = headers.request.pacientes.cpf;

            void await pacientes.Salvar();

            headers.msg = 'Dados salvo com sucesso!';

            void await database.commit();

            /***************************************************
            * Exclui todos os Uploads de Arquivos do Atendimento
            * por numero do prontuario do paciente
            ***************************************************/
            fs.readdir(headers.uploadPath + '/', (err, files) => {
            
                if (err) throw new Error(err);

                for (const file of files) {

                    if (file.substring(0,headers.request.pacientes.id.length) == headers.request.pacientes.id) {

                        fs.unlink(headers.uploadPath + '/' + file, (err) => {
                            if (err) throw new Error(err);
                        });

                    }
                }

            });

        } catch (error) {
            
            void await database.rollback();

            headers.num = 99;
            headers.msg = error.stack;
            headers.status = 420;
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response
        });

    }

    static async ListarAtendimentos(req,res) {
        
        const headers = {
            num: 0,
            msg:'',
            status: 200,
            request: {
                data_ini: req.body.data_ini,
                data_fin: req.body.data_fin,
                nome_paciente: req.body.nome_paciente
            },
            response: {
                atendimentos: {}
            }
        }

        try {

            void await database.connect();

            const atendimentos = new Atendimentos(database.connection);

            headers.request.data_ini += ' 00:00:00';
            headers.request.data_fin += ' 23:59:59';

            headers.response.atendimentos = await atendimentos.Listar(headers.request.nome_paciente,headers.request.data_ini,headers.request.data_fin);

            headers.msg = 'Dados Listados com sucesso!';

        } catch (error) {

            headers.num = 99;
            headers.msg = error.stack;
            headers.status = 420;
            
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response
        });

    }

    static async EditAtendimento(req,res) {

        const headers = {
            num: 0,
            msg:'',
            status: 200,
            request: {
                id_atend: req.body.id
            },
            response: {
                atendimentos: {},
                pacientes: {},
                tipoatend: {},
                regimeatend: {},
                especialidades: {}
            }
        }

        try {

            void await database.connect();

            /*********************************************************/
            const atendimentos = new Atendimentos(database.connection);
            const pacientes = new Pacientes(database.connection);
            const tipoatend = new TipoAtend(database.connection);
            const regimeatend = new RegimeAtend(database.connection);
            const especialidades = new Especialidades(database.connection);

            /*********************************************************/
            headers.response.atendimentos = await atendimentos.Buscar(headers.request.id_atend);
            headers.response.pacientes = await pacientes.Buscar(atendimentos.paciente_id);
            headers.response.tipoatend = await tipoatend.Listar();
            headers.response.regimeatend = await regimeatend.Listar();
            headers.response.especialidades = await especialidades.Listar();

        } catch (error) {

            headers.num = 99;
            headers.msg = error.stack;
            headers.status = 420;
            
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            paciente_id: headers.response.pacientes.id,
            dtnasc: headers.response.pacientes.dt_nasc,
            nm_paciente: headers.response.pacientes.nome,
            dados: headers.response
        });

    }

    static async EditAtendSalvar(req,res) {

        const headers = {
            num: 0,
            msg:'',
            status: 200,
            request: {
                id_atend: req.body.id_atend,
                tipo_id: req.body.tipo_id,
                observacao: req.body.observacao.toUpperCase(),
                regime_atend_id: req.body.regime_atend_id,
                acompanhante: req.body.acompanhante.toUpperCase(),
                medico_assist: req.body.medico_assist.toUpperCase(),
                crm_assist: req.body.crm_assist,
                esp_assist: req.body.esp_assist.toUpperCase(),
                esp_atend_id: req.body.esp_atend_id    
            },
            response: {
                atendimentos: {}
            }
        }

        try {

            void await database.connect();

            void await database.begin();

            const atendimentos = new Atendimentos(database.connection);

            headers.response.atendimentos = await atendimentos.Buscar(headers.request.id_atend);

            if (!atendimentos.found) {
                throw new Error('Atendimento não cadastrado!');
            }
            
            atendimentos.id = headers.request.id_atend;
            atendimentos.tipo_id = headers.request.tipo_id;
            atendimentos.observacao = headers.request.observacao;
            atendimentos.regime_atend_id = headers.request.regime_atend_id;
            atendimentos.acompanhante = headers.request.acompanhante;
            atendimentos.crm_medico_assist = headers.request.crm_assist;
            atendimentos.nm_medico_assist = headers.request.medico_assist;
            atendimentos.esp_medico_assist = headers.request.esp_assist;
            atendimentos.especialidade_atend_id = headers.request.esp_atend_id;

            void await atendimentos.Salvar();

            void await database.commit();

            headers.msg = 'Atendimento salvo com sucesso.';
            
        } catch (error) {

            void await database.rollback()

            headers.num = 99;
            headers.msg = error.stack;
            headers.status = 420;
            
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg
        });

    }

    static async ListarExames(req,res) {

        const headers = {
            num: 0,
            msg:'',
            status: 200,
            request: {
                paciente_id: req.body.paciente_id 
            },
            response: {
                exames: {},
                pacientes: {}
            }
        }

        try {

            void await database.connect();
                            
            const exames = new Exames(database.connection);
            const pacientes = new Pacientes(database.connection);

            headers.response.pacientes = await pacientes.Buscar(headers.request.paciente_id);
            headers.response.exames = await exames.ListarPorPaciente(headers.request.paciente_id);

            if (!pacientes.found) {
                throw new Error('Paciente não encontrado.');
            }

            headers.msg = 'Lista de exames realizada com sucesso!';
            
        } catch (error) {

            headers.num = 99;
            headers.msg = error.stack
            headers.status = 420;
            
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response.exames,
            id: headers.response.pacientes.id,
            nome: headers.response.pacientes.nome,
            dtnasc: headers.response.pacientes.dt_nasc
        });

    }

    static async ExcluirExames(req,res) {

        const headers = {
            num: 0,
            msg:'',
            status: 200,
            request: {
                id_atend: req.body.id_atend,
                id: req.body.id
            },
            response: {
                exames: {}
            }
        }

        try {
            
            void await database.connect();

            void await database.begin();

            const exames = new Exames(database.connection);

            await exames.Excluir(headers.request.id_atend,headers.request.id);

            headers.response.exames = await exames.Listar(headers.request.id_atend);

            headers.msg = 'Exame excluido com sucesso!';

            void await database.commit();

        } catch (error) {
            
            void await database.rollback();

            headers.num = 99;
            headers.msg = error.stack;
            headers.status = 420;
            
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response.exames
        });

    }

}

export { RecepcaoController }
