export default class Enfermarias {

  private _found :boolean = false;
  private _conn :any;

  private _fields = {
    id: 0,
    nome: '',
    qt_leitos: 0
  }
 
  constructor(conn :any) {
    if (!conn) throw new Error('Não foi possivel estabelecer uma conexão com banco de dados.');
    this._conn = conn;
  }

  /***********************************/
  get id() :number  {
    return this._fields.id;
  }
  set id(id :number) {
    this._fields.id = id;
  }

  /***********************************/
  get nome() :string {
    return this._fields.nome;
  }
  set nome(nome :string) {
    this._fields.nome = nome;
  }

  /***********************************/
  get qt_leitos()  :number {
    return this._fields.qt_leitos;
  }
  set qt_leitos(qt_leitos :number) {
    this._fields.qt_leitos = qt_leitos;
  }

  /***********************************/
  get found() :boolean {
    return this._found;
  }

  /********************************** */
  async Buscar(id :number) {

    let sql :string = "SELECT * FROM tb_enfermarias WHERE id = ?";

    const [rows] :number[] = await this._conn.query(sql, [id]);

    if (rows[0]) {
        this._fields.id = rows[0].id;
        this._fields.nome = rows[0].nome;
        this._fields.qt_leitos = rows[0].qt_leitos;
        this._found = true;
    } else {
        this._found = false;
    }

    return this._fields;
      
  }    

  /********************************** */
  async Listar(nome :string = '') {

    let sql :string = 'SELECT * FROM tb_enfermarias WHERE nome LIKE "%"?"%"';

    const [rows] :number[] =  await this._conn.query(sql,[nome]);

    if(!rows) return false;

    return rows;

  }
  
  async Salvar() {

    let sql :string = '';

    if (this._found) {
      sql = "UPDATE tb_enfermarias SET nome = :nome, qt_leitos = :qt_leitos WHERE id = :id";                
    } else {
        
      this._fields.id = await this.NovoId();
      
      sql = "INSERT INTO tb_enfermarias (id,nome,qt_leitos) VALUES (:id,:nome,:qt_leitos)"
    }

    void await this._conn.query(sql,this._fields)

  }

  async Excluir(id :number) {

    let sql :string = "DELETE FROM tb_enfermarias WHERE id = ?";

    void await this._conn.query(sql,[id]);

  }

  private async NovoId() {

    let sql = "SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_enfermarias";

    const [rows] :number[] = await this._conn.query(sql);

    return rows[0].newcode;

  }

}