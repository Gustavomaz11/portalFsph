
export default class Leitos {

  private _found :boolean = false;
  private _conn :any;

  private _fields = {
      id: 0,
      enfermaria_id: 0,
      nome: '',
      ocupado: 'NAO',
      ativo: 0
  }
 
  /************************ */
  constructor(conn :any) {
      if (!conn) throw new Error('Não foi possivel estabelecer uma conexão com banco de dados.');
      this._conn = conn;
  }

  /************************ */
  get id() :number {
      return this._fields.id
  }
  set id(id :number) {
      this._fields.id = id;
  }

  /************************ */
  get enfermaria_id() :number {
      return this._fields.enfermaria_id;
  }
  set enfermaria_id(enfermaria_id :number) {
      this._fields.enfermaria_id = enfermaria_id
  }

  /************************ */
  get nome() :string {
      return this._fields.nome;
  }
  set nome(nome :string) {
      this._fields.nome = nome;
  }

  /************************ */
  get ocupado() :string {
      return this._fields.ocupado;
  }
  set ocupado(ocupado :string) {
      this._fields.ocupado = ocupado;
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
  async Buscar(enf_id :number,id :number) {

      let sql :string = `SELECT * FROM tb_leitos WHERE enfermaria_id = ? AND tb_leitos.id = ?`;

      const [rows] :number[] = await this._conn.query(sql, [enf_id,id]);

      if (rows[0]) {
          this._fields.id = rows[0].id;
          this._fields.enfermaria_id = rows[0].enfermaria_id;
          this._fields.nome = rows[0].nome;
          this._fields.ocupado = rows[0].ocupado;
          this._fields.ativo = rows[0].ativo;
          this._found = true;
      } else {
          this._found = false;
      }

      return this._fields;

  }

  async Listar(nome :string = '') {

      let sql :string = `SELECT tb_leitos.*, tb_enfermarias.nome as enfermaria FROM tb_leitos 
      LEFT JOIN tb_enfermarias ON tb_enfermarias.id = tb_leitos.enfermaria_id 
      WHERE tb_leitos.nome LIKE "%"?"%"`;

      const [rows] :number[] = await this._conn.query(sql, [nome]);

      if (!rows) return false;

      return rows;

  }

  async Salvar() {
      
      let sql :string;

      if (this._found) {
          sql = "UPDATE tb_leitos SET nome = :nome, ocupado = :ocupado, ativo = :ativo WHERE enfermaria_id = :enfermaria_id AND id = :id";
      } else {
          this._fields.id = await this.NovoId(this._fields.enfermaria_id)
          sql = "INSERT INTO tb_leitos (id,enfermaria_id,nome,ocupado,ativo) VALUES (:id,:enfermaria_id,:nome,:ocupado,:ativo)";
      }

      void await this._conn.query(sql, this._fields);

  }

  async Excluir(enf_id :number,id :number) {

      let sql :string = "DELETE FROM tb_leitos WHERE enfermaria_id = ? AND id = ?";

      void await this._conn.query(sql, [enf_id,id]);

  }

  private async NovoId(enf_id :number) {

      let sql :string = "SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_leitos WHERE enfermaria_id = ?";

      const [rows] :number[] = await this._conn.query(sql, [enf_id]);

      return rows[0].newcode;

  }

}