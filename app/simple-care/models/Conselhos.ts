export default class Conselhos {

  private _found :boolean = false;
  private _conn :any;
  private _fields = { id: 0, nm_classe: '', sigla: '', ativo: 0 }
  
  /************************/ 
  constructor(conn :any) {
    if (!conn) throw new Error('Não foi possivel estabelecer uma conexão com banco de dados.');
    this._conn = conn;
  }

  /************************ */    
  get id() :number {
    return this._fields.id;
  }
  set id(id :number) {
    this._fields.id = id;
  }

  /************************ */ 
  get nm_classe() :string {
    return this._fields.nm_classe;
  }
  set nm_classe(nm_classe :string) {
    this._fields.nm_classe = nm_classe;
  }

  /************************ */    
  get sigla() :string {
    return this._fields.sigla;
  }
  set sigla(sigla :string) {
    this._fields.sigla = sigla;
  }

  /************************ */    
  get ativo() :number {
    return this._fields.ativo;
  }
  set ativo(ativo :number) {
    this._fields.ativo = ativo;
  }

  /************************ */    
  get found() :boolean {
    return this._found;
  }

  /************************ */    
  async Buscar(id :number) {

    let sql :string = "SELECT * FROM tb_conselhos WHERE id = ?";

    const [rows] :number[] = await this._conn.query(sql, [id]);

    if (rows[0]) {
        this._fields.id = rows[0].id;
        this._fields.nm_classe = rows[0].nm_classe;
        this._fields.sigla = rows[0].sigla;
        this._fields.ativo = rows[0].ativo;
        this._found = true;
    } else {
        this._found = false;
    }

    return this._fields;

  }

  /********************************* */    
  async Listar(nome :string = '') {

    let sql :string = 'SELECT * FROM tb_conselhos WHERE nm_classe LIKE "%"?"%"';

    const [rows] :number[] = await this._conn.query(sql,[nome]);

    return rows;
  }

  /********************************* */    
  async Salvar() {

    let sql :string;

    if (this._found) {
        sql = "UPDATE tb_conselhos SET nm_classe = :nm_classe, sigla = :sigla, ativo = :ativo WHERE id = :id";
    } else {
        this._fields.id = await this.NovoId();
        sql = "INSERT INTO tb_conselhos (id,nm_classe,sigla,ativo) VALUES (:id,:nm_classe,:sigla,:ativo)"
    }

    void await this._conn.query(sql,this._fields);

  }

  /********************************* */    
  async Excluir(id :number) {

    let sql :string = "DELETE FROM tb_conselhos WHERE id = ?";

    void await this._conn.query(sql,[id]);

  }

  /********************************* */
  private async NovoId() {

      let sql = "SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_conselhos";

      const [rows] :number[] = await this._conn.query(sql);

      return rows[0].newcode;
  }

}