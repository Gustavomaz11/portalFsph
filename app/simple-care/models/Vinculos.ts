export default class Vinculos {

  private _found :boolean = false;
  private _conn :any;

  private _fields = {
      id: 0,
      nome: '',
      carga_horaria: 0,
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
  get carga_horaria() :number {
      return this._fields.carga_horaria;
  }
  set carga_horaria(carga_horaria :number) {
      this._fields.carga_horaria = carga_horaria;
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

      let sql :string = "SELECT * FROM tb_vinculos WHERE id = ?"
      
      const [rows] :number[] = await this._conn.query(sql, [id]);

      if (rows[0]) {
          this._fields.id = rows[0].id;
          this._fields.nome = rows[0].nome;
          this._fields.carga_horaria = rows[0].carga_horaria;
          this._fields.ativo = rows[0].ativo;
          this._found = true;
      } else {
          this._found = false;
      }

      return this._fields;
      
  }

  /********************************** */
  async Listar(nome :string = '') {

      let sql :string = 'SELECT * FROM tb_vinculos WHERE nome LIKE "%"?"%"';

      const [rows] :number[] = await this._conn.query(sql,[nome]);
      
      if (!rows) return false;

      return rows;
      
  }

  /********************************** */
  async Salvar() {

      let sql :string;

      if (this._found) {
          sql = "UPDATE tb_vinculos SET nome = :nome, carga_horaria = :carga_horaria, ativo = :ativo WHERE id = :id";
      } else {
          this._fields.id = await this.NovoId();
          sql = "INSERT INTO tb_vinculos (id,nome,carga_horaria,ativo) VALUES (:id,:nome,:carga_horaria,:ativo)";
      }
  
      void await this._conn.query(sql,this._fields);

  }

  /********************************** */
  async Excluir(id :number) {

      let sql :string = "DELETE FROM tb_vinculos WHERE id = ?";

      void await this._conn.query(sql,[id]);

  }

  /********************************** */
  private async NovoId() {

      let sql :string = "SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_vinculos";

      const [rows] :number[] = await this._conn.query(sql);

      return rows[0].newcode;

  }

}