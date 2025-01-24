import database from '../database/conn.js'

class TipoAtend {

    #found = false;
    
    #fields = {
        id: 0,
        nome: '',
        ativo: 0
    }
        
    /*************************/
    constructor() {
        if (!database.connection) throw new Error('Não foi possivel estabelecer uma conexão com banco de dados.');
    }

    /************************ */
    get id() {
        return this.#fields.id;
    }
    set id(id) {
        this.#fields.id = id;
    }

    /************************ */
    get nome() {
        return this.#fields.nome;
    }
    set nome(nome) {
        this.#fields.nome = nome;
    }

    /************************ */
    get ativo() {
        return this.#fields.ativo;
    }
    set ativo(ativo) {
        this.#fields.ativo = ativo;
    }

    /************************ */
    get found() {
        return this.#found;
    }

    /************************ */
    async Buscar(id) {

        const sql = "SELECT * FROM tb_tipo_atendimentos WHERE id = ?";

        const [rows] = await database.connection.query(sql,[id]);

        if (rows[0]) {
            this.#fields.id = rows[0].id;
            this.#fields.nome = rows[0].nome;
            this.#fields.ativo = rows[0].ativo;
            this.#found = true;
        } else {
            this.#found = false;
        }

        return this.#fields;
    }

    /************************ */
    async Listar(nome = '') {

        let sql = 'SELECT * FROM tb_tipo_atendimentos WHERE nome LIKE "%"?"%"';

        const [rows] = await database.connection.query(sql,[nome]);

        return rows;

    }

    /************************ */
    async Salvar() {

        let sql = '';

        if (this.#found) {
            sql = "UPDATE tb_tipo_atendimentos SET nome = :nome, ativo = :ativo WHERE id = :id ";
        } else {
            this.#fields.id = await this.#NewCode();
            sql = "INSERT INTO tb_tipo_atendimentos (id,nome,ativo) VALUES (:id,:nome,:ativo)";
        }

        void await database.connection.execute(sql,this.#fields);
       
    }

    /************************ */
    async Excluir(id) {

        let sql = "DELETE FROM tb_tipo_atendimentos WHERE id = ?";

        void await database.connection.execute(sql,[id]);

    }

    /************************ */
    async #NewCode() {

        let sql = "SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_tipo_atendimentos";

        const [rows] = await database.connection.query(sql);

        return rows[0].newcode

    }

}

/**********************************************************************************/
class Conselhos {

    #found = false;
    
    #fields = {
        id: 0,
        nm_classe: '',
        sigla: '',
        ativo: ''
    }
    
    /************************/ 
    constructor() {
        if (database.connection) throw new Error('Não foi possivel estabelecer uma conexão com banco de dados.');        
    }

    /************************ */    
    get id() {
        return this.#fields.id;
    }
    set id(id) {
        this.#fields.id = id;
    }

    /************************ */ 
    get nm_classe() {
        return this.#fields.nm_classe;
    }
    set nm_classe(nm_classe) {
        this.#fields.nm_classe = nm_classe;
    }

    /************************ */    
    get sigla() {
        return this.#fields.sigla;
    }
    set sigla(sigla) {
        this.#fields.sigla = sigla;
    }

    /************************ */    
    get ativo() {
        return this.#fields.ativo;
    }
    set ativo(ativo) {
        this.#fields.ativo = ativo;
    }

    /************************ */    
    get found() {
        return this.#found;
    }

    /************************ */    
    async Buscar(id) {

        let sql = "SELECT * FROM tb_conselhos WHERE id = ?";

        const [rows] = await database.connection.query(sql, [id]);

        if (rows[0]) {
            this.#fields.id = rows[0].id;
            this.#fields.nm_classe = rows[0].nm_classe;
            this.#fields.sigla = rows[0].sigla;
            this.#fields.ativo = rows[0].ativo;
            this.#found = true;
        } else {
            this.#found = false;
        }

        return this.#fields;

    }

    /************************ */    
    async Listar(nome = '') {

        let sql = 'SELECT * FROM tb_conselhos WHERE nm_classe LIKE "%"?"%"';

        const [rows] = await database.connection.query(sql,[nome]);

        return rows;
    }

    /************************ */    
    async Salvar() {

        let sql = "";

        if (this.#found) {
            sql = "UPDATE tb_conselhos SET nm_classe = :nm_classe, sigla = :sigla, ativo = :ativo WHERE id = :id";
        } else {
            this.#fields.id = await this.#NewCode();
            sql = "INSERT INTO tb_conselhos (id,nm_classe,sigla,ativo) VALUES (:id,:nm_classe,:sigla,:ativo)"
        }

        void await database.connection.execute(sql,this.#fields);

    }

    /************************ */    
    async Excluir(id) {

        let sql = "DELETE FROM tb_conselhos WHERE id = ?";

        void await database.connection.execute(sql,[id]);

    }

    /************************ */
    async #NewCode() {

        let sql = "SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_conselhos";

        const [rows] = await database.connection.query(sql);

        return rows[0].newcode;
    }

}

/**********************************************************************************/
class Leitos{

    #found = false;
   
    #fields = {
        id: 0,
        enfermaria_id: 0,
        nome: '',
        ocupado: 'NAO',
        ativo: 0
    }
   
    /************************ */
    constructor() {
        if (!database.connection) throw new Error('Não foi possivel estabelecer uma conexão com banco de dados.');
    }

    /************************ */
    get id() {
        return this.#fields.id
    }
    set id(id) {
        this.#fields.id = id;
    }

    /************************ */
    get enfermaria_id() {
        return this.#fields.enfermaria_id;
    }
    set enfermaria_id(enfermaria_id) {
        this.#fields.enfermaria_id = enfermaria_id
    }

    /************************ */
    get nome() {
        return this.#fields.nome;
    }
    set nome(nome) {
        this.#fields.nome = nome;
    }

    /************************ */
    get ocupado() {
        return this.#fields.ocupado;
    }
    set ocupado(ocupado) {
        this.#fields.ocupado = ocupado;
    }

    /************************ */
    get ativo() {
        return this.#fields.ativo;
    }
    set ativo(ativo) {
        this.#fields.ativo = ativo;
    }

    /************************ */
    get found() {
        return this.#found;
    }

    /************************ */
    async Buscar(enf_id,id) {

        let sql = `SELECT * FROM tb_leitos WHERE enfermaria_id = ? AND tb_leitos.id = ?`;

        const [rows] = await database.connection.query(sql, [enf_id,id]);

        if (rows[0]) {
            this.#fields.id = rows[0].id;
            this.#fields.enfermaria_id = rows[0].enfermaria_id;
            this.#fields.nome = rows[0].nome;
            this.#fields.ocupado = rows[0].ocupado;
            this.#fields.ativo = rows[0].ativo;
            this.#found = true;
        } else {
            this.#found = false;
        }

        return this.#fields;

    }

    async Listar(nome = '') {

        let sql = `SELECT tb_leitos.*, tb_enfermarias.nome as enfermaria FROM tb_leitos 
        LEFT JOIN tb_enfermarias ON tb_enfermarias.id = tb_leitos.enfermaria_id 
        WHERE tb_leitos.nome LIKE "%"?"%"`;

        const [rows] = await database.connection.query(sql, [nome]);

        if (!rows) return false;

        return rows;

    }

    async Salvar() {
        
        let sql = '';

        if (this.#found) {
            sql = "UPDATE tb_leitos SET nome = :nome, ocupado = :ocupado, ativo = :ativo WHERE enfermaria_id = :enfermaria_id AND id = :id";
        } else {
            this.#fields.id = await this.#NewCode(this.#fields.enfermaria_id)
            sql = "INSERT INTO tb_leitos (id,enfermaria_id,nome,ocupado,ativo) VALUES (:id,:enfermaria_id,:nome,:ocupado,:ativo)";
        }

        void await database.connection.execute(sql, this.#fields);

    }

    async Excluir(enf_id,id) {

        let sql = "DELETE FROM tb_leitos WHERE enfermaria_id = ? AND id = ?";

        void await database.connection.execute(sql, [enf_id,id]);

    }

    async #NewCode(enf_id) {

        let sql = "SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_leitos WHERE enfermaria_id = ?";

        const [rows] = await database.connection.query(sql, [enf_id]);

        return rows[0].newcode;

    }

}

/**********************************************************************************/
class Enfermarias {

    #found = false;
    
    #fields = {
        id: 0,
        nome: '',
        qt_leitos: 0
    }
   
    constructor() {
        if (!database.connection) throw new Error('Não foi possivel estabelecer uma conexão com banco de dados.');
    }

    /***********************************/
    get id() {
        return this.#fields.id;
    }
    set id(id) {
        this.#fields.id = id;
    }

    /***********************************/
    get nome() {
        return this.#fields.nome;
    }
    set nome(nome) {
        this.#fields.nome = nome;
    }

    /***********************************/
    get qt_leitos() {
        return this.#fields.qt_leitos;
    }
    set qt_leitos(qt_leitos) {
        this.#fields.qt_leitos = qt_leitos;
    }

    /***********************************/
    get found() {
        return this.#found;
    }

    /********************************** */
    async Buscar(id) {

        let sql = "SELECT * FROM tb_enfermarias WHERE id = ?";

        const [rows] = await database.connection.query(sql, [id]);

        if (rows[0]) {
            this.#fields.id = rows[0].id;
            this.#fields.nome = rows[0].nome;
            this.#fields.qt_leitos = rows[0].qt_leitos;
            this.#found = true;
        } else {
            this.#found = false;
        }

        return this.#fields;
        
    }    

    /********************************** */
    async Listar(nome = '') {

        let sql = 'SELECT * FROM tb_enfermarias WHERE nome LIKE "%"?"%"';

        const [rows] =  await database.connection.query(sql,[nome]);

        if(!rows) return false;

        return rows;

    }
    
    async Salvar() {

        let sql = '';

        if (this.#found) {
            sql = "UPDATE tb_enfermarias SET nome = :nome, qt_leitos = :qt_leitos WHERE id = :id";                
        } else {
            
            this.#fields.id = await this.#NewCode();
            
            sql = "INSERT INTO tb_enfermarias (id,nome,qt_leitos) VALUES (:id,:nome,:qt_leitos)"
        }

        void await database.connection.execute(sql,this.#fields)

    }

    async Excluir(id) {

        let sql = "DELETE FROM tb_enfermarias WHERE id = ?";

        void await database.connection.execute(sql,[id]);

    }

    async #NewCode() {

        let sql = "SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_enfermarias";

        const [rows] = await database.connection.query(sql);

        return rows[0].newcode;

    }

}

/**********************************************************************************/
class Especialidades {

    #found = false;
   
    #fields = {
        id: 0,
        nome: '',
        prescreve_em: '',
        ativo: 0 
    }

    /**********************************/
    constructor() {
        if (!database.connection) throw new Error('Não foi possivel estabelecer uma conexão com banco de dados.');
    }
    
    /********************************** */
    get id() {
        return this.#fields.id;
    }
    set id(id) {
        this.#fields.id = id;
    }

    /********************************** */
    get nome() {
        return this.#fields.nome;
    }
    set nome(nome) {
        this.#fields.nome = nome;
    }

    /********************************** */
    get prescreve_em() {
        return this.#fields.prescreve_em;
    }
    set prescreve_em(prescreve_em) {
        this.#fields.prescreve_em = prescreve_em;
    }

    /********************************** */
    get ativo() {
        return this.#fields.ativo;
    }
    set ativo(ativo) {
        this.#fields.ativo = ativo;
    }

    /********************************** */
    get found() {
        return this.#found;
    }

    /********************************** */
    async Buscar(id) {

        const sql = "SELECT * FROM tb_especialidades WHERE id = ?";

        const [rows] = await database.connection.query(sql, [id]);

        if (rows[0]) {
            this.#fields.id = rows[0].id;
            this.#fields.nome = rows[0].nome;
            this.#fields.prescreve_em = rows[0].prescreve_em;
            this.#fields.ativo = rows[0].ativo;
            this.#found = true;
        } else {
            this.#found = false;
        }

        return this.#fields;
        
    }

    /********************************** */
    async Listar(nome = '') {

        let sql = 'SELECT * FROM tb_especialidades WHERE nome LIKE "%"?"%"';

        const [rows] = await database.connection.query(sql,[nome]);

        return rows;
        
    }

    /********************************** */
    async Salvar() {

        let sql = '';

        if(this.#found) {
            sql = "UPDATE tb_especialidades SET nome = :nome, prescreve_em = :prescreve_em, ativo = :ativo WHERE id = :id";
        } else {
            this.#fields.id = await this.#NewCode();
            sql = "INSERT INTO tb_especialidades (id,nome,prescreve_em,ativo) VALUES (:id,:nome,:prescreve_em,:ativo)";
        }
    
        void await database.connection.execute(sql,this.#fields); 

    }

    /********************************** */
    async Excluir(id) {

        let sql = "DELETE FROM tb_especialidades WHERE id = ?";

        void await database.connection.execute(sql,[id]);

    }

    /********************************** */
    async #NewCode() {

        let sql = "SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_especialidades";

        const [rows] = await database.connection.query(sql)

        return rows[0].newcode;

    }

}

/**********************************************************************************/
class Vinculos {

    #found = false;
  
    #fields = {
        id: 0,
        nome: '',
        carga_horaria: 0,
        ativo: 0
    }

    /**********************************/
     constructor() {
        if (!database.connection) throw new Error('Não foi possivel estabelecer uma conexão com banco de dados.');
    }    

    /********************************** */
    get id() {
        return this.#fields.id;
    }
    set id(id) {
        this.#fields.id = id;
    }

    /********************************** */
    get nome() {
        return this.#fields.nome;
    }
    set nome(nome) {
        this.#fields.nome = nome;
    }

    /********************************** */
    get carga_horaria() {
        return this.#fields.carga_horaria;
    }
    set carga_horaria(carga_horaria) {
        this.#fields.carga_horaria = carga_horaria;
    }

    /********************************** */
    get ativo() {
        return this.#fields.ativo;
    }
    set ativo(ativo) {
        this.#fields.ativo = ativo;
    }

    /********************************** */
    get found() {
        return this.#found;
    } 

    /********************************** */
    async Buscar(id) {

        let sql = "SELECT * FROM tb_vinculos WHERE id = ?"
        
        const [rows] = await database.connection.query(sql, [id]);

        if (rows[0]) {
            this.#fields.id = rows[0].id;
            this.#fields.nome = rows[0].nome;
            this.#fields.carga_horaria = rows[0].carga_horaria;
            this.#fields.ativo = rows[0].ativo;
            this.#found = true;
        } else {
            this.#found = false;
        }

        return this.#fields;
        
    }

    /********************************** */
    async Listar(nome = '') {

        let sql = 'SELECT * FROM tb_vinculos WHERE nome LIKE "%"?"%"';

        const [rows] = await database.connection.query(sql,[nome]);
        
        if (!rows) return false;

        return rows;
        
    }

    /********************************** */
    async Salvar() {

        let sql = '';

        if (this.#found) {
            sql = "UPDATE tb_vinculos SET nome = :nome, carga_horaria = :carga_horaria, ativo = :ativo WHERE id = :id";
        } else {
            this.#fields.id = await this.#NewCode();
            sql = "INSERT INTO tb_vinculos (id,nome,carga_horaria,ativo) VALUES (:id,:nome,:carga_horaria,:ativo)";
        }
    
        void await database.connection.execute(sql,this.#fields);

    }

    /********************************** */
    async Excluir(id) {

        let sql = "DELETE FROM tb_vinculos WHERE id = ?";

        void await database.connection.execute(sql,[id]);

    }

    /********************************** */
    async #NewCode() {

        let sql = "SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_vinculos";

        const [rows] = await database.connection.query(sql);

        return rows[0].newcode;

    }

}

/**********************************************************************************/
class Profissionais {

    #found = false;
   
    #fields = {
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
    constructor() {
        if (!database.connection) throw new Error('Não foi possivel estabelecer uma conexão com banco de dados.');
    }
    
    /********************************** */
    get found() {
        return this.#found;
    }
    
    /********************************** */
    get id() {
        return this.#fields.id;
    }
    set id(id) {
        this.#fields.id = id;
    }

    /********************************** */
    get nome() {
        return this.#fields.nome;
    }
    set nome(nome) {
        this.#fields.nome = nome;
    }

    /********************************** */
    get cpf() {
        return this.#fields.cpf;
    }
    set cpf(cpf) {
        this.#fields.cpf = cpf;
    }

    /********************************** */
    get conselho_id() {
        return this.#fields.conselho_id;
    }
    set conselho_id(conselho_id) {
        this.#fields.conselho_id = conselho_id;
    }
    
    /********************************** */
    get conselho_registro() {
        return this.#fields.conselho_registro;
    }
    set conselho_registro(conselho_registro) {
        this.#fields.conselho_registro = conselho_registro;
    }

    /********************************** */
    get uf() {
        return this.#fields.uf;
    }
    set uf(uf) {
        this.#fields.uf = uf
    }

    /********************************** */
    get vinculo_id() {
        return this.#fields.vinculo_id;
    }
    set vinculo_id(vinculo_id) {
        this.#fields.vinculo_id = vinculo_id;
    }
    
    /********************************** */
    get especialidade_id() {
        return this.#fields.especialidade_id;
    }
    set especialidade_id(especialidade_id) {
        this.#fields.especialidade_id = especialidade_id;
    }

    /********************************** */
    get ativo() {
        return this.#fields.ativo;
    }
    set ativo(ativo) {
        this.#fields.ativo = ativo;
    }

    /********************************** */
     get token_assinatura() {
        return this.#fields.token_assinatura;
    }
    set token_assinatura(token_assinatura) {
        this.#fields.token_assinatura = token_assinatura;
    }

    /********************************** */
    async Buscar(id) {

        let sql = 'SELECT * FROM tb_profissionais WHERE id = ?';

        const [rows] = await database.connection.query(sql, [id]);

        if (rows[0]) { 
            this.#fields.id = rows[0].id;
            this.#fields.nome = rows[0].nome;
            this.#fields.cpf = rows[0].cpf;
            this.#fields.conselho_id = rows[0].conselho_id;
            this.#fields.conselho_registro = rows[0].conselho_registro;
            this.#fields.vinculo_id = rows[0].vinculo_id;
            this.#fields.especialidade_id = rows[0].especialidade_id;
            this.#fields.ativo = rows[0].ativo;
            this.#fields.token_assinatura = rows[0].token_assinatura;
            this.#found = true;
        } else {
            this.#found = false;
        }

        return this.#fields;
        
    }

    /********************************** */
    async Listar(nome = '') {

        let sql = 'SELECT tb_profissionais.*, sigla FROM tb_profissionais ';
        sql += 'LEFT JOIN tb_conselhos ON tb_conselhos.id = tb_profissionais.conselho_id ';
        sql += 'WHERE nome LIKE "%"?"%"';

        const [rows] = await database.connection.query(sql,[nome]);

        return rows;
        
    }

    /********************************** */
    async Salvar() {

        let sql = '';

        if (this.#found) {
            sql = `UPDATE tb_profissionais 
            SET nome = :nome, cpf = :cpf, conselho_id = :conselho_id, conselho_registro = :conselho_registro, uf = :uf, 
            vinculo_id = :vinculo_id, especialidade_id = :especialidade_id, ativo = :ativo, token_assinatura = :token_assinatura WHERE id = :id`;
        } else {
            this.#fields.id = await this.#NewCode();
            sql = `INSERT INTO tb_profissionais (id,nome,cpf,conselho_id,conselho_registro,uf,vinculo_id,especialidade_id,ativo,token_assinatura) 
            VALUES (:id,:nome,:cpf,:conselho_id,:conselho_registro,:uf,:vinculo_id,:especialidade_id,:ativo,:token_assinatura)`
        }

        void await database.connection.execute(sql,this.#fields);

    }

    /********************************** */
    async Excluir(id) {

        let sql = "DELETE FROM tb_profissionais WHERE id = ?";

        void await database.connection.execute(sql,[id]);

    }

    /********************************** */
    async #NewCode() {

        let sql = "SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_profissionais";

        const [rows] = await database.connection.query(sql);

        return rows[0].newcode;

    }

}

/**********************************************************************************/
class MotivoEncerra {

    #found = false;
  
    #fields = {
        id: 0,
        nome: '',
        ativo: 0
    }

    constructor() {
        if (!database.connection) throw new Error('Não foi possivel estabelecer uma conexão com banco de dados.');
    }

    /****************************** */
    get found() {
        return this.#found;
    }

    /****************************** */
    get id() {
        return this.#fields.id;
    }
    set id(id) {
        this.#fields.id = id;
    }

    /****************************** */
    get nome() {
        return this.#fields.nome;
    }
    set nome(nome) {
        this.#fields.nome = nome;
    }

    /****************************** */
    get ativo() {
        return this.#fields.ativo;
    }
    set ativo(ativo) {
        this.#fields.ativo = ativo;
    }

    /****************************** */
    async Buscar(id) {

        let sql = 'SELECT * FROM tb_motivo_encerra WHERE id = ?';

        const [rows] = await database.connection.query(sql,[id]);

        if (rows[0]) {
            this.#fields.id = rows[0].id;
            this.#fields.nome = rows[0].nome;
            this.#fields.ativo = rows[0].ativo;
            this.#found = true;
        } else {
            this.#found = false;
        }

        return this.#fields;
        
    }

    async Listar(nome = '') {

        let sql = 'SELECT * FROM tb_motivo_encerra WHERE nome LIKE "%"?"%"';

        const [rows] = await database.connection.query(sql,[nome]);

        return rows;
    }

    async Salvar() {

        let sql = '';

        if (this.#found) {
            sql = "UPDATE tb_motivo_encerra SET nome = :nome, ativo = :ativo WHERE id = :id";
        } else {
            this.#fields.id = await this.#NewCode();
            sql = "INSERT INTO tb_motivo_encerra (id,nome,ativo) VALUES (:id,:nome,:ativo)";
        }

        void await database.connection.execute(sql,this.#fields);

    }

    async Excluir(id) {

        let sql = "DELETE FROM tb_motivo_encerra WHERE id = ?";

        void await database.connection.execute(sql,[id]);

    }

    async #NewCode() {

        let sql = "SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_motivo_encerra";

        const [rows] = await database.connection.query(sql);

        return rows[0].newcode;

    }

}

/**********************************************************************************/
class RegimeAtend { 

    #found = false;
    
    #fields = {
        id: 0,
        nome: '',
        ativo: 0
    }

    constructor() {
        if (!database.connection) throw new Error('Não foi possivel estabelecer uma conexão com banco de dados.');
    }

     /****************************** */
     get found() {
        return this.#found;
    }

    /****************************** */
    get id() {
        return this.#fields.id;
    }
    set id(id) {
        this.#fields.id = id;
    }

    /****************************** */
    get nome() {
        return this.#fields.nome;
    }
    set nome(nome) {
        this.#fields.nome = nome;
    }

    /****************************** */
    get ativo() {
        return this.#fields.ativo;
    }
    set ativo(ativo) {
        this.#fields.ativo = ativo;
    }

    /****************************** */
    async Buscar(id) {

        let sql = 'SELECT * FROM tb_regime_atend WHERE id = ?'

        const [rows] = await database.connection.query(sql, [id]);

        if (rows[0]) {
            this.#fields.id = rows[0].id;
            this.#fields.nome = rows[0].nome;
            this.#fields.ativo = rows[0].ativo;
            this.#found = true;
        } else {
            this.#found = false
        }

        return this.#fields;

    }

    /****************************** */
    async Listar(nome = '') {

        let sql = 'SELECT * FROM tb_regime_atend WHERE nome LIKE "%"?"%"';

        const [rows] = await database.connection.query(sql,[nome]);

        return rows;
        
    }

    async Salvar() {

        let sql = '';

        if (this.#found) {
            sql = "UPDATE tb_regime_atend SET nome = :nome, ativo = :ativo WHERE id = :id";
        } else {
            this.#fields.id = await this.#NewCode();
            sql = "INSERT INTO tb_regime_atend (id,nome,ativo) VALUES (:id,:nome,:ativo)";
        }
        
        void await database.connection.execute(sql,this.#fields);

    }

    async Excluir(id) {

        let sql = "DELETE FROM tb_regime_atend WHERE id = ?";

        void await database.connection.execute(sql,[id]);
       
    }

    async #NewCode() {

        let sql = "SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_regime_atend";

        const [rows] = await database.connection.query(sql);

        return rows[0].newcode.toString().length == 1 ? '0' + rows[0].newcode.toString() : rows[0].newcode.toString();
    }

}

/**********************************************************************************/
class Turnos {

    #found = false;
   
    #fields = {
        id: 0,
        nome: '',
        hr_ini: '',
        hr_fin: '',
        ativo: 0
    }

    constructor() {
        if (!database.connection) throw new Error('Não foi possivel estabelecer uma conexão com banco de dados.');
    }

    /******************************* */
    get found() {
        return this.#found;
    }

    /******************************* */
    get id() {
        return this.#fields.id;
    }
    set id(id) {
        this.#fields.id = id;
    }

    /******************************* */
    get nome() {
        return this.#fields.nome;
    }
    set nome(nome) {
        this.#fields.nome = nome;
    }

    /******************************* */
    get hr_ini() {
        return this.#fields.hr_ini;
    }
    set hr_ini(hr_ini) {
        this.#fields.hr_ini = hr_ini;
    }

    /******************************* */
    get hr_fin() {
        return this.#fields.hr_fin;
    }
    set hr_fin(hr_fin) {
        this.#fields.hr_fin = hr_fin;
    }

    /******************************* */
    get ativo() {
        return this.#fields.ativo;
    }
    set ativo(ativo) {
        this.#fields.ativo = ativo;
    }
    
    /******************************* */
    async Buscar(id) {

        let sql = "SELECT * FROM tb_turnos WHERE id = ?";

        const [rows] = await database.connection.query(sql, [id]);

        if (rows[0]) {
            this.#fields.id = rows[0].id;
            this.#fields.nome = rows[0].nome;
            this.#fields.hr_ini = rows[0].hr_ini;
            this.#fields.hr_fin = rows[0].hr_fin;
            this.#fields.ativo = rows[0].ativo;
            this.#found = true;
        } else {
            this.#found = false;
        }

        return this.#fields;
        
    }

    /******************************* */
    async Listar(nome = '') {

        let sql = 'SELECT * FROM tb_turnos WHERE nome LIKE "%"?"%"';

        const [rows] = await database.connection.query(sql,[nome]);

        return rows;
                
    }

    /******************************* */
    async Salvar() {

        let sql = '';

        if (this.#found) {
            sql = "UPDATE tb_turnos SET nome = :nome, hr_ini = :hr_ini, hr_fin = :hr_fin, ativo = :ativo WHERE id = :id";
        } else {
            this.#fields.id = await this.#NewCode();
            sql = "INSERT INTO tb_turnos (id,nome,hr_ini,hr_fin,ativo) VALUES (:id,:nome,:hr_ini,:hr_fin,:ativo)";
        }

        void await database.connection.execute(sql,this.#fields);

    }

    /******************************* */
    async Excluir(id) {

        let sql = "DELETE FROM tb_turnos WHERE id = ?";

        void await database.connection.execute(sql,[id]);

    }

    /******************************* */
    async #NewCode() {

        let sql = "SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_turnos";

        const [rows] = await database.connection.query(sql);

        return rows[0].newcode;

    }

}

/**********************************************************************************/
class Sexos {

    #found = false;
    #id = 0;
    #nome = '';
 
    constructor() {
        if (!database.connection) throw new Error('Não foi possivel estabelecer uma conexão com banco de dados.');
    }

    get found() {
        return this.#found
    }

    get id() {
        return this.#id;
    }

    get nome() {
        return this.#nome
    }

    async Buscar(id) {

        let sql = 'SELECT * FROM tb_sexos WHERE id = ?'

        const [rows] = await database.connection.query(sql,[id]);

        if (rows[0]) {
            this.#id = rows[0].id;
            this.#nome = rows[0].nome;
        }

        return rows[0];

    }

    async Listar() {

        const [rows] = await database.connection.query('SELECT * FROM tb_sexos');

        return rows;

    }

}

/**********************************************************************************/
class Racas {

    #id = 0;
    #nome = '';
    
    constructor() {

        if (!database.connection) throw new Error('Não foi possivel estabelecer uma conexão com banco de rows.');

    }

    get id() {
        return this.#id;
    }

    get nome() {
        return this.#nome;
    }

    async Buscar(id) {

        let sql = 'SELECT * FROM tb_racas WHERE id = ?';

        const [rows] = await database.connection.query(sql,[id]);

        if (rows[0]) {
            this.#id = rows[0].id;
            this.#nome = rows[0].nome;
        }

        return rows[0];

    }

    async Listar() {

        let sql = 'SELECT * FROM tb_racas';

        const [rows] = await database.connection.query(sql);

        return rows;

    }

}

/**********************************************************************************/
class Estado_Civis {

    #id = 0;
    #nome = '';

    constructor() {

        if (!database.connection) throw new Error('Não foi possivel estabelecer uma conexão com banco de rows.');

    }

    get id() {
        return this.#id;
    }

    get nome() {
        return this.#nome;
    }

    async Buscar(id) {

        let sql = 'SELECT * FROM tb_estado_civis WHERE id = ?';

        const [rows] = await database.connection.query(sql,[id]);

        if (rows[0]) {
            this.#id = rows[0].id;
            this.#nome = rows[0].nome;
        }

        return rows[0];

    }

    async Listar() {

        let sql = 'SELECT * FROM tb_estado_civis';

        const [rows] = await database.connection.query(sql);

        return rows;

    }

}

/**********************************************************************************/
class Prescricoes {

    #found = false;

    #fields = {
        id: 0,
        atend_id: 0,
        prof_id: 0,
        tipo: '',
        proc_id: 0,
        prescricao: ''
    }

    constructor() {
        if (!database.connection) throw new Error('Não foi possivel estabelecer uma conexão com banco de dados.');
    }

    /********************************** */
    get found() {
        return this.#found;
    }

    /********************************** */
    set id(id) {
        this.#fields.id = id;
    }
    get id() {
        return this.#fields.id;
    }

    /********************************** */
    set atend_id(atend_id) {
        this.#fields.atend_id = atend_id;
    }
    get atend_id() {
        return this.#fields.atend_id;
    }

    /********************************** */
    set prof_id(prof_id) {
        this.#fields.prof_id = prof_id;
    }
    get prof_id() {
        return this.#fields.prof_id;
    }

    /********************************** */
    set tipo(tipo) {
        this.#fields.tipo = tipo;
    }
    get tipo() {
        return this.#fields.tipo;
    }

    /********************************** */
    set proc_id(proc_id) {
        this.#fields.proc_id = proc_id;
    }
    get proc_id() {
        return this.#fields.proc_id;
    }

    /********************************** */
    set prescricao(prescricao) {
        this.#fields.prescricao = prescricao;
    }
    get prescricao() {
        return this.#fields.prescricao;
    }

    async Buscar(id) {

        let sql = 'SELECT * FROM tb_prescricoes WHERE id = ?'

        const [rows] = await database.connection.query(sql,[id]);

        if (rows[0]) {
            this.#fields.id = rows[0].id;
            this.#fields.atend_id = rows[0].atend_id;
            this.#fields.prof_id = rows[0].prof_id;
            this.#fields.tipo = rows[0].tipo;
            this.#fields.proc_id = rows[0].proc_id;
            this.#fields.prescricao = rows[0].prescricao;
            this.#found = true;
        } else {
            this.#found = false;
        }

        return this.#fields;

    }

    async Listar(nome= '') {

        let sql = 'SELECT * FROM tb_prescricoes WHERE nome LIKE "%"?"%"';

        const [rows] = await database.connection.query(sql,[nome]);

        return rows;
        
    }

    async Salvar() {

        let sql = '';

        if (this.#found) {
            sql = `UPDATE tb_prescricoes SET prof_id = :prof_id, tipo = :tipo, proc_id = :proc_id, prescricao = :prescricao 
            WHERE atend_id = :atend_id AND id = :id`;
        } else {
            this.#fields.id = await this.#NewCode(this.#fields.atend_id);
            sql = `INSERT INTO tb_prescricoes (atend_id,id,prof_id,tipo,proc_id,prescricao) 
            VALUES (:atend_id,:id,:prof_id,:tipo,:proc_id,:prescricao)`
        }

        void await database.connection.execute(sql,this.#fields);

    }

    async Excluir(atend_id,id) {

        let sql = "DELETE FROM tb_prescricoes WHERE atend_id = ? AND id = ?";

        void await database.connection.execute(sql,[atend_id,id]);

    }

    async #NewCode(atend_id) {

        let sql = "SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_prescricoes WHERE atend_id = ?";

        const [rows] = await database.connection.query(sql,[atend_id]);

        return rows[0].newcode;

    }

}

/**********************************************************************************/
class Tipo_Prescricao {

    #found = false;
    
    #fields = {
        id: 0,
        codigo: '',
        descricao: '',
        ativo: 0
    }

    constructor() {
        if (!database.connection) throw new Error('Não foi possivel estabelecer uma conexão com banco de dados.');
    }

    /******************************** */
    get found() {
        return this.#found;
    }

    /******************************** */
    set id(id) {
        this.#fields.id = id;
    }
    get id() {
        return this.#fields.id
    }

    /******************************** */
    set codigo(codigo) {
        this.#fields.codigo = codigo;
    }
    get codigo() {
        return this.#fields.codigo
    }

    /******************************** */
    set descricao(descricao) {
        this.#fields.descricao = descricao;
    }
    get descricao() {
        return this.#fields.descricao
    }

    /******************************** */
    set ativo(ativo) {
        this.#fields.ativo = ativo;
    }
    get ativo() {
        return this.#fields.ativo
    }

    /******************************** */
    async Listar(nome = '') {

        let sql = 'SELECT * FROM tb_tipo_prescricao WHERE descricao LIKE "%"?"%"';

        const [rows] = await database.connection.query(sql,[nome]);

        return rows;

    }

    async Buscar(id) {

        let sql = 'SELECT * FROM tb_tipo_prescricao WHERE id = ?';

        const [rows] = await database.connection.query(sql,[id]);

        if (rows[0]) {
            this.#fields.id = rows[0].id;
            this.#fields.codigo = rows[0].codigo;
            this.#fields.descricao = rows[0].descricao;
            this.#fields.ativo = rows[0].ativo;
            this.#found = true;
        } else {
            this.#found = false;
        }

        return this.#fields;

    }

    async Salvar() {

        let sql = ''

        if (this.#found) {
            sql = "UPDATE tb_tipo_prescricao SET codigo = :codigo, descricao = :descricao, ativo = :ativo WHERE id = :id";
        } else {
            this.#fields.id = await this.#NewCode();
            sql = "INSERT INTO tb_tipo_prescricao (id,codigo,descricao,ativo) VALUES (:id,:codigo,:descricao,:ativo)";
        }

        void await database.connection.execute(sql,this.#fields);

    }

    async Excluir(id) {

        let sql = "DELETE FROM tb_tipo_prescricao WHERE id = ?";

        void await database.connection.execute(sql,[id]);

    }

    async #NewCode() {

        let sql = "SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_tipo_prescricao";

        const [rows] = await database.connection.query(sql);

        return rows[0].newcode;

    }

}

/**********************************************************************************/
class Procedimentos {

    #found = false;

    #fields = {
        id: 0,
        procedimento: '',
        tipo: '',
        bpa_cod: '',
        encaminha_enf: '',
        ativo: 0
    }

    constructor() {
        if (!database.connection) throw new Error('Não foi possivel estabelecer uma conexão com banco de dados.');
    }

    /******************************** */
    get found() {
        return this.#found;
    }

    /******************************** */
    set id(id) {
        this.#fields.id = id;
    }
    get id() {
        return this.#fields.id
    }

    /******************************** */
    set procedimento(procedimento) {
        this.#fields.procedimento = procedimento;
    }
    get procedimento() {
        return this.#fields.procedimento;
    }

    /******************************** */
    set tipo(tipo) {
        this.#fields.tipo = tipo;
    }
    get tipo() {
        return this.#fields.tipo;
    }

    /******************************** */
    set bpa_cod(bpa_cod) {
        this.#fields.bpa_cod = bpa_cod;
    }
    get bpa_cod() {
        return this.#fields.bpa_cod;
    }

    /******************************** */
    set ativo(ativo) {
        this.#fields.ativo = ativo;
    }
    get ativo() {
        return this.#fields.ativo;
    }

    /******************************** */
    set encaminha_enf(encaminha_enf) {
        this.#fields.encaminha_enf = encaminha_enf;
    }
    get encaminha_enf() {
        return this.#fields.encaminha_enf;
    }
    
    /******************************** */
    async Buscar(id) {

        let sql = 'SELECT * FROM tb_procedimentos WHERE id = ?';

        const [rows] = await database.connection.query(sql,[id]);

        if (rows[0]) {
            this.#fields.id = rows[0].id;
            this.#fields.procedimento = rows[0].procedimento;
            this.#fields.tipo = rows[0].tipo;
            this.#fields.bpa_cod = rows[0].bpa_cod;
            this.#fields.encaminha_enf = rows[0].encaminha_enf
            this.#fields.ativo = rows[0].ativo;

            this.#found = true;
        } else {
            this.#found = false;
        }

        return this.#fields;

    }

    async Listar(nome = '') {

        let sql = 'SELECT * FROM tb_procedimentos WHERE procedimento LIKE "%"?"%"';

        const [rows] = await database.connection.query(sql,[nome]);

        return rows;

    }
   
    async Salvar() {

        let sql = '';

        if (this.#found) {
            sql = "UPDATE tb_procedimentos SET procedimento = :procedimento, tipo = :tipo, bpa_cod = :bpa_cod, encaminha_enf = :encaminha_enf ,ativo = :ativo WHERE id = :id";
        } else {
            this.#fields.id = await this.#NewCode();
            sql = "INSERT INTO tb_procedimentos (id,procedimento,tipo,bpa_cod,encaminha_enf,ativo) VALUES (:id,:procedimento,:tipo,:bpa_cod,:encaminha_enf,:ativo)";
        }

        void await database.connection.execute(sql,this.#fields);

    }

    async Excluir(id) {

        let sql = "DELETE FROM tb_procedimentos WHERE id = ?";

        void await database.connection.execute(sql,[id]);

    }

    async #NewCode() {

        let sql = "SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_procedimentos";

        const [rows] = await database.connection.query(sql);

        return rows[0].newcode;

    }

}

/**********************************************************************************/
class Tipo_Procedimento {

    #found = false;
    
    #fields = {
        id: 0,
        codigo: '',
        descricao: '',
        ativo: 0
    }

    constructor() {
        if (!database.connection) throw new Error('Não foi possivel estabelecer uma conexão com banco de dados.');
    }

    /******************************** */
    get found() {
        return this.#found;
    }

    /******************************** */
    set id(id) {
        this.#fields.id = id;
    }
    get id() {
        return this.#fields.id
    }

    /******************************** */
    set codigo(codigo) {
        this.#fields.codigo = codigo;
    }
    get codigo() {
        return this.#fields.codigo
    }

    /******************************** */
    set descricao(descricao) {
        this.#fields.descricao = descricao;
    }
    get descricao() {
        return this.#fields.descricao
    }

    /******************************** */
    set ativo(ativo) {
        this.#fields.ativo = ativo;
    }
    get ativo() {
        return this.#fields.ativo
    }

    /******************************** */

    async Listar(nome = '') {

        let sql = 'SELECT * FROM tb_tipo_procedimento WHERE descricao LIKE "%"?"%"';

        const [rows] = await database.connection.query(sql, [nome]);

        return rows;

    }

    async Buscar(id) {

        let sql = 'SELECT * FROM tb_tipo_procedimento WHERE id = ?'

        const [rows] = await database.connection.query(sql,[id]);

        if (rows[0]) {
            this.#fields.id = rows[0].id;
            this.#fields.codigo = rows[0].codigo;
            this.#fields.descricao = rows[0].descricao;
            this.#fields.ativo = rows[0].ativo;
            this.#found = true;
        } else {
            this.#found = false;
        }

        return this.#fields;

    }

    async Salvar() {

        let sql = ''

        if (this.#found) {
            sql = "UPDATE tb_tipo_procedimento SET codigo = :codigo, descricao = :descricao , ativo = :ativo WHERE id = :id";
        } else {
            this.#fields.id = await this.#NewCode();
            sql = "INSERT INTO tb_tipo_procedimento (id,codigo,descricao,ativo) VALUES (:id,:codigo,:descricao,:ativo)"
        }

        void await database.connection.execute(sql,this.#fields);

    }

    async Excluir(id) {

        let sql = "DELETE FROM tb_tipo_procedimento WHERE id = ?";

        void await database.connection.execute(sql,[id]);

    }

    async #NewCode() {
        
        let sql = "SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_tipo_procedimento";

        const [rows] = await database.connection.query(sql);

        return rows[0].newcode;

    }

}

/**********************************************************************************/
class Pacientes {

    #found = false;
   
    #fields = {
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
   
    constructor() {
        if (!database.connection) throw new Error('Não foi possivel acessar o banco de dados.');
    }

    /********************************* */
    set id(id) {
        this.#fields.id = id;
    }
    get id() {
        return this.#fields.id;
    }

    /********************************* */
    set dt_cadastro(dt_cadastro) {
        this.#fields.dt_cadastro = dt_cadastro;
    }
    get dt_cadastro() {
        return this.#fields.dt_cadastro;
    }

    /********************************* */
    set nome(nome) {
        this.#fields.nome = nome;
    }
    get nome() {
        return this.#fields.nome;
    }

    /********************************* */
    set dt_nasc(dt_nasc) {
        this.#fields.dt_nasc = dt_nasc;
    }
    get dt_nasc() {
        return this.#fields.dt_nasc;
    }

    /********************************* */
    set nm_pai(nm_pai) {
        this.#fields.nm_pai = nm_pai;
    }
    get nm_pai() {
        return this.#fields.nm_pai;
    }

    /********************************* */
    set nm_mae(nm_mae) {
        this.#fields.nm_mae = nm_mae;
    }
    get nm_mae() {
        return this.#fields.nm_mae;
    }

    /********************************* */
    set raca_id(raca_id) {
        this.#fields.raca_id = raca_id;
    }
    get raca_id() {
        return this.#fields.raca_id;
    }

    /********************************* */
    set sexo_id(sexo_id) {
        this.#fields.sexo_id = sexo_id;
    }
    get sexo_id() {
        return this.#fields.sexo_id;
    }

    /********************************* */
    set naturalidade(naturalidade) {
        this.#fields.naturalidade = naturalidade;
    }
    get naturalidade() {
        return this.#fields.naturalidade;
    }

    /********************************* */
    set nacionalidade(nacionalidade) {
        this.#fields.nacionalidade = nacionalidade;
    }
    get nacionalidade() {
        return this.#fields.nacionalidade;
    }

    /********************************* */
    set estado_civil_id(estado_civil_id) {
        this.#fields.estado_civil_id = estado_civil_id;
    }
    get estado_civil_id() {
        return this.#fields.estado_civil_id;
    }

    /********************************* */
    set rg_num(rg_num) {
        this.#fields.rg_num = rg_num;
    }
    get rg_num() {
        return this.#fields.rg_num
    }

    /********************************* */
    set rg_org(rg_org) {
        this.#fields.rg_org = rg_org;
    }
    get rg_org() {
        return this.#fields.rg_org;
    }

    /********************************* */
    set celular_i(celular_i) {
        this.#fields.celular_i = celular_i;
    }
    get celular_i() {
        return this.#fields.celular_i;
    }

    /********************************* */
    set celular_ii(celular_ii) {
        this.#fields.celular_ii = celular_ii;
    }
    get celular_ii() {
        return this.#fields.celular_ii;
    }

    /********************************* */
    set endereco(endereco) {
        this.#fields.endereco = endereco;
    }
    get endereco() {
        return this.#fields.endereco;
    }

    /********************************* */
    set bairro(bairro) {
        this.#fields.bairro = bairro;
    }
    get bairro() {
        return this.#fields.bairro;
    }

    /********************************* */
    set cidade(cidade) {
        this.#fields.cidade = cidade;
    }
    get cidade() {
        return this.#fields.cidade;
    }
    
    /********************************* */
    set uf(uf) {
        this.#fields.uf = uf;
    }
    get uf() {
        return this.#fields.uf;
    }

    /********************************* */
    set cns(cns) {
        this.#fields.cns = cns;
    }
    get cns() {
        return this.#fields.cns;
    }

    /********************************* */
    set cep(cep) {
        this.#fields.cep = cep;
    }
    get cep() {
        return this.#fields.cep;
    }

    /********************************* */
    set abo(abo) {
        this.#fields.abo = abo;
    }
    get abo() {
        return this.#fields.abo;
    }
    
    /********************************* */
    set tem_alergia(tem_alergia) {
        this.#fields.tem_alergia = tem_alergia;
    }
    get tem_alergia() {
        return this.#fields.tem_alergia;
    }

    /********************************* */
    set qual(qual) {
        this.#fields.qual = qual;
    }
    get qual() {
        return this.#fields.qual;
    }

    /********************************* */
    set cpf(cpf) {
        this.#fields.cpf = cpf;
    }
    get cpf() {
        return this.#fields.cpf;
    }

    /********************************* */
    set numero(numero) {
        this.#fields.numero = numero;
    }
    get numero() {
        return this.#fields.numero;
    }

    /********************************* */
    set email(email) {
        this.#fields.email = email;
    }
    get email() {
        return this.#fields.email;
    }

    get found() {
        return this.#found;
    }

    async Buscar(cpf) {

        let sql = 'SELECT * FROM tb_pacientes WHERE cpf = ?'

        const [rows] = await database.connection.query(sql, [cpf]);

        if (rows[0]) {
            this.#fields.id = rows[0].id;
            this.#fields.dt_cadastro = rows[0].dt_cadastro;
            this.#fields.nome = rows[0].nome;
            this.#fields.dt_nasc = rows[0].dt_nasc;
            this.#fields.nm_pai = rows[0].nm_pai;
            this.#fields.nm_mae = rows[0].nm_mae;
            this.#fields.raca_id = rows[0].raca_id;
            this.#fields.sexo_id = rows[0].sexo_id;
            this.#fields.naturalidade = rows[0].naturalidade;
            this.#fields.nacionalidade = rows[0].nacionalidade;
            this.#fields.estado_civil_id = rows[0].estado_civil_id;
            this.#fields.rg_num = rows[0].rg_num;
            this.#fields.rg_org = rows[0].rg_org;
            this.#fields.celular_i = rows[0].celular_i;
            this.#fields.celular_ii = rows[0].celular_ii;
            this.#fields.endereco = rows[0].endereco;
            this.#fields.bairro = rows[0].bairro;
            this.#fields.cidade = rows[0].cidade;
            this.#fields.uf = rows[0].uf;
            this.#fields.cns = rows[0].cns;
            this.#fields.cep = rows[0].cep;
            this.#fields.abo = rows[0].abo;
            this.#fields.tem_alergia = rows[0].tem_alergia;
            this.#fields.qual = rows[0].qual;
            this.#fields.cpf = rows[0].cpf;
            this.#fields.numero = rows[0].numero;
            this.#fields.email = rows[0].email;
            this.#found = true;
        } else {
            this.#found = false;
        }

        return this.#fields;
        
    }

    async Listar(nome = '') {

        let sql = 'SELECT * FROM tb_pacientes WHERE nome LIKE "%"?"%"';

        const [rows] = await database.connection.query(sql,[nome]);

        return rows;
        
    }

    async Salvar() {

        let sql = ''

        if (this.#found) {

            sql = `UPDATE tb_pacientes SET dt_cadastro = :dt_cadastro, nome = :nome, dt_nasc = :dt_nasc, nm_pai = :nm_pai, nm_mae = :nm_mae, 
            raca_id = :raca_id, sexo_id = :sexo_id, naturalidade = :naturalidade, nacionalidade = :nacionalidade, estado_civil_id = :estado_civil_id, 
            rg_num = :rg_num, rg_org = :rg_org, celular_i = :celular_i, celular_ii = :celular_ii, endereco = :endereco, bairro = :bairro, 
            cidade = :cidade, uf = :uf, cns = :cns, cep = :cep, cpf = :cpf, numero = :numero, email = :email WHERE id = :id`

        } else {

            this.#fields.id = await this.#NewCode();
            
            sql = `INSERT INTO tb_pacientes (id,dt_cadastro,nome,dt_nasc,nm_pai,nm_mae,raca_id,sexo_id,
            naturalidade,nacionalidade,estado_civil_id,rg_num,rg_org,celular_i,celular_ii,endereco,bairro,cidade,
            uf,cns,cep,abo,tem_alergia,qual,cpf,numero,email) VALUES (:id,:dt_cadastro,:nome,:dt_nasc,:nm_pai,:nm_mae,:raca_id,
            :sexo_id,:naturalidade,:nacionalidade,:estado_civil_id,:rg_num,:rg_org,:celular_i,:celular_ii,:endereco,:bairro,:cidade,
            :uf,:cns,:cep,:abo,:tem_alergia,:qual,:cpf,:numero,:email)`;

        }

        void await database.connection.execute(sql,this.#fields);

    }

    async Excluir(id) {

        let sql = "DELETE FROM tb_pacientes WHERE id = ?";

        void await database.connection.execute(sql,[id]);

    }

    async #NewCode() {

        let sql = "SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_pacientes";

        const [rows] = await database.connection.query(sql);

        return rows[0].newcode;

    }

}

/**********************************************************************************/
class Atendimentos {

    #found = false;
    
    #fields = {
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

    constructor() {
        if (!database.connection) throw new Error('Não foi possivel acessar o banco de dados.');
    }

    /************************** */
    get found() {
        return this.#found;
    }

    /************************** */
    set id(id) {
        this.#fields.id = id;
    }
    get id() {
        return this.#fields.id;
    }

    /************************** */
    set data(data) {
        this.#fields.data = data;
    }
    get data() {
        return this.#fields.data
    }

    /************************** */
    set tipo_id(tipo_id) {
        this.#fields.tipo_id = tipo_id;
    }
    get tipo_id() {
        return this.#fields.tipo_id;
    }

    /************************** */
    set paciente_id(paciente_id) {
        this.#fields.paciente_id = paciente_id;
    }
    get paciente_id() {
        return this.#fields.paciente_id;
    }

    /************************** */
    set observacao(observacao) {
        this.#fields.observacao = observacao;
    }
    get observacao() {
        return this.#fields.observacao;
    }

    /************************** */
    set dt_encerra(dt_encerra) {
        this.#fields.dt_encerra = dt_encerra;
    }
    get dt_encerra() {
        return this.#fields.dt_encerra;
    }

    /************************** */
    set dt_admissao(dt_admissao) {
        this.#fields.dt_admissao = dt_admissao;
    }
    get dt_admissao() {
        return this.#fields.dt_admissao;
    }

    /************************** */
    set leito_id(leito_id) {
        this.#fields.leito_id = leito_id;
    }
    get leito_id() {
        return this.#fields.leito_id;
    }

    /************************** */
    set enfermaria_id(enfermaria_id) {
        this.#fields.enfermaria_id = enfermaria_id;
    }
    get enfermaria_id() {
        return this.#fields.enfermaria_id;
    }

    /************************** */
    set entidade_id(entidade_id) {
        this.#fields.entidade_id = entidade_id;
    }
    get entidade_id() {
        return this.#fields.entidade_id;
    }

    /************************** */
    set regime_atend_id(regime_atend_id) {
        this.#fields.regime_atend_id = regime_atend_id;
    }
    get regime_atend_id() {
        return this.#fields.regime_atend_id;
    }

    /************************** */
    set situacao(situacao) {
        this.#fields.situacao = situacao;
    }
    get situacao() {
        return this.#fields.situacao;
    }

    /************************** */
    set motivo_encerra_id(motivo_encerra_id) {
        this.#fields.motivo_encerra_id = motivo_encerra_id;
    }
    get motivo_encerra_id() {
        return this.#fields.motivo_encerra_id;
    }

    /************************** */
    set cid_codigo(cid_codigo) {
        this.#fields.cid_codigo = cid_codigo;
    }
    get cid_codigo() {
        return this.#fields.cid_codigo;
    }

    /************************** */
    set acompanhante(acompanhante) {
        this.#fields.acompanhante = acompanhante;
    }
    get acompanhante() {
        return this.#fields.acompanhante;
    }

    /*************************** */
    set nm_medico_assist(nm_medico_assist) {
        this.#fields.nm_medico_assist = nm_medico_assist;
    }
    get nm_medico_assist() {
        return this.#fields.nm_medico_assist;
    }

    /**************************** */
    set crm_medico_assist(crm_medico_assist) {
        this.#fields.crm_medico_assist = crm_medico_assist;
    }
    get crm_medico_assist() {
        return this.#fields.crm_medico_assist;
    }

    /*************************** */
    set esp_medico_assist(esp_medico_assist) {
        this.#fields.esp_medico_assist = esp_medico_assist;
    }
    get esp_medico_assist() {
        return this.#fields.esp_medico_assist;
    }

    /*************************** */
    set especialidade_atend_id(especialidade_atend_id) {
        this.#fields.especialidade_atend_id = especialidade_atend_id
    }
    get especialidade_atend_id() {
        return this.#fields.especialidade_atend_id;
    }

    /*************************** */
    set preferencia(preferencia) {
        this.#fields.preferencia = preferencia
    }
    get preferencia() {
        return this.#fields.preferencia;
    }

    /************************** */
    async Buscar(id) {

        let sql = 'SELECT * FROM tb_atendimentos WHERE id = ?'

        const [rows] = await database.connection.query(sql, [id]);

        if (rows[0]) {
            this.#fields.id = rows[0].id;
            this.#fields.data = rows[0].data;
            this.#fields.tipo_id = rows[0].tipo_id;
            this.#fields.paciente_id = rows[0].paciente_id;
            this.#fields.observacao = rows[0].observacao;
            this.#fields.dt_encerra = rows[0].dt_encerra;
            this.#fields.dt_admissao = rows[0].dt_admissao;
            this.#fields.leito_id = rows[0].leito_id;
            this.#fields.enfermaria_id = rows[0].enfermaria_id;
            this.#fields.entidade_id = rows[0].entidade_id;
            this.#fields.regime_atend_id = rows[0].regime_atend_id;
            this.#fields.situacao = rows[0].situacao;
            this.#fields.motivo_encerra_id = rows[0].motivo_encerra_id;
            this.#fields.cid_codigo = rows[0].cid_codigo;
            this.#fields.acompanhante = rows[0].acompanhante;
            this.#fields.nm_medico_assist = rows[0].nm_medico_assist;
            this.#fields.crm_medico_assist = rows[0].crm_medico_assist;
            this.#fields.esp_medico_assist = rows[0].esp_medico_assist;
            this.#fields.especialidade_atend_id = rows[0].especialidade_atend_id;
            this.#fields.preferencia = rows[0].preferencia;
            this.#found = true;
        } else {
            this.#found = false;
        }

        return this.#fields;
        
    }

    async ListarAtendNaoEncerrado(id_paciente) {

        let sql = 'SELECT id FROM tb_atendimentos WHERE paciente_id = ? AND situacao <> 99';

        const [rows] = await database.connection.query(sql,[id_paciente]);

        return rows.length > 0;

    }

    async Listar(Nome = '', Data_Ini, Data_Fin) {

        let sql = `SELECT tb_atendimentos.*,tb_pacientes.nome,tb_pacientes.nm_mae, tb_sit_atendimentos.nome as nm_situacao FROM tb_atendimentos 
        LEFT JOIN tb_pacientes ON tb_pacientes.id = tb_atendimentos.paciente_id
        LEFT JOIN tb_sit_atendimentos ON tb_sit_atendimentos.id = tb_atendimentos.situacao
        WHERE tb_pacientes.nome LIKE "%"?"%" AND data BETWEEN ? AND ? AND situacao < 99`;

        const [rows] = await database.connection.query(sql,[Nome,Data_Ini,Data_Fin]);

        return rows;       
    }

    async ListarAtendConsultorio(Nome = '',Situacao) {

        let sql = `SELECT tb_atendimentos.*,tb_pacientes.nome,tb_pacientes.nm_mae, tb_pacientes.dt_nasc, tb_sit_atendimentos.nome as nm_situacao FROM tb_atendimentos 
        LEFT JOIN tb_pacientes ON tb_pacientes.id = tb_atendimentos.paciente_id
        LEFT JOIN tb_sit_atendimentos ON tb_sit_atendimentos.id = tb_atendimentos.situacao
        WHERE tb_pacientes.nome LIKE "%"?"%" AND situacao = ? ORDER BY preferencia, tb_atendimentos.id`;

        const [rows] = await database.connection.query(sql,[Nome,Situacao]);

        return rows;       

    }

    async Salvar() {

        let sql = '';

        if (this.#found) {

            sql = `UPDATE tb_atendimentos SET data = :data, tipo_id = :tipo_id, observacao =:observacao, entidade_id = :entidade_id,
                regime_atend_id = :regime_atend_id, acompanhante = :acompanhante, nm_medico_assist = :nm_medico_assist, 
                crm_medico_assist = :crm_medico_assist, esp_medico_assist = :esp_medico_assist, especialidade_atend_id = :especialidade_atend_id  
                WHERE id = :id`

        } else {

            this.#fields.id = await this.#NewCode();

            sql = `INSERT INTO tb_atendimentos (id,data,tipo_id,paciente_id,observacao,entidade_id,regime_atend_id,
            situacao,acompanhante,nm_medico_assist,crm_medico_assist,esp_medico_assist,especialidade_atend_id) 
            VALUES (:id,:data,:tipo_id,:paciente_id,:observacao,:entidade_id,:regime_atend_id,:situacao,:acompanhante,
            :nm_medico_assist,:crm_medico_assist,:esp_medico_assist,:especialidade_atend_id)`;

        }

        void await database.connection.execute(sql,this.#fields);

    }

    async Excluir(id) {

        let sql = "DELETE FROM tb_atendimentos WHERE id = ?";

        void await database.connection.execute(sql,[id]);

    }

    async #NewCode() {

        let sql = "SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_atendimentos";

        const [rows] = await database.connection.query(sql);

        return rows[0].newcode

    }
}

/**********************************************************************************/
class Exames {

    #found = false;

    #fields = {
        paciente_id : 0,
        atend_id: 0,
        id: 0,
        nm_exame: '',
        dt_inclusao: '',
        nm_arquivo: '',
        imagem: 0,
        mimetype: '',
        tipo_arquivo: ''
    }

    constructor() {
        if (!database.connection) throw new Error('Não foi possivel acessar o banco de dados.');
    }

    /************************** */
    get found() {
        return this.#found;
    }

    /************************** */
    set paciente_id(paciente_id) {
        this.#fields.paciente_id = paciente_id;
    }
    get paciente_id() {
        return this.#fields.paciente_id;
    }

    /************************** */
    set id(id) {
        this.#fields.id = id;
    }
    get id() {
        return this.#fields.id;
    }

    /************************** */
    set atend_id(atend_id) {
        this.#fields.atend_id = atend_id;
    }
    get atend_id() {
        return this.#fields.atend_id;
    }

    /************************** */
    set nm_exame(nm_exame) {
        this.#fields.nm_exame = nm_exame;
    }
    get nm_exame() {
        return this.#fields.nm_exame;
    }

    /************************** */
    set dt_inclusao(dt_inclusao) {
        this.#fields.dt_inclusao = dt_inclusao;
    }
    get dt_inclusao() {
        return this.#fields.dt_inclusao;
    }

    /************************** */
    set nm_arquivo(nm_arquivo) {
        this.#fields.nm_arquivo = nm_arquivo;
    }
    get nm_arquivo() {
        return this.#fields.nm_arquivo;
    }

    /************************** */
    set imagem (imagem) {
        this.#fields.imagem = imagem;
    }
    get imagem() {
        return this.#fields.imagem;
    }

    /************************** */
    set mimetype(mimetype) {
        this.#fields.mimetype = mimetype;
    }
    get mimetype() {
        return this.#fields.mimetype;
    }

    /************************** */
    set tipo_arquivo(tipo_arquivo) {
        this.#fields.tipo_arquivo = tipo_arquivo;
    }
    get tipo_arquivo() {
        return this.#fields.tipo_arquivo;
    }
    /************************** */

    async Buscar(paciente_id,id) {

        let sql = 'SELECT * FROM tb_exames WHERE paciente_id = ? AND id = ?'

        const [rows] = await database.connection.query(sql, [paciente_id,id]);

        if (rows[0]) {

            this.#fields.atend_id = rows[0].atend_id;
            this.#fields.paciente_id = rows[0].paciente_id;
            this.#fields.id = rows[0].id;
            this.#fields.nm_exame = rows[0].nm_exame;
            this.#fields.dt_inclusao = rows[0].dt_inclusao;
            this.#fields.nm_arquivo = rows[0].nm_arquivo;
            this.#fields.imagem = rows[0].imagem;
            this.#fields.mimetype = rows[0].mimetype;
            this.#fields.tipo_arquivo = rows[0].tipo_arquivo;
            this.#found = true;
        } else {
            this.#found = false;
        }

        return this.#fields;
        
    }

    async ListarPorAtend(atend_id) {

        let sql = 'SELECT dt_inclusao, id, nm_exame, nm_arquivo FROM tb_exames WHERE atend_id = ?';

        const [rows] = await database.connection.query(sql,[atend_id]);

        return rows;
       
    }

    async ListarPorPaciente(paciente_id) {

        let sql = 'SELECT dt_inclusao, id, nm_exame, nm_arquivo FROM tb_exames WHERE paciente_id = ?';

        const [rows] = await database.connection.query(sql,[paciente_id]);

        return rows;
       
    }

    async Salvar() {

        let sql = '';

        if (this.#found) {

            sql = `UPDATE tb_exames SET atend_id = :atend_id, nm_exame = :nm_exame, dt_inclusao = :dt_inclusao, nm_arquivo = :nm_arquivo,
            imagem = :imagem, mimetype = :mimetype, tipo_arquivo = :tipo_arquivo WHERE paciente_id = :paciente_id AND id = :id`

        } else {

            sql = `INSERT INTO tb_exames (paciente_id,atend_id,id,nm_exame,dt_inclusao,nm_arquivo,imagem,mimetype,tipo_arquivo)
            VALUES (:paciente_id,:atend_id,:id,:nm_exame,:dt_inclusao,:nm_arquivo,:imagem,:mimetype,:tipo_arquivo)`
        }

        void await database.connection.execute(sql,this.#fields);

    }

    async Excluir(atend_id,id) {

        let sql = 'DELETE FROM tb_exames WHERE atend_id = ? AND id = ?';

        void await database.connection.execute(sql,[atend_id,id]);

    }

    async NewCode(paciente_id) {

        let sql = 'SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_exames WHERE paciente_id = ?';

        const [rows] = await database.connection.query(sql,[paciente_id]);

        return rows[0].newcode;

    }

}

class TabelaCid {

    #found = false;

    #fields = {        
        id: 0,
        codigo: '',
        descricao: '',
    }

    constructor() {
        if (!database.connection) throw new Error('Não foi possivel acessar o banco de dados.');
    }

    get found() {
        return this.#found;
    }

    /*********************************** */
    get id() {
        return this.#fields.id
    }
    set id(id) {
        this.#fields.id = id
    }

    /*********************************** */
    get codigo() {
        return this.#fields.codigo
    }
    set codigo(codigo) {
        this.#fields.codigo = codigo
    }

    /*********************************** */
    get descricao() {
        return this.#fields.id
    }
    set descricao(descricao) {
        this.#fields.descricao = descricao
    }

    /*********************************** */
    async Buscar(codigo) {

        let sql = "SELECT * FROM tb_cid10 WHERE codigo = ?";

        const [rows] = await database.connection.query(sql,[codigo]);

        if (rows[0]) {
            this.#fields.id = rows[0].id;
            this.#fields.codigo = rows[0].codigo;
            this.#fields.descricao = rows[0].descricao;
            this.#found = true;
        } else {
            this.#found = false;
        }

        return this.#fields;

    }

    /*********************************** */
    async SelecionarCodigo(codigo) {

        let sql = "SELECT * FROM tb_cid10 WHERE codigo = ?";

        const [rows] = await database.connection.query(sql,[codigo]);

        if (rows[0]) {
            this.#fields.id = rows[0].id;
            this.#fields.codigo = rows[0].codigo;
            this.#fields.descricao = rows[0].descricao;
            this.#found = true;
        } else {
            this.#found = false;
        }

        return this.#fields;

    }

    async Listar(nome) {

        let sql = 'SELECT * FROM tb_cid10 WHERE descricao LIKE "%"?"%"';

        const [rows] = await database.connection.query(sql,[nome]);

        return rows;

    }

    async Salvar() {

        let sql = "";

        if (this.#found) {
            sql = `UPDATE tb_cid10 SET codigo = :codigo, descricao = :descricao WHERE id = :id`;
        } else {
            this.#fields.id = await this.#NewCode();
            sql = `INSERT INTO tb_cid10 (id,codigo,descricao) VALUES (:id,:codigo,:descricao)`;
        }

        void await database.connection.execute(sql,this.#fields)

    }

    async Excluir(id) {

        let sql = "DELETE FROM tb_cid10 WHERE id = ?";

        void await database.connection.query(sql,[id]);

    }

    async #NewCode() {

        let sql = 'SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_cid10';

        const [rows] = await database.connection.query(sql);

        return rows[0].newcode;

    }

}

class SinaisVitais {

    #found = false;

    #fields = {        
        atend_id: 0,
        id: 0,
        press_sistolica : 0,
        press_diastolica : 0,
        freq_card: 0,
        freq_resp: 0,
    }

    constructor() {
        if (!database.connection) throw new Error('Não foi possivel acessar o banco de dados.');
    }

    get found() {
        return this.#found;
    }

    /********************************************/
    get atend_id() {
        return this.#fields.atend_id;
    }
    set atend_id(atend_id) {
        this.#fields.atend_id = atend_id;
    }

    /********************************************/
    get id() {
        return this.#fields.id;
    }
    set id(id) {
        this.#fields.id = id;
    }

    /********************************************/
    get press_sistolica() {
        return this.#fields.press_sistolica;
    }
    set press_sistolica (press_sistolica) {
        this.#fields.press_sistolica = press_sistolica;
    }    

    /********************************************/
    get freq_card() {
        return this.#fields.freq_card;
    }
    set freq_card(freq_card) {
        this.#fields.freq_card = freq_card;
    }

    /********************************************/
    get freq_resp() {
        return this.#fields.freq_resp;
    }
    set freq_resp(freq_resp) {
        this.#fields.freq_resp = freq_resp;
    }

    /*********************************** */
    async Buscar(atend_id,id) {

        let sql = "SELECT * FROM tb_sinais_vitais WHERE atend_id = ? AND  id = ?";

        const [rows] = await database.connection.query(sql,[atend_id,id]);

        if (rows[0]) {
            this.#fields.atend_id = rows[0].atend_id
            this.#fields.id = rows[0].id;
            this.#fields.press_sistolica = rows[0].press_sistolica;
            this.#fields.press_diastolica = rows[0].press_diastolica;
            this.#fields.freq_card = rows[0].freq_card;
            this.#fields.freq_resp = rows[0].freq_resp;
            this.#found = true;
        } else {
            this.#found = false;
        }

        return this.#fields;

    }

    async Listar(atend_id) {

        let sql = 'SELECT * FROM tb_sinais_vitais WHERE atend_id = ?';

        const [rows] = await database.connection.query(sql,[atend_id]);

        return rows;

    }

    async Salvar() {

        let sql = "";

        if (this.#found) {
            sql = `UPDATE tb_sinais_vitais 
                   SET press_sistolica = :press_sistolica, press_diastolica = :press_diastolica,
                   freq_card = :freq_card, freq_resp = :freq_resp 
                   WHERE atend_id = :atend_id AND id = :id`;
        } else {
            this.#fields.id = await this.#NewCode(this.#fields.atend_id);
            sql = `INSERT INTO tb_sinais_vitais (atend_id,id,press_sistolica,press_diastolica,freq_card,freq_resp) 
                   VALUES (:atend_id,:id,:press_sistolica,:press_diastolica,:freq_card,:freq_resp)`;
        }

        void await database.connection.execute(sql,this.#fields)

    }

    async Excluir(atend_id,id) {

        let sql = "DELETE FROM tb_sinais_vitais WHERE atend_id = ? AND id = ?";

        void await database.connection.execute(sql,[atend_id,id]);

    }

    async #NewCode(atend_id) {

        let sql = 'SELECT IFNULL(MAX(id),0) + 1 as newcode FROM tb_sinais_vitais WHERE atend_id = ?';

        const [rows] = await database.connection.query(sql,[atend_id]);

        return rows[0].newcode;

    }
}

class EspProcedimentos {

    #found = false;

    #fields = {        
        especialidade_id: 0,
        proc_id: 0
    }

    constructor() {
        if (!database.connection) throw new Error('Não foi possivel acessar o banco de dados.');
    }

    get found() {
        return this.#found;
    }

    /********************************************/
    get especialidade_id() {
        return this.#fields.especialidade_id;
    }
    set especialidade_id(especialidade_id) {
        this.#fields.especialidade_id = especialidade_id;
    }

    /********************************************/
    get proc_id() {
        return this.#fields.proc_id;
    }
    set proc_id(proc_id) {
        this.#fields.proc_id = proc_id;
    }

    /*********************************** */
    async Buscar(especialidade_id,proc_id) {

        let sql = "SELECT * FROM tb_esp_procedimento WHERE especialidade_id = ? AND  proc_id = ?";

        const [rows] = await database.connection.query(sql,[especialidade_id,proc_id]);

        if (rows[0]) {
            this.#fields.especialidade_id = rows[0].especialidade_id
            this.#fields.proc_id = rows[0].proc_id;
            this.#found = true;
        } else {
            this.#found = false;
        }

        return this.#fields;

    }

    async ListaProcedimento(especialidade_id) {

        let sql = `SELECT tb_esp_procedimento.especialidade_id,tb_esp_procedimento.proc_id,tb_procedimentos.procedimento,tb_procedimentos.bpa_cod FROM tb_esp_procedimento 
                   LEFT JOIN tb_procedimentos ON tb_procedimentos.id = tb_esp_procedimento.proc_id
                   WHERE especialidade_id = ?`;

        const [rows] = await database.connection.query(sql,[especialidade_id]);

        return rows;

    }

    async Salvar() {

        let sql = "";

        if (!this.#found) {
            sql = `INSERT INTO tb_esp_procedimento (especialidade_id,proc_id) 
                   VALUES (:especialidade_id,:proc_id)`;
        }

        void await database.connection.execute(sql,this.#fields);

    }

    async Excluir(especialiade_id,proc_id) {

        let sql = "DELETE FROM tb_esp_procedimento WHERE especialidade_id = ? AND proc_id = ?";

        void await database.connection.execute(sql,[especialiade_id,proc_id]);

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