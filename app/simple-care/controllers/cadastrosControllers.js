import database from '../database/conn.js';
import fileDirName from '../helpers/file-dir-name.js';

import {
    TipoAtend, Conselhos, Enfermarias, Leitos, Especialidades, Vinculos, 
    Profissionais, MotivoEncerra, RegimeAtend, Turnos,Tipo_Prescricao,
    Procedimentos, Tipo_Procedimento,TabelaCid, EspProcedimentos,Sexos,Racas,Estado_Civis
} from '../models/classModels.js';

const {__dirname} = fileDirName(import.meta);

const options = {
    root: __dirname.replace('controllers','views')
}

/****************************************
* Controller Cadastros
*****************************************/
class CadastrosController {

    /**************************************************
    * Envia HTML do cadastro de Tipos de Atendimentos
    ***************************************************/
    static async TiposAtendimentos(req,res) {
        res.status(200).sendFile('/cadastros/tipo-atend.html',options);
    }

    /**************************************************
    * Lista de Tipos de Atendimento por nome.
    ***************************************************/
    static async ListarTipoAtend(req,res) {

        const headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                nome: req.params.nome == '*' ? '' : req.params.nome,
            },
            response: {
                tipo_atend: {}
            }
        }

        try {

            void await database.connect();
            
            const tipo_atend = new TipoAtend();

            headers.response.tipo_atend = await tipo_atend.Listar(headers.request.nome);
            
        } 
        catch (error) {
            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status =  headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response.tipo_atend
        });

    }

    static async EditarTipoAtend(req,res) {

        const headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                id: req.params.id,
            },
            response: {
                tipo_atend: {}
            }
        }

        try {

            void await database.connect();
           
            const tipo_atend = new TipoAtend();

            headers.response.tipo_atend = await tipo_atend.Buscar(headers.request.id);
            
        } 
        catch (error) {
            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status =  headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response.tipo_atend
        });

    }

    static async SalvarTipoAtend(req,res) {

        const headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                id: req.body.id,
                nome: req.body.nome.toUpperCase(),
                ativo: req.body.ativo,
            },
            response: {
                tipo_atend:{} 
            }
        }

        try {

            void await database.connect();

            void await database.begin();

            const tipo_atend = new TipoAtend();

            headers.response.tipo_atend = await tipo_atend.Buscar(headers.request.id);

            tipo_atend.id = headers.request.id;
            tipo_atend.nome = headers.request.nome;
            tipo_atend.ativo = headers.request.ativo;

            void await tipo_atend.Salvar();

            headers.msg = 'Dados salvo com sucesso !';

            headers.response.tipo_atend.id = tipo_atend.id;

            void await database.commit();

        }
        catch (error) {

            database.rollback();
            
            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status =  headers.status == 200 ? 500 : headers.status

        }

        database.close();
        
        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response.tipo_atend
        });
     
    }

    static async ExcluirTipoAtend(req,res) {
        
        const headers = {
            num: 0,
            msg: '',
            status: 200,
            request: { 
                id: req.params.id,                
            },
            response: {}
        }

        try {

            void await database.connect();
            
            void await database.begin();

            const tipos = new TipoAtend();

            void await tipos.Excluir(headers.data.id);

            void await database.commit();

            headers.msg = 'Registro Excluido com Sucesso!';
            
        }
        catch (error) {

            void await database.rollback();

            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status

        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg
        });

    }
    
    /********************************
    * Conselhos de Classes
    *********************************/
    static async Conselhos(req,res) {
        res.status(200).sendFile('/cadastros/conselhos.html',options);
    }

    static async ListarConselhos(req,res) {

        const headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                nome: req.params.nome == '*' ? '' : req.params.nome
            },
            response: {
                conselhos: {}
            }
        }

        try {

            void await database.connect();
            
            const conselhos = new Conselhos();
           
            headers.response.conselhos = await conselhos.Listar(headers.request.nome);

        } 
        catch (error) {
            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response.conselhos
        });

    }

    static async EditarConselhos(req,res) {

        let headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                id: req.params.id
            },
            response: {
                conselhos: {}
            }
        }

        try {

            void await database.connect();
            
            const conselhos = new Conselhos();

            headers.response.conselhos = await conselhos.Buscar(headers.request.id);

        } 
        catch (error) {
            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response
        });
        
    }

    static async SalvarConselhos(req,res) {

        let headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                id: req.body.id,
                nm_classe: req.body.nm_classe.toUpperCase(),
                sigla: req.body.sigla.toUpperCase(),
                ativo: req.body.ativo
            },
            response: {
                conselhos: {}
            }
        }

        try {

            void await database.connect();

            void await database.begin();

            const conselhos = new Conselhos();

            headers.response.conselhos = await conselhos.Buscar(headers.request.id);

            conselhos.id = headers.request.id;
            conselhos.nm_classe = headers.request.nm_classe;
            conselhos.sigla = headers.request.sigla;
            conselhos.ativo = headers.request.ativo;

            void await conselhos.Salvar()

            void await database.commit();

            headers.response.conselhos.id = conselhos.id;
            headers.msg =  'Dados Salvos com Sucesso!';

        }
        catch (error) {
            
            void await database.rollback();
            
            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response.conselhos
        });

    }

    static async ExcluirConselhos(req,res) {

        let headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                id: req.params.id,
            },
            response: {}
        }

        try {

            void await database.connect();
            
            void await database.begin();

            const conselhos = new Conselhos();

            void await conselhos.Excluir(headers.request.id);

            void await database.commit();

            headers.msg = 'Registro Excluido com Sucesso!';

        }
        catch (error) {

            void await database.rollback();

            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg
        });
    
    }

    /********************************
    * Enfermarias
    *********************************/
    static async Enfermarias(req,res) {
        res.status(200).sendFile('/cadastros/enfermarias.html',options);
    }

    static async ListarEnfermarias(req,res) {

        const headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                nome: req.params.nome == '*' ? '' : req.params.nome
            },
            response: {
                enfermarias: {}
            }
        }

        try {

            void await database.connect();

            const enfermarias = new Enfermarias()
            
            headers.response.enfermarias = await enfermarias.Listar(headers.request.nome);

        } 
        catch (error) {
            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response.enfermarias
        });
        
    }

    static async EditarEnfermarias(req,res) {

        const headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                id: req.params.id
            },
            response: {
                enfermarias: {}
            }
        }

        try {

            void await database.connect();
           
            const enfermarias = new Enfermarias();

            headers.response.enfermarias = await enfermarias.Buscar(headers.request.id);

        } 
        catch (error) {
            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response.enfermarias
        });

    }

    static async SalvarEnfermarias(req,res) {

        let headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                id: req.body.id,
                nome: req.body.nome.toUpperCase(),
                qt_leitos: req.body.qt_leitos
            },
            response: {
                enfermarias: {}
            }
        }

        try {

            void await database.connect();
            
            void await database.begin();

            const enfermarias = new Enfermarias();

            headers.response.enfermarias = await enfermarias.Buscar(headers.request.id);
            
            enfermarias.id = headers.request.id;
            enfermarias.nome = headers.request.nome;
            enfermarias.qt_leitos = headers.request.qt_leitos;

            void await enfermarias.Salvar();

            void await database.commit();

            headers.msg = 'Dados Salvos com Sucesso!';

            headers.response.enfermarias.id = enfermarias.id;

        }
        catch (error) {        
            
            void await database.rollback();
            
            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response.enfermarias
        });
        
    }

    static async ExcluirEnfermarias(req,res) {

        let headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                id: req.params.id,
            },
            response: {}
        }

        try {
            
            void await database.connect();

            void await database.begin();

            const enfermarias = new Enfermarias();

            void await enfermarias.Excluir(headers.request.id);

            void await database.commit();

            headers.msg = 'Registro Excluido com Sucesso!';
            
        }
        catch (error) {

            void await database.rollback();

            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg 
        });

    }
    
    /********************************
    * Leitos das Enfermarias
    *********************************/
    static async Leitos(req,res) {
        res.status(200).sendFile('/cadastros/leitos.html',options);
    }

    static async ListarLeitos(req,res) {

        let headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                nome: req.params.nome == '*' ? '' : req.params.nome,
            },
            response: {
                leitos: {},
            }
        }

        try {
 
            void await database.connect();

            /**********************************************/
            const leitos = new Leitos();

            headers.response.leitos = await leitos.Listar(headers.request.nome);
            
        } 
        catch (error) {
            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: {
                leitos: headers.response.leitos
            }
        });

    }
    /************************************************************* */
    static async EditarLeitos(req,res) {

        let headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                leito_id: req.params.id,
                enfermaria_id: req.params.enf_id                
            },
            response: {
                leitos: {},
                enfermarias: {}
            }
        }
        
        try {

            void await database.connect();
         
            /********************************************* */
            const leitos = new Leitos();
            const enfermarias = new Enfermarias();

            headers.response.leitos = await leitos.Buscar(headers.request.enfermaria_id,headers.request.leito_id);
            headers.response.enfermarias = await enfermarias.Listar();

            console.log(headers.response.enfermarias)

        } 
        catch (error) {
            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response
        });
        
    }
    
    /*************************************************************** */
    static async SalvarLeitos(req,res) {

        let headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                enfermaria_id: req.body.enfermaria_id,
                id: req.body.id, 
                nome: req.body.nome.toUpperCase(), 
                ativo: req.body.ativo,
            },
            response: {
                leitos: {}
            }
        }    

        try {

            void await database.connect();

            void await database.begin();

            /*******************************************/
            const enfermarias = new Enfermarias();
            const leitos = new Leitos();

            /********************************************/
            headers.response.leitos = await leitos.Buscar(headers.request.enfermaria_id,headers.request.id);

            leitos.enfermaria_id = headers.request.enfermaria_id;
            leitos.id = headers.request.id;
            leitos.nome = headers.request.nome;
            leitos.ativo = headers.request.ativo;

            void await leitos.Salvar();

            void await enfermarias.Buscar(headers.request.enfermaria_id);

            headers.response.leitos.enfermaria = enfermarias.nome;

            void await database.commit();

            headers.response.leitos.id = leitos.id;

            headers.msg = 'Dados Salvos com Sucesso!'; 

        }
        catch (error) {

            void await database.rollback();

            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: {
                leitos: headers.response.leitos,
            }
        });
    
    }

    static async ExcluirLeitos(req,res) {

        let headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                enfermaria_id: req.params.enf_id,
                leito_id: req.params.id
            },
            response: {}
        }

        try {
        
            void await database.connect();

            void await database.begin();

            const leitos = new Leitos()

            void await leitos.Excluir(headers.request.enfermaria_id,headers.request.leito_id);

            void await database.commit();
            
            headers.msg = 'Registro Excluido com Sucesso!';
        }
        catch (error) {
            
            void await database.rollback();
            
            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }
    
        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg
        });

    }

    /********************************
    * Especialidades Medicas
    *********************************/
    static async Especialidades(req,res) {
        res.status(200).sendFile('/cadastros/especialidades.html',options);
    }

    static async ListarEspecialidades(req,res) {

        let headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                nome: req.params.nome == '*' ? '' : req.params.nome
            },
            response: {
                especialidades: {},
                procedimentos: {}
            }
        }

        try {

            void await database.connect();

            /********************************************* */
            const especialidades = new Especialidades();
            const procedimentos = new Procedimentos();

            /********************************************* */
            headers.response.especialidades = await especialidades.Listar(headers.request.nome);                  
            headers.response.procedimentos = await procedimentos.Listar();
                                                       
        } 
        catch (error) {
            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg:  headers.msg,
            dados: headers.response
        });

    }

    static async EditarEspecialidades(req,res) {

        let headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                id: req.params.id
            },
            response: {
                especialidades: {},
                tipo_prescricoes: {},
                procedimentos: {},
                espprocedimentos: {}
            }
        }

        try {

            void await database.connect();

            /********************************************* */
            const especialidades = new Especialidades();
            const tipo_prescricoes = new Tipo_Prescricao();
            const procedimentos = new Procedimentos();
            const espprocedimentos = new EspProcedimentos();
                                
            /********************************************* */
            headers.response.especialidades = await especialidades.Buscar(headers.request.id);
            headers.response.tipo_prescricoes = await tipo_prescricoes.Listar();            
            headers.response.procedimentos = await procedimentos.Listar('');
            headers.response.espprocedimentos = await espprocedimentos.ListaProcedimento(headers.request.id);
            
        } 
        catch (error) {
            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(200).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response
        });

    }

    static async SalvarEspecialidades(req,res) {

        let headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                id: req.body.id, 
                nome: req.body.nome.toUpperCase(),
                prescreve_em: req.body.prescreve_em,
                ativo: req.body.ativo,
                procedimentos: req.body.procedimentos    
            },
            response: {
                especialidades: {},
                procedimentos: {}
            }
        }

        try {

            void await database.connect();

            void await database.begin();

            const especialidades = new Especialidades();
            const procedimentos = new EspProcedimentos();

            headers.response.especialidades = await especialidades.Buscar(headers.request.id);

            especialidades.id = headers.request.id;
            especialidades.nome = headers.request.nome;
            especialidades.prescreve_em = headers.request.prescreve_em;
            especialidades.ativo = headers.request.ativo;

            void await especialidades.Salvar();

            let i = 0;

            while (i < headers.request.procedimentos.length) {

                void await procedimentos.Buscar(headers.request.procedimentos[i].especialidade_id,headers.request.procedimentos[i].proc_id)

                if (!procedimentos.found) {
                    
                    procedimentos.especialidade_id = especialidades.id;
                    procedimentos.proc_id = headers.request.procedimentos[i].proc_id;

                    void await procedimentos.Salvar();
                }

                i++;

            }

            headers.response.procedimentos = await procedimentos.ListaProcedimento(headers.request.id)

            void await database.commit();

            headers.msg =  'Dados Salvos com Sucesso!';

        }
        catch (error) {

            void await database.rollback();

            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response
        });
    
    }

    static async ExcluirEspecialidades(req,res) {

        let headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                id: req.params.id, 
            },
            response:{}
        }

        try {

            void await database.connect();
            
            void await database.begin();

            const especialidades = new Especialidades();

            void await especialidades.Excluir(headers.request.id);

            void await database.commit();            

            headers.msg = 'Registro Excluido com Sucesso!';

        }
        catch (error) {

            void await database.rollback();

            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg
        });

    }

    /********************************
    * Vinculos de Trabalho
    *********************************/
    static async Vinculos(req,res) {
        res.status(200).sendFile('/cadastros/vinculos.html',options);
    }

    static async ListarVinculos(req,res) {

        let headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                nome: req.params.nome == '*' ? '' : req.params.nome
            },
            response:{
                vinculos: {}
            }
        }

        try {
           
            void await database.connect();

            const vinculos = new Vinculos();

            headers.response.vinculos = await vinculos.Listar(headers.request.nome);
           
        } 
        catch (error) {
            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response
        });
        
    }

    static async EditarVinculos(req,res) {

        let headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                id: req.params.id 
            },
            response:{
                vinculos: {}
            }
        }
        
        try {

            void await database.connect();

            const vinculos = new Vinculos();

            headers.response.vinculos = await vinculos.Buscar(headers.request.id);
            
        } 
        catch (error) {
            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response
        });

    }

    static async SalvarVinculos(req,res) {

        let headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                id: req.body.id,
                nome: req.body.nome.toUpperCase(), 
                carga_horaria: req.body.carga_horaria, 
                ativo: req.body.ativo      
            },
            response:{
                vinculos: {}
            }
        }

        try {

            void await database.connect();

            void await database.begin();

            var vinculos = new Vinculos();

            headers.response.vinculos = await vinculos.Buscar(headers.request.id);

            vinculos.id = headers.request.id;
            vinculos.nome = headers.request.nome;
            vinculos.carga_horaria = headers.request.carga_horaria;
            vinculos.ativo = headers.request.ativo;

            void await vinculos.Salvar();

            void await database.commit();

            msg = 'Dados Salvos com Sucesso!';

            headers.response.id = vinculos.id;

        }
        catch (error) {
            
            void await database.rollback();
            
            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response
        });
    
    }

    static async ExcluirVinculos(req,res) {

        let headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                id: req.params.id,
            },
            response: {}
        }

        try {

            void await database.connect();
            
            void await database.begin();

            const vinculos = new Vinculos();

            void await vinculos.Excluir(headers.request.id);

            void await database.commit();

            headers.msg = 'Registro Excluido com Sucesso!';

        }
        catch (error) {

            void await database.rollback();

            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg
        });

    }

    /********************************
    * Profissionais Ambulatorio
    *********************************/
    static async Profissionais(req,res) {
        res.status(200).sendFile('/cadastros/profissionais.html',options);
    }

    static async ListarProfissionais(req,res) {

        let headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                nome: req.params.nome == '*' ? '' : req.params.nome,
            },
            response: {
                profissionais: {},
                conselhos: {},
                vinculos: {},
                especialidades: {}
            }
        }

        try {

            void await database.connect()

            /************************************************** */
            const profissionais = new Profissionais();
            const conselhos = new Conselhos();
            const vinculos = new Vinculos();
            const especialidades = new Especialidades();

            /************************************************** */
            headers.response.profissionais = await profissionais.Listar(headers.request.nome);
            headers.response.conselhos = await conselhos.Listar('');
            headers.response.vinculos = await vinculos.Listar('');
            headers.response.especialidades = await especialidades.Listar('');
            
        } 
        catch (error) {
            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response
        });
    }

    static async EditarProfissionais(req,res) {

        let headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                id: req.params.id,
            },
            response: {
                profissionais: {},
                conselhos: {},
                vinculos: {},
                especialidades: {}
            }
        }

        try {

            void await database.connect();

            /************************************************** */
            const conselhos = new Conselhos();
            const vinculos = new Vinculos();
            const especialidades = new Especialidades();
            const profissionais = new Profissionais();

            /************************************************** */
            headers.response.profissionais = await profissionais.Buscar(headers.request.id);
            headers.response.conselhos = await conselhos.Listar('');
            headers.response.vinculos = await vinculos.Listar('');
            headers.response.especialidades = await especialidades.Listar('');            

        } 
        catch (error) {
            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response
        });

    }

    static async SalvarProfissionais(req,res) {

        let headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                id: req.body.id, 
                nome: req.body.nome.toUpperCase(),
                cpf: req.body.cpf,
                conselho_id: req.body.conselho_id, 
                conselho_registro: req.body.conselho_registro,
                uf: req.body.uf.toUpperCase(),
                vinculo_id: req.body.vinculo_id,
                especialidade_id: req.body.especialidade_id, 
                ativo: req.body.ativo               
            },
            response: {
                id: 0,
                nome: '',
                conselho_registro: '',
                sigla: ''
            }
        }        

        try {

            void await database.connect();

            void await database.begin();

            /**************************************************************************** */
            const profissionais = new Profissionais();
            const conselhos = new Conselhos();

            /**************************************************************************** */
            headers.response.profissionais = await profissionais.Buscar(headers.request.id);

            profissionais.id = headers.request.id;
            profissionais.nome = headers.request.nome;
            profissionais.cpf = headers.request.cpf;
            profissionais.conselho_id = headers.request.conselho_id;
            profissionais.conselho_registro = headers.request.conselho_registro;
            profissionais.uf = headers.request.uf;
            profissionais.vinculo_id = headers.request.vinculo_id;
            profissionais.especialidade_id = headers.request.especialidade_id;
            profissionais.ativo = headers.request.ativo;
            profissionais.token_assinatura = ''; //hash(headers.request.cpf+headers.request.conselho_registro+headers.request.uf);

            void await profissionais.Salvar();
            
            void await conselhos.Buscar(headers.request.conselho_id);
            
            void await database.commit();

            headers.msg =  'Dados Salvos com Sucesso!';

            headers.response.id = profissionais.id;
            headers.response.nome = profissionais.nome;
            headers.response.conselho_registro = profissionais.conselho_registro;
            headers.response.sigla = conselhos.sigla

        }
        catch (error) {
            
            void await database.rollback();

            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status

        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response            
        });    
    
    }

    static async ExcluirProfissionais(req,res) {

        let headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                id: req.params.id,
            },
            response: {}
        }

        try {

            void await database.connect();
            
            void await database.begin();

            const profissionais = new Profissionais();

            void await profissionais.Excluir(headers.request.id);

            void await database.commit();

            headers.msg = 'Registro Excluido com Sucesso!';
            
        }
        catch (error) {            

            void await database.rollback();

            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg
        });

    }

    /********************************
    * Motivo Encerramento Atendimento
    *********************************/
    static async MotivoEncerra(req,res) {
        res.status(200).sendFile('/cadastros/motivo_encerra.html',options);
    }
   
    static async ListarMotivoEncerra(req,res) {

        let headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                nome: req.params.nome == '*' ? '' : req.params.nome
            },
            response: {
                motivos: {}
            }
        }

        try {

            void await database.connect();
            
            const motivos = new MotivoEncerra();

            headers.response.motivos = await motivos.Listar(headers.request.nome);
            
        } 
        catch (error) {
            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response
        });

    }

    static async EditarMotivoEncerra(req,res) {

        let headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                id: req.params.id,
            },
            response: {
                motivos: {}
            }
        }

        try {

            void await database.connect();

            const motivos = new MotivoEncerra();

            headers.response.motivos = await motivos.Buscar(headers.request.id);
            
        } 
        catch (error) {
            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response
        });

    }

    static async SalvarMotivoEncerra(req,res) {

        let headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                id: req.body.id,
                nome: req.body.nome.toUpperCase(), 
                ativo: req.body.ativo 
            },
            response: {
                motivos: {}
            }
        }

        try {

            void await database.connect();

            void await database.begin();

            const motivos = new MotivoEncerra();

            headers.response.motivos = await motivos.Buscar(headers.request.id);

            motivos.id = headers.request.id;
            motivos.nome = headers.request.nome;
            motivos.ativo = headers.request.ativo;

            void await motivos.Salvar();

            void await database.commit();

            headers.msg = 'Dados Salvos com Sucesso!';

            headers.response.motivos.id = motivos.id;

        }
        catch (error) {

            void await database.rollback();

            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response
        });
    
    }

    static async ExcluirMotivoEncerra(req,res) {

        let headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                id: req.params.id,
            },
            response: {}
        }

        try {
        
            void await database.connect();

            void await database.begin();

            const motivos = new MotivoEncerra();

            void await motivos.Excluir(headers.request.id);

            void await database.commit();

            headers.msg = 'Registro Excluido com Sucesso!';
            
        }
        catch (error) {
            
            void await database.rollback();
            
            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();
        
        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg
        });

    }

    /********************************
    * Regime de Atendimentos
    *********************************/
    static async RegimeAtend(req,res) {
        res.status(200).sendFile('/cadastros/regime_atend.html',options);
    }

    static async ListarRegimeAtend(req,res) {

        let headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                nome: req.params.nome == '*' ? '' : req.params.nome
            },
            response: {
                regime_atend: {}
            }
        }

        try {

            void await database.connect();

            const regime_atend = new RegimeAtend();

            headers.response.regime_atend = await regime_atend.Listar(headers.request.nome);

        } 
        catch (error) {
            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response
        });

    }

    static async EditarRegimeAtend(req,res) {

        let headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                id: req.params.id
            },
            response: {
                regime_atend: {}
            }
        }

        try {

            void await database.connect();

            const regime_atend = new RegimeAtend();

            headers.response.regime_atend = await regime_atend.Buscar(headers.request.id);
            
        } 
        catch (error) {
            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response
        });

    }

    static async SalvarRegimeAtend(req,res) {

        let headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                id: req.body.id, 
                nome: req.body.nome.toUpperCase(), 
                ativo: req.body.ativo 
            },
            response: {
                regime_atend: {}
            }
        }

        try {

            void await database.connect();

            const regime_atend = new RegimeAtend();

            headers.response.regime_atend = await regime_atend.Buscar(headers.request.id);

            regime_atend.id = headers.request.id;
            regime_atend.nome = headers.request.nome;
            regime_atend.ativo = headers.request.ativo;

            void await regime_atend.Salvar()
           
            void await database.commit();

            headers.msg = 'Dados salvo com sucesso!';

            headers.response.regime_atend.id = regime_atend.id;

        }
        catch (error) {
        
            void await database.rollback();

            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
           
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response
        });
            
    }

    static async ExcluirRegimeAtend(req,res) {

        let headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                id: req.params.id
            },
            response: {}
        }

        try {
        
            void await database.connect();

            void await database.begin();

            const regime_atend = new RegimeAtend();

            void await regime_atend.Excluir(headers.request.id);

            void await database.commit();

            headers.msg = 'Registro Excluido com Sucesso!'; 

        }
        catch (error) {
            
            void await database.rollback();

            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg
        });

    }    

    /************************************************************
    * Turnos de Trabalho
    *************************************************************/
    static async Turnos(req,res) {
        res.status(200).sendFile('/cadastros/turnos.html',options);
    }

    static async ListarTurnos(req,res) {

        let headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                nome: req.params.nome == '*' ? ''  : req.params.nome
            },
            response: {
                turnos: {}
            }
        }

        try {

            void await database.connect();

            const turnos = new Turnos();

            headers.response.turnos = await turnos.Listar(headers.request.nome);
    
        } 
        catch (error) {

            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
            
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response
        });

    }

    /*************************************************************/
    static async EditarTurnos(req,res) {

        let headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                id: req.params.id
            },
            response: {
                turnos: {}
            }
        }

        try {

            void await database.connect();

            const turnos = new Turnos();

            headers.response.turnos = await turnos.Buscar(headers.request.id);
            
        } 
        catch (error) {
            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response
        });

    }

    /*************************************************************/
    static async SalvarTurnos(req,res) {

        let headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                id: req.body.id,
                nome: req.body.nome.toUpperCase(), 
                hr_ini: req.body.hr_ini, 
                hr_fin: req.body.hr_fin, 
                ativo: req.body.ativo     
            },
            response: {
                turnos: {}
            }
        }

        try {

            void await database.connect();

            void await database.begin();

            const turnos = new Turnos();

            headers.response.turnos = await turnos.Buscar(headers.request.id);

            turnos.id = headers.request.id;
            turnos.nome = headers.request.nome;
            turnos.hr_ini = headers.request.hr_ini;
            turnos.hr_fin = headers.request.hr_fin;
            turnos.ativo = headers.request.ativo;

            void await turnos.Salvar()

            void await database.commit();

            headers.msg = 'Dados Salvos com Sucesso!';

            headers.response.turnos.id = turnos.id;

        }
        catch (error) {
        
            void await database.rollback();

            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados : headers.response
        });

    }

    /*************************************************************/
    static async ExcluirTurnos(req,res) {

        let headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                id: req.params.id
            },
            response: {
                turnos: {}
            }
        }

        try {

            void await database.connect();
            
            void await database.begin();

            const turnos = new Turnos();

            headers.response.turnos = await turnos.Excluir(headers.request.id);

            void await database.commit();

            headers.msg = 'Registro Excluido com Sucesso!'; 
            
        }
        catch (error) {
            
            void await database.rollback();

            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg
        });

    }

    /*************************************************************
    * Listar tabela auxiliares Especialidades
    **************************************************************/    
    static async ListarAuxEspecialidade(req,res) {

        let headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
            },
            response: {
                tipo_prescricoes: {},
                procedimentos: {}
            }
        }
        
        try {
            
            void await database.connect();

            /*******************************************************/
            const tipo_prescricoes = new Tipo_Prescricao();
            const procedimentos = new Procedimentos();

            /*******************************************************/
            headers.response.tipo_prescricoes = await tipo_prescricoes.Listar();
            headers.response.procedimentos = await procedimentos.Listar('');

        } catch (error) {
            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response
        });

    } 

    /*************************************************************
    * Tipos de Prescriçoes
    **************************************************************/
    static async TiposPrescricao(req,res) {
        res.status(200).sendFile('/cadastros/tipos_prescricoes.html',options);
    }  

    static async ListarTiposPrecricoes(req,res) {

        const headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                nome: req.params.nome == '*' ? '' : req.params.nome
            },
            response: {
                tipo_prescricoes: {},
            }
        }

        try {

            void await database.connect();

            const tipo_prescricoes = new Tipo_Prescricao();

            headers.response.tipo_prescricoes = await tipo_prescricoes.Listar(headers.request.nome);

        } catch (error) {
            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response
        });

    }

    /*************************************************************/
    static async SalvarTipoPrescricao(req,res) {

        const headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                id: req.body.id, 
                codigo: req.body.codigo.toUpperCase(), 
                descricao: req.body.descricao.toUpperCase(), 
                ativo: req.body.ativo     
            },
            response: {
                tipo_prescricoes: {}
            }
        }

        try {
            
            void await database.connect();
            
            void await database.begin();

            /*****************************************************/
            const tipos = new Tipo_Prescricao();

            headers.response.tipo_prescricoes = await tipos.Buscar(headers.request.id);

            tipos.id = headers.request.id;
            tipos.codigo = headers.request.codigo;
            tipos.descricao = headers.request.descricao;
            tipos.ativo = headers.request.ativo;

            void await tipos.Salvar();
            
            void await database.commit();

            headers.msg = 'Dados salvo com sucesso!';

            headers.request.id = tipos.id;

        } catch(error) {

            void await database.rollback();

            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response.tipo_prescricoes
        });

    }

    /*************************************************************/
    static async EditarTipoPrescricao(req,res) {

        const headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                id: req.params.id
            },
            response: {
                tipo_prescricoes: {},
            }
        }

        try {
            
            void await database.connect();

            const tipo_prescricoes = new Tipo_Prescricao();

            headers.response.tipo_prescricoes = await tipo_prescricoes.Buscar(headers.request.id);

        } catch (error) {
            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response
        });
      
    }

    /*************************************************************/
    static async ExcluirTipoPrescricao(req,res) {

        let headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                id: req.params.id
            },
            response: {}
        }

        try {

            void await database.connect();
            
            void await database.begin();

            const tipos = new Tipo_Prescricao();

            void await tipos.Excluir(headers.request.id);

            void await database.commit();

            headers.msg = 'Registro Excluido com Sucesso!'; 
            
        }
        catch (error) {
            
            void await database.rollback();

            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg
        });

    }

    /*************************************************************
    * Procedimentos
    **************************************************************/
    static async Procedimentos(req,res) {
        res.status(200).sendFile('/cadastros/procedimentos.html',options);
    }

    static async ListarProcedimentos(req,res) {

        let headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                nome: req.params.nome == '*' ? '' : req.params.nome
            },
            response: {
                procedimentos: {},
                tipo_procedimento: {}
            }
        }

        try {

            void await database.connect();

            const procedimentos = new Procedimentos();
            const tipo_procedimento = new Tipo_Procedimento();

            headers.response.procedimentos = await procedimentos.Listar(headers.request.nome);
            headers.response.tipo_procedimento = await tipo_procedimento.Listar('');

        } catch (error) {
            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response
        });

    }

    static async SalvarProcedimento(req,res) {
        
        let headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                id: req.body.id,
                procedimento: req.body.nome.toUpperCase(), 
                bpa_cod: req.body.bpa_cod, 
                tipo: req.body.tipo,
                encaminha_enf: req.body.encaminha_enf,
                ativo: req.body.ativo     
            },
            response: {
                procedimentos: {},
                tipo_procedimento: {}
            }
        }
        
        try {
            
            void await database.connect();

            void await database.begin();

            /**************************************************************/
            const procedimentos = new Procedimentos();

            headers.response.procedimentos = await procedimentos.Buscar(headers.request.id);

            procedimentos.id = headers.request.id;
            procedimentos.procedimento = headers.request.procedimento;
            procedimentos.bpa_cod = headers.request.bpa_cod;
            procedimentos.tipo = headers.request.tipo;
            procedimentos.encaminha_enf = headers.request.encaminha_enf;
            procedimentos.ativo = headers.request.ativo;

            void await procedimentos.Salvar();

            void await database.commit();

            headers.msg = 'Dados salvo com sucesso!';

            headers.response.procedimentos.id = procedimentos.id;

        } catch(error) {

            void await database.rollback();

            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados : headers.response
        });

    }

    static async EditarProcedimento(req,res) {

        const headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                id: req.params.id
            },
            response: {
                procedimentos: {},
                tipo_procedimento: {}
            }
        }
        
        try {
            
            void await database.connect();

            const procedimentos = new Procedimentos();
            const tipo_procedimento = new Tipo_Procedimento();

            /************************************************************* */
            headers.response.procedimentos = await procedimentos.Buscar(headers.request.id);
            headers.response.tipo_procedimento = await tipo_procedimento.Listar();

        } catch (error) {
            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response
        });
      
    }

    static async ExcluirProcedimento(req,res) {

        const headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                id: req.params.id
            },
            response: {}
        }

        try {

            void await database.connect();
            
            void await database.begin();

            const procedimentos = new Procedimentos();

            /********************************************************/
            void await procedimentos.Excluir(headers.request.id);

            void await database.commit();

            headers.msg = 'Registro Excluido com Sucesso!'; 
            
        }
        catch (error) {
            
            void await database.rollback();

            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status

        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg
        });

    }
    
    /*************************************************************
    * Tipos Procedimentos
    **************************************************************/
    static async TiposProcedimentos(req,res) {
        res.status(200).sendFile('/cadastros/tipos_procedimentos.html',options);
    }

    static async ListarTiposProcedimentos(req,res) {

        const headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                id: req.params.nome == '*' ? '' : req.params.nome
            },
            response: {
                tipo_procedimento: {}
            }
        }

        try {

            void await database.connect();

            const tipo_procedimento = new Tipo_Procedimento();

            headers.response.tipo_procedimento = await tipo_procedimento.Listar();

        } catch (error) {
            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response
        });

    }

    /*************************************************************/
    static async EditarTipoProcedimento(req,res) {

        let headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                id: req.params.id
            },
            response: {
                tipo_procedimento: {}
            }
        }
        
        try {
            
            void await database.connect(); 

            const tipo_procedimento = new Tipo_Procedimento();

            headers.response.tipo_procedimento = await tipo_procedimento.Buscar(headers.request.id);

        } catch (error) {
            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response
        });
      
    }

    /*************************************************************/
    static async SalvarTipoProcedimento(req,res) {

        const headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                id: req.body.id,
                codigo: req.body.codigo.toUpperCase(), 
                descricao: req.body.descricao.toUpperCase(), 
                ativo: req.body.ativo     
            },
            response: {
                tipo_procedimento: {}
            }
        }
        
        try {
            
            void await database.connect();

            void await database.begin();

            const tipo_procedimento = new Tipo_Procedimento();

            headers.response.tipo_procedimento =  await tipo_procedimento.Buscar(headers.request.id);

            tipo_procedimento.id = headers.request.id;
            tipo_procedimento.codigo = headers.request.codigo;
            tipo_procedimento.descricao = headers.request.descricao;
            tipo_procedimento.ativo = headers.request.ativo;

            void await tipo_procedimento.Salvar()

            void await database.commit();

            headers.msg = 'Dados salvo com sucesso!';

            headers.response.tipo_procedimento.id = tipo_procedimento.id;

        } catch (error) {
            
            void await database.rollback();

            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response
        });
        
    }

    /*************************************************************/
    static async ExcluirTipoProcedimento(req,res) {

        let headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                id: req.params.id,
            },
            response: {}
        }

        try {

            void await database.connect();

            void await database.begin();

            const tipo_procedimento = new Tipo_Procedimento();

            void await tipo_procedimento.Excluir(headers.request.id);

            void await database.commit();

            headers.msg = 'Registro Excluido com Sucesso!'; 
            
        }
        catch (error) {
            
            void await database.rollback();
            
            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg
        });

    }

    /*************************************************************
    * Procedimentos das Especialidades
    **************************************************************/
    static async ExcluirEspProcedimento(req,res) {
        
        let headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                especialidade_id: req.params.especialidade_id,
                proc_id: req.params.proc_id
            },
            response: {}
        }

        try {

            void await database.connect();

            void await database.begin();

            const esp_procedimento = new EspProcedimentos();

            void await esp_procedimento.Excluir(headers.request.especialidade_id,headers.request.proc_id);

            void await database.commit();

            headers.msg = 'Registro Excluido com Sucesso!'; 
            
        }
        catch (error) {
            
            void await database.rollback();
            
            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status

        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg
        });

    }

    static async ListarSetores(req,res) {

        const headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {
                nome: req.params.nome == '*' ? '' : req.params.nome,
            },
            response: {
                setores: [
                    {
                        id: 1,
                        nome : 'Recepção'
                    },
                    {
                        id: 2,
                        nome : 'Ambulatorio'
                    },
                    {
                        id: 3,
                        nome : 'Laboratorio'
                    },
                ]
                
            }
        }

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response.setores
        });


    }
    
    static async ListarSexos(req,res) {

        const headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {},
            response: {
                sexos: {}
            }    
        }

        try {

            void await database.connect();

            const sexos = new Sexos();

            headers.response.sexos = await sexos.Listar();


        } catch (error) {
            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response
        });

    }

    static async ListarRacas(req,res) {

        const headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {},
            response: {
                racas: {}
            }    
        }

        try {

            void await database.connect();

            const racas = new Racas();

            headers.response.racas = await racas.Listar();

        } catch (error) {
            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response
        });

    }

    static async ListarEstadoCivis(req,res) {

        const headers = {
            num: 0,
            msg: '',
            status: 200,
            request: {},
            response: {
                estado_civis: {}
            }    
        }

        try {

            void await database.connect();

            const estado_civis = new Estado_Civis();

            headers.response.estado_civis = await estado_civis.Listar();

        } catch (error) {
            headers.num = 99;
            headers.msg = headers.status == 200 ? error.stack : error.message;
            headers.status = headers.status == 200 ? 500 : headers.status
        }

        void await database.close();

        res.status(headers.status).json({
            err: headers.num,
            msg: headers.msg,
            dados: headers.response
        });

    }

}
/*******************************************************/

export {CadastrosController}