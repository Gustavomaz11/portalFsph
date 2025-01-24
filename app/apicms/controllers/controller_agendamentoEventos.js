import Database from '../database/conn.js';
import {DaoModel} from '../models/dao_model.js'

export class ControllerAgendamentoEvento {
    
    static async create (req,res){

        const {evento,ids_unidades_fk,dt_evento} = req.body

        const resdata = {
            err: 0,
            msg: '',
            status: 201,
        }

        const database = new Database('fsph_cms');

        try {
            
            void await database.connect()

            void await database.begin()

            if(!evento,!ids_unidades_fk,!dt_evento){
                resdata.err = 1
                resdata.status = 400
                throw new Error("Informções invalidas")
            }

            const model = new DaoModel(database.connection)
            
            const sql = `INSERT INTO tb_eventos SET
                id_evento = :id_evento,
                id_unidade_fk = :id_unidade_fk,
                dt_evento = :dt_evento,
                local = :local,
                nome_evento =: nome
            `
            ids_unidades_fk.map(async (id_unidade_fk)=>{
                const id_evento = await model.newId('id_evento','tb_eventos')
                const sqlData = {id_evento,id_unidade_fk,dt_evento,evento}
                void await model.executequery(sql,sqlData)
            })

            void await database.commit()

            resdata.msg = 'Agendamento feito com sucesso'

        } catch (error) {
            resdata.err = 1
            resdata.status = 400
            resdata.msg = error.message
            void await database.rollback()
        }
        
        void await database.close()

        res.status(resdata.status).json(resdata)
    }

    static async getAll (req,res){

        let {id_unidade} = req.params

        const resdata = {
            err: 0,
            msg: '',
            status: 200,
            data:[]
        }

        if(id_unidade == 0){
            id_unidade = [1,2,3,4]
        }else if(id_unidade != 1) {
            id_unidade = id_unidade.split(',')
        }

        const database = new Database('fsph_cms');

        try {

            void await database.connect()

            const model = new DaoModel(database.connection)

            let sql = `
                SELECT e.id_aux_evento,MAX(e.dt_evento) AS dt_max, MIN(e.dt_evento) AS dt_min, e.id_unidade_fk, a.nome_evento FROM tb_eventos e
                    LEFT JOIN tb_aux_eventos a
                ON
                a.id_evento = e.id_aux_evento
                WHERE e.id_unidade_fk IN (:id_unidade)
                GROUP BY e.id_aux_evento, e.id_unidade_fk, a.nome_evento
                ORDER BY dt_max
            ` 
            const data = await model.executequery(sql,{id_unidade})
        
            resdata.data = data

        } catch (error) {
            console.log(error)
            resdata.err = 1
            resdata.msg = error.message
            resdata.status = 500
        }

        res.status(resdata.status).json(resdata);

        void await database.close();
    }

    static async getById (req,res){
        
        const {id_evento} = req.params

        const resdata = {
            err: 0,
            msg: '',
            status: 200,
            data:{}
        }

        const database = new Database('fsph_cms');

        try {
            void await database.connect()
            
            const model = new DaoModel(database.connection)

            const sql = `SELECT * FROM tb_eventos WHERE id_evento = :id_evento`
            const datasql = {id_evento}

            const [evento] = await model.executequery(sql,datasql)

            resdata.data = evento

        } catch (error) {
            resdata.err = 1
            resdata.msg = error.message
            resdata.status = 500
        }

        res.status(resdata.status).json(resdata)
        await database.close()
    }

    static async editEvent (req,res){
        
        const {evento,id_unidade_fk,dt_evento,id_evento} = req.body
       
        const resdata = {
            err: 0,
            msg: '',
            status: 200,
        }

        const database = new Database('fsph_cms');

        try {
        
            await database.connect()

            await database.begin()

            const model = new DaoModel(database.connection)

            const sql = `UPDATE tb_eventos SET 
            evento= :evento,
            id_unidade_fk= :id_unidade_fk, 
            dt_evento= :dt_evento
            WHERE id_evento = :id_evento`

            const sqlData = {evento,id_unidade_fk,dt_evento,id_evento}

            await model.executequery(sql,sqlData)

            resdata.msg = 'Agendamento editado com sucesso'

            await database.commit()

            res.status(200).json(resdata)
        } catch (error) {
            resdata.err = 1
            resdata.msg = error.message
            resdata.status = 500
            await database.rollback()
        }

        void await database.close()

        res.status(resdata.status).json(resdata)
        
    }

    static async getDetalhado (req,res){
        const resdata = {
            err: 0,
            msg: '',
            status: 200,
            data:[]
        }

        let {id_unidade_fk,id_aux_evento} = req.params

        const database = new Database('fsph_cms')

        try {
            await database.connect()
            const model = new DaoModel(database.connection)
            const query = `SELECT tb_eventos.* FROM tb_eventos 
            WHERE id_aux_evento = :id_aux_evento AND id_unidade_fk = :id_unidade_fk
            ORDER BY dt_evento 
            `

            const dataquery = {id_unidade_fk, id_aux_evento}
            console.log(dataquery)
            const data = await model.executequery(query, dataquery)
            resdata.data = data
        } catch (error) {
            resdata.err = 1
            resdata.msg = error.message
            resdata.status = 500
        }

        void await database.close()
        res.status(resdata.status).json(resdata)
    }
}

export class ControllerAuxEvento {
    static async create (req,res){
        const resdata = {
            msg:'',
            status:201,
            data:[],
            err:0
        }

        const {nome_evento} = req.body
        const database = new Database('fsph_cms')
        try {
            await database.connect()
            await database.begin()
            const model = new DaoModel(database.connection)
            const id_evento = await model.newId('id_evento', 'tb_aux_eventos')
            const sql = `INSERT INTO tb_aux_eventos SET nome_evento= :nome_evento, id_evento= :id_evento`

            const sqlGet = `SELECT * FROM tb_aux_eventos`
            

            await model.executequery(sql,{nome_evento,id_evento})
            const dados = await model.executequery(sqlGet)

            resdata.data = dados

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

    static async getAll (req,res) {
        const resdata = {
            msg:'',
            status:200,
            data:[],
            err:0
        }

        const database = new Database('fsph_cms')
        try {
            await database.connect()
            const model = new DaoModel(database.connection)
            const sql = `SELECT * FROM tb_aux_eventos`

            const dados = await model.executequery(sql)

            resdata.data = dados
        } catch (error) {
            resdata.err = 1
            resdata.status = 500
            resdata.msg = error.message
        }

        await database.close()
        res.status(resdata.status).json(resdata)
    }

    static async edit (req,res){
        const resdata = {
            err:0,
            status:200,
            data:[],
            msg:''
        }

        const {id_evento} = req.params
        const {nome_evento} = req.body

        const database = new Database('fsph_cms')
        try {  
            await database.connect()
            await database.begin()
            const model = new DaoModel(database.connection)

            const sqlUp = `UPDATE tb_aux_eventos SET nome_evento= :nome_evento WHERE id_evento= :id_evento`

            const sqlGet = `SELECT * FROM tb_aux_eventos`

            await model.executequery(sqlUp, {id_evento, nome_evento})

            const dados = await model.executequery(sqlGet)

            resdata.data = dados
        } catch (error) {
            resdata.err = 1
            resdata.status = 500
            resdata.msg = error.message
        }

        await database.close()
        res.status(resdata.status).json(resdata)
    }
}