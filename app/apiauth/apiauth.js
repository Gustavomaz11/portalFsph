import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/routes.js';

dotenv.config({path: '/var/www/app/.env'});

const app = express();

app.use(express.urlencoded({
  extended: true,
}));

app.use(express.json());

app.use(cors());
app.use(router);

app.listen(3003,() => console.log('api rodando na Porta: 3003'));
