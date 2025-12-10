import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDatabase() {
    try {
        // Leer variables de entorno o usar valores por defecto
        const dbConfig = {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            multipleStatements: true
        };

        console.log('Conectando a MySQL...');
        const connection = await mysql.createConnection(dbConfig);
        
        // Leer el archivo SQL
        const sqlPath = path.join(__dirname, '..', 'database', 'playerone_db.sql');
        let sqlContent;
        
        try {
            sqlContent = await fs.readFile(sqlPath, 'utf8');
        } catch (error) {
            // Si no existe el archivo, usar SQL embebido
            console.log('Archivo SQL no encontrado, usando SQL embebido...');
            sqlContent = `
                CREATE DATABASE IF NOT EXISTS playerone_db;
                USE playerone_db;
                
                -- Tabla de usuarios
                CREATE TABLE IF NOT EXISTS usuarios (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    nombre VARCHAR(100) NOT NULL,
                    email VARCHAR(100) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    rol ENUM('usuario', 'admin') DEFAULT 'usuario',
                    activo BOOLEAN DEFAULT TRUE,
                    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                
                -- Tabla de productos
                CREATE TABLE IF NOT EXISTS productos (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    nombre VARCHAR(200) NOT NULL,
                    descripcion TEXT,
                    precio DECIMAL(10,2) NOT NULL,
                    categoria VARCHAR(50),
                    plataforma VARCHAR(50),
                    imagen VARCHAR(255),
                    stock INT DEFAULT 10,
                    activo BOOLEAN DEFAULT TRUE,
                    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                
                -- Tabla de carrito
                CREATE TABLE IF NOT EXISTS carrito (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    usuario_id INT,
                    producto_id INT,
                    cantidad INT DEFAULT 1,
                    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
                    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
                );
                
                -- Tabla de productos eliminados
                CREATE TABLE IF NOT EXISTS productos_eliminados (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    producto_id INT,
                    nombre VARCHAR(200),
                    motivo_eliminacion VARCHAR(255),
                    fecha_eliminacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    eliminado_por INT,
                    FOREIGN KEY (eliminado_por) REFERENCES usuarios(id)
                );
            `;
        }
        
        console.log('Ejecutando script SQL...');
        await connection.query(sqlContent);
        
        console.log('✅ Base de datos inicializada correctamente');
        
        // Insertar datos de prueba
        console.log('Insertando datos de prueba...');
        
        const insertData = `
            USE playerone_db;
            
            -- Insertar usuarios de prueba
            INSERT IGNORE INTO usuarios (nombre, email, password, rol) VALUES 
            ('Administrador PlayerOne', 'admin@playerone.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Hb6G5QYq7cFqH3JkKJ7RcFc2sQ7W6y', 'admin'),
            ('Usuario Demo', 'usuario@demo.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Hb6G5QYq7cFqH3JkKJ7RcFc2sQ7W6y', 'usuario');
            
            -- Insertar productos de prueba
            INSERT IGNORE INTO productos (nombre, descripcion, precio, categoria, plataforma, imagen, stock) VALUES
            ('The Legend of Zelda: Tears of the Kingdom', 'La esperada secuela de Breath of the Wild', 69.99, 'Aventura', 'Nintendo Switch', 'https://via.placeholder.com/300x400/3498db/ffffff?text=Zelda+TOTK', 15),
            ('God of War: Ragnarok', 'Kratos y Atreus continúan su viaje épico', 59.99, 'Acción', 'PS5', 'https://via.placeholder.com/300x400/9b59b6/ffffff?text=God+of+War', 10),
            ('Elden Ring', 'RPG de mundo abierto', 49.99, 'RPG', 'Multiplataforma', 'https://via.placeholder.com/300x400/2c3e50/ffffff?text=Elden+Ring', 20);
        `;
        
        await connection.query(insertData);
        
        console.log('✅ Datos de prueba insertados correctamente');
        
        await connection.end();
        console.log('✅ Conexión cerrada');
        
    } catch (error) {
        console.error('❌ Error inicializando la base de datos:', error.message);
        process.exit(1);
    }
}

// Ejecutar si se llama directamente
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    initDatabase();
}

export { initDatabase };