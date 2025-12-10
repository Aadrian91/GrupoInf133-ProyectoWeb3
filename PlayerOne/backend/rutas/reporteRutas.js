import express from 'express';
import { generarReportePDF } from '../controladores/reporteControlador.js';
import { verificarToken, esAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/productos-pdf', verificarToken, esAdmin, generarReportePDF);

export default router;