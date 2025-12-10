import { db } from '../config/db.js';
import PDFDocument from 'pdfkit';

export const generarReporteProductos = async () => {
    const [productos] = await db.query(
        'SELECT nombre, descripcion, precio, categoria, plataforma, stock FROM productos WHERE activo = TRUE ORDER BY precio DESC'
    );
    
    return productos;
};

export const generarReporteVentas = async () => {
    // Esta función genera datos de ejemplo para el reporte
    // En una aplicación real, esto vendría de una tabla de ventas
    
    const reporte = {
        titulo: 'Reporte de Ventas - PlayerOne',
        periodo: 'Enero 2024',
        totalVentas: 12500.75,
        productosVendidos: [
            { nombre: 'The Legend of Zelda: Tears of the Kingdom', cantidad: 45, total: 6750 },
            { nombre: 'God of War: Ragnarok', cantidad: 32, total: 1920 },
            { nombre: 'Elden Ring', cantidad: 28, total: 1680 },
            { nombre: 'Final Fantasy VII Rebirth', cantidad: 25, total: 1750 },
            { nombre: 'Super Mario Odyssey', cantidad: 20, total: 1200 }
        ]
    };
    
    return reporte;
};

export const generarPDFProductos = async () => {
    const productos = await generarReporteProductos();
    
    // Crear documento PDF
    const doc = new PDFDocument();
    const buffers = [];
    
    doc.on('data', buffers.push.bind(buffers));
    
    // Contenido del PDF
    doc.fontSize(20).text('PlayerOne - Reporte de Productos', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Fecha: ${new Date().toLocaleDateString()}`, { align: 'right' });
    doc.moveDown(2);
    
    // Tabla de productos
    let yPos = doc.y;
    
    // Encabezados de la tabla
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Producto', 50, yPos);
    doc.text('Categoría', 200, yPos);
    doc.text('Precio', 300, yPos);
    doc.text('Stock', 370, yPos);
    
    yPos += 20;
    doc.moveTo(50, yPos).lineTo(450, yPos).stroke();
    yPos += 10;
    
    // Filas de productos
    doc.font('Helvetica');
    productos.forEach((producto, index) => {
        if (yPos > 700) {
            doc.addPage();
            yPos = 50;
        }
        
        doc.text(producto.nombre.substring(0, 30), 50, yPos);
        doc.text(producto.categoria || 'N/A', 200, yPos);
        doc.text(`$${producto.precio.toFixed(2)}`, 300, yPos);
        doc.text(producto.stock.toString(), 370, yPos);
        
        yPos += 20;
        
        if (index < productos.length - 1) {
            doc.moveTo(50, yPos - 5).lineTo(450, yPos - 5).stroke('#CCCCCC');
            yPos += 5;
        }
    });
    
    // Total
    yPos += 10;
    doc.moveTo(50, yPos).lineTo(450, yPos).stroke();
    yPos += 20;
    doc.font('Helvetica-Bold').text(`Total de productos: ${productos.length}`, 50, yPos);
    
    doc.end();
    
    return new Promise((resolve) => {
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            resolve(pdfData);
        });
    });
};