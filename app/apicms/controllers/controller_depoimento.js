import Database from '../database/conn.js';

import {DaoModel} from '../models/dao_model.js'

export class ControllerDepoimento {
    
    static async create(req,res){
        
        const resdata = {
            err: 0,
            msg: '',
            status: 201,
        }

        const database = new Database('fsph_cms');

        const {nome_criador,texto_depoimento,nota_depoimento,ocupacao_criador} = req.body

        const {foto_criador} = req.files

        const tamanho_arquivo = (1024 * 350)

        if (foto_criador.size > tamanho_arquivo) {
            throw new Error(`Tamanho do Upload do arquivo ${tamanho_arquivo.name} maior que permitido. Tamanho Maximo é de 350kb`);
        }

        try {
            
            await database.connect()

            const model = new DaoModel(database.connection)

            const id_depoimento = await model.newId('id_depoimento','tb_depoimentos')

            const query = `
                INSERT INTO tb_depoimentos SET
                nome_criador = :nome_criador,
                texto_depoimento = :texto_depoimento,
                nota_depoimento = :nota_depoimento,
                ocupacao_criador = :ocupacao_criador,
                foto_criador = :foto_criador,
                foto_criador_mimetype = :foto_criador_mimetype,
                id_depoimento = :id_depoimento
            `

            const dataQuery = {
                nome_criador,
                texto_depoimento,
                nota_depoimento,
                ocupacao_criador,
                foto_criador:foto_criador.data,
                foto_criador_mimetype: foto_criador.mimetype,
                id_depoimento
            }

            await model.executequery(query,dataQuery)

            resdata.msg = 'Depoimento criado com sucesso'

        } catch (error) {
            resdata.err = 1
            resdata.status = 500
            resdata.msg = error.message
        }

        database.close()

        res.status(resdata.status).json(resdata)
    }

    static async getAll (req,res){
        
        const resdata = {
            err: 0,
            msg: '',
            status: 200,
            data:[]
        }

        const database = new Database('fsph_cms');
        
        try {

            await database.connect()

            const model = new DaoModel(database.connection)

            const sql = `SELECT * FROM tb_depoimentos`

            const depoimentos = await model.executequery(sql)

            depoimentos.map((depoimento)=>{
                
                resdata.data.push({
                    nome_criador:depoimento.nome_criador,
                    texto_depoimento:depoimento.texto_depoimento,
                    nota_depoimento:depoimento.nota_depoimento,
                    ocupacao_criador:depoimento.ocupacao_criador,
                    foto_criador: `data: ${depoimento.foto_criador_mimetype}; base64, ${depoimento.foto_criador.toString('base64')}`,
                    foto_criador_mimetype: depoimento.foto_criador_mimetype,
                    id_depoimento:depoimento.id_depoimento
                })
                
            });

        } catch (error) {
            
        }

        database.close()
        res.status(resdata.status).json(resdata)
    }
}