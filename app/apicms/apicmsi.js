import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/routes.js';
import {env} from 'node:process'

dotenv.config({path: '/var/www/app/.env'});

env.TZ = 'America/Recife';

const app = express();

app.use(express.urlencoded({
  extended: true,
}));

app.use(express.json());

app.use(cors());

app.use(router);

app.use(express.static('fotos_noticias'));

app.listen(3002,() => console.log('api rodando na Porta: 3002'));
