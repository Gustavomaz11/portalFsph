type Fields = {
    id: number,
    nome: string,
    ativo: number
}

class TipoAtend {

    private _found : boolean = false;
    private _conn : any;

    private _fields :Fields = {
        id: 0,
        nome: '',
        ativo: 0
    }
        
    /*************************/
    constructor(conn : any) {
        if (!conn) throw new Error('Não foi possivel estabelecer uma conexão com banco de dados.');
        this._conn = conn;
    }

    /************************ */
    get id() :number {
        return this._fields.id;
    }
    set id(id : number) {
        this._fields.id = id;
    }

    /************************ */
    get nome() :string {
        return this._fields.nome;
    }
    set nome(nome :string) {
        this._fields.nome = nome;
    }

    /************************ */
    get ativo() :number {
        return this._fields.ativo;
    }
    set ativo(ativo : number) {
        this._fields.ativo = ativo;
    }

    /************************ */
    get found() :boolean {
        return this._found;
    }

    /************************ */
    async Buscar(id: number)  {

        const sql: string = "SELECT * FROM tb_tipo_atendimentos WHERE id = ?";

        const [rows] :number[] = await this._conn.query(sql,[id]);

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

    /************************ */
    async Listar(nome :string = '') {

        let sql: string = 'SELECT * FROM tb_tipo_atendimentos WHERE nome LIKE "%"?"%"';

        const [rows] : number[] = await this._conn.query(sql,[nome]);

        return rows;

    }

    /************************ */
    async Salvar() {

        let sql: string;

        if (this._found) {
            sql = "UPDATE tb_tipo_atendimentos SET nome = :nome, ativo = :ativo WHERE id = :id ";
        } else {
            this._fields.id = await this.NewCode();
            sql = "INSERT INTO tb_tipo_atendimentos (id,nome,ativo) VALUES (:id,:nome,:ativo)";
        }

        void await this._conn.query(sql,this._fields);
       
    }

    /************************ */
    async Excluir(id :number) {

        let sql :string = "DELETE FROM tb_tipo_atendimentos WHERE id = ?";

        void await this._conn.query(sql,[id]);

    }

    /************************ */
    private async NewCode() {

        let sql :string = "SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_tipo_atendimentos";

        const [rows] : number[] = await this._conn.execute(sql);

        return rows[0].newcode

    }

}

/**********************************************************************************/
class Conselhos {

    private _found :boolean = false;
    private _conn :any;

    private _fields : 
    {
        id: number,
        nm_classe: string,
        sigla: string,
        ativo: number
    }  = 
    {
        id: 0,
        nm_classe: '',
        sigla: '',
        ativo: 0
    }
    
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

    /************************ */    
    async Listar(nome :string = '') {

        let sql :string = 'SELECT * FROM tb_conselhos WHERE nm_classe LIKE "%"?"%"';

        const [rows] :number[] = await this._conn.query(sql,[nome]);

        return rows;
    }

    /************************ */    
    async Salvar() {

        let sql :string;

        if (this._found) {
            sql = "UPDATE tb_conselhos SET nm_classe = :nm_classe, sigla = :sigla, ativo = :ativo WHERE id = :id";
        } else {
            this._fields.id = await this.NewCode();
            sql = "INSERT INTO tb_conselhos (id,nm_classe,sigla,ativo) VALUES (:id,:nm_classe,:sigla,:ativo)"
        }

        void await this._conn.query(sql,this._fields);

    }

    /************************ */    
    async Excluir(id :number) {

        let sql :string = "DELETE FROM tb_conselhos WHERE id = ?";

        void await this._conn.query(sql,[id]);

    }

    /************************ */
    private async NewCode() {

        let sql = "SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_conselhos";

        const [rows] :number[] = await this._conn.query(sql);

        return rows[0].newcode;
    }

}

/**********************************************************************************/
class Leitos{

    private _found :boolean = false;
    private _conn :any;

    private _fields : 
    {
        id: number,
        enfermaria_id: number,
        nome: string,
        ocupado: string,
        ativo: number
    } = 
    {
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
        
        let sql :string = '';

        if (this._found) {
            sql = "UPDATE tb_leitos SET nome = :nome, ocupado = :ocupado, ativo = :ativo WHERE enfermaria_id = :enfermaria_id AND id = :id";
        } else {
            this._fields.id = await this.NewCode(this._fields.enfermaria_id)
            sql = "INSERT INTO tb_leitos (id,enfermaria_id,nome,ocupado,ativo) VALUES (:id,:enfermaria_id,:nome,:ocupado,:ativo)";
        }

        void await this._conn.query(sql, this._fields);

    }

    async Excluir(enf_id :number,id :number) {

        let sql :string = "DELETE FROM tb_leitos WHERE enfermaria_id = ? AND id = ?";

        void await this._conn.query(sql, [enf_id,id]);

    }

    private async NewCode(enf_id :number) {

        let sql :string = "SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_leitos WHERE enfermaria_id = ?";

        const [rows] :number[] = await this._conn.query(sql, [enf_id]);

        return rows[0].newcode;

    }

}

/**********************************************************************************/
class Enfermarias {

    private _found :boolean = false;
    private _conn :any;

    private _fields : 
    {
        id: number,
        nome: string,
        qt_leitos: number
    } = 
    {
        id: 0,
        nome: '',
        qt_leitos: 0
    }
   
    constructor(conn :any) {
        if (!conn) throw new Error('Não foi possivel estabelecer uma conexão com banco de dados.');
        this._conn = conn;
    }

    /***********************************/
    get id() :number {
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
    get qt_leitos() :number {
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

        let sql :string;

        if (this._found) {
            sql = "UPDATE tb_enfermarias SET nome = :nome, qt_leitos = :qt_leitos WHERE id = :id";                
        } else {
            
            this._fields.id = await this.NewCode();
            
            sql = "INSERT INTO tb_enfermarias (id,nome,qt_leitos) VALUES (:id,:nome,:qt_leitos)"
        }

        void await this._conn.query(sql,this._fields)

    }

    async Excluir(id :number) {

        let sql :string = "DELETE FROM tb_enfermarias WHERE id = ?";

        void await this._conn.query(sql,[id]);

    }

    private async NewCode() {

        let sql = "SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_enfermarias";

        const [rows] :number[] = await this._conn.query(sql);

        return rows[0].newcode;

    }

}

/**********************************************************************************/
class Especialidades {

    private _found :boolean = false;
    private _conn :any;

    private _fields : 
    {
        id: number,
        nome: string,
        prescreve_em: string,
        ativo: number 
    } = 
    {
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

        let sql :string = '';

        if(this._found) {
            sql = "UPDATE tb_especialidades SET nome = :nome, prescreve_em = :prescreve_em, ativo = :ativo WHERE id = :id";
        } else {
            this._fields.id = await this.NewCode();
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
    private async NewCode() {

        let sql :string = "SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_especialidades";

        const [rows] :number[] = await this._conn.query(sql)

        return rows[0].newcode;

    }

}

/**********************************************************************************/
class Vinculos {

    private _found :boolean = false;
    private _conn :any;

    private _fields : 
    {
        id: number,
        nome: string,
        carga_horaria: number,
        ativo: number 
    } = 
    {
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

        let sql :string = '';

        if (this._found) {
            sql = "UPDATE tb_vinculos SET nome = :nome, carga_horaria = :carga_horaria, ativo = :ativo WHERE id = :id";
        } else {
            this._fields.id = await this.NewCode();
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
    private async NewCode() {

        let sql :string = "SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_vinculos";

        const [rows] :number[] = await this._conn.query(sql);

        return rows[0].newcode;

    }

}

/**********************************************************************************/
class Profissionais {

    private _found :boolean = false;
    private _conn :any;

    private _fields : 
    {
        id: number,
        nome: string,
        cpf: string,
        conselho_id: number,
        conselho_registro: string,
        uf: string,
        vinculo_id: number,
        especialidade_id: number,
        ativo: number,
        token_assinatura: string
    } = 
    {
        id: 0,
        nome: '',
        cpf: '',
        conselho_id: 0,
        conselho_registro: '',
        uf: '',
        vinculo_id: 0,
        especialidade_id: 0,
        ativo: 0,
        token_assinatura: ''
    }

    /********************************** */
    constructor(conn :any) {
        if (!conn) throw new Error('Não foi possivel estabelecer uma conexão com banco de dados.');
        this._conn = conn;
    }
    
    /********************************** */
    get found() :boolean {
        return this._found;
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
    get cpf() :string {
        return this._fields.cpf;
    }
    set cpf(cpf :string) {
        this._fields.cpf = cpf;
    }

    /********************************** */
    get conselho_id() :number {
        return this._fields.conselho_id;
    }
    set conselho_id(conselho_id :number) {
        this._fields.conselho_id = conselho_id;
    }
    
    /********************************** */
    get conselho_registro() :string {
        return this._fields.conselho_registro;
    }
    set conselho_registro(conselho_registro :string) {
        this._fields.conselho_registro = conselho_registro;
    }

    /********************************** */
    get uf() :string {
        return this._fields.uf;
    }
    set uf(uf :string) {
        this._fields.uf = uf
    }

    /********************************** */
    get vinculo_id() :number {
        return this._fields.vinculo_id;
    }
    set vinculo_id(vinculo_id :number) {
        this._fields.vinculo_id = vinculo_id;
    }
    
    /********************************** */
    get especialidade_id() :number {
        return this._fields.especialidade_id;
    }
    set especialidade_id(especialidade_id :number) {
        this._fields.especialidade_id = especialidade_id;
    }

    /********************************** */
    get ativo() :number {
        return this._fields.ativo;
    }
    set ativo(ativo : number) {
        this._fields.ativo = ativo;
    }

    /********************************** */
     get token_assinatura() :string {
        return this._fields.token_assinatura;
    }
    set token_assinatura(token_assinatura :string) {
        this._fields.token_assinatura = token_assinatura;
    }

    /********************************** */
    async Buscar(id :number) {

        let sql :string = 'SELECT * FROM tb_profissionais WHERE id = ?';

        const [rows] :number[] = await this._conn.query(sql, [id]);

        if (rows[0]) { 
            this._fields.id = rows[0].id;
            this._fields.nome = rows[0].nome;
            this._fields.cpf = rows[0].cpf;
            this._fields.conselho_id = rows[0].conselho_id;
            this._fields.conselho_registro = rows[0].conselho_registro;
            this._fields.vinculo_id = rows[0].vinculo_id;
            this._fields.especialidade_id = rows[0].especialidade_id;
            this._fields.ativo = rows[0].ativo;
            this._fields.token_assinatura = rows[0].token_assinatura;
            this._found = true;
        } else {
            this._found = false;
        }

        return this._fields;
        
    }

    /********************************** */
    async Listar(nome :string = '') {

        let sql :string = `SELECT tb_profissionais.*, sigla FROM tb_profissionais 
        LEFT JOIN tb_conselhos ON tb_conselhos.id = tb_profissionais.conselho_id 
        WHERE nome LIKE "%"?"%"`;

        const [rows] :number[] = await this._conn.query(sql,[nome]);

        return rows;
        
    }

    /********************************** */
    async Salvar() {

        let sql :string;

        if (this._found) {
            sql = `UPDATE tb_profissionais 
            SET nome = :nome, cpf = :cpf, conselho_id = :conselho_id, conselho_registro = :conselho_registro, uf = :uf, 
            vinculo_id = :vinculo_id, especialidade_id = :especialidade_id, ativo = :ativo, token_assinatura = :token_assinatura WHERE id = :id`;
        } else {
            this._fields.id = await this.NewCode();
            sql = `INSERT INTO tb_profissionais (id,nome,cpf,conselho_id,conselho_registro,uf,vinculo_id,especialidade_id,ativo,token_assinatura) 
            VALUES (:id,:nome,:cpf,:conselho_id,:conselho_registro,:uf,:vinculo_id,:especialidade_id,:ativo,:token_assinatura)`
        }

        void await this._conn.query(sql,this._fields);

    }

    /********************************** */
    async Excluir(id :number) {

        let sql :string = "DELETE FROM tb_profissionais WHERE id = ?";

        void await this._conn.query(sql,[id]);

    }

    /********************************** */
    private async NewCode() {

        let sql :string = "SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_profissionais";

        const [rows] :number[] = await this._conn.query(sql);

        return rows[0].newcode;

    }

}

/**********************************************************************************/
class MotivoEncerra {

    private _found :boolean = false;
    private _conn :any;

    private _fields : 
    {
        id: number,
        nome: string,
        ativo: number
    } = 
    {
        id: 0,
        nome: '',
        ativo: 0
    }

    constructor(conn :any) {
        if (!conn) throw new Error('Não foi possivel estabelecer uma conexão com banco de dados.');
        this._conn = conn;
    }

    /****************************** */
    get found() :boolean {
        return this._found;
    }

    /****************************** */
    get id() :number {
        return this._fields.id;
    }
    set id(id :number) {
        this._fields.id = id;
    }

    /****************************** */
    get nome() :string {
        return this._fields.nome;
    }
    set nome(nome :string) {
        this._fields.nome = nome;
    }

    /****************************** */
    get ativo() :number {
        return this._fields.ativo;
    }
    set ativo(ativo :number) {
        this._fields.ativo = ativo;
    }

    /****************************** */
    async Buscar(id :number) {

        let sql :string = 'SELECT * FROM tb_motivo_encerra WHERE id = ?';

        const [rows] :number[] = await this._conn.query(sql,[id]);

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

    async Listar(nome :string = '') {

        let sql :string = 'SELECT * FROM tb_motivo_encerra WHERE nome LIKE "%"?"%"';

        const [rows] :number[] = await this._conn.query(sql,[nome]);

        return rows;
    }

    async Salvar() {

        let sql :string;

        if (this._found) {
            sql = "UPDATE tb_motivo_encerra SET nome = :nome, ativo = :ativo WHERE id = :id";
        } else {
            this._fields.id = await this.NewCode();
            sql = "INSERT INTO tb_motivo_encerra (id,nome,ativo) VALUES (:id,:nome,:ativo)";
        }

        void await this._conn.query(sql,this._fields);

    }

    async Excluir(id :number) {

        let sql :string = "DELETE FROM tb_motivo_encerra WHERE id = ?";

        void await this._conn.query(sql,[id]);

    }

    private async NewCode() {

        let sql :string = "SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_motivo_encerra";

        const [rows] :number[] = await this._conn.query(sql);

        return rows[0].newcode;

    }

}

/**********************************************************************************/
class RegimeAtend { 

    private _found :boolean = false;
    private _conn :any;

    _fields : 
    {
        id: number,
        nome: string,
        ativo: number
    } = 
    {
        id: 0,
        nome: '',
        ativo: 0
    }

    constructor(conn :any) {
        if (!conn) throw new Error('Não foi possivel estabelecer uma conexão com banco de dados.');
        this._conn = conn;  
    }

     /****************************** */
     get found() :boolean {
        return this._found;
    }

    /****************************** */
    get id() :number {
        return this._fields.id;
    }
    set id(id :number) {
        this._fields.id = id;
    }

    /****************************** */
    get nome() :string {
        return this._fields.nome;
    }
    set nome(nome :string) {
        this._fields.nome = nome;
    }

    /****************************** */
    get ativo() :number {
        return this._fields.ativo;
    }
    set ativo(ativo :number) {
        this._fields.ativo = ativo;
    }

    /****************************** */
    async Buscar(id :number) {

        let sql :string = 'SELECT * FROM tb_regime_atend WHERE id = ?'

        const [rows] :number[] = await this._conn.query(sql, [id]);

        if (rows[0]) {
            this._fields.id = rows[0].id;
            this._fields.nome = rows[0].nome;
            this._fields.ativo = rows[0].ativo;
            this._found = true;
        } else {
            this._found = false
        }

        return this._fields;

    }

    /****************************** */
    async Listar(nome :string = '') {

        let sql :string = 'SELECT * FROM tb_regime_atend WHERE nome LIKE "%"?"%"';

        const [rows] :number[] = await this._conn.query(sql,[nome]);

        return rows;
        
    }

    async Salvar() {

        let sql :string;

        if (this._found) {
            sql = "UPDATE tb_regime_atend SET nome = :nome, ativo = :ativo WHERE id = :id";
        } else {
            this._fields.id = await this.NewCode();
            sql = "INSERT INTO tb_regime_atend (id,nome,ativo) VALUES (:id,:nome,:ativo)";
        }
        
        void await this._conn.query(sql,this._fields);

    }

    async Excluir(id :number) {

        let sql :string = "DELETE FROM tb_regime_atend WHERE id = ?";

        void await this._conn.query(sql,[id]);
       
    }

    private async NewCode() {

        let sql :string = "SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_regime_atend";

        const [rows] :number[] = await this._conn.query(sql);

        return rows[0].newcode.toString().length == 1 ? '0' + rows[0].newcode.toString() : rows[0].newcode.toString();
    }

}

/**********************************************************************************/
class Turnos {

    private _found :boolean = false;
    private _conn :any;

    private _fields : 
    {
        id: number,
        nome: string,
        hr_ini: string,
        hr_fin: string,
        ativo: number
    } = 
    {
        id: 0,
        nome: '',
        hr_ini: '',
        hr_fin: '',
        ativo: 0
    }

    constructor(conn :any) {
        if (!conn) throw new Error('Não foi possivel estabelecer uma conexão com banco de dados.');
        this._conn = conn;
    }

    /******************************* */
    get found() :boolean {
        return this._found;
    }

    /******************************* */
    get id() :number {
        return this._fields.id;
    }
    set id(id :number) {
        this._fields.id = id;
    }

    /******************************* */
    get nome() :string {
        return this._fields.nome;
    }
    set nome(nome :string) {
        this._fields.nome = nome;
    }

    /******************************* */
    get hr_ini() :string {
        return this._fields.hr_ini;
    }
    set hr_ini(hr_ini :string) {
        this._fields.hr_ini = hr_ini;
    }

    /******************************* */
    get hr_fin() :string {
        return this._fields.hr_fin;
    }
    set hr_fin(hr_fin :string) {
        this._fields.hr_fin = hr_fin;
    }

    /******************************* */
    get ativo() :number {
        return this._fields.ativo;
    }
    set ativo(ativo :number) {
        this._fields.ativo = ativo;
    }
    
    /******************************* */
    async Buscar(id :number) {

        let sql :string = "SELECT * FROM tb_turnos WHERE id = ?";

        const [rows] :number[] = await this._conn.query(sql, [id]);

        if (rows[0]) {
            this._fields.id = rows[0].id;
            this._fields.nome = rows[0].nome;
            this._fields.hr_ini = rows[0].hr_ini;
            this._fields.hr_fin = rows[0].hr_fin;
            this._fields.ativo = rows[0].ativo;
            this._found = true;
        } else {
            this._found = false;
        }

        return this._fields;
        
    }

    /******************************* */
    async Listar(nome :string = '') {

        let sql :string = 'SELECT * FROM tb_turnos WHERE nome LIKE "%"?"%"';

        const [rows] :number[] = await this._conn.query(sql,[nome]);

        return rows;
                
    }

    /******************************* */
    async Salvar() {

        let sql :string;

        if (this._found) {
            sql = "UPDATE tb_turnos SET nome = :nome, hr_ini = :hr_ini, hr_fin = :hr_fin, ativo = :ativo WHERE id = :id";
        } else {
            this._fields.id = await this.NewCode();
            sql = "INSERT INTO tb_turnos (id,nome,hr_ini,hr_fin,ativo) VALUES (:id,:nome,:hr_ini,:hr_fin,:ativo)";
        }

        void await this._conn.query(sql,this._fields);

    }

    /******************************* */
    async Excluir(id :number) {

        let sql :string = "DELETE FROM tb_turnos WHERE id = ?";

        void await this._conn.query(sql,[id]);

    }

    /******************************* */
    private async NewCode() {

        let sql :string = "SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_turnos";

        const [rows] :number[] = await this._conn.query(sql);

        return rows[0].newcode;

    }

}

/**********************************************************************************/
class Sexos {

    private _found :boolean = false;
    private _id :number = 0;
    private _nome :string = '';
    private _conn :any;

    constructor(conn :any) {
        if (!conn) throw new Error('Não foi possivel estabelecer uma conexão com banco de dados.');
        this._conn = conn;
    }

    get found() :boolean {
        return this._found
    }

    get id() :number {
        return this._id;
    }

    get nome() :string {
        return this._nome
    }

    async Buscar(id :number) {

        let sql :string = 'SELECT * FROM tb_sexos WHERE id = ?'

        const [rows] :number[] = await this._conn.query(sql,[id]);

        if (rows[0]) {
            this._id = rows[0].id;
            this._nome = rows[0].nome;
        }

        return rows[0];

    }

    async Listar() {

        const [rows] :number[] = await this._conn.query('SELECT * FROM tb_sexos');

        return rows;

    }

}

/**********************************************************************************/
class Racas {

    private _id :number = 0;
    private _nome :string = '';
    private _conn :any;

    constructor(conn :any) {

        if (!conn) throw new Error('Não foi possivel estabelecer uma conexão com banco de rows.');

        this._conn = conn;

    }

    get id() :number {
        return this._id;
    }

    get nome() :string {
        return this._nome;
    }

    async Buscar(id :number) {

        let sql :string = 'SELECT * FROM tb_racas WHERE id = ?';

        const [rows] :number[] = await this._conn.query(sql,[id]);

        if (rows[0]) {
            this._id = rows[0].id;
            this._nome = rows[0].nome;
        }

        return rows[0];

    }

    async Listar() {

        let sql :string = 'SELECT * FROM tb_racas';

        const [rows] :number[] = await this._conn.query(sql);

        return rows;

    }

}

/**********************************************************************************/
class Estado_Civis {

    private _id :number = 0;
    private _nome :string = '';
    private _conn :any;

    constructor(conn :any) {

        if (!conn) throw new Error('Não foi possivel estabelecer uma conexão com banco de rows.');

        this._conn = conn;

    }

    get id() :number {
        return this._id;
    }

    get nome() :string {
        return this._nome;
    }

    async Buscar(id :number) {

        let sql :string = 'SELECT * FROM tb_estado_civis WHERE id = ?';

        const [rows] :number[] = await this._conn.query(sql,[id]);

        if (rows[0]) {
            this._id = rows[0].id;
            this._nome = rows[0].nome;
        }

        return rows[0];

    }

    async Listar() {

        let sql :string = 'SELECT * FROM tb_estado_civis';

        const [rows] :number[] = await this._conn.query(sql);

        return rows;

    }

}

/**********************************************************************************/
class Prescricoes {

    private _found :boolean = false;
    private _conn :any;

    private _fields : 
    {
        id: number,
        atend_id: number,
        prof_id: number,
        tipo: string,
        proc_id: number,
        prescricao: string
    } = 
    {
        id: 0,
        atend_id: 0,
        prof_id: 0,
        tipo: '',
        proc_id: 0,
        prescricao: ''
    }

    constructor(conn :any) {
        if (!conn) throw new Error('Não foi possivel estabelecer uma conexão com banco de dados.');
        this._conn = conn;
    }

    /********************************** */
    get found() :boolean {
        return this._found;
    }

    /********************************** */
    set id(id :number) {
        this._fields.id = id;
    }
    get id() :number {
        return this._fields.id;
    }

    /********************************** */
    set atend_id(atend_id :number) {
        this._fields.atend_id = atend_id;
    }
    get atend_id() :number {
        return this._fields.atend_id;
    }

    /********************************** */
    set prof_id(prof_id :number) {
        this._fields.prof_id = prof_id;
    }
    get prof_id() :number {
        return this._fields.prof_id;
    }

    /********************************** */
    set tipo(tipo :string) {
        this._fields.tipo = tipo;
    }
    get tipo() :string {
        return this._fields.tipo;
    }

    /********************************** */
    set proc_id(proc_id :number) {
        this._fields.proc_id = proc_id;
    }
    get proc_id() :number {
        return this._fields.proc_id;
    }

    /********************************** */
    set prescricao(prescricao :string) {
        this._fields.prescricao = prescricao;
    }
    get prescricao() :string {
        return this._fields.prescricao;
    }

    async Buscar(id :number) {

        let sql :string = 'SELECT * FROM tb_prescricoes WHERE id = ?'

        const [rows] :number[] = await this._conn.query(sql,[id]);

        if (rows[0]) {
            this._fields.id = rows[0].id;
            this._fields.atend_id = rows[0].atend_id;
            this._fields.prof_id = rows[0].prof_id;
            this._fields.tipo = rows[0].tipo;
            this._fields.proc_id = rows[0].proc_id;
            this._fields.prescricao = rows[0].prescricao;
            this._found = true;
        } else {
            this._found = false;
        }

        return this._fields;

    }

    async Listar(nome :string = '') {

        let sql :string = 'SELECT * FROM tb_prescricoes WHERE nome LIKE "%"?"%"';

        const [rows] :number[] = await this._conn.query(sql,[nome]);

        return rows;
        
    }

    async Salvar() {

        let sql :string ;

        if (this._found) {
            sql = `UPDATE tb_prescricoes SET prof_id = :prof_id, tipo = :tipo, proc_id = :proc_id, prescricao = :prescricao 
                   WHERE atend_id = :atend_id AND id = :id`;
        } else {
            this._fields.id = await this.NewCode(this._fields.atend_id);
            sql = `INSERT INTO tb_prescricoes (atend_id,id,prof_id,tipo,proc_id,prescricao) 
                   VALUES (:atend_id,:id,:prof_id,:tipo,:proc_id,:prescricao)`
        }

        void await this._conn.query(sql,this._fields);

    }

    async Excluir(atend_id :number,id :number) {

        let sql :string = "DELETE FROM tb_prescricoes WHERE atend_id = ? AND id = ?";

        void await this._conn.query(sql,[atend_id,id]);

    }

    private async NewCode(atend_id :number) {

        let sql :string = "SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_prescricoes WHERE atend_id = ?";

        const [rows] :number[] = await this._conn.query(sql,[atend_id]);

        return rows[0].newcode;

    }

}

/**********************************************************************************/
class Tipo_Prescricao {

    private _found :boolean = false;
    private _conn :any;

    private _fields : 
    {
        id: number,
        codigo: string,
        descricao: string,
        ativo: number
    } = 
    {
        id: 0,
        codigo: '',
        descricao: '',
        ativo: 0
    }

    constructor(conn :any) {
        if (!conn) throw new Error('Não foi possivel estabelecer uma conexão com banco de dados.');
        this._conn = conn;
    }

    /******************************** */
    get found() :boolean {
        return this._found;
    }

    /******************************** */
    set id(id :number) {
        this._fields.id = id;
    }
    get id() :number {
        return this._fields.id
    }

    /******************************** */
    set codigo(codigo :string) {
        this._fields.codigo = codigo;
    }
    get codigo() :string {
        return this._fields.codigo
    }

    /******************************** */
    set descricao(descricao :string) {
        this._fields.descricao = descricao;
    }
    get descricao() :string {
        return this._fields.descricao
    }

    /******************************** */
    set ativo(ativo :number) {
        this._fields.ativo = ativo;
    }
    get ativo() :number {
        return this._fields.ativo
    }

    /******************************** */
    async Listar(nome :string = '') {

        let sql :string = 'SELECT * FROM tb_tipo_prescricao WHERE descricao LIKE "%"?"%"';

        const [rows] :number[] = await this._conn.query(sql,[nome]);

        return rows;

    }

    async Buscar(id :number) {

        let sql :string = 'SELECT * FROM tb_tipo_prescricao WHERE id = ?';

        const [rows] :number[] = await this._conn.query(sql,[id]);

        if (rows[0]) {
            this._fields.id = rows[0].id;
            this._fields.codigo = rows[0].codigo;
            this._fields.descricao = rows[0].descricao;
            this._fields.ativo = rows[0].ativo;
            this._found = true;
        } else {
            this._found = false;
        }

        return this._fields;

    }

    async Salvar() {

        let sql :string

        if (this._found) {
            sql = "UPDATE tb_tipo_prescricao SET codigo = :codigo, descricao = :descricao, ativo = :ativo WHERE id = :id";
        } else {
            this._fields.id = await this.NewCode();
            sql = "INSERT INTO tb_tipo_prescricao (id,codigo,descricao,ativo) VALUES (:id,:codigo,:descricao,:ativo)";
        }

        void await this._conn.query(sql,this._fields);

    }

    async Excluir(id :number) {

        let sql :string = "DELETE FROM tb_tipo_prescricao WHERE id = ?";

        void await this._conn.query(sql,[id]);

    }

    private async NewCode() {

        let sql :string = "SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_tipo_prescricao";

        const [rows] :number[] = await this._conn.query(sql);

        return rows[0].newcode;

    }

}

/**********************************************************************************/
class Procedimentos {

    private _found :boolean = false;
    private _conn :any;

    private _fields : 
    {
        id: number,
        procedimento: string,
        tipo: string,
        bpa_cod: string,
        encaminha_enf: string,
        ativo: number
    } = 
    {
        id: 0,
        procedimento: '',
        tipo: '',
        bpa_cod: '',
        encaminha_enf: '',
        ativo: 0
    }

    constructor(conn :any) {
        if (!conn) throw new Error('Não foi possivel estabelecer uma conexão com banco de dados.');
        this._conn = conn;
    }

    /******************************** */
    get found() :boolean {
        return this._found;
    }

    /******************************** */
    set id(id :number) {
        this._fields.id = id;
    }
    get id() :number {
        return this._fields.id
    }

    /******************************** */
    set procedimento(procedimento :string) {
        this._fields.procedimento = procedimento;
    }
    get procedimento() :string {
        return this._fields.procedimento;
    }

    /******************************** */
    set tipo(tipo :string) {
        this._fields.tipo = tipo;
    }
    get tipo() :string {
        return this._fields.tipo;
    }

    /******************************** */
    set bpa_cod(bpa_cod :string) {
        this._fields.bpa_cod = bpa_cod;
    }
    get bpa_cod() :string {
        return this._fields.bpa_cod;
    }

    /******************************** */
    set ativo(ativo :number) {
        this._fields.ativo = ativo;
    }
    get ativo() :number {
        return this._fields.ativo;
    }

    /******************************** */
    set encaminha_enf(encaminha_enf :string) {
        this._fields.encaminha_enf = encaminha_enf;
    }
    get encaminha_enf() :string {
        return this._fields.encaminha_enf;
    }
    
    /******************************** */
    async Buscar(id :number) {

        let sql :string = 'SELECT * FROM tb_procedimentos WHERE id = ?';

        const [rows] :number[] = await this._conn.query(sql,[id]);

        if (rows[0]) {
            this._fields.id = rows[0].id;
            this._fields.procedimento = rows[0].procedimento;
            this._fields.tipo = rows[0].tipo;
            this._fields.bpa_cod = rows[0].bpa_cod;
            this._fields.encaminha_enf = rows[0].encaminha_enf
            this._fields.ativo = rows[0].ativo;

            this._found = true;
        } else {
            this._found = false;
        }

        return this._fields;

    }

    async Listar(nome :string = '') {

        let sql :string = 'SELECT * FROM tb_procedimentos WHERE procedimento LIKE "%"?"%"';

        const [rows] :number[] = await this._conn.query(sql,[nome]);

        return rows;

    }
   
    async Salvar() {

        let sql :string;

        if (this._found) {
            sql = "UPDATE tb_procedimentos SET procedimento = :procedimento, tipo = :tipo, bpa_cod = :bpa_cod, encaminha_enf = :encaminha_enf ,ativo = :ativo WHERE id = :id";
        } else {
            this._fields.id = await this.NewCode();
            sql = "INSERT INTO tb_procedimentos (id,procedimento,tipo,bpa_cod,encaminha_enf,ativo) VALUES (:id,:procedimento,:tipo,:bpa_cod,:encaminha_enf,:ativo)";
        }

        void await this._conn.query(sql,this._fields);

    }

    async Excluir(id :number) {

        let sql :string = "DELETE FROM tb_procedimentos WHERE id = ?";

        void await this._conn.query(sql,[id]);

    }

    private async NewCode() {

        let sql :string = "SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_procedimentos";

        const [rows] :number[] = await this._conn.query(sql);

        return rows[0].newcode;

    }

}

/**********************************************************************************/
class Tipo_Procedimento {

    private _found :boolean = false;
    private _conn :any;

    private _fields : {id:number,codigo:string,descricao:string,ativo:number} = {
        id: 0,
        codigo: '',
        descricao: '',
        ativo: 0
    }

    constructor(conn :any) {
        if (!conn) throw new Error('Não foi possivel estabelecer uma conexão com banco de dados.');
        this._conn = conn;
    }

    /******************************** */
    get found() :boolean {
        return this._found;
    }

    /******************************** */
    set id(id :number) {
        this._fields.id = id;
    }
    get id() :number {
        return this._fields.id
    }

    /******************************** */
    set codigo(codigo :string) {
        this._fields.codigo = codigo;
    }
    get codigo() :string {
        return this._fields.codigo
    }

    /******************************** */
    set descricao(descricao :string) {
        this._fields.descricao = descricao;
    }
    get descricao() :string {
        return this._fields.descricao
    }

    /******************************** */
    set ativo(ativo :number) {
        this._fields.ativo = ativo;
    }
    get ativo() :number {
        return this._fields.ativo
    }

    /******************************** */
    async Listar(nome :string = '') {

        let sql :string = 'SELECT * FROM tb_tipo_procedimento WHERE descricao LIKE "%"?"%"';

        const [rows] :number[] = await this._conn.query(sql, [nome]);

        return rows;

    }

    async Buscar(id :number) {

        let sql :string = 'SELECT * FROM tb_tipo_procedimento WHERE id = ?'

        const [rows] :number[] = await this._conn.query(sql,[id]);

        if (rows[0]) {
            this._fields.id = rows[0].id;
            this._fields.codigo = rows[0].codigo;
            this._fields.descricao = rows[0].descricao;
            this._fields.ativo = rows[0].ativo;
            this._found = true;
        } else {
            this._found = false;
        }

        return this._fields;

    }

    async Salvar() {

        let sql :string;

        if (this._found) {
            sql = "UPDATE tb_tipo_procedimento SET codigo = :codigo, descricao = :descricao , ativo = :ativo WHERE id = :id";
        } else {
            this._fields.id = await this.NewCode();
            sql = "INSERT INTO tb_tipo_procedimento (id,codigo,descricao,ativo) VALUES (:id,:codigo,:descricao,:ativo)"
        }

        void await this._conn.query(sql,this._fields);

    }

    async Excluir(id :number) {

        let sql :string = "DELETE FROM tb_tipo_procedimento WHERE id = ?";

        void await this._conn.query(sql,[id]);

    }

    private async NewCode() {
        
        let sql :string = "SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_tipo_procedimento";

        const [rows] :number[] = await this._conn.query(sql);

        return rows[0].newcode;

    }

}

/**********************************************************************************/
class Pacientes {

    private _found :boolean = false;
    private _conn :any;

    private _fields : 
    {
        id: number,
        dt_cadastro: string,
        nome: string,
        dt_nasc: string,
        nm_pai: string,
        nm_mae: string,
        raca_id: string,
        sexo_id: string,
        naturalidade: string,
        nacionalidade: string,
        estado_civil_id: string,
        rg_num: string,
        rg_org: string,
        celular_i: string,
        celular_ii: string,
        endereco: string,
        bairro: string,
        cidade: string,
        uf: string,
        cns: string,
        cep: string,
        abo: string,
        tem_alergia: string,
        qual: string,
        cpf: string,
        numero: string,
        email: string,
    } = 
    {
        id: 0,
        dt_cadastro: '',
        nome: '',
        dt_nasc: '',
        nm_pai: '',
        nm_mae: '',
        raca_id: '',
        sexo_id: '',
        naturalidade: '',
        nacionalidade: '',
        estado_civil_id: '',
        rg_num: '',
        rg_org: '',
        celular_i: '',
        celular_ii: '',
        endereco: '',
        bairro: '',
        cidade: '',
        uf: '',
        cns: '',
        cep: '',
        abo: '',
        tem_alergia: '',
        qual: '',
        cpf: '',
        numero: '',
        email: '',
    }
   
    constructor(conn :any) {
        if (!conn) throw new Error('Não foi possivel acessar o banco de dados.');
        this._conn = conn
    }

    /********************************* */
    set id(id :number) {
        this._fields.id = id;
    }
    get id() :number {
        return this._fields.id;
    }

    /********************************* */
    set dt_cadastro(dt_cadastro :string) {
        this._fields.dt_cadastro = dt_cadastro;
    }
    get dt_cadastro() :string {
        return this._fields.dt_cadastro;
    }

    /********************************* */
    set nome(nome :string) {
        this._fields.nome = nome;
    }
    get nome() :string {
        return this._fields.nome;
    }

    /********************************* */
    set dt_nasc(dt_nasc :string) {
        this._fields.dt_nasc = dt_nasc;
    }
    get dt_nasc() :string {
        return this._fields.dt_nasc;
    }

    /********************************* */
    set nm_pai(nm_pai :string) {
        this._fields.nm_pai = nm_pai;
    }
    get nm_pai() :string {
        return this._fields.nm_pai;
    }

    /********************************* */
    set nm_mae(nm_mae :string) {
        this._fields.nm_mae = nm_mae;
    }
    get nm_mae() :string {
        return this._fields.nm_mae;
    }

    /********************************* */
    set raca_id(raca_id :string) {
        this._fields.raca_id = raca_id;
    }
    get raca_id() :string {
        return this._fields.raca_id;
    }

    /********************************* */
    set sexo_id(sexo_id :string) {
        this._fields.sexo_id = sexo_id;
    }
    get sexo_id() :string {
        return this._fields.sexo_id;
    }

    /********************************* */
    set naturalidade(naturalidade :string) {
        this._fields.naturalidade = naturalidade;
    }
    get naturalidade() :string {
        return this._fields.naturalidade;
    }

    /********************************* */
    set nacionalidade(nacionalidade :string) {
        this._fields.nacionalidade = nacionalidade;
    }
    get nacionalidade() :string {
        return this._fields.nacionalidade;
    }

    /********************************* */
    set estado_civil_id(estado_civil_id :string) {
        this._fields.estado_civil_id = estado_civil_id;
    }
    get estado_civil_id() :string {
        return this._fields.estado_civil_id;
    }

    /********************************* */
    set rg_num(rg_num :string) {
        this._fields.rg_num = rg_num;
    }
    get rg_num() :string {
        return this._fields.rg_num
    }

    /********************************* */
    set rg_org(rg_org :string) {
        this._fields.rg_org = rg_org;
    }
    get rg_org() :string {
        return this._fields.rg_org;
    }

    /********************************* */
    set celular_i(celular_i :string) {
        this._fields.celular_i = celular_i;
    }
    get celular_i() :string {
        return this._fields.celular_i;
    }

    /********************************* */
    set celular_ii(celular_ii :string) {
        this._fields.celular_ii = celular_ii;
    }
    get celular_ii() :string {
        return this._fields.celular_ii;
    }

    /********************************* */
    set endereco(endereco :string) {
        this._fields.endereco = endereco;
    }
    get endereco() :string {
        return this._fields.endereco;
    }

    /********************************* */
    set bairro(bairro :string) {
        this._fields.bairro = bairro;
    }
    get bairro() :string {
        return this._fields.bairro;
    }

    /********************************* */
    set cidade(cidade :string) {
        this._fields.cidade = cidade;
    }
    get cidade() :string {
        return this._fields.cidade;
    }
    
    /********************************* */
    set uf(uf :string) {
        this._fields.uf = uf;
    }
    get uf() :string {
        return this._fields.uf;
    }

    /********************************* */
    set cns(cns :string) {
        this._fields.cns = cns;
    }
    get cns() :string {
        return this._fields.cns;
    }

    /********************************* */
    set cep(cep :string) {
        this._fields.cep = cep;
    }
    get cep() :string {
        return this._fields.cep;
    }

    /********************************* */
    set abo(abo :string) {
        this._fields.abo = abo;
    }
    get abo() :string {
        return this._fields.abo;
    }
    
    /********************************* */
    set tem_alergia(tem_alergia :string) {
        this._fields.tem_alergia = tem_alergia;
    }
    get tem_alergia() :string {
        return this._fields.tem_alergia;
    }

    /********************************* */
    set qual(qual :string) {
        this._fields.qual = qual;
    }
    get qual() :string {
        return this._fields.qual;
    }

    /********************************* */
    set cpf(cpf :string) {
        this._fields.cpf = cpf;
    }
    get cpf() :string {
        return this._fields.cpf;
    }

    /********************************* */
    set numero(numero :string) {
        this._fields.numero = numero;
    }
    get numero() :string {
        return this._fields.numero;
    }

    /********************************* */
    set email(email :string) {
        this._fields.email = email;
    }
    get email() :string {
        return this._fields.email;
    }

    get found() :boolean {
        return this._found;
    }

    async Buscar(id :number) {

        let sql :string = 'SELECT * FROM tb_pacientes WHERE id = ?'

        const [rows] :number[] = await this._conn.query(sql, [id]);

        if (rows[0]) {
            this._fields.id = rows[0].id;
            this._fields.dt_cadastro = rows[0].dt_cadastro;
            this._fields.nome = rows[0].nome;
            this._fields.dt_nasc = rows[0].dt_nasc;
            this._fields.nm_pai = rows[0].nm_pai;
            this._fields.nm_mae = rows[0].nm_mae;
            this._fields.raca_id = rows[0].raca_id;
            this._fields.sexo_id = rows[0].sexo_id;
            this._fields.naturalidade = rows[0].naturalidade;
            this._fields.nacionalidade = rows[0].nacionalidade;
            this._fields.estado_civil_id = rows[0].estado_civil_id;
            this._fields.rg_num = rows[0].rg_num;
            this._fields.rg_org = rows[0].rg_org;
            this._fields.celular_i = rows[0].celular_i;
            this._fields.celular_ii = rows[0].celular_ii;
            this._fields.endereco = rows[0].endereco;
            this._fields.bairro = rows[0].bairro;
            this._fields.cidade = rows[0].cidade;
            this._fields.uf = rows[0].uf;
            this._fields.cns = rows[0].cns;
            this._fields.cep = rows[0].cep;
            this._fields.abo = rows[0].abo;
            this._fields.tem_alergia = rows[0].tem_alergia;
            this._fields.qual = rows[0].qual;
            this._fields.cpf = rows[0].cpf;
            this._fields.numero = rows[0].numero;
            this._fields.email = rows[0].email;
            this._found = true;
        } else {
            this._found = false;
        }

        return this._fields;
        
    }

    async Listar(nome :string = '') {

        let sql :string = 'SELECT * FROM tb_pacientes WHERE nome LIKE "%"?"%"';

        const [rows] :number[] = await this._conn.query(sql,[nome]);

        return rows;
        
    }

    async Salvar() {

        let sql :string

        if (this._found) {

            sql = `UPDATE tb_pacientes SET dt_cadastro = :dt_cadastro, nome = :nome, dt_nasc = :dt_nasc, nm_pai = :nm_pai, nm_mae = :nm_mae, 
            raca_id = :raca_id, sexo_id = :sexo_id, naturalidade = :naturalidade, nacionalidade = :nacionalidade, estado_civil_id = :estado_civil_id, 
            rg_num = :rg_num, rg_org = :rg_org, celular_i = :celular_i, celular_ii = :celular_ii, endereco = :endereco, bairro = :bairro, 
            cidade = :cidade, uf = :uf, cns = :cns, cep = :cep, cpf = :cpf, numero = :numero, email = :email WHERE id = :id`

        } else {

            this._fields.id = await this.NewCode();
            
            sql = `INSERT INTO tb_pacientes (id,dt_cadastro,nome,dt_nasc,nm_pai,nm_mae,raca_id,sexo_id,
            naturalidade,nacionalidade,estado_civil_id,rg_num,rg_org,celular_i,celular_ii,endereco,bairro,cidade,
            uf,cns,cep,abo,tem_alergia,qual,cpf,numero,email) VALUES (:id,:dt_cadastro,:nome,:dt_nasc,:nm_pai,:nm_mae,:raca_id,
            :sexo_id,:naturalidade,:nacionalidade,:estado_civil_id,:rg_num,:rg_org,:celular_i,:celular_ii,:endereco,:bairro,:cidade,
            :uf,:cns,:cep,:abo,:tem_alergia,:qual,:cpf,:numero,:email)`;

        }

        void await this._conn.query(sql,this._fields);

    }

    async Excluir(id :number) {

        let sql :string = "DELETE FROM tb_pacientes WHERE id = ?";

        void await this._conn.query(sql,[id]);

    }

    private async NewCode() {

        let sql :string = "SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_pacientes";

        const [rows] :number[] = await this._conn.query(sql);

        return rows[0].newcode;

    }

}

/**********************************************************************************/
class Atendimentos {

    private _found :boolean = false;
    private _conn :any;

    private _fields : 
    {
        id: number,
        data: string,
        tipo_id: number,
        paciente_id: number,
        observacao: string,
        dt_encerra: string,
        dt_admissao: string,
        leito_id: number,
        enfermaria_id: number,
        entidade_id: number,
        regime_atend_id: number,
        situacao: number,
        motivo_encerra_id: number,
        cid_codigo: string,
        acompanhante: string,
        nm_medico_assist: string,
        crm_medico_assist: string,
        esp_medico_assist: string,
        especialidade_atend_id: number,
        preferencia: number
    } = 
    {
        id: 0,
        data: '',
        tipo_id: 0,
        paciente_id: 0,
        observacao: '',
        dt_encerra: '',
        dt_admissao: '',
        leito_id: 0,
        enfermaria_id: 0,
        entidade_id: 0,
        regime_atend_id: 0,
        situacao: 0,
        motivo_encerra_id: 0,
        cid_codigo: '',
        acompanhante: '',
        nm_medico_assist: '',
        crm_medico_assist: '',
        esp_medico_assist: '',
        especialidade_atend_id: 0,
        preferencia: 0
    }

    constructor(conn :any) {
        if (!conn) throw new Error('Não foi possivel acessar o banco de dados.');
        this._conn = conn;
    }

    /************************** */
    get found() :boolean {
        return this._found;
    }

    /************************** */
    set id(id :number) {
        this._fields.id = id;
    }
    get id() :number {
        return this._fields.id;
    }

    /************************** */
    set data(data :string) {
        this._fields.data = data;
    }
    get data() :string {
        return this._fields.data
    }

    /************************** */
    set tipo_id(tipo_id :number) {
        this._fields.tipo_id = tipo_id;
    }
    get tipo_id() :number {
        return this._fields.tipo_id;
    }

    /************************** */
    set paciente_id(paciente_id :number) {
        this._fields.paciente_id = paciente_id;
    }
    get paciente_id() :number {
        return this._fields.paciente_id;
    }

    /************************** */
    set observacao(observacao :string) {
        this._fields.observacao = observacao;
    }
    get observacao() :string {
        return this._fields.observacao;
    }

    /************************** */
    set dt_encerra(dt_encerra :string) {
        this._fields.dt_encerra = dt_encerra;
    }
    get dt_encerra() :string {
        return this._fields.dt_encerra;
    }

    /************************** */
    set dt_admissao(dt_admissao :string) {
        this._fields.dt_admissao = dt_admissao;
    }
    get dt_admissao() :string {
        return this._fields.dt_admissao;
    }

    /************************** */
    set leito_id(leito_id :number) {
        this._fields.leito_id = leito_id;
    }
    get leito_id() :number {
        return this._fields.leito_id;
    }

    /************************** */
    set enfermaria_id(enfermaria_id :number) {
        this._fields.enfermaria_id = enfermaria_id;
    }
    get enfermaria_id() :number {
        return this._fields.enfermaria_id;
    }

    /************************** */
    set entidade_id(entidade_id :number) {
        this._fields.entidade_id = entidade_id;
    }
    get entidade_id() :number {
        return this._fields.entidade_id;
    }

    /************************** */
    set regime_atend_id(regime_atend_id :number) {
        this._fields.regime_atend_id = regime_atend_id;
    }
    get regime_atend_id() :number {
        return this._fields.regime_atend_id;
    }

    /************************** */
    set situacao(situacao :number) {
        this._fields.situacao = situacao;
    }
    get situacao() :number {
        return this._fields.situacao;
    }

    /************************** */
    set motivo_encerra_id(motivo_encerra_id :number) {
        this._fields.motivo_encerra_id = motivo_encerra_id;
    }
    get motivo_encerra_id() :number {
        return this._fields.motivo_encerra_id;
    }

    /************************** */
    set cid_codigo(cid_codigo :string) {
        this._fields.cid_codigo = cid_codigo;
    }
    get cid_codigo() :string {
        return this._fields.cid_codigo;
    }

    /************************** */
    set acompanhante(acompanhante :string) {
        this._fields.acompanhante = acompanhante;
    }
    get acompanhante() :string {
        return this._fields.acompanhante;
    }

    /*************************** */
    set nm_medico_assist(nm_medico_assist :string) {
        this._fields.nm_medico_assist = nm_medico_assist;
    }
    get nm_medico_assist() :string {
        return this._fields.nm_medico_assist;
    }

    /**************************** */
    set crm_medico_assist(crm_medico_assist :string) {
        this._fields.crm_medico_assist = crm_medico_assist;
    }
    get crm_medico_assist() :string {
        return this._fields.crm_medico_assist;
    }

    /*************************** */
    set esp_medico_assist(esp_medico_assist :string) {
        this._fields.esp_medico_assist = esp_medico_assist;
    }
    get esp_medico_assist() :string {
        return this._fields.esp_medico_assist;
    }

    /*************************** */
    set especialidade_atend_id(especialidade_atend_id :number) {
        this._fields.especialidade_atend_id = especialidade_atend_id
    }
    get especialidade_atend_id() :number {
        return this._fields.especialidade_atend_id;
    }

    /*************************** */
    set preferencia(preferencia :number) {
        this._fields.preferencia = preferencia
    }
    get preferencia() :number {
        return this._fields.preferencia;
    }

    /************************** */
    async Buscar(id :number) {

        let sql :string = 'SELECT * FROM tb_atendimentos WHERE id = ?'

        const [rows] :number[] = await this._conn.query(sql, [id]);

        if (rows[0]) {
            this._fields.id = rows[0].id;
            this._fields.data = rows[0].data;
            this._fields.tipo_id = rows[0].tipo_id;
            this._fields.paciente_id = rows[0].paciente_id;
            this._fields.observacao = rows[0].observacao;
            this._fields.dt_encerra = rows[0].dt_encerra;
            this._fields.dt_admissao = rows[0].dt_admissao;
            this._fields.leito_id = rows[0].leito_id;
            this._fields.enfermaria_id = rows[0].enfermaria_id;
            this._fields.entidade_id = rows[0].entidade_id;
            this._fields.regime_atend_id = rows[0].regime_atend_id;
            this._fields.situacao = rows[0].situacao;
            this._fields.motivo_encerra_id = rows[0].motivo_encerra_id;
            this._fields.cid_codigo = rows[0].cid_codigo;
            this._fields.acompanhante = rows[0].acompanhante;
            this._fields.nm_medico_assist = rows[0].nm_medico_assist;
            this._fields.crm_medico_assist = rows[0].crm_medico_assist;
            this._fields.esp_medico_assist = rows[0].esp_medico_assist;
            this._fields.especialidade_atend_id = rows[0].especialidade_atend_id;
            this._fields.preferencia = rows[0].preferencia;
            this._found = true;
        } else {
            this._found = false;
        }

        return this._fields;
        
    }

    async ListarAtendNaoEncerrado(id_paciente :number) {

        let sql :string = 'SELECT id FROM tb_atendimentos WHERE paciente_id = ? AND situacao <> 99';

        const [rows] = await this._conn.query(sql,[id_paciente]);

        return  rows.length > 0;

    }

    async Listar(Nome :string = '', Data_Ini :string, Data_Fin :string) {

        let sql = `SELECT tb_atendimentos.*,tb_pacientes.nome,tb_pacientes.nm_mae, tb_sit_atendimentos.nome as nm_situacao FROM tb_atendimentos 
        LEFT JOIN tb_pacientes ON tb_pacientes.id = tb_atendimentos.paciente_id
        LEFT JOIN tb_sit_atendimentos ON tb_sit_atendimentos.id = tb_atendimentos.situacao
        WHERE tb_pacientes.nome LIKE "%"?"%" AND data BETWEEN ? AND ? AND situacao < 99`;

        const [rows] :number[] = await this._conn.query(sql,[Nome,Data_Ini,Data_Fin]);

        return rows;       
    }

    async ListarAtendConsultorio(Nome :string = '',Situacao :string) {

        let sql = `SELECT tb_atendimentos.*,tb_pacientes.nome,tb_pacientes.nm_mae, tb_pacientes.dt_nasc, tb_sit_atendimentos.nome as nm_situacao FROM tb_atendimentos 
        LEFT JOIN tb_pacientes ON tb_pacientes.id = tb_atendimentos.paciente_id
        LEFT JOIN tb_sit_atendimentos ON tb_sit_atendimentos.id = tb_atendimentos.situacao
        WHERE tb_pacientes.nome LIKE "%"?"%" AND situacao = ? ORDER BY preferencia, tb_atendimentos.id`;

        const [rows] :number[] = await this._conn.query(sql,[Nome,Situacao]);

        return rows;       

    }

    async Salvar() {

        let sql :string;

        if (this._found) {

            sql = `UPDATE tb_atendimentos SET data = :data, tipo_id = :tipo_id, observacao =:observacao, entidade_id = :entidade_id,
                regime_atend_id = :regime_atend_id, acompanhante = :acompanhante, nm_medico_assist = :nm_medico_assist, 
                crm_medico_assist = :crm_medico_assist, esp_medico_assist = :esp_medico_assist, especialidade_atend_id = :especialidade_atend_id  
                WHERE id = :id`

        } else {

            this._fields.id = await this.NewCode();

            sql = `INSERT INTO tb_atendimentos (id,data,tipo_id,paciente_id,observacao,entidade_id,regime_atend_id,
            situacao,acompanhante,nm_medico_assist,crm_medico_assist,esp_medico_assist,especialidade_atend_id) 
            VALUES (:id,:data,:tipo_id,:paciente_id,:observacao,:entidade_id,:regime_atend_id,:situacao,:acompanhante,
            :nm_medico_assist,:crm_medico_assist,:esp_medico_assist,:especialidade_atend_id)`;

        }

        void await this._conn.query(sql,this._fields);

    }

    async Excluir(id :number) {

        let sql :string = "DELETE FROM tb_atendimentos WHERE id = ?";

        void await this._conn.query(sql,[id]);

    }

    private async NewCode() {

        let sql = "SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_atendimentos";

        const [rows] :number[] = await this._conn.query(sql);

        return rows[0].newcode;

    }
}

/**********************************************************************************/
class Exames {
   
    private _conn :any;
    private _found = false;
    
    private _fields : 
    {
        paciente_id : number,
        atend_id: number,
        id: number,
        imagem: any,
        nm_exame: string,
        dt_inclusao: string,
        nm_arquivo: string,
        mimetype: string,
        tipo_arquivo: string
    } = 
    {
        paciente_id : 0,
        atend_id: 0,
        id: 0,
        imagem: 0,
        nm_exame: '',
        dt_inclusao: '',
        nm_arquivo: '',
        mimetype: '',
        tipo_arquivo: ''
    }

    constructor(conn :any) {
        if (!conn) throw new Error('Não foi possivel acessar o banco de dados.');
        this._conn = conn;
    }

    /************************** */
    get found() :boolean {
        return this._found;
    }

    /************************** */
    set paciente_id(paciente_id :number) {
        this._fields.paciente_id = paciente_id;
    }
    get paciente_id() :number {
        return this._fields.paciente_id;
    }

    /************************** */
    set id(id :number) {
        this._fields.id = id;
    }
    get id() :number {
        return this._fields.id;
    }

    /************************** */
    set atend_id(atend_id :number) {
        this._fields.atend_id = atend_id;
    }
    get atend_id() :number {
        return this._fields.atend_id;
    }

    /************************** */
    set nm_exame(nm_exame :string) {
        this._fields.nm_exame = nm_exame;
    }
    get nm_exame() :string {
        return this._fields.nm_exame;
    }

    /************************** */
    set dt_inclusao(dt_inclusao :string) {
        this._fields.dt_inclusao = dt_inclusao;
    }
    get dt_inclusao() :string {
        return this._fields.dt_inclusao;
    }

    /************************** */
    set nm_arquivo(nm_arquivo :string) {
        this._fields.nm_arquivo = nm_arquivo;
    }
    get nm_arquivo() :string {
        return this._fields.nm_arquivo;
    }

    /************************** */
    set imagem (imagem :any) {
        this._fields.imagem = imagem;
    }
    get imagem() :any {
        return this._fields.imagem;
    }

    /************************** */
    set mimetype(mimetype :string) {
        this._fields.mimetype = mimetype;
    }
    get mimetype() :string {
        return this._fields.mimetype;
    }

    /************************** */
    set tipo_arquivo(tipo_arquivo :string) {
        this._fields.tipo_arquivo = tipo_arquivo;
    }
    get tipo_arquivo() :string {
        return this._fields.tipo_arquivo;
    }

    /************************** */
    async Buscar(paciente_id :number,id :number) {

        let sql = 'SELECT * FROM tb_exames WHERE paciente_id = ? AND id = ?'

        const [rows] :number[] = await this._conn.query(sql, [paciente_id,id]);

        if (rows[0]) {

            this._fields.atend_id = rows[0].atend_id;
            this._fields.paciente_id = rows[0].paciente_id;
            this._fields.id = rows[0].id;
            this._fields.nm_exame = rows[0].nm_exame;
            this._fields.dt_inclusao = rows[0].dt_inclusao;
            this._fields.nm_arquivo = rows[0].nm_arquivo;
            this._fields.imagem = rows[0].imagem;
            this._fields.mimetype = rows[0].mimetype;
            this._fields.tipo_arquivo = rows[0].tipo_arquivo;
            this._found = true;
        } else {
            this._found = false;
        }

        return this._fields;
        
    }

    async ListarPorAtend(atend_id :number) {

        let sql = 'SELECT dt_inclusao, id, nm_exame, nm_arquivo FROM tb_exames WHERE atend_id = ?';

        const [rows] :number[] = await this._conn.query(sql,[atend_id]);

        return rows;
       
    }

    async ListarPorPaciente(paciente_id :number) {

        let sql :string = 'SELECT dt_inclusao, id, nm_exame, nm_arquivo FROM tb_exames WHERE paciente_id = ?';

        const [rows] :number[] = await this._conn.query(sql,[paciente_id]);

        return rows;
       
    }

    async Salvar() {

        let sql :string;

        if (this._found) {

            sql = `UPDATE tb_exames SET atend_id = :atend_id, nm_exame = :nm_exame, dt_inclusao = :dt_inclusao, nm_arquivo = :nm_arquivo,
            imagem = :imagem, mimetype = :mimetype, tipo_arquivo = :tipo_arquivo WHERE paciente_id = :paciente_id AND id = :id`

        } else {

            sql = `INSERT INTO tb_exames (paciente_id,atend_id,id,nm_exame,dt_inclusao,nm_arquivo,imagem,mimetype,tipo_arquivo)
            VALUES (:paciente_id,:atend_id,:id,:nm_exame,:dt_inclusao,:nm_arquivo,:imagem,:mimetype,:tipo_arquivo)`
        }

        void await this._conn.query(sql,this._fields);

    }

    async Excluir(atend_id :number,id :number) {

        let sql :string = 'DELETE FROM tb_exames WHERE atend_id = ? AND id = ?';

        void await this._conn.query(sql,[atend_id,id]);

    }

    async NewCode(paciente_id :number) {

        let sql :string = 'SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_exames WHERE paciente_id = ?';

        const [rows] :number[] = await this._conn.query(sql,[paciente_id]);

        return rows[0].newcode;

    }

}

class TabelaCid {

    private _conn :any;
    private _found :boolean = false;

    private _fields :
    {
        id: number,
        codigo: string,
        descricao: string
    } = 
    {        
        id: 0,
        codigo: '',
        descricao: '',
    }

    constructor(conn :any) {
        if (!conn) throw new Error('Não foi possivel acessar o banco de dados.');
        this._conn = conn;
    }

    get found() :boolean {
        return this._found;
    }

    /*********************************** */
    get id() :number {
        return this._fields.id
    }
    set id(id :number) {
        this._fields.id = id
    }

    /*********************************** */
    get codigo() :string {
        return this._fields.codigo
    }
    set codigo(codigo :string) {
        this._fields.codigo = codigo
    }

    /*********************************** */
    get descricao() :string {
        return this._fields.descricao
    }
    set descricao(descricao :string) {
        this._fields.descricao = descricao
    }

    /*********************************** */
    async Buscar(codigo :string) {

        let sql = "SELECT * FROM tb_cid10 WHERE codigo = ?";

        const [rows] :number[] = await this._conn.query(sql,[codigo]);

        if (rows[0]) {
            this._fields.id = rows[0].id;
            this._fields.codigo = rows[0].codigo;
            this._fields.descricao = rows[0].descricao;
            this._found = true;
        } else {
            this._found = false;
        }

        return this._fields;

    }

    /*********************************** */
    async SelecionarCodigo(codigo :string) {

        let sql = "SELECT * FROM tb_cid10 WHERE codigo = ?";

        const [rows] :number[] = await this._conn.query(sql,[codigo]);

        if (rows[0]) {
            this._fields.id = rows[0].id;
            this._fields.codigo = rows[0].codigo;
            this._fields.descricao = rows[0].descricao;
            this._found = true;
        } else {
            this._found = false;
        }

        return this._fields;

    }

    async Listar(nome :string) {

        let sql = 'SELECT * FROM tb_cid10 WHERE descricao LIKE "%"?"%"';

        const [rows] :number[] = await this._conn.query(sql,[nome]);

        return rows;

    }

    async Salvar() {

        let sql :string;

        if (this._found) {
            sql = `UPDATE tb_cid10 SET codigo = :codigo, descricao = :descricao WHERE id = :id`;
        } else {
            this._fields.id = await this.NewCode();
            sql = `INSERT INTO tb_cid10 (id,codigo,descricao) VALUES (:id,:codigo,:descricao)`;
        }

        void await this._conn.query(sql,this._fields)

    }

    async Excluir(id :number) {

        let sql :string = "DELETE FROM tb_cid10 WHERE id = ?";

        void await this._conn.query(sql,[id]);

    }

    private async NewCode() {

        let sql :string = 'SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_cid10';

        const [rows] :number[] = await this._conn.query(sql);

        return rows[0].newcode;

    }

}

class SinaisVitais {

    private _conn :any;
    private _found :boolean = false;

    _fields : { atend_id :number, id :number, press_sistolica :number, press_diastolica :number, freq_card: number, freq_resp: number } = 
    {        
        atend_id: 0,
        id: 0,
        press_sistolica: 0,
        press_diastolica: 0,
        freq_card: 0,
        freq_resp: 0,
    }

    constructor(conn :any) {
        if (!conn) throw new Error('Não foi possivel acessar o banco de dados.');
        this._conn = conn;
    }

    get found() :boolean {
        return this._found;
    }

    /********************************************/
    get atend_id() :number {
        return this._fields.atend_id;
    }
    set atend_id(atend_id :number) {
        this._fields.atend_id = atend_id;
    }

    /********************************************/
    get id() :number {
        return this._fields.id;
    }
    set id(id :number) {
        this._fields.id = id;
    }

    /********************************************/
    get press_sistolica() :number {
        return this._fields.press_sistolica;
    }
    set press_sistolica (press_sistolica :number) {
        this._fields.press_sistolica = press_sistolica;
    }    

    /********************************************/
    get freq_card() :number {
        return this._fields.freq_card;
    }
    set freq_card(freq_card :number) {
        this._fields.freq_card = freq_card;
    }

    /********************************************/
    get freq_resp() :number {
        return this._fields.freq_resp;
    }
    set freq_resp(freq_resp :number) {
        this._fields.freq_resp = freq_resp;
    }

    /*********************************** */
    async Buscar(atend_id :number,id :number) {

        let sql = "SELECT * FROM tb_sinais_vitais WHERE atend_id = ? AND  id = ?";

        const [rows] = await this._conn.query(sql,[atend_id,id]);

        if (rows[0]) {
            this._fields.atend_id = rows[0].atend_id
            this._fields.id = rows[0].id;
            this._fields.press_sistolica = rows[0].press_sistolica;
            this._fields.press_diastolica = rows[0].press_diastolica;
            this._fields.freq_card = rows[0].freq_card;
            this._fields.freq_resp = rows[0].freq_resp;
            this._found = true;
        } else {
            this._found = false;
        }

        return this._fields;

    }

    async Listar(atend_id :number) {

        let sql = 'SELECT * FROM tb_sinais_vitais WHERE atend_id = ?';

        const [rows] = await this._conn.query(sql,[atend_id]);

        return rows;

    }

    async Salvar() {

        let sql :string;

        if (this._found) {
            sql = `UPDATE tb_sinais_vitais 
                   SET press_sistolica = :press_sistolica, press_diastolica = :press_diastolica,
                   freq_card = :freq_card, freq_resp = :freq_resp 
                   WHERE atend_id = :atend_id AND id = :id`;
        } else {
            this._fields.id = await this.NewCode(this._fields.atend_id);
            sql = `INSERT INTO tb_sinais_vitais (atend_id,id,press_sistolica,press_diastolica,freq_card,freq_resp) 
                   VALUES (:atend_id,:id,:press_sistolica,:press_diastolica,:freq_card,:freq_resp)`;
        }

        void await this._conn.query(sql,this._fields)

    }

    async Excluir(atend_id :number,id :number) {

        let sql :string = "DELETE FROM tb_sinais_vitais WHERE atend_id = ? AND id = ?";

        void await this._conn.query(sql,[atend_id,id]);

    }

    private async NewCode(atend_id :number) {

        let sql = 'SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_sinais_vitais WHERE atend_id = ?';

        const [rows] = await this._conn.query(sql,[atend_id]);

        return rows[0].newcode;

    }
}

class EspProcedimentos {

    private _conn :any;
    private _found :boolean = false;

    _fields : {especialidade_id: number, proc_id: number} = {        
        especialidade_id: 0,
        proc_id: 0
    }

    constructor(conn :any) {
        if (!conn) throw new Error('Não foi possivel acessar o banco de dados.');
        this._conn = conn;
    }

    get found() :boolean {
        return this._found;
    }

    /********************************************/
    get especialidade_id() :number {
        return this._fields.especialidade_id;
    }
    set especialidade_id(especialidade_id :number) {
        this._fields.especialidade_id = especialidade_id;
    }

    /********************************************/
    get proc_id() :number {
        return this._fields.proc_id;
    }
    set proc_id(proc_id :number) {
        this._fields.proc_id = proc_id;
    }

    /*********************************** */
    async Buscar(especialidade_id :number,proc_id :number) {

        let sql = "SELECT * FROM tb_esp_procedimento WHERE especialidade_id = ? AND  proc_id = ?";

        const [rows] :number[] = await this._conn.query(sql,[especialidade_id,proc_id]);

        if (rows[0]) {
            this._fields.especialidade_id = rows[0].especialidade_id
            this._fields.proc_id = rows[0].proc_id;
            this._found = true;
        } else {
            this._found = false;
        }

        return this._fields;

    }

    async ListaProcedimento(especialidade_id :number) {

        let sql = `SELECT tb_esp_procedimento.especialidade_id,tb_esp_procedimento.proc_id,tb_procedimentos.procedimento,tb_procedimentos.bpa_cod FROM tb_esp_procedimento 
                   LEFT JOIN tb_procedimentos ON tb_procedimentos.id = tb_esp_procedimento.proc_id
                   WHERE especialidade_id = ?`;

        const [rows] :number[] = await this._conn.query(sql,[especialidade_id]);

        return rows;

    }

    async Salvar() {

        let sql :string = '';

        if (!this._found) {
            sql = `INSERT INTO tb_esp_procedimento (especialidade_id,proc_id) 
                   VALUES (:especialidade_id,:proc_id)`;
        }

        void await this._conn.query(sql,this._fields);

    }

    async Excluir(especialiade_id :number,proc_id :number) {

        let sql = "DELETE FROM tb_esp_procedimento WHERE especialidade_id = ? AND proc_id = ?";

        void await this._conn.query(sql,[especialiade_id,proc_id]);

    }

}

/**********************************************************************************/
export {
    TipoAtend, Conselhos, Enfermarias, Leitos, Especialidades, 
    Vinculos, Profissionais, MotivoEncerra, RegimeAtend, Turnos, 
    Racas, Sexos, Estado_Civis,Tipo_Prescricao, Procedimentos,
    Prescricoes, Tipo_Procedimento, Pacientes, Atendimentos,Exames,
    TabelaCid,SinaisVitais,EspProcedimentos
}