import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRutas from './rutas/authRutas.js';
import productoRutas from './rutas/productoRutas.js';
import usuarioRutas from './rutas/usuarioRutas.js';
import reporteRutas from './rutas/reporteRutas.js';

dotenv.config();

const app = express();
const puerto = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Rutas
app.use('/api/auth', authRutas);
app.use('/api/productos', productoRutas);
app.use('/api/usuarios', usuarioRutas);
app.use('/api/reportes', reporteRutas);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ mensaje: 'API de PlayerOne funcionando' });
});

app.listen(puerto, () => {
    console.log(`Servidor backend en http://localhost:${puerto}`);
});