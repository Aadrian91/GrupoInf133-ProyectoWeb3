-- database/playerone_db.sql
-- Script completo de creación de base de datos para PlayerOne

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS playerone_db;
USE playerone_db;

-- Eliminar tablas si existen (en orden correcto por dependencias)
DROP TABLE IF EXISTS productos_eliminados;
DROP TABLE IF EXISTS carrito;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS usuarios;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('usuario', 'admin') DEFAULT 'usuario',
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_rol (rol),
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de productos (videojuegos)
CREATE TABLE productos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
    categoria VARCHAR(50),
    plataforma VARCHAR(50),
    imagen VARCHAR(255),
    stock INT DEFAULT 10 CHECK (stock >= 0),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_categoria (categoria),
    INDEX idx_plataforma (plataforma),
    INDEX idx_activo (activo),
    INDEX idx_precio (precio),
    FULLTEXT idx_busqueda (nombre, descripcion, categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de carrito de compras
CREATE TABLE carrito (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT DEFAULT 1 CHECK (cantidad > 0),
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY uk_usuario_producto (usuario_id, producto_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_producto (producto_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para registros eliminados lógicamente
CREATE TABLE productos_eliminados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    producto_id INT NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    motivo_eliminacion VARCHAR(255),
    fecha_eliminacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    eliminado_por INT,
    FOREIGN KEY (eliminado_por) REFERENCES usuarios(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_producto_id (producto_id),
    INDEX idx_fecha_eliminacion (fecha_eliminacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar usuarios de prueba (contraseñas encriptadas con bcrypt)
-- Contraseña para ambos: "Admin123!" y "Usuario123!" encriptadas
INSERT INTO usuarios (nombre, email, password, rol) VALUES 
('Administrador PlayerOne', 'admin@playerone.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Hb6G5QYq7cFqH3JkKJ7RcFc2sQ7W6y', 'admin'),
('Usuario Demo', 'usuario@demo.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Hb6G5QYq7cFqH3JkKJ7RcFc2sQ7W6y', 'usuario'),
('Juan Pérez', 'juan@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Hb6G5QYq7cFqH3JkKJ7RcFc2sQ7W6y', 'usuario'),
('María García', 'maria@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Hb6G5QYq7cFqH3JkKJ7RcFc2sQ7W6y', 'usuario');

-- Insertar productos de prueba
INSERT INTO productos (nombre, descripcion, precio, categoria, plataforma, imagen, stock) VALUES
('The Legend of Zelda: Tears of the Kingdom', 'La esperada secuela de Breath of the Wild. Explora los cielos y las profundidades de Hyrule en una aventura épica.', 69.99, 'Aventura', 'Nintendo Switch', 'https://via.placeholder.com/300x400/3498db/ffffff?text=Zelda+TOTK', 15),
('God of War: Ragnarok', 'Kratos y Atreus continúan su viaje épico en la mitología nórdica. Enfrenta dioses y monstruos en este juego de acción.', 59.99, 'Acción', 'PS5', 'https://via.placeholder.com/300x400/9b59b6/ffffff?text=God+of+War', 10),
('Elden Ring', 'Un RPG de mundo abierto creado en colaboración con George R. R. Martin. Explora las Tierras Intermedias y descubre sus secretos.', 49.99, 'RPG', 'Multiplataforma', 'https://via.placeholder.com/300x400/2c3e50/ffffff?text=Elden+Ring', 20),
('Final Fantasy VII Rebirth', 'La continuación del remake del clásico de PlayStation. Sigue la historia de Cloud y sus amigos en esta épica aventura.', 69.99, 'RPG', 'PS5', 'https://via.placeholder.com/300x400/3498db/ffffff?text=FFVII+Rebirth', 8),
('Super Mario Odyssey', 'Únete a Mario en una aventura épica alrededor del mundo. Captura criaturas con tu sombrero mágico y salva a la Princesa Peach.', 49.99, 'Aventura', 'Nintendo Switch', 'https://via.placeholder.com/300x400/e74c3c/ffffff?text=Mario+Odyssey', 12),
('Call of Duty: Modern Warfare III', 'La última entrega de la famosa saga de shooters. Modo campaña, multijugador y Zombies incluidos.', 59.99, 'Shooter', 'Multiplataforma', 'https://via.placeholder.com/300x400/2c3e50/ffffff?text=COD+MW3', 18),
('Cyberpunk 2077: Phantom Liberty', 'Expansión del aclamado RPG futurista. Nueva historia, personajes y área de juego en Night City.', 39.99, 'RPG', 'Multiplataforma', 'https://via.placeholder.com/300x400/9b59b6/ffffff?text=Cyberpunk', 6),
('Spider-Man 2', 'Peter Parker y Miles Morales unen fuerzas para proteger Nueva York de nuevas amenazas. Juega con ambos Spider-Men.', 69.99, 'Acción', 'PS5', 'https://via.placeholder.com/300x400/e74c3c/ffffff?text=Spider-Man+2', 14),
('Starfield', 'El nuevo RPG espacial de Bethesda. Explora más de 1000 planetas y crea tu propia historia en la galaxia.', 59.99, 'RPG', 'Xbox Series X', 'https://via.placeholder.com/300x400/3498db/ffffff?text=Starfield', 9),
('FIFA 24', 'El simulador de fútbol más realista. Todos los equipos, ligas y jugadores oficiales.', 49.99, 'Deportes', 'Multiplataforma', 'https://via.placeholder.com/300x400/27ae60/ffffff?text=FIFA+24', 22),
('Minecraft Legends', 'Nueva aventura en el universo de Minecraft. Lidera ejércitos y protege el Overworld.', 39.99, 'Estrategia', 'Multiplataforma', 'https://via.placeholder.com/300x400/f39c12/ffffff?text=Minecraft', 17),
('Resident Evil 4 Remake', 'Remake del clásico de terror. Gráficos modernos y gameplay actualizado.', 49.99, 'Terror', 'Multiplataforma', 'https://via.placeholder.com/300x400/2c3e50/ffffff?text=RE4+Remake', 11);

-- Insertar algunos productos en carrito de prueba
INSERT INTO carrito (usuario_id, producto_id, cantidad) VALUES
(2, 1, 1),
(2, 3, 2),
(2, 5, 1),
(3, 2, 1),
(3, 4, 1);

-- Crear algunos registros de eliminación lógica de prueba
INSERT INTO productos_eliminados (producto_id, nombre, motivo_eliminacion, eliminado_por) VALUES
(100, 'Juego de Prueba Eliminado', 'Producto discontinuado', 1);

-- Crear vistas útiles
CREATE VIEW vista_productos_activos AS
SELECT id, nombre, precio, categoria, plataforma, stock
FROM productos
WHERE activo = TRUE;

CREATE VIEW vista_carrito_usuario AS
SELECT 
    c.usuario_id,
    c.producto_id,
    p.nombre,
    p.precio,
    c.cantidad,
    (p.precio * c.cantidad) as subtotal
FROM carrito c
JOIN productos p ON c.producto_id = p.id
WHERE p.activo = TRUE;

-- Crear procedimientos almacenados
DELIMITER //

CREATE PROCEDURE sp_actualizar_stock(
    IN p_producto_id INT,
    IN p_cantidad INT,
    IN p_operacion ENUM('incrementar', 'decrementar')
)
BEGIN
    IF p_operacion = 'decrementar' THEN
        UPDATE productos 
        SET stock = stock - p_cantidad 
        WHERE id = p_producto_id AND stock >= p_cantidad;
    ELSE
        UPDATE productos 
        SET stock = stock + p_cantidad 
        WHERE id = p_producto_id;
    END IF;
END //

CREATE PROCEDURE sp_obtener_productos_populares(IN p_limite INT)
BEGIN
    SELECT 
        p.id,
        p.nombre,
        p.precio,
        p.categoria,
        p.plataforma,
        IFNULL(SUM(c.cantidad), 0) as total_vendido
    FROM productos p
    LEFT JOIN carrito c ON p.id = c.producto_id
    WHERE p.activo = TRUE
    GROUP BY p.id, p.nombre, p.precio, p.categoria, p.plataforma
    ORDER BY total_vendido DESC
    LIMIT p_limite;
END //

DELIMITER ;

-- Crear triggers
DELIMITER //

CREATE TRIGGER tr_validar_stock_minimo
BEFORE UPDATE ON productos
FOR EACH ROW
BEGIN
    IF NEW.stock < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El stock no puede ser negativo';
    END IF;
END //

CREATE TRIGGER tr_registrar_eliminacion
AFTER UPDATE ON productos
FOR EACH ROW
BEGIN
    IF OLD.activo = TRUE AND NEW.activo = FALSE THEN
        INSERT INTO productos_eliminados (producto_id, nombre, motivo_eliminacion, eliminado_por)
        VALUES (OLD.id, OLD.nombre, 'Eliminación desde sistema', NULL);
    END IF;
END //

DELIMITER ;

-- Crear índices adicionales para optimización
CREATE INDEX idx_productos_precio_categoria ON productos(precio, categoria);
CREATE INDEX idx_usuarios_fecha_registro ON usuarios(fecha_registro);
CREATE INDEX idx_carrito_fecha ON carrito(fecha_agregado);

-- Mensaje de éxito
SELECT 'Base de datos PlayerOne creada exitosamente!' as mensaje;
