import database from '../database/conn.js';
import { Atendimentos,TabelaCid,EspProcedimentos,Exames, Pacientes } from '../models/classModels.js';
import { DataHora } from '../helpers/datetime.js';
import fs from 'fs';
import fileDirName from '../helpers/file-dir-name.js';
//import pdf from 'html-pdf-node';
import qr from 'qrcode';
//import { JSDOM } from 'jsdom';

const { __dirname } = fileDirName(import.meta);

const options = {
    root: __dirname.replace('controllers','views')
};

/**************************************************************************************/
class AmbulatorioController {

    /*************************************************************
    * Tabela Prescrições Medicas
    **************************************************************/
    static async EditarPrescricaoMedica(req,res) {

        const header = {
            num: 0,
            msg:'',
            status: 200,
            path_html: '',
            request: {
                atend_id: req.body.atend_id,
                paciente_id: req.body.paciente_id
            },
            response: {
                html:'', 
                espprocedimentos: {},
                exames: {},
                pacientes: {
                    id: 0,
                    nome: '',
                    dt_nasc: '',
                }
            }
        }

        try {

            header.path_html = __dirname.replace('controllers','views') + '/ambulatorio/atend_medico.html';
            
            if (!fs.existsSync(header.path_html)) {
                throw new Error('Arquivo HTML não localizado.');
            }

            header.response.html = fs.readFileSync(header.path_html,'utf8');

            void await database.connect();

            const espprocedimentos = new EspProcedimentos(database.connection);
            const exames = new Exames(database.connection);
            const pacientes = new Pacientes(database.connection);

            header.response.espprocedimentos = await espprocedimentos.ListaProcedimento(header.request.atend_id);
            header.response.exames = await exames.ListarPorAtend(header.request.atend_id);
            
            void await pacientes.Buscar(header.request.paciente_id);

            header.response.pacientes.id = pacientes.id;
            header.response.pacientes.nome = pacientes.nome;
            header.response.pacientes.dt_nasc = pacientes.dt_nasc;

        } catch (error) {
            
            void await database.rollback();

            header.msg = error.stack;
            header.status = 420;
        }

        void await database.close();

        res.status(header.status).json({
            err: header.num,
            msg: header.msg,
            dados: header.response
        });

    }

    static async AtendimentoConsultorio(req,res) {
        
        const header = {
            num: 0,
            msg:'',
            status: 200,
            request: {
                nome: req.body.nome,
                situacao: req.body.situacao
            },
            response: {
                atendimentos: {}
            }
        }

        try {

            void await database.connect();

            const atendimentos = new Atendimentos(database.connection);

            header.response.atendimentos = await atendimentos.ListarAtendConsultorio(header.request.nome,header.request.situacao);
            
        } catch (error) {
            header.num = 99;
            header.msg = error.stack;
            header.status = 420;
        }

        void await database.close();
        
        res.status(header.status).json({
            err: header.num,
            msg: header.msg,
            dados: header.response
        });

    }

    static async VerExame(req,res) {
        
        const header = {
            num: 0,
            msg:'',
            status: 200,
            request: {
                paciente_id: req.body.paciente_id,
                id: req.body.id,
            },
            response: {
                imagem: '',
            }
            
        }

        try {
            
            void await database.connect();

            const exames = new Exames(database.connection);

            void await exames.Buscar(header.request.paciente_id,header.request.id);

            if (!exames.found) {
                throw new Error('Exame não Localizado!');
            }

            header.response.imagem = `data: ${exames.mimetype}; base64, ${exames.imagem.toString('base64')}`;
            
        } catch (error) {

            header.num = 99;
            header.msg = error.stack
            header.status = 420;
        }

        void await database.close();

        res.status(header.status).json({
            err: header.num,
            msg: header.msg,
            dados: header.response
        });

    }

    /*************************************************************
    * Tabela CID
    **************************************************************/
    static async ListarCid(req,res) {

        const header = {
            num: 0,
            msg:'',
            status: 200,
            request: {
                descricao: req.body.descricao
            },
            response: {
                cids: {}
            }
            
        }

        try {
            
            void await database.connect();

            const cids = new TabelaCid(database.connection);
           
            header.response.cids = await cids.Listar(header.request.descricao);

        } catch (error) {
            header.num = 99;
            header.msg = error.stack
            header.status = 420;
        }

        void await database.close();

        res.status(header.status).json({
            err: header.num,
            msg: header.msg,
            dados: header.response
        });

    }

    static async SelecionarCodigo(req,res) {

        const header = {
            num: 0,
            msg:'',
            status: 200,
            request: {
                codigo: req.body.codigo.toUpperCase()
            },
            response: {
                cids: {}
            }
            
        }

        try {
            
            void await database.connect();

            const cids = new TabelaCid(database.connection);

            header.response.cids = await cids.SelecionarCodigo(header.request.codigo);

        } catch (error) {
            header.num = 99;
            header.msg = error.stack;
            header.status = 420;
        }

        void await database.close();

        res.status(header.status).json({
            err: header.num,
            msg: header.msg,
            dados: header.response
        });

    }

    static async SalvarCid(req,res) {

        const header = {
            num: 0,
            msg:'',
            status: 200,
            request: {
                id: req.body.id,
                codigo: req.body.codigo.toUpperCase(),
                descricao: req.body.descricao.toUpperCase()
            },
            response: {
                cids: {}
            }
            
        }

        try {

            void await database.connect();

            void await database.begin();

            const cids = new TabelaCid(database.connection);

            header.response.cids = await cids.Buscar(header.request.codigo);

            if (cids.found) {
                throw new Error('Codigo CID já cadastrado.');
            }

            cids.id = header.request.id;
            cids.codigo = header.request.codigo;
            cids.descricao = header.request.descricao;

            void await cids.Salvar();

            header.response.cids.id = cids.id

            void await database.commit();
            
        } catch (error) {

            void await database.rollback();

            header.num = 99;
            header.msg = error.stack;
            header.status = 420;
            
        }

        void await database.close();

        res.status(header.status).json({
            err: header.num,
            msg: header.msg,
            dados: header.response
        });

    }

    static async Receituario(req,res) {

        let num = 0;
        let msg = '';
        let status = 200;

        res.status(status).json({
            err: num,
            msg: msg,
            dados: {
                nome_profissional: req.session.nome_profissional,
                dt_receituario: DataHora()
            }
        });

    }

    static async ImpressaoPrescricao(req,res) {

        const header = {
            num: 0,
            msg:'',
            status: 200,
            request: {
                nome_profissional: req.session.nome_profissional,
                registro_profissional: req.session.registro_profissional,
                nome_paciente: req.body.nome_paciente,
                prescricoes: req.body.prescricoes
            },
            response: {
                pdf_gerado: {}
            }
            
        }

        try {
           
            /********************************
            * Logomarca
            ********************************/
            let logo = undefined;
            let pasta = 'assets/img/'

            if (fs.existsSync(pasta + 'fsph_logo.png')) {
                logo = fs.readFileSync(pasta + 'fsph_logo.png','base64');
                logo = new Buffer.from(logo,'base64')   
            } else {
                throw new Error('pasta não encontrada ' + pasta)
            }

            /********************************
            * Criar imagem com o qrcode
            ********************************/            
            const opt_qrcode = {
                errorCorrectionLevel: 'L',
                type: 'png',
                margin: 0
            };
            
            const url = 'https://www.google.com';
            const qrcode = await qr.toBuffer(url, opt_qrcode);

            /**********************************
            * ler html e cria imagem no PDF
            ***********************************/
            pasta = __dirname.replace('controllers','views') + '/templates/';

            const arquivo_html = pasta + 'template-receituario.html'

            if (!fs.existsSync(arquivo_html)) {
                throw new Error('Template não encontrado.')
            }

            const dom = await JSDOM.fromFile(arquivo_html,{
                contentType: 'text/html; charset="utf-8"',
                resources: 'usable',
            });

            dom.window.document.getElementById('logo').src = 'data:image/png;base64,' + logo.toString('base64')
            dom.window.document.getElementById('nome-paciente').innerHTML = header.request.nome_paciente.toUpperCase();

            await header.request.prescricoes.map((itens) => {
                dom.window.document.getElementById('prescricoes').innerHTML += `<p>${itens.prescricao}</p>`;
            });

            dom.window.document.getElementById('profissional').innerHTML = header.request.nome_profissional + ' CRM ' + header.request.registro_profissional
            dom.window.document.getElementById('qrcode').src = 'data:image/png;base64,' + qrcode.toString('base64')
           
            const opt_pdf = { 
                format: 'A4',
                width: '210mm',
                height: '297mm',               
            };

            const file = { content: dom.serialize() };
            
            const imagepdf = await pdf.generatePdf(file, opt_pdf);

            header.response.pdf_gerado = `data:application/pdf;base64, ${imagepdf.toString('base64')}`;

            header.msg = 'PDF criado com sucesso!';
            
        } catch (error) {
            header.num = 99;
            header.msg = error.stack;
            header.status = 420;
        }

        res.status(header.status).json({
            err: header.num,
            msg: header.msg,
            dados: header.response
        });

    }

}

export default AmbulatorioController;