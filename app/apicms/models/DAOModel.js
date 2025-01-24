import Database from "../database/conn.js";

export class Auditoria {

  #auditoria

  constructor() {

    this.#auditoria = new Database('fsph_auth');

  }

  async #executequery(query,fields) {

    let response = null

    void await this.#auditoria.connect();

    const query_check = "SELECT * FROM tb_cfg_auditoria WHERE db_name = :db_name AND tb_name = :tb_name";

    const [row_check] = await this.#auditoria.connection.query(query_check,{db_name: fields.database, tb_name: fields.table});

    switch (fields.operacao) {
      
      case 'SELECT':

        if (row_check[0] && row_check.select) {

          void await this.#auditoria.begin();

          void await this.#auditoria.connection.query(query,fields)

          void await this.#auditoria.commit();

        }
        
        response = rows

        break;
    
      default:

        if (row_check[0] && (row_check[0].insert && fields.operacao == 'INSERT') || (row_check[0].update && fields.operacao == 'UPDATE') || (row_check[0].delete && fields.operacao == 'DELETE')) {

          void await this.#auditoria.begin();

          const [rows] = await this.#auditoria.connection.query(query,fields);

          void await this.#auditoria.commit();

          response = rows

        }

        break;
    }

    void await this.#auditoria.close();

    return response;

  }

  async #nwid() {

    void await this.#auditoria.connect();

    const query = "SELECT IFNULL(MAX(id_audit),0) + 1 as newid FROM tb_auditoria"

    const [rows] = await this.#auditoria.connection.query(query);

    void await this.#auditoria.close()

    return rows[0].newid;

  }

  async saveaudit(user,operation,database,table,data) {

    const date = new Date();
    const id_audit = await this.#nwid();

    const sqlquery = "INSERT INTO tb_auditoria SET date_hour = :date_hour, `user` = :user, `database` = :database, `table` = :table, data = :data, operation = :operation,id_audit = :id_audit";

    void await this.#executequery(sqlquery,{
      id_audit: id_audit,
      date_hour: date.toISOString().substring(0,10) + " " + date.toLocaleTimeString(),
      user: user,
      database: database,
      data: JSON.stringify(data),
      table: table,
      operation: operation
    });

  }

}

export class Unidades extends Auditoria {

  #conn = null;
  #found = null;

  #id_unidade = 0;

  get id_unidade() {
    return this.#id_unidade;
  }

  nm_unidade = '';
   
  constructor(connection) {

    super();

    if (!connection) throw new Error('Conexão invalida !');

    this.#conn = connection;

  }

  async executequery(query,fields) {

    if (query.split(' ')[0].toUpperCase() != "SELECT") {
      throw new Error('Não usar essa função (executequery) para operacões: INSERT ou UPDATE')
    }

    const [rows] = await this.#conn.query(query,fields);

    /*****************************************
    * Auditoria
    ******************************************/
    if (rows) {
    
      void await super.saveaudit('obtneto','SELECT','fsph_cms','tb_unidades',fields);
      
    }

    return rows;

  }

  async findbyid(id_unidade) {

    const query = "SELECT * FROM tb_unidades WHERE id_unidade = :id_unidade";

    const [rows] = await this.#conn.query(query,{id_unidade});

    if (rows[0]) {

      this.#id_unidade = rows[0].id_unidade;
      this.nm_unidade = rows[0].nm_unidade;
      
      this.#found = true;

    } else { 
      this.#found = false
    };

    /**** Auditoria ****/
    if (this.#found) {
      void await super.saveaudit('obtneto','SELECT','fsph_cms','tb_unidades',{id_unidade: this.#id_unidade,nm_unidade: this.nm_unidade});
    }

    return this.#found;
    
  }

  async save() {

    let query = null;

    if (this.#found) {

      query = "UPDATE tb_unidades SET nm_unidade = :nm_unidade WHERE id_unidade = :id_unidade";

    } else {

      this.#id_unidade = await this.newid();

      query = "INSERT INTO tb_unidades SET nm_unidade = :nm_unidade, id_unidade = :id_unidade";

    }

    const fields = {
      id_unidade: this.#id_unidade,
      nm_unidade: this.nm_unidade
    }

    void await this.#conn.query(query,fields);

    /**** Auditoria *****/
    void await super.saveaudit('obtneto',this.#found ? "UPDATE" : "INSERT",'fsph_cms','tb_unidades',fields);

  }

  async newid() {

    const query = "SELECT IFNULL(MAX(id_unidade),0) + 1 as newid FROM tb_unidades"

    const [rows] = await this.#conn.query(query);

    return rows[0].newid;

  }

}

export class Agendamentos extends Auditoria {

  #conn = null;
  #found = null;

  #id_agenda = 0;

  get id_agenda() {
    return this.#id_agenda;
  }

  dt_agenda = "";
  hr_agenda = "";
  tp_agenda = "";
  nome = "";
  email = "";
  contato = "";
  cpf = "";
  turno = "";
  qt_pessoas = 0;

  constructor(connection) {

    super();

    if (!connection) throw new Error('Conexão invalida !');

    this.#conn = connection;

  }

  async executequery(query,fields) {

    if (query.split(' ')[0].toUpperCase() != "SELECT") {
      throw new Error('Não usar essa função (executequery) para operacões: INSERT ou UPDATE')
    }

    const [rows] = await this.#conn.query(query,fields);

    /**** Auditoria ****/
    if (rows) {
      void await super.saveaudit('obtneto','SELECT','fsph_cms','tb_agendamentos',fields);
    }

    return rows;

  }

  async findbyid(id_agenda) {

    const query = "SELECT * FROM tb_agendamentos WHERE id_agenda = :id_agenda";

    const [rows] = await this.#conn.query(query,{id_agenda});

    if (rows[0]) {

      this.#id_agenda = rows[0].id_agenda;
      this.dt_agenda = rows[0].dt_agenda;
      this.hr_agenda = rows[0].hr_agenda;
      this.tp_agenda = rows[0].tp_agenda;
      this.nome = rows[0].nome;
      this.email = rows[0].email;
      this.contato = rows[0].contato;
      this.cpf = rows[0].cpf;
      this.qt_pessoas = rows[0].qt_pessoas

      this.#found = true;

    } else { 
      this.#found = false
    };

    /**** Auditoria ****/
    if (rows[0]) {
      void await super.saveaudit('obtneto','SELECT','fsph_cms','tb_agendamentos',rows[0]);
    }

    return this.#found
    
  }

  async save() {

    let query = null

    if (this.#found) {

      query = `UPDATE tb_agendamentos SET 
      dt_agenda = :dt_agenda,hr_agenda = :hr_agenda, tp_agenda = :tp_agenda,nome = :nome,
      email = :email, contato = :contato, cpf = :cpf, turno = :turno, qt_pessoas = :qt_pessoas
      WHERE id_agenda = :id_agenda`;

    } else {

      this.#id_agenda = await this.newid();

      query = `INSERT INTO tb_unidades SET 
      id_agenda = :id_agenda, dt_agenda = :dt_agenda,hr_agenda = :hr_agenda, tp_agenda = :tp_agenda,
      nome = :nome, email = :email, contato = :contato, cpf = :cpf, turno = :turno, qt_pessoas = :qt_pessoas`;

    }

    const fields = {
      id_agenda: this.#id_agenda,
      dt_agenda: this.dt_agenda,
      hr_agenda: this.hr_agenda,
      tp_agenda: this.tp_agenda,
      nome: this.nome,
      email: this.email,
      contato: this.contato,
      cpf: this.cpf,
      turno: this.turno,
      qt_pessoas: this.qt_pessoas,
    }

    void await this.#conn.query(query,fields);

    /**** Auditoria ****/
    void await super.saveaudit('obtneto',this.#found ? 'UPDATE' : 'INSERT','fsph_cms','tb_agendamentos',fields);
    
  }

  async newid() {

    const query = "SELECT IFNULL(MAX(id_agenda),0) + 1 as newid FROM tb_agendamentos"

    const [rows] = await this.#conn.query(query);

    return rows[0].newid;

  }

}

export class Eventos extends Auditoria {

  #conn = null;
  #found = null;

  #id_evento = 0;

  get id_evento() {
    return this.#id_evento;
  }

  id_unidade_fk = 0;
  dt_evento = '';
  local = '';
  id_aux_evento = 0;

  constructor(connection) {

    super();

    if (!connection) throw new Error('Conexão invalida !');

    this.#conn = connection;

  }

  async executequery(query,fields) {

    if (query.split(' ')[0].toUpperCase() != "SELECT") {
      throw new Error('Não usar essa função (executequery) para operacões: INSERT ou UPDATE')
    }

    const [rows] = await this.#conn.query(query,fields);

    
    /**** Auditoria ****/
    if (rows) {
      void await super.saveaudit('obtneto','SELECT','fsph_cms','tb_agendamentos',fields);
    }

    return rows;

  }

  async findbyid(id_unidade,id_evento) {

    const query = "SELECT * FROM tb_eventos WHERE id_unidade_fk = :id_unidade_fk AND id_evento = :id_evento";

    const [rows] = await this.#conn.query(query,{id_unidade_fk: id_unidade,id_evento});

    if (rows[0]) {

      this.#id_evento = rows[0].id_evento;
      this.id_unidade_fk = rows[0].id_unidade_fk;
      this.dt_evento = rows[0].dt_evento;
      this.local = rows[0].local;
      this.id_aux_evento = rows[0].id_aux_evento;

      this.#found = true;

    } else { 
      this.#found = false
    };

    
    /**** Auditoria ****/
    if (rows[0]) {
      void await super.saveaudit('obtneto','SELECT','fsph_cms','tb_agendamentos',rows[0]);
    }

    return this.#found
    
  }

  async save() {

    let query = null

    if (this.#found) {

      query = `UPDATE tb_eventos SET 
      id_unidade_fk = :id_unidade_fk,dt_evento = :dt_evento, local = :local,id_aux_evento = :id_aux_evento,
      WHERE id_evento = :id_evento`;

    } else {

      this.#id_evento = await this.newid(this.id_unidade_fk);

      query = `INSERT INTO tb_unidades SET 
      id_unidade_fk = :id_unidade_fk,dt_evento = :dt_evento, local = :local,id_aux_evento = :id_aux_evento,id_evento = :id_evento`;

    }

    void await this.#conn.query(query,{
      id_evento: this.#id_evento,
      id_unidade_fk: this.id_unidade_fk,
      dt_evento: this.dt_evento,
      local: this.local,
      id_aux_evento: this.id_aux_evento,
    });

    
    /**** Auditoria ****/
    void await super.saveaudit('obtneto','SELECT','fsph_cms','tb_agendamentos',fields);
    
  }

  async newid(id_unidade) {

    const query = "SELECT IFNULL(MAX(id_evento),0) + 1 as newid FROM tb_eventos WHERE id_unidade_fk = :id_unidade_fk"

    const [rows] = await this.#conn.query(query,{id_unidade_fk: id_unidade});

    return rows[0].newid;

  }

}
