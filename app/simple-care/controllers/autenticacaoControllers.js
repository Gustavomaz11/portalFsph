import database from '../database/conn.js';
import { DataHora, DataHoraUS } from '../helpers/datetime.js';
import fileDirName from '../helpers/file-dir-name.js';
import criptografar from '../helpers/criptografia.js';

process.env.TZ = 'America/Bahia';

const { __dirname } = fileDirName(import.meta);

const options = {
    root: __dirname.replace('controllers','views')
};

/*******************************************************
* Controller para Tipos de Atendimentos
********************************************************/
class AutenticacaoController {

    static TelaAcessar(req,res) {

        req.session.destroy(() => {
            res.status(200).sendFile('/autenticacao/login.html',options);
        });

    }

    static async Autenticar(req,res) {

        const {usuario, senha} = req.body;

        const menu = [
            {
                name: 'Cadastros',
                program: 'Cadastros();'
            },
            {
                name: 'Recepção',
                program: 'Recepcao()'
            },
            {
                name: 'Ambulatorio',
                program: 'Ambulatorio()'
            },
            {
                name: 'Laboratorio',
                program: ''
            },
            {
                name: 'Sair',
                program: 'Logout()'
            }
        ];

        const data = new Date();
        
        //inicializa a session
        req.session.userid = usuario;
        req.session.timer = Date.now() + 180000;
        req.session.nome_usual = usuario;
        req.session.nome_profissional = 'Alan Dave';
        req.session.registro_profissional = '1530';

        data.setTime(req.session.timer);

        req.session.save();

        //const secret = criptografar('ovidio');

        res.status(200).json({
            err: 0,
            msg: '',
            menu,
            sessao: req.session,
            time: data.getHours() + ':' + data.getMinutes() + ':' + data.getMilliseconds(),
            auth: true
        });
    }

    static Sair(req,res) {

        req.session.destroy(() => {
            res.status(200).redirect('/');
        });

    }

}

export default AutenticacaoController;