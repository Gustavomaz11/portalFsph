import database from '../database/conn.js';
import { DaoModel } from '../model/dao_model.js';
import fs from 'fs';

export class Controller {

  static async Listar(req,res) {
  
    const resdata = {
      err: 0,
      msg: '',
      status: 200,
      data: []
    }

    try {

      void await database.connect();

      const dados = {
        objeto: '%' + req.body.descr + '%',
        status: req.body.status
      }

      const model = new DaoModel(database.connection);

      const query = `SELECT * FROM tb_objetos WHERE objeto LIKE :objeto AND status ${dados.status == 'TOD' ? '<>' : '='} :status`
      
      const rows = await model.executequery(query,dados);

      resdata.data = rows

    } catch (error) {
      resdata.status = 500;
      resdata.err = 999;
      resdata.msg = error.message
    }

    void await database.close();

    res.status(resdata.status).json(resdata);
  
  }

  static async Inserir(req,res) {
 
    const resdata = {
      err: 0,
      msg: '',
      status: 200,
      data: []
    }

    try {
    
      let {nr_processo,dt_processo,objeto,val_medio,status} = req.body;

      void await database.connect();

      void await database.begin();

      const dados = {
        num_processo: nr_processo,
        dt_processo,
        objeto: objeto.toUpperCase(),
        status,
        val_medio
      }

      const model = new DaoModel(database.connection);

      const query = `INSERT INTO tb_objetos SET 
                    num_processo = :num_processo, 
                    dt_processo = :dt_processo, 
                    objeto = :objeto, status = :status, 
                    val_medio = :val_medio`

      void await model.executequery(query,dados);

      void await database.connection.commit();

      resdata.msg = 'Dados Salvo com sucesso!';
      
    } catch (error) {
      resdata.status = 500;
      resdata.err = 999;
      resdata.msg = error.message
    }

    void await database.close();

    res.status(resdata.status).json(resdata);

  }

  static async Editar(req,res) {

    const resdata = {
      err: 0,
      msg: '',
      status: 200,
      data: []
    }
  
    try {
     
      const {id} = req.params;
  
      void await database.connect();
  
      const query = `SELECT * FROM tb_objetos WHERE id_objeto = :id_objeto`
  
      const model = new DaoModel(database.connection);
  
      const rows = await model.executequery(query,{id_objeto: id});
  
      resdata.data = rows;
      
    } catch (error) {
      resdata.status = 500;
      resdata.err = 999;
      resdata.msg = error.message
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
  
    try {
     
      const {id_objeto,nr_processo,dt_processo,objeto,status,val_medio} = req.body;
  
      void await database.connect();
  
      void await database.begin();
  
      const dados = {
        id_objeto,
        num_processo: nr_processo,
        dt_processo,
        objeto: objeto.toUpperCase(),
        status,
        val_medio
      }
  
      const query = `UPDATE tb_objetos SET 
                    num_processo = :num_processo, dt_processo = :dt_processo, 
                    objeto = :objeto, status = :status, val_medio = :val_medio
                    WHERE id_objeto = :id_objeto`
  
      const model = new DaoModel(database.connection);
  
      void await model.executequery(query,dados);
  
      void await database.connection.commit();
  
      resdata.msg = 'Dados Salvo com sucesso!';
      
    } catch (error) {
  
      void await database.rollback();
  
      resdata.status = 500;
      resdata.err = 999;
      resdata.msg = error.message
    }
  
    void await database.close();
  
    res.status(resdata.status).json(resdata);  

  }

  static async Anexar(req,res) {

    const resdata = {
      num: 0,
      msg:'',
      status: 200
    }
  
    try {
  
      if (!req.files.arquivo) {
        throw new Error('Nenhum arquivo recebido.');
      }
      
      const pathUpload = 'public/uploads/';
  
      const sql = `INSERT INTO tb_anexos 
                   SET id_objeto_fk = :id_objeto_fk, mimetype = :mimetype, nm_anexo = :nm_anexo, nm_arquivo = :nm_arquivo`;
  
      const dados = {
        mimetype: req.files.arquivo.mimetype,
        id_objeto_fk: req.body.id_objeto,
        nm_anexo: req.body.nm_anexo.toUpperCase(),
        nm_arquivo: req.files.arquivo.name
      }
  
      void await database.connect();
  
      void await database.begin();
  
      const model = new DaoModel(database.connection);

      void await model.executequery(sql,dados);
  
      void await database.commit();
     
      req.files.arquivo.mv(pathUpload + req.files.arquivo.name)
  
      resdata.msg = 'Upload realizado com sucesso!';
  
      /*********************************************
      * Caso precise gerar um arquivo fisico com os
      * dados da imagem no banco de dados
      **********************************************
  
      const buffer = Buffer.from(dados.imagem,"base64");
  
      void await fs.writeFileSync(`public/uploads/${dados.nm_arquivo}`,buffer);*/
  
    } catch (error) {
      resdata.num = 99;
      resdata.msg = error.stack;
      resdata.status = 500;
    }
  
    void await database.close();
  
    res.status(resdata.status).json({
      err: resdata.num,
      msg: resdata.msg
    });    
  
  }

  static async ListarAnexos(req,res) {

    const resdata = {
      num: 0,
      msg:'',
      status: 200,
      data: []
    }
  
    try {
      
      const dados = {
        id_objeto_fk: req.params.id_objeto
      }
  
      void await database.connect();
  
      const model = new DaoModel(database.connection);
  
      const sql = `SELECT id_objeto_fk,id_anexo,nm_anexo,nm_arquivo FROM tb_anexos WHERE id_objeto_fk = :id_objeto_fk`;
  
      const rows = await model.executequery(sql,dados);
  
      resdata.data = rows;
  
    } catch (error) {
      resdata.num = 99;
      resdata.msg = error.message;
      resdata.status = 500;
    }
  
    void await database.close();
  
    res.status(resdata.status).json(resdata);    

  }

  static async ExibirAnexo(req,res) {

    const resdata = {
      num: 0,
      msg:'',
      status: 200,
      data: {
        imagem: ''
      }
    }
  
    try {
      
      const sql = `SELECT nm_arquivo,mimetype FROM tb_anexos WHERE id_objeto_fk = :id_objeto_fk AND id_anexo = :id_anexo`;
  
      const dados = {
        id_objeto_fk: req.params.id_objeto,
        id_anexo: req.params.id_anexo
      }
  
      void await database.connect();
  
      const model = new DaoModel(database.connection);
  
      const rows = await model.executequery(sql,dados);
  
      resdata.data.imagem = 'public/uploads/' + rows[0].nm_arquivo;
  
    } catch (error) {
      resdata.num = 99;
      resdata.msg = error.message;
      resdata.status = 500;
    }
  
    void await database.close();
  
    res.status(resdata.status).json(resdata);

  }

  static async ExcluirAnexo(req,res) {

    const resdata = {
      num: 0,
      msg:'',
      status: 200
    }
  
    try {
      
      const dados = {
        id_objeto_fk: parseInt(req.params.id_objeto),
        id_anexo: parseInt(req.params.id_anexo),
      }

      const model = new DaoModel(database.connection);

      const query_sel = 'SELECT nm_arquivo FROM tb_anexos WHERE id_objeto_fk = :id_objeto_fk AND id_anexo = :id_anexo'
  
      void await database.connect();
  
      const rows = await model.executequery(query_sel,dados)
  
      /**********************************************************/
      const query_del = 'DELETE FROM tb_anexos WHERE id_objeto_fk = :id_objeto_fk AND id_anexo = :id_anexo';

      void await database.begin()
  
      void await model.executequery(query_del,dados);
  
      void await database.commit();
  
      /**********************************************************/
      fs.unlinkSync('public/uploads/' + rows.nm_arquivo)
  
      resdata.msg = "Anexo excluido com sucesso!";
  
    } catch (error) {
  
      void await database.rollback();
  
      resdata.num = 99;
      resdata.msg = error.message;
      resdata.status = 500;
    }
  
    void await database.close();
  
    res.status(resdata.status).json(resdata);

  }

}