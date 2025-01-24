import express from "express";
import session from 'express-session';
import cors from "cors";
import dotenv from 'dotenv';
import homeRouter from './routers/homeRouter.js';
import autenticacaoRouters from './routers/autenticacaoRouters.js'
import cadastrosRouters from './routers/cadastrosRouters.js';
import recepcaoRouters from './routers/recepcaoRouters.js';
import ambulatorioRouters from './routers/ambulatorioRouters.js'
import apiRoutes from './routers/apiRoutes.js'
import fileDirName from "./helpers/file-dir-name.js";

dotenv.config();

const app = express();
const port = process.env.SERVER_PORT;
const { __dirname } = fileDirName(import.meta);

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(express.json());

//session middleware
app.use(session({
    name: 'session',
    secret: 'nosso_secret',
    resave: false,
    saveUninitialized: false,
    /*store: new fileStore({
        logFn: function() {},
        path: __dirname + '/sessions',
    })*/
}));

// assets path
app.use(express.static('assets'));

// Criar o middleware para permitir requisição externa
app.use( (req, res, next) => {

    // Qualquer endereço pode fazer requisição "*"
    res.header("Access-Control-Allow-Origin", "*");

    // Tipos de método que a API aceita
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");

    // Permitir o envio de dados para API
    res.header("Access-Control-Allow-Headers", "Content-Type");

    // Executar o cors
    app.use(cors());

    // Quando não houver erro deve continuar o processamento
    next();
});

//rotas de acessos
app.use('/',homeRouter);
app.use('/autentica',autenticacaoRouters);
app.use('/cadastros',cadastrosRouters);
app.use('/recepcao',recepcaoRouters);
app.use('/ambulatorio',ambulatorioRouters);
app.use('/api',apiRoutes)

app.listen(port);