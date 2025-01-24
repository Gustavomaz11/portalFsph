import database from '../database/conn.js';
import { DataHora } from '../helpers/datetime.js';
import {
  TipoAtend, Conselhos, Enfermarias, Leitos, Especialidades, Vinculos, 
  Profissionais, MotivoEncerra, RegimeAtend, Turnos,Tipo_Prescricao,Pacientes,
  Procedimentos, Tipo_Procedimento,TabelaCid, EspProcedimentos,Sexos,Racas,Estado_Civis
} from '../models/classModels.js';

export class apiController {

  /************************************* 
   * Tabelas de Apoio
  **/
  static async EncontrarPaciente(req,res) {
              
    const headers = {
      num: 0,
      msg: '',
      status: 200,
      request: {
          cpf: req.body.cpf
      },
      response: {
          pacientes: {},              
      }
    }

    try {

      void await database.connect();

      /**************************************** */
      const pacientes = new Pacientes();

      /**************************************** */
      headers.response.pacientes = await pacientes.Buscar(headers.request.cpf);
        
    } catch (error) {
      headers.num = 99;                
      headers.msg = error.stack;                
      headers.status = 500;
    }

    void await database.close();

    res.status(headers.status).json({
      err: headers.num,
      msg: headers.msg,
      dados: headers.response
    });

  }

  static async ListarSetores(req,res) {

      const headers = {
          num: 0,
          msg: '',
          status: 200,
          request: {
              nome: req.params.nome == '*' ? '' : req.params.nome,
          },
          response: {
              setores: [
                  {
                      id: 1,
                      nome : 'Recepção'
                  },
                  {
                      id: 2,
                      nome : 'Ambulatorio'
                  },
                  {
                      id: 3,
                      nome : 'Laboratorio'
                  },
              ]
              
          }
      }

      res.status(headers.status).json({
          err: headers.num,
          msg: headers.msg,
          dados: headers.response.setores
      });


  }

  static async ListarSexos(req,res) {

      const headers = {
          num: 0,
          msg: '',
          status: 200,
          request: {},
          response: {
              sexos: {}
          }    
      }

      try {

          void await database.connect();

          const sexos = new Sexos();

          headers.response.sexos = await sexos.Listar();


      } catch (error) {
          headers.num = 99;
          headers.msg = headers.status == 200 ? error.stack : error.message;
          headers.status = headers.status == 200 ? 500 : headers.status
      }

      void await database.close();

      res.status(headers.status).json({
          err: headers.num,
          msg: headers.msg,
          dados: headers.response
      });

  }

  static async ListarRacas(req,res) {

      const headers = {
          num: 0,
          msg: '',
          status: 200,
          request: {},
          response: {
              racas: {}
          }    
      }

      try {

          void await database.connect();

          const racas = new Racas();

          headers.response.racas = await racas.Listar();

      } catch (error) {
          headers.num = 99;
          headers.msg = headers.status == 200 ? error.stack : error.message;
          headers.status = headers.status == 200 ? 500 : headers.status
      }

      void await database.close();

      res.status(headers.status).json({
          err: headers.num,
          msg: headers.msg,
          dados: headers.response
      });

  }

  static async ListarEstadoCivis(req,res) {

      const headers = {
          num: 0,
          msg: '',
          status: 200,
          request: {},
          response: {
              estado_civis: {}
          }    
      }

      try {

          void await database.connect();

          const estado_civis = new Estado_Civis();

          headers.response.estado_civis = await estado_civis.Listar();

      } catch (error) {
          headers.num = 99;
          headers.msg = headers.status == 200 ? error.stack : error.message;
          headers.status = headers.status == 200 ? 500 : headers.status
      }

      void await database.close();

      res.status(headers.status).json({
          err: headers.num,
          msg: headers.msg,
          dados: headers.response
      });

  }

  /************************************* 
   * Modulo Recepção
  **/
  static async NovoAtendimento(req,res) {

    const headers = {
      num: 0,
      msg: '',
      status: 200,
      request: {},
      response: {
        dt_atendimento: DataHora(),
        tipo_atendimento: {},
        regime_atendimento: {},
        especialidade_atendimento : {}
      }  
    }

    try {

      void await database.connect();

      const tipo_atendimento = new TipoAtend();
      const regime_atendimento = new RegimeAtend();
      const especialidade_atendimento = new Especialidades();

      headers.response.tipo_atendimento = await tipo_atendimento.Listar();
      headers.response.regime_atendimento = await regime_atendimento.Listar();
      headers.response.especialidade_atendimento = await especialidade_atendimento.Listar();

    } 
    catch (error) {
      headers.num = 99;
      headers.msg = headers.status == 200 ? error.stack : error.message;
      headers.status = headers.status == 200 ? 500 : headers.status
    }

    void await database.close();

    res.status(headers.status).json({
        err: headers.num,
        msg: headers.msg,
        dados: headers.response
    });

  }

}