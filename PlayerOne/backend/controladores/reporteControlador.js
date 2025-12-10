import { generarPDFProductos, generarReporteProductos, generarReporteVentas } from '../modelos/reporteModelo.js';
import { db } from '../config/db.js';

export const generarReportePDF = async (req, res) => {
    try {
        const { tipo } = req.query;
        
        let pdfBuffer;
        let nombreArchivo;
        
        if (tipo === 'ventas') {
            pdfBuffer = await generarReporteVentasPDF();
            nombreArchivo = 'reporte-ventas.pdf';
        } else {
            pdfBuffer = await generarPDFProductos();
            nombreArchivo = 'reporte-productos.pdf';
        }
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${nombreArchivo}`);
        
        res.send(pdfBuffer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerReporteProductos = async (req, res) => {
    try {
        const productos = await generarReporteProductos();
        
        res.json({
            success: true,
            data: productos,
            total: productos.length,
            fechaGeneracion: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const obtenerReporteVentas = async (req, res) => {
    try {
        const reporte = await generarReporteVentas();
        
        res.json({
            success: true,
            data: reporte
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const generarReporteUsuarios = async (req, res) => {
    try {
        const [usuarios] = await db.query(`
            SELECT 
                u.id,
                u.nombre,
                u.email,
                u.rol,
                DATE(u.fecha_registro) as fecha_registro,
                COUNT(c.id) as total_compras,
                SUM(c.cantidad) as total_productos,
                IFNULL(SUM(p.precio * c.cantidad), 0) as total_gastado
            FROM usuarios u
            LEFT JOIN carrito c ON u.id = c.usuario_id
            LEFT JOIN productos p ON c.producto_id = p.id
            WHERE u.activo = TRUE
            GROUP BY u.id
            ORDER BY total_gastado DESC
        `);
        
        res.json({
            success: true,
            data: usuarios,
            total: usuarios.length,
            fechaGeneracion: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const generarReporteVentasPDF = async () => {
    const PDFDocument = (await import('pdfkit')).default;
    const doc = new PDFDocument();
    const buffers = [];
    
    doc.on('data', buffers.push.bind(buffers));
    
    // Cabecera del reporte
    doc.fontSize(20).text('PlayerOne - Reporte de Ventas', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, { align: 'right' });
    doc.moveDown(2);
    
    // Datos de ventas (ejemplo)
    const ventasEjemplo = [
        { producto: 'The Legend of Zelda: TOTK', cantidad: 45, total: 3149.55 },
        { producto: 'God of War: Ragnarok', cantidad: 32, total: 1919.68 },
        { producto: 'Elden Ring', cantidad: 28, total: 1399.72 },
        { producto: 'Final Fantasy VII Rebirth', cantidad: 25, total: 1749.75 },
        { producto: 'Super Mario Odyssey', cantidad: 20, total: 999.80 }
    ];
    
    let yPos = doc.y;
    
    // Tabla de ventas
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Producto', 50, yPos);
    doc.text('Cantidad', 250, yPos);
    doc.text('Total', 350, yPos);
    
    yPos += 20;
    doc.moveTo(50, yPos).lineTo(450, yPos).stroke();
    yPos += 10;
    
    // Filas de ventas
    doc.font('Helvetica');
    let totalVentas = 0;
    let totalProductos = 0;
    
    ventasEjemplo.forEach((venta, index) => {
        if (yPos > 700) {
            doc.addPage();
            yPos = 50;
        }
        
        doc.text(venta.producto.substring(0, 40), 50, yPos);
        doc.text(venta.cantidad.toString(), 250, yPos);
        doc.text(`$${venta.total.toFixed(2)}`, 350, yPos);
        
        totalVentas += venta.total;
        totalProductos += venta.cantidad;
        yPos += 20;
        
        if (index < ventasEjemplo.length - 1) {
            doc.moveTo(50, yPos - 5).lineTo(450, yPos - 5).stroke('#CCCCCC');
            yPos += 5;
        }
    });
    
    // Totales
    yPos += 10;
    doc.moveTo(50, yPos).lineTo(450, yPos).stroke();
    yPos += 20;
    
    doc.font('Helvetica-Bold');
    doc.text('TOTALES:', 50, yPos);
    doc.text(totalProductos.toString(), 250, yPos);
    doc.text(`$${totalVentas.toFixed(2)}`, 350, yPos);
    
    // Resumen
    yPos += 40;
    doc.fontSize(12).text('Resumen del Período', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10);
    doc.text(`• Total de ventas: $${totalVentas.toFixed(2)}`);
    doc.text(`• Total de productos vendidos: ${totalProductos}`);
    doc.text(`• Producto más vendido: The Legend of Zelda: TOTK (45 unidades)`);
    doc.text(`• Promedio de venta por producto: $${(totalVentas / ventasEjemplo.length).toFixed(2)}`);
    
    doc.end();
    
    return new Promise((resolve) => {
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            resolve(pdfData);
        });
    });
};