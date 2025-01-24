import Database from '../database/conn.js';
import { DaoModel } from '../models/dao_model.js';

export class ControllerInterfaceEstoque {

  static async Listar(req,res) {
    
    const resdata = {
      err: 0,
      msg: '',
      updated: '',
      status: 200,
      data: []
    }

    const database = new Database('fsph_cms');

    try {
      
      void await database.connect();

      const model = new DaoModel(database.connection);

      const query = `SELECT * FROM view_interface_estoque`
      
      const rows = await model.executequery(query);

      const dia = new Date(rows[0].updated);
      
      resdata.updated = dia.toLocaleDateString() + " " + dia.toLocaleTimeString();

      resdata.data = rows;
      
    } catch (error) {
      resdata.status = 500;
      resdata.err = 999;
      resdata.msg = error.message
    }

    void await database.close();

    res.status(resdata.status).json(resdata);

  }

}

export class ControllerInterfaceEstatista {

  static async Listar(req,res) {
    
    const resdata = {
      err: 0,
      msg: '',
      updated: '',
      status: 200,
      data: []
    }

    const database = new Database('fsph_cms');

    try {
      
      void await database.connect();

      const model = new DaoModel(database.connection);

      const query = `SELECT * FROM tb_interface_doacoes`
      
      const [rows] = await model.executequery(query);

      resdata.data = rows;
      
    } catch (error) {
      resdata.status = 500;
      resdata.err = 999;
      resdata.msg = error.message
    }

    void await database.close();

    res.status(resdata.status).json(resdata);
    
  }

}