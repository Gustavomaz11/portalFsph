import Database from '../database/conn.js';
import { DaoModel } from '../models/dao_model.js';

export class ControllerFuncionamentos {

  static async Listar(req,res) {

    const resdata = {
      err: 0,
      msg: '',
      status: 200,
      data: []
    }

    const database = new Database('fsph_cms');

    try {
      
      const {id_unidade} = req.params;

      void await database.connect();

      const model = new DaoModel(database.connection);

      const query = "SELECT * FROM tb_funcionamentos WHERE id_unidade = :id_unidade"

      const rows = await model.executequery(query,{id_unidade});

      resdata.data = rows

    } catch (error) {
      resdata.err = 99;
      resdata.msg = error.message;
      resdata.status = 500;
    }

    void await database.close();

    res.status(resdata.status).json(resdata)

  }

  static async Inserir(req,res) {

    const resdata = {
      err: 0,
      msg: '',
      status: 200,
      data: []
    }

    const database = new Database('fsph_cms');

    try {
      
      const dados = req.body;

      void await database.connect();

      const model = new DaoModel(database.connection);

      const sql = `INSERT INTO tb_funcionamentos SET id_unidade = :id_unidade, dia_sem = :dia_sem, hora_ini = :hora_ini, hora_fim = :hora_fim`

      void await database.begin();

      void await model.executequery(sql,dados);

      void await database.commit();

      resdata.msg = 'Dados Inseridos com sucesso!';


    } catch (error) {

      void await database.rollback();

      resdata.err = 99;
      resdata.msg = error.message;
      resdata.status = 500
      
    }

    void await database.close();

    res.status(resdata.status).json(resdata);

  }

  static async Atualizar(req,res) {

    const resdata = {
      err: 0,
      msg: '',
      status: 200,
      data: []
    }

    const database = new Database('fsph_cms');

    try {
      
      const dados = req.body;

      void await database.connect();

      const model = new DaoModel(database.connection);

      const sql = `UPDATE tb_funcionamentos 
      SET id_unidade = :id_unidade, dia_sem = :dia_sem, hora_ini = :hora_ini, hora_fim = :hora_fim,status = :status
      WHERE id_func = :id_func`

      void await database.begin();

      void await model.executequery(sql,dados);

      void await database.commit();

      resdata.msg = 'Dados Atualizados com sucesso!';


    } catch (error) {

      void await database.rollback();

      resdata.err = 99;
      resdata.msg = error.message;
      resdata.status = 500
      
    }

    void await database.close();

    res.status(resdata.status).json(resdata);

  }

}