import Database from './database/conn.js';
import { sqlserver } from './database/conn.js'

(async () => {
  
  console.clear()

  const database = new Database('fsph_cms')

  try {

    /***************************************************
    * Coleta dados do SQL Server (Hemovida)
    ***************************************************/
    let request = await sqlserver.connect('hemovida');

    let query = 'SELECT hemocomp,grupoabo,fatorrh FROM View_Estoque_Site'
  
    var {recordset} = await request.query(query);

    const rec_estoque = recordset;

    /******************************************************************************/
    query = `SELECT COUNT(*) AS qtde_doacoes, (GETDATE() - 365) AS Date FROM doacao 
    WHERE (dtatend >= (GETDATE() - 365)) AND (intercorrencia = '999')`
    
    var {recordset} = await request.query(query);
  
    const rec_qtde_doacoes = recordset[0];

    /******************************************************************************/
    query = `SELECT COUNT(*) as qtde_transfusoes FROM Vw_Distrib_Geral`;

    var {recordset} = await request.query(query);
  
    const rec_qtde_transfusoes = recordset[0];

    /******************************************************************************/
    query = "SELECT Ndoacao as qtde_doacoes_ext FROM Vw_doacao_externa"

    var {recordset} = await request.query(query);

    const rec_qtde_doacoes_ext = recordset[0]

    void await sqlserver.close();

    /******************************************************************************/

    
    /************************************************** 
    * Coleta dados do SQL Server (dbAmbu)
    ***************************************************/
    request = await sqlserver.connect('dbambu');

    query = 'SELECT qtde_atendimentos FROM view_qtde_atendimentos'
  
    var {recordset} = await request.query(query);

    const rec_atendimentos = recordset[0];

    void await sqlserver.close();

    /***************************************************
    * Insere Dados Coletados no MySql
    ***************************************************/
    void await database.connect();

    if (!database.connection) throw new Error('Servidor MySql não conectado !');

    void await database.begin();

    /**************************************************/
    let query_mysql = `DELETE FROM tb_interface_estoque WHERE id_interface > 0`;

    void await database.connection.query(query_mysql);

    void await database.connection.query('ALTER TABLE tb_interface_estoque AUTO_INCREMENT = 1');

    rec_estoque.map( async (coleta) => {
   
      const sql = `INSERT INTO tb_interface_estoque SET grupoabo = :grupoabo, fatorrh = :fatorrh, hemocomp = :hemocomp, updated = CURRENT_TIMESTAMP()`

      coleta.grupoabo = coleta.grupoabo.trim();
      coleta.fatorrh = coleta.fatorrh.trim();

      void await database.connection.query(sql,coleta);

    });

    query_mysql = 'DELETE FROM tb_interface_doacoes';

    void await database.connection.query(query_mysql);

    query_mysql = `INSERT INTO tb_interface_doacoes SET 
    id_interface = 1, qtd_doacoes = :qtd_doacoes, 
    qtd_atendimentos = :qtd_atendimentos, 
    qtd_transfusoes = :qtd_transfusoes, qtd_doacoes_ext = :qtd_doacoes_ext`;

    void await database.connection.query(query_mysql,{
      qtd_doacoes: rec_qtde_doacoes.qtde_doacoes,
      qtd_atendimentos: rec_atendimentos.qtde_atendimentos,
      qtd_transfusoes: rec_qtde_transfusoes.qtde_transfusoes,
      qtd_doacoes_ext: rec_qtde_doacoes_ext.qtde_doacoes_ext
    });
    
    /**************************************************/

    void await database.commit();

    console.log("Processo excutado com sucesso!");
    
  } catch (error) {

    void await database.rollback();

    console.log(error)
  } 

  void await database.close();

})()