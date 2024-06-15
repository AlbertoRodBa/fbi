import express from 'express';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import authRouter from './routes/auth.js';
import protectedRouter from './routes/protected.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const secretKey = process.env.JWT_SECRET;
app.use(express.json());
app.use(express.static('public'));

// Conectar routers con app principal
app.use('/', authRouter);
app.use('/', protectedRouter);


app.listen(3000, () => {
    console.log(`Servidor encendido en el puerto 3000`);
});
