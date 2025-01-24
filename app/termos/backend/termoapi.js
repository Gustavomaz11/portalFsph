import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/routes.js';

dotenv.config();

const app = express();

app.use(express.urlencoded({
  extended: true,
  limit: '10mb'
}));

app.use(express.json());

app.use(express.static('public'));

app.use(cors({
  origin: '192.168.0.1',
  methods: ['POST','GET'],
  allowedHeaders: ['*']
}));

app.use(router);


app.listen(3001,() => console.log('api rodando na Porta: 3001'));
