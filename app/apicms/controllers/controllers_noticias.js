import Database from '../database/conn.js';
import { DaoModel } from '../models/dao_model.js';
import {Unidades,Auditoria} from '../models/DAOModel.js'
import fs from 'fs';

export class ControllerNoticias {
  
  static async SalvarUnidade(req,res) {

    const resdata = {
      err: 0,
      msg: '',
      status: 200,
      data: []
    }

    const database = new Database('fsph_cms');

    try {
     
      const {id_unidade,nm_unidade} = req.body;

      void await database.connect();

      void await database.begin();

      const unidades = new Unidades(database.connection);
  
      void await unidades.findbyid(id_unidade);
      
      unidades.nm_unidade = nm_unidade;
  
      void await unidades.save();

      void await database.commit();
      
      resdata.msg = "Dados Salvos com sucesso!";

    } catch (error) {

      void await database.rollback();

      resdata.err = 99;
      resdata.msg = error.message;
      resdata.status = 500;
      
    }

    void await database.close();

    res.status(resdata.status).json(resdata);

  }

  static async Listar(req, res) {
    
    const resdata = {
      err: 0,
      msg: '',
      status: 200,
      data: [],
    }

    const database = new Database('fsph_cms');

    try {

      let {quantidade} = req.params

      quantidade = Number(quantidade)

      void await database.connect();

      const model = new DaoModel(database.connection);

      let query = null, rows = null

      if(quantidade == 0){
        query = `SELECT * FROM tb_noticias WHERE ativo = 1 ORDER BY id_noticia DESC`;
        rows = await model.executequery(query);
      }else {
        query = `SELECT * FROM tb_noticias WHERE ativo = 1 ORDER BY id_noticia DESC LIMIT :quantidade`;
        rows = await model.executequery(query,{quantidade});
      }

      rows.map((dados) => {
        
        resdata.data.push({
          id_unidade_fk: dados.id_unidade_fk,
          id_noticia: dados.id_noticia,
          dt_noticia: dados.dt_noticia,
          autor_noticia: dados.autor_noticia,
          titulo: dados.titulo,
          texto: dados.texto,
          foto_capa: `data: ${dados.foto_capa_mimetype}; base64, ${dados.foto_capa.toString('base64')}`,
          foto_i: `data: ${dados.foto_i_mimetype}; base64, ${dados.foto_i.toString('base64')}`,
          foto_ii: `data: ${dados.foto_ii_mimetype}; base64, ${dados.foto_ii.toString('base64')}`,
          ativo: dados.ativo,
        });

      });

    } catch (error) {
      resdata.status = 500;
      resdata.err = 999;
      resdata.msg = error.message;
    }

    void await database.close();

    res.status(resdata.status).json(resdata);

  }

  static async filtrar(req, res) {

    let { unidade, ativo } = req.params;

    const resdata = {
      status: 200,
      err: 0,
      msg: '',
      data: [],
    }

    if (unidade == 0) {
      unidade = [1, 2, 3, 4];
    } else {
      unidade = unidade.split(',');
    }

    const database = new Database('fsph_cms');

    try {

      void (await database.connect());

      const model = new DaoModel(database.connection);

      const query = `SELECT * FROM tb_noticias WHERE id_unidade_fk IN (:unidade) AND ativo IN (:ativo) ORDER BY id_noticia DESC`;

      const dataQuery = { unidade, ativo };

      const noticias = await model.executequery(query, dataQuery);

      noticias.map((noticia) => {
        
        resdata.data.push({
          id_unidade_fk: noticia.id_unidade_fk,
          id_noticia: noticia.id_noticia,
          dt_noticia: noticia.dt_noticia,
          autor_noticia: noticia.autor_noticia,
          titulo: noticia.titulo,
          titulo_pri_paragrafo: noticia.titulo_pri_paragrafo,
          titulo_seg_paragrafo: noticia.titulo_seg_paragrafo,
          titulo_ter_paragrafo: noticia.titulo_ter_paragrafo,
          titulo_qua_paragrafo: noticia.titulo_qua_paragrafo,
          subtitulo: noticia.subtitulo,
          subtitulo_pri_paragrafo: noticia.subtitulo_pri_paragrafo,
          subtitulo_seg_paragrafo: noticia.subtitulo_seg_paragrafo,
          colaborador: noticia.colaborador,
          comentario: noticia.comentario,
          foto_capa: `data: ${noticia.foto_capa_mimetype}; base64, ${noticia.foto_capa.toString('base64')}`,
          foto_i: `data: ${noticia.foto_i_mimetype}; base64, ${noticia.foto_i.toString('base64')}`,
          foto_ii: `data: ${noticia.foto_ii_mimetype}; base64, ${noticia.foto_ii.toString('base64')}`,
          ativo: noticia.ativo,
        });

      });

    } catch (error) {
      resdata.status = 500;
      resdata.err = 1;
      resdata.msg = error.message;
    }

    void await database.close();

    res.status(resdata.status).json(resdata);

  }

  static async Inserir(req, res) {

    const resdata = {
      err: 0,
      msg: '',
      status: 200,
      data: [],
    };

    const database = new Database('fsph_cms');

    try {

      void await database.connect();

      void await database.connection.beginTransaction();

      if (!req.files.imagemCapa) {
        throw new Error('Foto da capa da noticia não recebida.');
      }

      if (!req.files.corpo_1) {
        throw new Error('Foto 1 da noticia não recebida.');
      }

      if (!req.files.corpo_2) {
        throw new Error('Foto 2 da noticia não recebida.');
      }

      const { id_unidade, dt_noticia, autor_noticia, titulo, texto } = req.body;

      const { imagemCapa, corpo_1, corpo_2 } = req.files;

      const tamanho_arquivo = 1024 * 350;

      if (imagemCapa.size > tamanho_arquivo) {
        throw new Error(`Tamanho do Upload do arquivo ${imagemCapa.name} maior que permitido. Tamanho Maximo é de 350kb`);
      }

      if (corpo_1.size > tamanho_arquivo) {
        throw new Error(`Tamanho do Upload do arquivo ${corpo_1.name} maior que permitido. Tamanho Maximo é de 350kb`);
      }

      if (corpo_2.size > tamanho_arquivo) {
        throw new Error(`Tamanho do Upload do arquivo ${corpo_2.name} maior que permitido. Tamanho Maximo é de 350kb`);
      }

      const model = new DaoModel(database.connection);

      const id_noticia = await model.newId('id_noticia', 'tb_noticias');

      const dados = {
        id_noticia,
        id_unidade_fk: id_unidade,
        dt_noticia,
        autor_noticia,
        titulo,
        texto,
        foto_capa: imagemCapa.data,
        foto_i: corpo_1.data,
        foto_ii: corpo_2.data,
        foto_capa_mimetype: imagemCapa.mimetype,
        foto_i_mimetype: corpo_1.mimetype,
        foto_ii_mimetype: corpo_2.mimetype,
      };

      const query = `INSERT INTO tb_noticias SET 
      id_noticia = :id_noticia, id_unidade_fk = :id_unidade_fk, dt_noticia = :dt_noticia, 
      autor_noticia = :autor_noticia, titulo = :titulo,texto = :texto, foto_capa = :foto_capa,
      foto_i = :foto_i, foto_ii = :foto_ii, foto_capa_mimetype = :foto_capa_mimetype,
      foto_i_mimetype = :foto_i_mimetype, foto_ii_mimetype = :foto_ii_mimetype, ativo = 1`;

      void await model.executequery(query, dados);

      void await database.connection.commit();

      resdata.msg = 'Dados Salvo com sucesso!';

    } catch (error) {
    
      void await database.connection.rollback();

      resdata.status = 500;
      resdata.err = 999;
      resdata.msg = error.message;
    }

    void await database.connection.close();

    res.status(resdata.status).json(resdata);

  }

  static async Editar(req, res) {

    const resdata = {
      err: 0,
      msg: '',
      status: 200,
      data: [],
    };

    const database = new Database('fsph_cms');

    try {
      const { id_noticia } = req.params;

      void await database.connect();

      const query = 'SELECT * FROM tb_noticias WHERE id_noticia = :id_noticia';

      const model = new DaoModel(database.connection);

      const [rows] = await model.executequery(query, { id_noticia });

      resdata.data = {
        id_unidade_fk: rows.id_unidade_fk,
        id_noticia: rows.id_noticia,
        dt_noticia: rows.dt_noticia,
        autor_noticia: rows.autor_noticia,
        titulo: rows.titulo,
        texto: rows.texto,
        foto_capa: `data: ${
          rows.foto_capa_mimetype
        }; base64, ${rows.foto_capa.toString('base64')}`,
        foto_i: `data: ${rows.foto_i_mimetype}; base64, ${rows.foto_i.toString(
          'base64',
        )}`,
        foto_ii: `data: ${
          rows.foto_ii_mimetype
        }; base64, ${rows.foto_ii.toString('base64')}`,
        ativo: rows.ativo,
      };
    } catch (error) {
      resdata.status = 500;
      resdata.err = 999;
      resdata.msg = error.message;
    }

    void await database.close();

    res.status(resdata.status).json(resdata);
  }

  static async Atualizar(req, res) {

    const resdata = {
      err: 0,
      msg: '',
      status: 200,
      data: [],
    }

    const database = new Database('fsph_cms');

    try {

      const {
        id_noticia,
        id_unidade,
        ativo,
        dt_noticia,
        autor_noticia,
        titulo,
        texto,
      } = req.body;

      const { imagemCapa, corpo_1, corpo_2 } = req.files;

      if (!imagemCapa) throw new Error('Foto da cada da noticia não recebida.');
      if (!corpo_1) throw new Error('Foto 1 da noticia não recebida.');
      if (!corpo_2) throw new Error('Foto 2 da noticia não recebida.');

      if (imagemCapa.size > tamanho_arquivo) {
        throw new Error(
          `Tamanho do Upload do arquivo ${imagemCapa.name} maior que permitido. Tamanho Maximo é de 350kb`,
        );
      }

      if (corpo_1.size > tamanho_arquivo) {
        throw new Error(
          `Tamanho do Upload do arquivo ${corpo_1.name} maior que permitido. Tamanho Maximo é de 350kb`,
        );
      }

      if (corpo_2.size > tamanho_arquivo) {
        throw new Error(
          `Tamanho do Upload do arquivo ${corpo_2.name} maior que permitido. Tamanho Maximo é de 350kb`,
        );
      }

      void await database.connect();

      void await database.begin();

      const model = new DaoModel(database.connection);

      const dados = {
        id_noticia,
        id_unidade_fk: id_unidade,
        dt_noticia,
        autor_noticia,
        titulo,
        texto,
        ativo,
        foto_capa: imagemCapa.data,
        foto_i: corpo_1.data,
        foto_ii: corpo_2.data,
        foto_capa_mimetype: imagemCapa.mimetype,
        foto_i_mimetype: corpo_1.mimetype,
        foto_ii_mimetype: corpo_2.mimetype,
      };

      const query = `UPDATE tb_noticias SET 
      id_unidade_fk = :id_unidade_fk, 
      dt_noticia = :dt_noticia, 
      autor_noticia = :autor_noticia, 
      titulo = :titulo,
      texto = :texto,
      foto_capa = :foto_capa,
      foto_i = :foto_i,
      foto_ii = :foto_ii,
      foto_capa_mimetype = :foto_capa_mimetype,
      foto_i_mimetype = :foto_i_mimetype,
      foto_ii_mimetype = :foto_ii_mimetype,
      ativo = :ativo
      WHERE id_noticia = :id_noticia
      `;

      void await model.executequery(query, dados);

      void await database.connection.commit();

      const queryGetAtualizado = `SELECT * from tb_noticias`;

      const rows = await model.executequery(queryGetAtualizado);

      rows.map((row) => {
        
        resdata.data.push({
          id_unidade_fk: row.id_unidade_fk,
          id_noticia: row.id_noticia,
          dt_noticia: row.dt_noticia,
          autor_noticia: row.autor_noticia,
          titulo: row.titulo,
          texto: row.texto,
          foto_capa: `data: ${row.foto_capa_mimetype}; base64, ${row.foto_capa.toString('base64')}`,
          foto_i: `data: ${row.foto_i_mimetype}; base64, ${row.foto_i.toString('base64')}`,
          foto_ii: `data: ${row.foto_ii_mimetype}; base64, ${row.foto_ii.toString('base64')}`,
          ativo: row.ativo,
        });

      });

      resdata.msg = 'Dados Salvo com sucesso!';

    } catch (error) {
      
      void await database.rollback();

      console.log(error);

      resdata.status = 500;
      resdata.err = 999;
      resdata.msg = error.message;
    }

    void await database.close();

    res.status(resdata.status).json(resdata);

  }

  static async Excluir(req, res) {
    
    const resdata = {
      err: 0,
      msg: '',
      status: 200,
    };

    const database = new Database('fsph_cms');

    try {

      const id_noticia = req.params.id_noticia;

      void await database.connect();

      const model = new DaoModel(database.connection);

      const query_sel =
        'SELECT id_unidade_fk, foto_capa,foto_i,foto_ii FROM tb_noticias WHERE id_noticia = :id_noticia';

      const [rows] = await model.executequery(query_sel, { id_noticia });

      /**********************************************************/
      const [conf] = await model.executequery(
        'SELECT path_save_img, path_recover_img FROM tb_configuracao WHERE id_config = 1',
      );

      const path_fotos = conf.path_save_img; //'/var/www/html/portal/fundacao/assets/img/blog/';

      /**********************************************************/
      const query_del =
        'DELETE FROM tb_noticias WHERE id_unidade_fk = :id_unidade AND id_noticia = :id_noticia';

      const id_unidade = rows.unidade_fk;

      void (await database.begin());

      void (await model.executequery(query_del, { id_noticia, id_unidade }));

      void (await database.commit());

      /**********************************************************/

      fs.unlinkSync(path_fotos + rows.foto_capa);
      fs.unlinkSync(path_fotos + rows.foto_i);
      fs.unlinkSync(path_fotos + rows.foto_ii);

      resdata.msg = 'Anexo excluido com sucesso!';

    } catch (error) {
      
      void await database.rollback();

      resdata.num = 99;
      resdata.msg = error.message;
      resdata.status = 500;
    }

    void await database.close();

    res.status(resdata.status).json(resdata);

  }

  static async changeStatus(req, res) {
    
    const resdata = {
      err: 0,
      msg: '',
      status: 200,
      data:[]
    }

    const database = new Database('fsph_cms');

    const { id_noticia, atualStatus } = req.body;

    const newStatus = atualStatus == 0 ? 1 : 0;

    try {

      void await database.connect();

      const model = new DaoModel(database.connection);

      void await database.begin();

      const query = `UPDATE tb_noticias SET ativo= :newStatus WHERE id_noticia= :id_noticia`;

      const dataQuery = { newStatus, id_noticia };

      void await model.executequery(query, dataQuery);

      void await database.commit();

      const queryGet = `SELECT * FROM tb_noticias WHERE ativo=1`

      const rows = await model.executequery(queryGet)
      
      rows.map((dados)=>{
        
        resdata.data.push({
          id_unidade_fk: dados.id_unidade_fk,
          id_noticia: dados.id_noticia,
          dt_noticia: dados.dt_noticia,
          autor_noticia: dados.autor_noticia,
          titulo: dados.titulo,
          texto: dados.texto,
          foto_capa: `data: ${dados.foto_capa_mimetype}; base64, ${dados.foto_capa.toString('base64')}`,
          foto_i: `data: ${dados.foto_i_mimetype}; base64, ${dados.foto_i.toString('base64')}`,
          foto_ii: `data: ${dados.foto_ii_mimetype}; base64, ${dados.foto_ii.toString('base64')}`,
          ativo: dados.ativo,
        })

      })

      resdata.msg = 'alteração feita com sucesso';

    } catch (error) {

      void await database.rollback()

      resdata.status = 500;
      resdata.err = 1;
      resdata.msg = error.message;
    }

    void await database.close();

    res.status(resdata.status).json(resdata);
    
  }
}
