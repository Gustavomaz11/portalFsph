import Database from '../database/conn.js';
import { DaoModel } from '../models/dao_model.js';

export class ControllerRamal {
  static async adicionar (req,res){
      const resdata = {
        msg:'',
        err:0,
        status:201,
        data:[]
      }

      const {id_unidade_fk, setor, ramal} = req.body
      let {id_unidade} = req.params 

      if(id_unidade == 0){
        id_unidade = [1,2,3,4]
      }else {
        id_unidade = id_unidade.split(',')
      }

      const database = new Database('fsph_cms')

      try {
        if(!id_unidade_fk,!setor,!ramal){
          resdata.status = 400
          throw new Error('Informações insuficiente')
        }

        await database.connect()
        await database.begin()

        const model = new DaoModel(database.connection)

        const id_ramal = await model.newId('id_ramal','tb_ramais')
        
        const query = `INSERT INTO tb_ramais SET 
          id_ramal = :id_ramal,
          id_unidade_fk = :id_unidade_fk,
          setor= :setor,
          ramal= :ramal
        `

        const queryData = {
          id_ramal,
          id_unidade_fk,
          setor,
          ramal
        }

        await model.executequery(query,queryData)

        const queryGet = `SELECT * FROM tb_ramais WHERE id_unidade_fk IN (:id_unidade)`

        const ramais = await model.executequery(queryGet,{id_unidade})

        resdata.data = ramais

        await database.commit()
      } catch (error) {
        console.log(error)
        resdata.err = 1
        resdata.msg = error.message
        resdata.status = 500
        await database.rollback()
      }

      await database.close()
      res.status(resdata.status).json(resdata)
  }

  static async getAll (req,res){
    let {id_unidade_fk} = req.params

    const resdata = {
      err:0,
      status:200,
      msg:'',
      data:[]
    }

    if (id_unidade_fk == 0){
      id_unidade_fk = [1,2,3,4]
    }else {
      id_unidade_fk = id_unidade_fk.split(',')
    }

    const database = new Database('fsph_cms')  
    try {
      await database.connect()

      const model = new DaoModel(database.connection)


      const query = `SELECT * FROM tb_ramais WHERE id_unidade_fk IN (:id_unidade_fk)`
      
      const ramais = await model.executequery(query,{id_unidade_fk})
      
      resdata.data = ramais

    } catch (error) {
      resdata.err = 1
      resdata.msg = error.message
      resdata.status = 500
    }
    
    await database.close()
    res.status(resdata.status).json(resdata)
  }

  static async edit (req,res){
    const resdata = {
      msg:'',
      err:0,
      status:200,
      data:[]
    }
    
    const {ramal,id_ramal,setor,id_unidade_fk} = req.body
    let {id_unidade} = req.params 

    if(id_unidade == 0){
      id_unidade = [1,2,3,4]
    }else {
      id_unidade = id_unidade.split(',')
    }


    const database = new Database('fsph_cms')

    try {
      await database.connect()
      await database.begin()
      const model = new DaoModel(database.connection)

      const query = `UPDATE tb_ramais SET ramal= :ramal, setor= :setor WHERE id_ramal = :id_ramal`

      const querydata = {ramal,id_ramal,setor}

      model.executequery(query,querydata)

      const queryGet = `SELECT * FROM tb_ramais WHERE id_unidade_fk IN (:id_unidade)`

      const ramais = await model.executequery(queryGet,{id_unidade})

      resdata.data = ramais

      await database.commit()
    } catch (error) {
      resdata.err = 1
      resdata.msg = error.message
      resdata.status = 500
      await database.rollback()
    }
    await database.close()
    res.status(resdata.status).json(resdata)

  }

  static async mudarStatus (req,res){
    const resdata = {
      err:0,
      status:200,
      msg:'',
      data:[]
    }

    let {atualStatus, id_ramal} = req.body
    let {id_unidade} = req.params 

    if(id_unidade == 0){
      id_unidade = [1,2,3,4]
    }else {
      id_unidade = id_unidade.split(',')
    }

    if(atualStatus == 1){
      atualStatus = 0
    }else {
      atualStatus == 1
    }

    const database = new Database('fsph_cms') 

    try { 
      await database.connect()
      await database.begin()
      const model = new DaoModel(database.connection) 

      const query = `UPDATE tb_ramais SET ativo= :atualStatus WHERE id_ramal= :id_ramal`

      await model.executequery(query,{atualStatus,id_ramal})

      const queryGet = `SELECT * FROM tb_ramais WHERE id_unidade_fk IN (:id_unidade)`

      const ramais = await model.executequery(queryGet,{id_unidade})

      resdata.data = ramais

      await database.commit()
    } catch (error) {
      resdata.err = 1
      resdata.msg = error.message
      resdata.status = 500
      await database.rollback()
    }

    await database.close()
    res.status(resdata.status).json(resdata)
  }
}