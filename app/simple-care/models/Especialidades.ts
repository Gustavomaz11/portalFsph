export default class Especialidades {

  private _found :boolean = false;
  private _conn :any;

  private _fields = {
    id: 0,
    nome: '',
    prescreve_em: '',
    ativo: 0 
  }

  /**********************************/
  constructor(conn :any) {
    if (!conn) throw new Error('Não foi possivel estabelecer uma conexão com banco de dados.');
    this._conn = conn;
  }
  
  /********************************** */
  get id() :number {
    return this._fields.id;
  }
  set id(id :number) {
    this._fields.id = id;
  }

  /********************************** */
  get nome() :string {
    return this._fields.nome;
  }
  set nome(nome :string) {
    this._fields.nome = nome;
  }

  /********************************** */
  get prescreve_em() :string {
    return this._fields.prescreve_em;
  }
  set prescreve_em(prescreve_em :string) {
    this._fields.prescreve_em = prescreve_em;
  }

  /********************************** */
  get ativo() :number {
    return this._fields.ativo;
  }
  set ativo(ativo :number) {
    this._fields.ativo = ativo;
  }

  /********************************** */
  get found() :boolean {
    return this._found;
  }

  /********************************** */
  async Buscar(id :number) {

    const sql :string = "SELECT * FROM tb_especialidades WHERE id = ?";

    const [rows] :number[] = await this._conn.query(sql, [id]);

    if (rows[0]) {
        this._fields.id = rows[0].id;
        this._fields.nome = rows[0].nome;
        this._fields.prescreve_em = rows[0].prescreve_em;
        this._fields.ativo = rows[0].ativo;
        this._found = true;
    } else {
        this._found = false;
    }

    return this._fields;
    
  }

  /********************************** */
  async Listar(nome :string = '') {

    let sql :string = 'SELECT * FROM tb_especialidades WHERE nome LIKE "%"?"%"';

    const [rows] :number[] = await this._conn.query(sql,[nome]);

    return rows;
    
  }

  /********************************** */
  async Salvar() {

    let sql :string;

    if(this._found) {
        sql = "UPDATE tb_especialidades SET nome = :nome, prescreve_em = :prescreve_em, ativo = :ativo WHERE id = :id";
    } else {
        this._fields.id = await this.NovoId();
        sql = "INSERT INTO tb_especialidades (id,nome,prescreve_em,ativo) VALUES (:id,:nome,:prescreve_em,:ativo)";
    }

    void await this._conn.query(sql,this._fields); 

  }

  /********************************** */
  async Excluir(id :number) {

    let sql :string = "DELETE FROM tb_especialidades WHERE id = ?";

    void await this._conn.query(sql,[id]);

  }

  /********************************** */
  private async NovoId() {

    let sql :string = "SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_especialidades";

    const [rows] :number[] = await this._conn.query(sql);

    return rows[0].newcode;

  }

}