import Database from '../database/conn.js';
import {DaoModel} from '../models/dao_model.js'

export class ControllerAgendamento { 
    
    static async create (req,res){
        
        let {nome,email,contato,cpf,turno,qt_pessoas,dt_agenda,hr_agenda,tp_agenda} = req.body

        const arquivo_autorizacao = req.files?.arquivo_autorizacao

        const resdata = {
            err: 0,
            msg: '',
            status: 201,
        }

        const database = new Database('fsph_cms');

        if(qt_pessoas == undefined){
            qt_pessoas = 1
        }

        try {

            const tamanhoMaximoArquivo = 1024 * 350

            if(arquivo_autorizacao?.size > tamanhoMaximoArquivo){
                throw new Error('Arquivo de autorização ultrapassou o limite de 350kb')
            }

            void await database.connect()
            
            void await database.begin()
            
            if(!nome,!email,!contato,!dt_agenda,!tp_agenda){
                resdata.err = 1
                resdata.status = 400
                throw new Error("Informções invalidas")
            }

            const model = new DaoModel(database.connection)

            const id_agenda = await model.newId('id_agenda','tb_agendamentos')

            let query = `INSERT INTO tb_agendamentos SET
                id_agenda = :id_agenda,
                nome = :nome,
                email = :email,
                contato = :contato,
                cpf = :cpf,
                turno = :turno,
                qt_pessoas = :qt_pessoas,
                dt_agenda = :dt_agenda ,
                hr_agenda = :hr_agenda,
                tp_agenda = :tp_agenda,
                arquivo_autorizacao = :arquivo_autorizacao,
                arquivo_autorizacao_mimetype = :arquivo_autorizacao_mimetype
            `

            let dataQuery = {
                id_agenda,
                nome,
                email,
                contato,
                cpf,
                turno,
                qt_pessoas,
                dt_agenda,
                hr_agenda,
                tp_agenda,
                arquivo_autorizacao:arquivo_autorizacao?.data,
                arquivo_autorizacao_mimetype:arquivo_autorizacao?.mimetype
            }

            await model.executequery(query,dataQuery);
            
            await database.commit()

            resdata.msg = 'Agendamento criado com sucesso';

        } catch (error) {
            resdata.status = 500
            resdata.msg = error.message
            resdata.err = 1
            console.log(error.message)
            await database.rollback()
        }

        void await database.close();

        res.status(resdata.status).json(resdata)

    }

    static async getAllAgendamentos (req,res){

        const resdata = {
            err: 0,
            msg: '',
            status: 200,
            data:[]
        }

        const database = new Database('fsph_cms');

        try {
            void await database.connect()

            const model = new DaoModel(database.connection)

            const sql = `SELECT * FROM tb_agendamentos`

            const agendamentos = await model.executequery(sql)

            agendamentos.map((agendamento)=>{
                resdata.data.push({
                    id_agenda:agendamento.id_agenda,
                    dt_agenda:agendamento.dt_agenda,
                    hr_agenda:agendamento.hr_agenda,
                    tp_agenda:agendamento.tp_agenda,
                    nome:agendamento.nome,
                    email:agendamento.email,
                    contato:agendamento.contato,
                    cpf:agendamento.cpf,
                    turno:agendamento.turno,
                    qt_pessoas:agendamento.qt_pessoas,
                    arquivo_autorizacao:`data: ${agendamento.arquivo_autorizacao_mimetype}; base64, ${agendamento.arquivo_autorizacao.toString('base64')}`
                })
            })

        } catch (error) {
            resdata.err = 1
            resdata.msg = error.message
            resdata.status = 500
        }

        void await database.close();

        res.status(resdata.status).json(resdata)
    }

    static async edit (req,res) {

        const resdata = {
            msg:'',
            status:200,
            err:0,
            data:[]
        }

        const database = new Database('fsph_cms');

        const {id_agenda,dt_agenda,hr_agenda,tp_agenda,turno,qt_pessoas} = req.body

        try {
            
            await database.connect()

            await database.begin()
            
            const model = new DaoModel(database.connection)

            const query = `UPDATE tb_agendamentos SET 
                dt_agenda = :dt_agenda,
                hr_agenda = :hr_agenda,
                tp_agenda = :tp_agenda,
                turno = :turno,
                qt_pessoas = :qt_pessoas
                WHERE id_agenda = :id_agenda
            `

            const queryData = {id_agenda,dt_agenda,hr_agenda,tp_agenda,turno,qt_pessoas}

            await model.executequery(query,queryData)

            const queryGet = `SELECT * FROM tb_agendamentos`

            const rows = await model.executequery(queryGet)

            await database.commit()

            resdata.data = rows
            resdata.msg = 'Agendamento editado com sucesso'

        } catch (error) {

            resdata.err = 1
            resdata.status = 500
            resdata.msg = error.message

            await database.rollback()

        }

        await database.close()
        
        res.status(resdata.status).json(resdata)
    }

    static async delete (req,res){
        
        const {id_agenda} = req.params

        const resdata = {
            msg:'',
            status:200,
            err:0,
            data:[]
        }

        const database = new Database('fsph_cms');

        try {

            await database.connect()

            await database.begin()

            const model = new DaoModel(database.connection)

            const query = `DELETE FROM tb_agendamentos WHERE id_agenda = :id_agenda`
            
            model.executequery(query,{id_agenda})

            resdata.msg = 'Excluido com sucesso'

            const queryGet = `SELECT * FROM tb_agendamentos`

            const rows = await model.executequery(queryGet)

            resdata.data = rows

            await database.commit()

        } catch (error) {
            
            resdata.err = 1
            resdata.status = 500
            resdata.msg = error.message
            
            await database.rollback()
        }

        await database.close()
        
        res.status(resdata.status).json(resdata)
    }

    static async getByid (req,res) {
        
        const {id_agenda} = req.params

        const resdata = {
            msg:'Agendamento encontrado com sucesso',
            status:200,
            data:{},
            err:0
        }

        const database = new Database('fsph_cms');

        try {

            void await database.connect()

            void await database.begin()

            const model = new DaoModel(database.connection)
            
            const query = `SELECT * FROM tb_agendamentos WHERE id_agenda = :id_agenda`

            const [agendamento] = await model.executequery(query,{id_agenda})



            resdata.data = {
                id_agenda:agendamento.id_agenda,
                dt_agenda:agendamento.dt_agenda,
                hr_agenda:agendamento.hr_agenda,
                tp_agenda:agendamento.tp_agenda,
                nome:agendamento.nome,
                email:agendamento.email,
                contato:agendamento.contato,
                cpf:agendamento.cpf,
                turno:agendamento.turno,
                qt_pessoas:agendamento.qt_pessoas,
                arquivo_autorizacao:`data: ${agendamento.arquivo_autorizacao_mimetype}; base64, ${agendamento.arquivo_autorizacao.toString('base64')}`
            }

            void await database.commit()

        } catch (error) {
            
            resdata.err = 1
            resdata.status = 500
            resdata.msg = error.message
            
            void await database.rollback()
        }

        void await database.close();

        res.status(resdata.status).json(resdata)
    }

}