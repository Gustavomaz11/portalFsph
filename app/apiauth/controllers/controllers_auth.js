import LdapClient from '../activeDirectory/classldap.js';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import Database from '../database/conn.js';
import {encrypt_AES,decrypt} from '../helpers/criptografia.js'

dotenv.config();

export class ControllerAuth {

  static async CreateToken(req,res) {

    const resdata = {
      err: 0,
      msg: '',
      status: 200,
      data: null
    }

    const database = new Database('fsph_auth')

    const {user,password,domain} = req.body;

    try {

      //const dominio = 'hemose.fsph' // dominio deve vir pelo body

      let query = '';
      let userdata = '';

      void await database.connect();

      /****************************************************** 
       * obter dados do dominio
      *******************************************************/
      query = "SELECT key_token_dom,user_dom,pass_dom,host_ldap_dom,basedn_dom,port_host_ldap FROM tb_domains WHERE domain = :domain";

      const [dominio] = await database.connection.query(query,{domain});

      if (!dominio[0]) {
        throw new Error('Nenhum Dados do Dominio encontrado.');
      }


      /****************************************************** 
       * obter dados do usuario
      *******************************************************/
      query = "SELECT * from tb_users WHERE user = :user";

      const [users] = await database.connection.query(query,{user});

      /****************************************************** 
       * Autenticação por dominio
      *******************************************************/
      if (domain != 'local') {

        const ldap = new LdapClient(
          dominio[0].user_dom + "@" + domain,
          dominio[0].pass_dom,
          dominio[0].host_ldap_dom,
          dominio[0].basedn_dom,
          dominio[0].port_host_ldap
        );

        if (!await ldap.Autenticate(user + '@' + domain,password)) {
          throw new Error('Usuario não Autenticado!');
        }

        userdata = await ldap.FindUser(user);
        
        /****************************************************** 
         * atualiza dados do usuario
        *******************************************************/
        if (!users[0]) {

          query = "INSERT INTO tb_users SET user = :user, sector = :sector, email = :email, fullname = :fullname, password = :password, dt_access = :dt_access";

        } else {

          query = "UPDATE tb_users SET sector = :sector, email = :email, fullname = :fullname, password = :password,dt_access = :dt_access WHERE user = :user"

        }

        void await database.begin();

        const dados = {
          user: userdata.user,
          sector: userdata.sector,
          fullname: userdata.fullname,
          email: userdata.email,
          dt_access: new Date(),
          password: encrypt_AES(password,dominio[0].key_token_dom),
        }

        void await database.connection.query(query,dados);

        void await database.commit();

      } else {

        if (!users[0]) throw new Error('Usuario não encontrado na base local.')

        if (decrypt(users[0].password,dominio[0].key_token_dom) != password) {
          throw new Error('Senha Incorreta !');
        }

        if(users[0].active == 0) {
          throw new Error('Usuario Desativado !');
        }

        void await database.begin();

        query = "UPDATE tb_users SET dt_access = :dt_access WHERE user = :user";

        void await database.connection.query(query,{user: users[0].user, dt_access: new Date()});

        void await database.commit();

        userdata = {
          user: users[0].user,
          email: users[0].email,
          fullname: users[0].fullname,
          sector: users[0].sector,
        }

      }

      /*************************************
      * Cria o token de autenticação
      *************************************/

      // Declara variaveis para a criaçao do token
      const validade_token = '30m'; // validade do token 30 minutos
      const datatoken = {
        auth: true,
        dateacess: new Date(Date.now()).toLocaleTimeString(),
        user: userdata,
      }

      const token = jwt.sign({datatoken},dominio[0].key_token_dom,{
          expiresIn: validade_token 
      });

      resdata.data = {
        auth: true,
        token: token,
        userdata
      }

    } catch (error) {

      void await database.rollback();

      resdata.err = 99;
      resdata.msg = error.message;
      resdata.status = 500;

    }

    void await database.close()

    res.status(resdata.status).json(resdata);

  }

  static async GetCredential(req,res) {

    const resdata = {
      err: 0,
      msg: '',
      status: 200,
      data: null
    }

    const database = new Database('fsph_auth');

    try {

      const authHeader = req.headers["authorization"];
      
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) throw new Error('Token não recebido.')

      const dominio = req.params.dominio

      void await database.connect();

      const query = "SELECT key_token_dom FROM tb_domains WHERE domain = :domain";

      const [domain] = await database.connection.query(query,{domain : dominio});

      jwt.verify(token, domain[0].key_token_dom, function(err, decoded) {

        if (err) throw new Error(err);

        resdata.data = decoded.datatoken;
      
      });

    } catch (error) {
      resdata.err = 99;
      resdata.msg = error.message;
      resdata.status = 500;
    }

    res.status(resdata.status).json(resdata)

  }

  static async GetDomains(req,res) {

    const resdata = {
      err: 0,
      msg: '',
      status: 200,
      data: []
    }

    const database = new Database('fsph_auth');

    try {

      void await database.connect();

      let query = "SELECT nm_dom,domain FROM tb_domains WHERE active = 1";

      const [rows] = await database.connection.query(query);

      resdata.data = rows
      
    } catch (error) {

      resdata.err = 99,
      resdata.msg = error.message;
      resdata.status = 500;
      
    }

    void await database.close();

    res.status(resdata.status).json(resdata);

  }

}  