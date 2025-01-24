export class DaoModel{

  #conn = null;
  
  constructor(conn) {

    if (!conn) throw new Error('no pass connection');

    this.#conn = conn;

  }

  async executequery(query,fields) {

    const [rows] = await this.#conn.query(query,fields);

    return rows;

  }

  async newId(id,table) {

    const query =  `SELECT IFNULL(MAX(${id}),0) + 1 as newid FROM ${table}`;
    const [rows] = await this.#conn.query(query);

    return rows[0].newid;

  }
  
}