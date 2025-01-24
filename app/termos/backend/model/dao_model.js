export class DaoModel{

  #conn = null;
  
  constructor(conn) {

    this.#conn = conn;

  }

  async executequery(query,fields) {

    const [rows] = await this.#conn.query(query,fields);

    return rows;

  }

  async newId(id,table) {

    const query =  `SELECT IFNULL(MAX(${id}),0) + 1 as newid FROM ${table}`;
    void await this.#conn.query(query);

    return rows.newid;

  }

}