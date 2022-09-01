import express, { Express } from 'express';
import dotenv from 'dotenv';
import db from './config/db';
import {stockController} from './controllers/stock'

dotenv.config();
db.connect();
const app: Express = express();
const port = process.env.PORT;

app.get('/stock', stockController);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

process.on('SIGINT', () => {
  console.warn('Shutting down server...');
  db.disconnect()
  console.log('Server successfully shutdown');
  process.exit(0);
});