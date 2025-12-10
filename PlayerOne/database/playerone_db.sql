-- database/playerone_db.sql
-- Script completo de creación e inicialización de la base de datos PlayerOne

-- ============================================
-- 1. CREAR BASE DE DATOS
-- ============================================
DROP DATABASE IF EXISTS playerone_db;
CREATE DATABASE playerone_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE playerone_db;

-- ============================================
-- 2. CREAR TABLAS
-- ============================================

-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('usuario', 'admin') DEFAULT 'usuario',
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Índices para optimización
    INDEX idx_email (email),
    INDEX idx_rol (rol),
    INDEX idx_activo (activo),
    INDEX idx_fecha_registro (fecha_registro)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de productos (videojuegos)
CREATE TABLE productos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(50),
    plataforma VARCHAR(50),
    imagen VARCHAR(255),
    stock INT DEFAULT 10,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Restricciones
    CHECK (precio >= 0),
    CHECK (stock >= 0),
    
    -- Índices
    INDEX idx_categoria (categoria),
    INDEX idx_plataforma (plataforma),
    INDEX idx_activo (activo),
    INDEX idx_precio (precio),
    INDEX idx_fecha_creacion (fecha_creacion),
    FULLTEXT idx_busqueda (nombre, descripcion, categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de carrito de compras
CREATE TABLE carrito (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT DEFAULT 1,
    fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Claves foráneas
    FOREIGN KEY (usuario_id) 
        REFERENCES usuarios(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    FOREIGN KEY (producto_id) 
        REFERENCES productos(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
    
    -- Restricción
    CHECK (cantidad > 0),
    
    -- Índices y restricción única
    UNIQUE KEY uk_usuario_producto (usuario_id, producto_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_producto (producto_id),
    INDEX idx_fecha_agregado (fecha_agregado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para registros eliminados lógicamente
CREATE TABLE productos_eliminados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    producto_id INT NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    motivo_eliminacion VARCHAR(255),
    fecha_eliminacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    eliminado_por INT,
    
    -- Clave foránea
    FOREIGN KEY (eliminado_por) 
        REFERENCES usuarios(id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
    
    -- Índices
    INDEX idx_producto_id (producto_id),
    INDEX idx_fecha_eliminacion (fecha_eliminacion),
    INDEX idx_eliminado_por (eliminado_por)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. INSERTAR DATOS DE PRUEBA
-- ============================================

-- Insertar usuarios de prueba
-- Contraseñas encriptadas con bcrypt: "Admin123!" y "Usuario123!"
INSERT INTO usuarios (nombre, email, password, rol) VALUES 
('Administrador PlayerOne', 'admin@playerone.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Hb6G5QYq7cFqH3JkKJ7RcFc2sQ7W6y', 'admin'),
('Usuario Demo', 'usuario@demo.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Hb6G5QYq7cFqH3JkKJ7RcFc2sQ7W6y', 'usuario'),
('Juan Pérez', 'juan.perez@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Hb6G5QYq7cFqH3JkKJ7RcFc2sQ7W6y', 'usuario'),
('María García', 'maria.garcia@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Hb6G5QYq7cFqH3JkKJ7RcFc2sQ7W6y', 'usuario'),
('Carlos López', 'carlos.lopez@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Hb6G5QYq7cFqH3JkKJ7RcFc2sQ7W6y', 'usuario');

-- Insertar productos de prueba (videojuegos)
INSERT INTO productos (nombre, descripcion, precio, categoria, plataforma, imagen, stock) VALUES
('The Legend of Zelda: Tears of the Kingdom', 'La esperada secuela de Breath of the Wild. Explora los cielos y las profundidades de Hyrule en una aventura épica llena de misterios, nuevos poderes y desafíos.', 69.99, 'Aventura', 'Nintendo Switch', 'https://via.placeholder.com/300x400/3498db/ffffff?text=Zelda+TOTK', 15),
('God of War: Ragnarok', 'Kratos y Atreus continúan su viaje épico en la mitología nórdica. Enfrenta dioses, monstruos y descubre secretos familiares en este juego de acción espectacular.', 59.99, 'Acción', 'PS5', 'https://via.placeholder.com/300x400/9b59b6/ffffff?text=God+of+War', 10),
('Elden Ring', 'Un RPG de mundo abierto creado en colaboración con George R. R. Martin. Explora las Tierras Intermedias, enfréntate a jefes épicos y forja tu propio destino.', 49.99, 'RPG', 'Multiplataforma', 'https://via.placeholder.com/300x400/2c3e50/ffffff?text=Elden+Ring', 20),
('Final Fantasy VII Rebirth', 'La continuación del remake del clásico de PlayStation. Sigue la historia de Cloud, Tifa, Aerith y Barrett en su búsqueda para salvar el planeta.', 69.99, 'RPG', 'PS5', 'https://via.placeholder.com/300x400/3498db/ffffff?text=FFVII+Rebirth', 8),
('Super Mario Odyssey', 'Únete a Mario en una aventura épica alrededor del mundo. Captura criaturas con tu sombrero mágico Cappy y salva a la Princesa Peach de Bowser.', 49.99, 'Aventura', 'Nintendo Switch', 'https://via.placeholder.com/300x400/e74c3c/ffffff?text=Mario+Odyssey', 12),
('Call of Duty: Modern Warfare III', 'La última entrega de la famosa saga de shooters. Incluye modo campaña, multijugador competitivo y el regreso del modo Zombies.', 59.99, 'Shooter', 'Multiplataforma', 'https://via.placeholder.com/300x400/2c3e50/ffffff?text=COD+MW3', 18),
('Cyberpunk 2077: Phantom Liberty', 'Expansión del aclamado RPG futurista. Nueva historia con Idris Elba, personajes y área de juego en Night City. Gameplay mejorado.', 39.99, 'RPG', 'Multiplataforma', 'https://via.placeholder.com/300x400/9b59b6/ffffff?text=Cyberpunk', 6),
('Spider-Man 2', 'Peter Parker y Miles Morales unen fuerzas para proteger Nueva York de nuevas amenazas. Juega con ambos Spider-Men, cada uno con habilidades únicas.', 69.99, 'Acción', 'PS5', 'https://via.placeholder.com/300x400/e74c3c/ffffff?text=Spider-Man+2', 14),
('Starfield', 'El nuevo RPG espacial de Bethesda. Explora más de 1000 planetas, personaliza tu nave y crea tu propia historia en la vasta galaxia.', 59.99, 'RPG', 'Xbox Series X', 'https://via.placeholder.com/300x400/3498db/ffffff?text=Starfield', 9),
('FIFA 24', 'El simulador de fútbol más realista. Todos los equipos, ligas y jugadores oficiales. Nuevos modos de juego y mecánicas mejoradas.', 49.99, 'Deportes', 'Multiplataforma', 'https://via.placeholder.com/300x400/27ae60/ffffff?text=FIFA+24', 22),
('Minecraft Legends', 'Nueva aventura en el universo de Minecraft. Lidera ejércitos, construye defensas y protege el Overworld de los piglins en esta estrategia de acción.', 39.99, 'Estrategia', 'Multiplataforma', 'https://via.placeholder.com/300x400/f39c12/ffffff?text=Minecraft', 17),
('Resident Evil 4 Remake', 'Remake del clásico de terror de supervivencia. Gráficos modernos, gameplay actualizado y nueva historia mientras rescata a la hija del presidente.', 49.99, 'Terror', 'Multiplataforma', 'https://via.placeholder.com/300x400/2c3e50/ffffff?text=RE4+Remake', 11),
('Hogwarts Legacy', 'Vive tu propia aventura en el mundo mágico de Harry Potter. Asiste a clases, aprende hechizos y explora Hogwarts en el siglo XIX.', 59.99, 'Aventura', 'Multiplataforma', 'https://via.placeholder.com/300x400/8e44ad/ffffff?text=Hogwarts', 13),
('Forza Horizon 5', 'Carreras de mundo abierto en México. Cientos de autos, eventos y paisajes espectaculares en el mejor juego de carreras.', 49.99, 'Carreras', 'Xbox Series X', 'https://via.placeholder.com/300x400/e67e22/ffffff?text=Forza+Horizon', 16),
('Animal Crossing: New Horizons', 'Crea tu propia isla paradisíaca. Decora, pesca, caza insectos y haz amigos en este relajante juego de simulación.', 54.99, 'Simulación', 'Nintendo Switch', 'https://via.placeholder.com/300x400/27ae60/ffffff?text=Animal+Crossing', 25);

-- Insertar productos en carrito de prueba
INSERT INTO carrito (usuario_id, producto_id, cantidad) VALUES
(2, 1, 1),   -- Usuario Demo: Zelda
(2, 3, 2),   -- Usuario Demo: Elden Ring x2
(2, 5, 1),   -- Usuario Demo: Mario Odyssey
(3, 2, 1),   -- Juan Pérez: God of War
(3, 4, 1),   -- Juan Pérez: Final Fantasy
(3, 6, 1),   -- Juan Pérez: Call of Duty
(4, 7, 1),   -- María García: Cyberpunk
(4, 8, 1);   -- María García: Spider-Man

-- Insertar registros de eliminación lógica de prueba
INSERT INTO productos_eliminados (producto_id, nombre, motivo_eliminacion, eliminado_por) VALUES
(100, 'Juego Antiguo Eliminado', 'Producto discontinuado por falta de stock', 1),
(101, 'Demo de Prueba', 'Producto de prueba eliminado después de desarrollo', 1);

-- ============================================
-- 4. CREAR VISTAS
-- ============================================

-- Vista de productos activos
CREATE VIEW vista_productos_activos AS
SELECT 
    id,
    nombre,
    descripcion,
    precio,
    categoria,
    plataforma,
    imagen,
    stock,
    fecha_creacion,
    CASE 
        WHEN stock = 0 THEN 'Agotado'
        WHEN stock <= 5 THEN 'Últimas unidades'
        ELSE 'Disponible'
    END as estado_stock
FROM productos
WHERE activo = TRUE
ORDER BY fecha_creacion DESC;

-- Vista de carrito con detalles
CREATE VIEW vista_carrito_detallado AS
SELECT 
    c.id as carrito_id,
    c.usuario_id,
    c.producto_id,
    p.nombre as producto_nombre,
    p.descripcion as producto_descripcion,
    p.precio as precio_unitario,
    p.imagen as producto_imagen,
    p.plataforma as plataforma,
    c.cantidad,
    (p.precio * c.cantidad) as subtotal,
    c.fecha_agregado
FROM carrito c
INNER JOIN productos p ON c.producto_id = p.id
WHERE p.activo = TRUE;

-- Vista de usuarios con estadísticas
CREATE VIEW vista_usuarios_estadisticas AS
SELECT 
    u.id,
    u.nombre,
    u.email,
    u.rol,
    u.fecha_registro,
    COUNT(DISTINCT c.producto_id) as productos_en_carrito,
    SUM(c.cantidad) as total_items_carrito,
    IFNULL(SUM(p.precio * c.cantidad), 0) as total_valor_carrito
FROM usuarios u
LEFT JOIN carrito c ON u.id = c.usuario_id
LEFT JOIN productos p ON c.producto_id = p.id AND p.activo = TRUE
WHERE u.activo = TRUE
GROUP BY u.id, u.nombre, u.email, u.rol, u.fecha_registro;

-- ============================================
-- 5. PROCEDIMIENTOS ALMACENADOS
-- ============================================

DELIMITER //

-- Procedimiento para actualizar stock
CREATE PROCEDURE sp_actualizar_stock(
    IN p_producto_id INT,
    IN p_cantidad INT,
    IN p_operacion ENUM('aumentar', 'disminuir')
)
BEGIN
    DECLARE stock_actual INT;
    
    -- Obtener stock actual
    SELECT stock INTO stock_actual 
    FROM productos 
    WHERE id = p_producto_id;
    
    IF stock_actual IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Producto no encontrado';
    END IF;
    
    IF p_operacion = 'disminuir' THEN
        IF stock_actual < p_cantidad THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Stock insuficiente';
        END IF;
        
        UPDATE productos 
        SET stock = stock - p_cantidad 
        WHERE id = p_producto_id;
    ELSE
        UPDATE productos 
        SET stock = stock + p_cantidad 
        WHERE id = p_producto_id;
    END IF;
    
    SELECT 'Stock actualizado correctamente' as mensaje;
END //

-- Procedimiento para obtener productos populares
CREATE PROCEDURE sp_productos_populares(IN p_limite INT)
BEGIN
    SELECT 
        p.id,
        p.nombre,
        p.precio,
        p.categoria,
        p.plataforma,
        COUNT(c.producto_id) as veces_agregado,
        SUM(c.cantidad) as total_cantidad
    FROM productos p
    LEFT JOIN carrito c ON p.id = c.producto_id
    WHERE p.activo = TRUE
    GROUP BY p.id, p.nombre, p.precio, p.categoria, p.plataforma
    ORDER BY veces_agregado DESC, total_cantidad DESC
    LIMIT p_limite;
END //

-- Procedimiento para limpiar carritos antiguos
CREATE PROCEDURE sp_limpiar_carritos_antiguos(IN p_dias INT)
BEGIN
    DELETE FROM carrito 
    WHERE fecha_agregado < DATE_SUB(NOW(), INTERVAL p_dias DAY);
    
    SELECT CONCAT('Carritos eliminados: ', ROW_COUNT()) as resultado;
END //

DELIMITER ;

-- ============================================
-- 6. TRIGGERS
-- ============================================

DELIMITER //

-- Trigger para validar stock mínimo
CREATE TRIGGER tr_validar_stock_minimo
BEFORE UPDATE ON productos
FOR EACH ROW
BEGIN
    IF NEW.stock < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El stock no puede ser negativo';
    END IF;
END //

-- Trigger para registrar eliminaciones
CREATE TRIGGER tr_registrar_eliminacion_producto
AFTER UPDATE ON productos
FOR EACH ROW
BEGIN
    IF OLD.activo = TRUE AND NEW.activo = FALSE THEN
        INSERT INTO productos_eliminados (producto_id, nombre, motivo_eliminacion)
        VALUES (OLD.id, OLD.nombre, 'Eliminado desde sistema');
    END IF;
END //

-- Trigger para actualizar fecha al modificar producto
CREATE TRIGGER tr_actualizar_fecha_modificacion
BEFORE UPDATE ON productos
FOR EACH ROW
BEGIN
    IF OLD.nombre != NEW.nombre OR 
       OLD.precio != NEW.precio OR 
       OLD.descripcion != NEW.descripcion OR
       OLD.categoria != NEW.categoria THEN
        SET NEW.fecha_creacion = NOW();
    END IF;
END //

DELIMITER ;

-- ============================================
-- 7. ÍNDICES ADICIONALES
-- ============================================

-- Índices compuestos para optimización
CREATE INDEX idx_productos_precio_categoria ON productos(precio, categoria);
CREATE INDEX idx_productos_plataforma_stock ON productos(plataforma, stock);
CREATE INDEX idx_carrito_usuario_fecha ON carrito(usuario_id, fecha_agregado);

-- Índice para búsqueda por fecha
CREATE INDEX idx_productos_fecha_activo ON productos(fecha_creacion, activo);

-- ============================================
-- 8. FUNCIONES
-- ============================================

DELIMITER //

-- Función para calcular descuento
CREATE FUNCTION fn_calcular_precio_con_descuento(
    p_precio DECIMAL(10,2),
    p_descuento DECIMAL(5,2)
) RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE precio_final DECIMAL(10,2);
    
    IF p_descuento < 0 OR p_descuento > 100 THEN
        SET p_descuento = 0;
    END IF;
    
    SET precio_final = p_precio * (1 - (p_descuento / 100));
    
    RETURN ROUND(precio_final, 2);
END //

-- Función para clasificar producto por precio
CREATE FUNCTION fn_clasificar_precio(
    p_precio DECIMAL(10,2)
) RETURNS VARCHAR(20)
DETERMINISTIC
BEGIN
    RETURN CASE
        WHEN p_precio < 20 THEN 'Económico'
        WHEN p_precio BETWEEN 20 AND 50 THEN 'Moderado'
        WHEN p_precio BETWEEN 50 AND 80 THEN 'Premium'
        ELSE 'Deluxe'
    END;
END //

DELIMITER ;

-- ============================================
-- 9. EVENTOS PROGRAMADOS (OPCIONAL)
-- ============================================

-- Nota: Requiere que el event_scheduler esté activado
-- SET GLOBAL event_scheduler = ON;

DELIMITER //

-- Evento para limpiar carritos abandonados cada semana
CREATE EVENT ev_limpiar_carritos_semanal
ON SCHEDULE EVERY 1 WEEK
STARTS CURRENT_TIMESTAMP
DO
BEGIN
    CALL sp_limpiar_carritos_antiguos(7); -- 7 días
END //

DELIMITER ;

-- ============================================
-- 10. USUARIOS Y PERMISOS (OPCIONAL PARA PRODUCCIÓN)
-- ============================================

/*
-- Crear usuario específico para la aplicación (recomendado en producción)
CREATE USER 'playerone_app'@'localhost' IDENTIFIED BY 'PlayerOneSecurePassword123!';

-- Otorgar permisos mínimos necesarios
GRANT SELECT, INSERT, UPDATE, DELETE ON playerone_db.* TO 'playerone_app'@'localhost';

-- Permisos específicos para procedimientos
GRANT EXECUTE ON PROCEDURE playerone_db.sp_actualizar_stock TO 'playerone_app'@'localhost';
GRANT EXECUTE ON PROCEDURE playerone_db.sp_productos_populares TO 'playerone_app'@'localhost';
GRANT EXECUTE ON PROCEDURE playerone_db.sp_limpiar_carritos_antiguos TO 'playerone_app'@'localhost';

FLUSH PRIVILEGES;
*/

-- ============================================
-- 11. CONSULTAS DE VERIFICACIÓN
-- ============================================

-- Mostrar resumen de la base de datos
SELECT 
    'Base de datos' as item,
    'PlayerOne' as nombre,
    'playerone_db' as valor
UNION ALL
SELECT 
    'Tablas creadas' as item,
    COUNT(*) as nombre,
    '' as valor
FROM information_schema.tables 
WHERE table_schema = 'playerone_db'
UNION ALL
SELECT 
    'Usuarios de prueba' as item,
    COUNT(*) as nombre,
    '' as valor
FROM usuarios
UNION ALL
SELECT 
    'Productos activos' as item,
    COUNT(*) as nombre,
    '' as valor
FROM productos
WHERE activo = TRUE
UNION ALL
SELECT 
    'Productos en carrito' as item,
    COUNT(DISTINCT producto_id) as nombre,
    CONCAT(SUM(cantidad), ' items') as valor
FROM carrito;

-- Mostrar estructura de tablas
SHOW TABLES;

-- ============================================
-- 12. MENSAJE FINAL
-- ============================================
SELECT '============================================' as mensaje;
SELECT '✅ BASE DE DATOS PLAYERONE CREADA EXITOSAMENTE' as mensaje;
SELECT '============================================' as mensaje;
SELECT '' as mensaje;
SELECT '📊 ESTADÍSTICAS INICIALES:' as mensaje;
SELECT '• 5 usuarios de prueba (1 admin, 4 usuarios)' as detalle;
SELECT '• 15 productos de videojuegos' as detalle;
SELECT '• 8 items en carritos de prueba' as detalle;
SELECT '• 2 productos eliminados lógicamente' as detalle;
SELECT '' as mensaje;
SELECT '🔧 ESTRUCTURA CREADA:' as mensaje;
SELECT '• 4 tablas principales' as detalle;
SELECT '• 3 vistas útiles' as detalle;
SELECT '• 3 procedimientos almacenados' as detalle;
SELECT '• 3 triggers de validación' as detalle;
SELECT '• 2 funciones de utilidad' as detalle;
SELECT '• 1 evento programado (opcional)' as detalle;
SELECT '' as mensaje;
SELECT '🔐 CREDENCIALES DE PRUEBA:' as mensaje;
SELECT '👑 Administrador: admin@playerone.com / Admin123!' as detalle;
SELECT '👤 Usuario: usuario@demo.com / Usuario123!' as detalle;
SELECT '' as mensaje;
SELECT '🚀 ¡BASE DE DATOS LISTA PARA PLAYERONE!' as mensaje;