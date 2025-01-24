
export default class TipoAtend {

  private _found :boolean = false
  private _conn :any;
  private _fields = { id: 0, nome: '', ativo: 0 }

  /*****************************************/
  constructor(conn :any) {
    if (!conn) throw new Error('Não foi possivel estabelecer uma conexão com banco de dados.');
    this._conn = conn;
  }

  /*****************************************/
  get found() :boolean {
    return this._found
  }

  /************************************ */
  get id() :number {
    return this._fields.id
  }
  set id(id: number) {
    this._fields.id = id;
  }
  
  /************************************ */
  get nome() :string {
    return this._fields.nome
  }
  set nome(nome: string) {
    this._fields.nome = nome;
  }

  /************************************ */
  get ativo() :number {
    return this._fields.ativo
  }
  set ativo(ativo: number) {
    this._fields.ativo = ativo;
  }
  
 /************************************ */
  async Listar(nome: string) {
    
    let sql: string = 'SELECT * FROM tb_tipo_atendimentos WHERE nome LIKE "%"?"%"';

    const [rows] : number[] = await this._conn.query(sql,[nome]);

    return rows;

  }
  
  async Buscar(id: number) {

    const sql: string = "SELECT * FROM tb_tipo_atendimentos WHERE id = ?";

    const [rows] : number[] = await this._conn.query(sql,[id]);

    if (rows[0]) {
        this._fields.id = rows[0].id;
        this._fields.nome = rows[0].nome;
        this._fields.ativo = rows[0].ativo;
        this._found = true;
    } else {
        this._found = false;
    }

    return this._fields;

  }

  async Salvar() {

    let sql: string;

    if (this._found) {
        sql = "UPDATE tb_tipo_atendimentos SET nome = :nome, ativo = :ativo WHERE id = :id ";
    } else {
        this._fields.id = await this.NovoId();
        sql = "INSERT INTO tb_tipo_atendimentos (id,nome,ativo) VALUES (:id,:nome,:ativo)";
    }

    void await this._conn.query(sql,this._fields);
   
  };

  async Excluir(id :number) {
   
    let sql :string = "DELETE FROM tb_tipo_atendimentos WHERE id = ?";

    void await this._conn.query(sql,[id]);
    
  }

  private async NovoId() {
    
    let sql :string = "SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_tipo_atendimentos";

    const [rows] :number[] = await this._conn.execute(sql);

    return rows[0].newcode;

  };

}