-- Crear la base de datos y seleccionarla
DROP DATABASE multi_envios_mi_tierra;
CREATE DATABASE multi_envios_mi_tierra;
USE multi_envios_mi_tierra;

-- Tabla de Estado
CREATE TABLE TBL_ESTADOS(
    COD_ESTADO BIGINT PRIMARY KEY AUTO_INCREMENT,
    TIP_ESTADO VARCHAR(20) UNIQUE NOT NULL,
    DETALLE VARCHAR(100) NOT NULL,
    ESTADO BOOLEAN DEFAULT 1 NOT NULL,
	USR_CREO VARCHAR(50) NOT NULL,
    FEC_CREACION DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    USR_MODIFICO VARCHAR(50) DEFAULT NULL,
    FEC_MODIFICO DATETIME DEFAULT NULL
) ENGINE = InnoDB
CHARACTER SET UTF8MB4
COLLATE utf8mb4_0900_ai_ci;

-- Tabla de Roles
CREATE TABLE TBL_MS_ROLES (
    COD_ROL BIGINT PRIMARY KEY AUTO_INCREMENT,
    NOM_ROL VARCHAR(100) UNIQUE NOT NULL,
    DES_ROL VARCHAR(100) NOT NULL,
    USR_CREO VARCHAR(50) NOT NULL,
    FEC_CREACION DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    USR_MODIFICO VARCHAR(50) DEFAULT NULL,
    FEC_MODIFICO DATETIME DEFAULT NULL,
    ESTADO BOOLEAN DEFAULT 1 NOT NULL
) ENGINE = InnoDB
CHARACTER SET UTF8MB4
COLLATE utf8mb4_0900_ai_ci;

-- Tabla de Objetos
CREATE TABLE TBL_MS_OBJETOS (
    COD_OBJETO BIGINT PRIMARY KEY AUTO_INCREMENT,
    NOM_OBJETO VARCHAR(100) NOT NULL,
    DES_OBJETO VARCHAR(100) NOT NULL,
    ESTADO BOOLEAN DEFAULT 1 NOT NULL,
	USR_CREO VARCHAR(50) NOT NULL,
    FEC_CREACION DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    USR_MODIFICO VARCHAR(50) DEFAULT NULL,
    FEC_MODIFICO DATETIME DEFAULT NULL
) ENGINE = InnoDB
CHARACTER SET UTF8MB4
COLLATE utf8mb4_0900_ai_ci;

-- Tabla de Permisos
CREATE TABLE TBL_MS_PERMISOS(
    COD_PERMISO BIGINT PRIMARY KEY AUTO_INCREMENT,
    FK_COD_ROL BIGINT NOT NULL,
    FK_COD_OBJETO BIGINT NOT NULL,
    DES_PERMISO_INSERCCION INT NOT NULL,
    DES_PERMISO_ELIMINACION INT NOT NULL,
    DES_PERMISO_ACTUALIZACION INT NOT NULL,
    DES_PERMISO_CONSULTAR INT NOT NULL,
    PERMISO_REPORTE INT NOT NULL,
    ESTADO BOOLEAN DEFAULT 1 NOT NULL,
	USR_CREO VARCHAR(50) NOT NULL,
    FEC_CREACION DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    USR_MODIFICO VARCHAR(50) DEFAULT NULL,
    FEC_MODIFICO DATETIME DEFAULT NULL,
    FOREIGN KEY (FK_COD_ROL) REFERENCES TBL_MS_ROLES (COD_ROL),
    FOREIGN KEY (FK_COD_OBJETO) REFERENCES TBL_MS_OBJETOS (COD_OBJETO)
) ENGINE = InnoDB
CHARACTER SET UTF8MB4
COLLATE utf8mb4_0900_ai_ci;

-- Tablas relacionadas con personas
CREATE TABLE TBL_GENEROS(
    COD_GENERO BIGINT PRIMARY KEY AUTO_INCREMENT,
    GENERO VARCHAR(15) UNIQUE NOT NULL,
    ESTADO BOOLEAN DEFAULT 1 NOT NULL,
	USR_CREO VARCHAR(50) NOT NULL,
    FEC_CREACION DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    USR_MODIFICO VARCHAR(50) DEFAULT NULL,
    FEC_MODIFICO DATETIME DEFAULT NULL
) ENGINE = InnoDB
CHARACTER SET UTF8MB4
COLLATE utf8mb4_0900_ai_ci;

CREATE TABLE TBL_PAISES(
    COD_PAIS BIGINT PRIMARY KEY AUTO_INCREMENT,
    NOM_PAIS VARCHAR(30) UNIQUE NOT NULL,
    NUM_ZONA VARCHAR(20) DEFAULT NULL,
    ESTADO BOOLEAN DEFAULT 1 NOT NULL,
	USR_CREO VARCHAR(50) NOT NULL,
    FEC_CREACION DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    USR_MODIFICO VARCHAR(50) DEFAULT NULL,
    FEC_MODIFICO DATETIME DEFAULT NULL
) ENGINE = InnoDB
CHARACTER SET UTF8MB4
COLLATE utf8mb4_0900_ai_ci;

CREATE TABLE TBL_DEPARTAMENTOS(
    COD_DEPARTAMENTO BIGINT PRIMARY KEY AUTO_INCREMENT,
    FK_COD_PAIS BIGINT,
    NOM_DEPARTAMENTO VARCHAR(50) UNIQUE NOT NULL,
    ESTADO BOOLEAN DEFAULT 1 NOT NULL,
	USR_CREO VARCHAR(50) NOT NULL,
    FEC_CREACION DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    USR_MODIFICO VARCHAR(50) DEFAULT NULL,
    FEC_MODIFICO DATETIME DEFAULT NULL,
    FOREIGN KEY (FK_COD_PAIS) REFERENCES TBL_PAISES (COD_PAIS)
) ENGINE = InnoDB
CHARACTER SET UTF8MB4
COLLATE utf8mb4_0900_ai_ci;

CREATE TABLE TBL_MUNICIPIOS(
    COD_MUNICIPIO BIGINT PRIMARY KEY AUTO_INCREMENT,
    FK_COD_DEPARTAMENTO BIGINT,
    NOM_MUNICIPIO VARCHAR(50) UNIQUE NOT NULL,
    ID_POSTAL VARCHAR(20) DEFAULT NULL,
    ESTADO BOOLEAN DEFAULT 1 NOT NULL,
	USR_CREO VARCHAR(50) NOT NULL,
    FEC_CREACION DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    USR_MODIFICO VARCHAR(50) DEFAULT NULL,
    FEC_MODIFICO DATETIME DEFAULT NULL,
    FOREIGN KEY (FK_COD_DEPARTAMENTO) REFERENCES TBL_DEPARTAMENTOS (COD_DEPARTAMENTO)
) ENGINE = InnoDB
CHARACTER SET UTF8MB4
COLLATE utf8mb4_0900_ai_ci;

CREATE TABLE TBL_PERSONAS (
    COD_PERSONA BIGINT PRIMARY KEY AUTO_INCREMENT,
    ID_PERSONA VARCHAR(30) NOT NULL,
    NOM_PERSONA VARCHAR(250) NOT NULL,
    FK_COD_GENERO BIGINT NOT NULL,
    FK_COD_PAIS BIGINT NOT NULL,
    FK_COD_DEPARTAMENTO BIGINT NOT NULL,
    FK_COD_MUNICIPIO BIGINT NOT NULL,
	USR_CREO VARCHAR(50) NOT NULL,
    FEC_CREACION DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    USR_MODIFICO VARCHAR(50) DEFAULT NULL,
    FEC_MODIFICO DATETIME DEFAULT NULL,
    FOREIGN KEY (FK_COD_GENERO) REFERENCES TBL_GENEROS (COD_GENERO),
    FOREIGN KEY (FK_COD_PAIS) REFERENCES TBL_PAISES (COD_PAIS),
    FOREIGN KEY (FK_COD_DEPARTAMENTO) REFERENCES TBL_DEPARTAMENTOS (COD_DEPARTAMENTO),
    FOREIGN KEY (FK_COD_MUNICIPIO) REFERENCES TBL_MUNICIPIOS (COD_MUNICIPIO)
) ENGINE = InnoDB
CHARACTER SET UTF8MB4
COLLATE utf8mb4_0900_ai_ci;

CREATE TABLE TBL_TELEFONOS(
    COD_TELEFONO BIGINT PRIMARY KEY AUTO_INCREMENT,
	FK_COD_PERSONA BIGINT NOT NULL,
    TELEFONO VARCHAR(15) UNIQUE NOT NULL,
	USR_CREO VARCHAR(50) NOT NULL,
    FEC_CREACION DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    USR_MODIFICO VARCHAR(50) DEFAULT NULL,
    FEC_MODIFICO DATETIME DEFAULT NULL,
	FOREIGN KEY (FK_COD_PERSONA) REFERENCES TBL_PERSONAS (COD_PERSONA)
) ENGINE = InnoDB
CHARACTER SET UTF8MB4
COLLATE utf8mb4_0900_ai_ci;

CREATE TABLE TBL_CORREOS(
    COD_CORREO BIGINT PRIMARY KEY AUTO_INCREMENT,
    FK_COD_PERSONA BIGINT NOT NULL,
    CORREO VARCHAR(50) UNIQUE NOT NULL,
	USR_CREO VARCHAR(50) NOT NULL,
    FEC_CREACION DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    USR_MODIFICO VARCHAR(50) DEFAULT NULL,
    FEC_MODIFICO DATETIME DEFAULT NULL,
	FOREIGN KEY (FK_COD_PERSONA) REFERENCES TBL_PERSONAS (COD_PERSONA)
) ENGINE = InnoDB
CHARACTER SET UTF8MB4
COLLATE utf8mb4_0900_ai_ci;

-- Tabla de Direcciones de Entrega
CREATE TABLE TBL_DIRECCIONES (
    COD_DIRECCION BIGINT PRIMARY KEY AUTO_INCREMENT,
    FK_COD_PERSONA BIGINT,
    FK_COD_MUNICIPIO BIGINT,  -- Relación solo con el municipio
    DIRECCION VARCHAR(255) DEFAULT NULL,
	USR_CREO VARCHAR(50) NOT NULL,
    FEC_CREACION DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    USR_MODIFICO VARCHAR(50) DEFAULT NULL,
    FEC_MODIFICO DATETIME DEFAULT NULL DEFAULT NULL,
    FOREIGN KEY (FK_COD_MUNICIPIO) REFERENCES TBL_MUNICIPIOS (COD_MUNICIPIO),
	FOREIGN KEY (FK_COD_PERSONA) REFERENCES TBL_PERSONAS (COD_PERSONA)
) ENGINE = InnoDB
CHARACTER SET UTF8MB4
COLLATE utf8mb4_0900_ai_ci;

-- Tabla de Usuarios
CREATE TABLE TBL_MS_USUARIOS (
    COD_USUARIO BIGINT PRIMARY KEY AUTO_INCREMENT,
    FK_COD_ROL BIGINT NOT NULL,
    FK_COD_PERSONA BIGINT NOT NULL,
    NOM_USUARIO VARCHAR(50) NOT NULL,
    CONTRASENA VARCHAR(255) NOT NULL,
    TOKEN VARCHAR(255) DEFAULT NULL,
    FEC_ULTIMA_CONEXION DATETIME NOT NULL,
    FEC_VENCIMIENTO DATE NOT NULL,
    NUM_INTENTOS INT DEFAULT '0' NOT NULL,
    USR_CREO VARCHAR(50) NOT NULL,
    FEC_CREACION DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    USR_MODIFICO VARCHAR(50) DEFAULT NULL,
    FEC_MODIFICACION DATETIME DEFAULT NULL,
    ESTADO BOOLEAN DEFAULT 1,
    FOREIGN KEY (FK_COD_ROL) REFERENCES TBL_MS_ROLES (COD_ROL),
    FOREIGN KEY (FK_COD_PERSONA) REFERENCES TBL_PERSONAS (COD_PERSONA)
) ENGINE = InnoDB
CHARACTER SET UTF8MB4
COLLATE utf8mb4_0900_ai_ci;

-- Tabla de Parámetros
CREATE TABLE TBL_MS_PARAMETROS (
    COD_PARAMETRO BIGINT PRIMARY KEY AUTO_INCREMENT,
    NOM_PARAMETRO VARCHAR(100) NOT NULL,
    VAL_PARAMETRO VARCHAR(100) NOT NULL,
    USR_CREO VARCHAR(50) NOT NULL,
    FEC_CREACION DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    USR_MODIFICO VARCHAR(50) DEFAULT NULL,
    FEC_MODIFICACION DATETIME DEFAULT NULL,
    ESTADO BOOLEAN DEFAULT 1
) ENGINE = InnoDB
CHARACTER SET UTF8MB4
COLLATE utf8mb4_0900_ai_ci;

-- Tabla de Bitácora
CREATE TABLE TBL_MS_BITACORA (
    COD_BITACORA BIGINT PRIMARY KEY AUTO_INCREMENT,
    FECHA DATETIME NOT NULL,
    USR_BITACORA VARCHAR(50) NOT NULL,
    OBJ_BITACORA VARCHAR(100) NOT NULL,
    ACCION VARCHAR(20) NOT NULL,
    DESCRIPCION VARCHAR(1000) NOT NULL,
	USR_CREO VARCHAR(50) NOT NULL,
    FEC_CREACION DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    USR_MODIFICO VARCHAR(50) DEFAULT NULL,
    FEC_MODIFICO DATETIME DEFAULT NULL
) ENGINE = InnoDB
CHARACTER SET UTF8MB4
COLLATE utf8mb4_0900_ai_ci;

CREATE TABLE TBL_PRECIOS (
    COD_PRECIO BIGINT PRIMARY KEY AUTO_INCREMENT,
    FK_COD_PAIS BIGINT NOT NULL,
    PRECIO DECIMAL(10, 2) NOT NULL,
	USR_CREO VARCHAR(50) NOT NULL,
    FEC_CREACION DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    USR_MODIFICO VARCHAR(50) DEFAULT NULL,
    FEC_MODIFICO DATETIME DEFAULT NULL,
    FOREIGN KEY (FK_COD_PAIS) REFERENCES TBL_PAISES (COD_PAIS)
) ENGINE = InnoDB
CHARACTER SET UTF8MB4
COLLATE utf8mb4_0900_ai_ci;

CREATE TABLE TBL_CAJAS (
    COD_CAJA BIGINT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	FK_COD_PRECIO BIGINT NOT NULL,
    ID_CAJA VARCHAR(50) NOT NULL,
    DETALLE VARCHAR(255) NOT NULL,
	USR_CREO VARCHAR(50) NOT NULL,
    FEC_CREACION DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    USR_MODIFICO VARCHAR(50) DEFAULT NULL,
    FEC_MODIFICO DATETIME DEFAULT NULL,
	FOREIGN KEY (FK_COD_PRECIO) REFERENCES TBL_PRECIOS (COD_PRECIO)
) ENGINE = InnoDB
CHARACTER SET UTF8MB4
COLLATE utf8mb4_0900_ai_ci;

CREATE TABLE TBL_TIPO_DESCUENTOS (
	COD_TIPO_DESCUENTO BIGINT PRIMARY KEY AUTO_INCREMENT,
    DETALLE VARCHAR(50) NOT NULL,
    ES_PORCENTAJE BOOLEAN NOT NULL,
	USR_CREO VARCHAR(50) NOT NULL,
    FEC_CREACION DATETIME DEFAULT CURRENT_TIMESTAMP,
    USR_MODIFICO VARCHAR(50) DEFAULT NULL,
    FEC_MODIFICO DATETIME DEFAULT NULL
) ENGINE = InnoDB
CHARACTER SET UTF8MB4
COLLATE utf8mb4_0900_ai_ci;

CREATE TABLE TBL_DESCUENTOS (
	COD_DESCUENTO BIGINT PRIMARY KEY AUTO_INCREMENT,
    FK_COD_TIPO_DESCUENTO BIGINT NOT NULL,
    NOMBRE VARCHAR(100) NOT NULL,
    CANTIDAD DECIMAL(10,2) NOT NULL,
	USR_CREO VARCHAR(50) NOT NULL,
    FEC_CREACION DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    USR_MODIFICO VARCHAR(50) DEFAULT NULL,
    FEC_MODIFICO DATETIME DEFAULT NULL
) ENGINE = InnoDB
CHARACTER SET UTF8MB4
COLLATE utf8mb4_0900_ai_ci;

-- Tablas operativas relacionadas con paquetes y pesos
CREATE TABLE TBL_OP_CLIENTES (
    COD_CLIENTE BIGINT PRIMARY KEY AUTO_INCREMENT,
    FK_COD_PERSONA BIGINT NOT NULL,
    USR_CREO VARCHAR(50) NOT NULL,
    FEC_CREACION DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    USR_MODIFICO VARCHAR(50) DEFAULT NULL,
    FEC_MODIFICACION DATETIME DEFAULT NULL,
    FOREIGN KEY (FK_COD_PERSONA) REFERENCES TBL_PERSONAS (COD_PERSONA)
) ENGINE = InnoDB
CHARACTER SET UTF8MB4
COLLATE utf8mb4_0900_ai_ci;

CREATE TABLE TBL_DATOS_ENVIO (
    COD_ENVIO BIGINT PRIMARY KEY AUTO_INCREMENT,
    FK_COD_CLIENTE BIGINT NOT NULL,
    CANTIDAD_CAJAS INT NOT NULL,
    FK_COD_PAIS_ORIGEN BIGINT NOT NULL,
    FK_COD_PAIS_DESTINO BIGINT NOT NULL,
    FK_COD_DEPARTAMENTO BIGINT NOT NULL,
    FK_COD_MUNICIPIO BIGINT NOT NULL,
    FK_COD_DIRECCION BIGINT NOT NULL,
    FK_COD_PERSONA BIGINT NOT NULL,
    NUM_ENVIO VARCHAR(50) DEFAULT NULL,
	USR_CREO VARCHAR(50) NOT NULL,
    FEC_CREACION DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    USR_MODIFICO VARCHAR(50) DEFAULT NULL,
    FEC_MODIFICO DATETIME DEFAULT NULL DEFAULT NULL,
    FOREIGN KEY (FK_COD_CLIENTE) REFERENCES TBL_OP_CLIENTES (COD_CLIENTE),
    FOREIGN KEY (FK_COD_PAIS_ORIGEN) REFERENCES TBL_PAISES (COD_PAIS),
    FOREIGN KEY (FK_COD_PAIS_DESTINO) REFERENCES TBL_PAISES (COD_PAIS),
    FOREIGN KEY (FK_COD_DEPARTAMENTO) REFERENCES TBL_DEPARTAMENTOS (COD_DEPARTAMENTO),
    FOREIGN KEY (FK_COD_MUNICIPIO) REFERENCES TBL_MUNICIPIOS (COD_MUNICIPIO),
    FOREIGN KEY (FK_COD_DIRECCION) REFERENCES TBL_DIRECCIONES (COD_DIRECCION),
    FOREIGN KEY (FK_COD_PERSONA) REFERENCES TBL_PERSONAS (COD_PERSONA)
) ENGINE = InnoDB
CHARACTER SET UTF8MB4
COLLATE utf8mb4_0900_ai_ci;

CREATE TABLE TBL_PAQUETE (
    COD_PAQUETE BIGINT PRIMARY KEY AUTO_INCREMENT,
    FK_COD_CAJA BIGINT NOT NULL,
    ESTADO TINYINT DEFAULT 0 NOT NULL,
    FK_COD_CLIENTE BIGINT NOT NULL,
    FK_COD_ENVIO BIGINT NOT NULL,
    FEC_ENTREGA DATETIME DEFAULT NULL,
	USR_CREO VARCHAR(50) NOT NULL,
    FEC_CREACION DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    USR_MODIFICO VARCHAR(50) DEFAULT NULL,
    FEC_MODIFICO DATETIME DEFAULT NULL,
    FOREIGN KEY (FK_COD_CAJA) REFERENCES TBL_CAJAS (COD_CAJA),
    FOREIGN KEY (FK_COD_CLIENTE) REFERENCES TBL_OP_CLIENTES (COD_CLIENTE),
    FOREIGN KEY (FK_COD_ENVIO) REFERENCES TBL_DATOS_ENVIO (COD_ENVIO)
) ENGINE = InnoDB
CHARACTER SET UTF8MB4
COLLATE utf8mb4_0900_ai_ci;

-- PORCEDIMIENTOS ALMACENADOS TABLA ESTADO
DELIMITER $$

CREATE PROCEDURE GET_ROL_OBJETOS_PERMISOS_FOR_USER (
    IN userId BIGINT
)
BEGIN
    START TRANSACTION;
    SELECT
        u.COD_USUARIO,
        r.NOM_ROL AS roleName,
        o.NOM_OBJETO AS objectName,
        p.DES_PERMISO_INSERCCION AS canInsert,
        p.DES_PERMISO_ELIMINACION AS canDelete,
        p.DES_PERMISO_ACTUALIZACION AS canUpdate,
        p.DES_PERMISO_CONSULTAR AS canView,
        p.PERMISO_REPORTE AS canReport
    FROM
        TBL_MS_USUARIOS u
        JOIN TBL_MS_ROLES r ON u.FK_COD_ROL = r.COD_ROL
        JOIN TBL_MS_PERMISOS p ON p.FK_COD_ROL = r.COD_ROL
        JOIN TBL_MS_OBJETOS o ON p.FK_COD_OBJETO = o.COD_OBJETO
    WHERE
        u.COD_USUARIO = userId;
    COMMIT;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE GET_PERSONA_INFO_FOR_USER (
    IN userId BIGINT
)
BEGIN
    SELECT 
        p.NOM_PERSONA
    FROM 
        TBL_MS_USUARIOS u
    JOIN 
        TBL_PERSONAS p ON u.FK_COD_PERSONA = p.COD_PERSONA
    WHERE 
        u.COD_USUARIO = userId;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE INS_PAIS(
    IN p_nom_pais VARCHAR(30),
    IN p_num_zona VARCHAR(20),
    IN p_usr_creo VARCHAR(50)
)
BEGIN
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Rollback en caso de error
        ROLLBACK;
        -- Mensaje de error
        SELECT 'Error al insertar el país. Por favor, verifique los datos.' AS Mensaje;
    END;

    -- Iniciar la transacción
    START TRANSACTION;

    -- Realizar la inserción
    INSERT INTO TBL_PAISES (NOM_PAIS, NUM_ZONA, USR_CREO)
    VALUES (p_nom_pais, p_num_zona, p_usr_creo);

    -- Confirmar la transacción
    COMMIT;

    -- Mensaje de éxito
    SELECT 'País insertado correctamente.' AS Mensaje;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE INS_DEPARTAMENTO(
    IN p_fk_cod_pais BIGINT,
    IN p_nom_departamento VARCHAR(50),
    IN p_usr_creo VARCHAR(50)
)
BEGIN
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Rollback en caso de error
        ROLLBACK;
        -- Mensaje de error
        SELECT 'Error al insertar el departamento. Verifique los datos.' AS Mensaje;
    END;

    -- Iniciar la transacción
    START TRANSACTION;

    -- Verificar que el país existe
    IF (SELECT COUNT(*) FROM TBL_PAISES WHERE COD_PAIS = p_fk_cod_pais) = 0 THEN
        -- Si el país no existe, mostrar mensaje de error y finalizar
        ROLLBACK;
        SELECT 'Error: El país especificado no existe.' AS Mensaje;
    ELSE
        -- Realizar la inserción
        INSERT INTO TBL_DEPARTAMENTOS (FK_COD_PAIS, NOM_DEPARTAMENTO, USR_CREO)
        VALUES (p_fk_cod_pais, p_nom_departamento, p_usr_creo);

        -- Confirmar la transacción
        COMMIT;

        -- Mensaje de éxito
        SELECT 'Departamento insertado correctamente.' AS Mensaje;
    END IF;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE INS_MUNICIPIO(
    IN p_fk_cod_departamento BIGINT,
    IN p_nom_municipio VARCHAR(50),
    IN p_id_postal VARCHAR(20),
    IN p_usr_creo VARCHAR(50)
)
BEGIN
    -- Manejador de errores que realiza rollback y muestra un mensaje
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Realizar rollback en caso de error
        ROLLBACK;
        -- Mensaje de error
        SELECT 'Error al insertar el municipio. Verifique los datos.' AS Mensaje;
    END;

    -- Iniciar la transacción
    START TRANSACTION;

    -- Verificar que el departamento existe en la tabla TBL_DEPARTAMENTOS
    IF (SELECT COUNT(*) FROM TBL_DEPARTAMENTOS WHERE COD_DEPARTAMENTO = p_fk_cod_departamento) = 0 THEN
        -- Si el departamento no existe, hacer rollback y mostrar mensaje de error
        ROLLBACK;
        SELECT 'Error: El departamento especificado no existe.' AS Mensaje;
    ELSE
        -- Si el departamento existe, realizar la inserción en la tabla TBL_MUNICIPIOS
        INSERT INTO TBL_MUNICIPIOS (FK_COD_DEPARTAMENTO, NOM_MUNICIPIO, ID_POSTAL, USR_CREO)
        VALUES (p_fk_cod_departamento, p_nom_municipio, p_id_postal, p_usr_creo);

        -- Confirmar la transacción
        COMMIT;

        -- Mensaje de éxito
        SELECT 'Municipio insertado correctamente.' AS Mensaje;
    END IF;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE GET_ALL_LOCATIONS(
    IN p_detalle INT,               -- 1: País, 2: País con departamentos, 3: País con departamentos y municipios
    IN p_cod_pais INT,              -- Código del país (requerido para detalle 2 y 3)
    IN p_cod_departamento INT        -- Código del departamento (requerido solo para detalle 3)
)
BEGIN
    -- Obtener solo los países
    IF p_detalle = 1 THEN
        SELECT 
            P.COD_PAIS, 
            P.NOM_PAIS, 
            P.NUM_ZONA, 
            P.ESTADO, 
            P.USR_CREO, 
            P.FEC_CREACION, 
            P.USR_MODIFICO, 
            P.FEC_MODIFICO
        FROM TBL_PAISES P;

    -- Obtener países con sus departamentos
    ELSEIF p_detalle = 2 THEN
        SELECT 
            DISTINCT 
            P.COD_PAIS, 
            P.NOM_PAIS, 
            P.NUM_ZONA, 
            P.ESTADO AS ESTADO_PAIS,
            D.COD_DEPARTAMENTO, 
            D.NOM_DEPARTAMENTO, 
            D.ESTADO AS ESTADO_DEPARTAMENTO
        FROM TBL_PAISES P
        LEFT JOIN TBL_DEPARTAMENTOS D ON P.COD_PAIS = D.FK_COD_PAIS
        WHERE P.COD_PAIS = p_cod_pais -- Filtrar por país
        ORDER BY P.COD_PAIS, D.COD_DEPARTAMENTO;

    -- Obtener ciudades de un país y departamento específicos
    ELSEIF p_detalle = 3 THEN
        SELECT 
            P.COD_PAIS, 
            P.NOM_PAIS, 
            D.COD_DEPARTAMENTO, 
            D.NOM_DEPARTAMENTO, 
            M.COD_MUNICIPIO, 
            M.NOM_MUNICIPIO, 
            M.ID_POSTAL, 
            M.ESTADO AS ESTADO_MUNICIPIO
        FROM TBL_PAISES P
        LEFT JOIN TBL_DEPARTAMENTOS D ON P.COD_PAIS = D.FK_COD_PAIS
        LEFT JOIN TBL_MUNICIPIOS M ON D.COD_DEPARTAMENTO = M.FK_COD_DEPARTAMENTO
        WHERE P.COD_PAIS = p_cod_pais  -- Filtrar por país
          AND D.COD_DEPARTAMENTO = p_cod_departamento -- Filtrar por departamento
        ORDER BY P.COD_PAIS, D.COD_DEPARTAMENTO, M.COD_MUNICIPIO;

    -- Si el valor de p_detalle no es válido, mostrar un mensaje de error
    ELSE
        SELECT 'Error: Parámetro de detalle no válido. Use 1, 2 o 3.' AS Mensaje;
    END IF;
END$$

DELIMITER ;

DELIMITER //

CREATE PROCEDURE GET_COUNTRIES_1()
BEGIN
    SELECT *
    FROM TBL_PAISES
    WHERE ESTADO = 1;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE GET_DEPARMENTS_1()
BEGIN
    SELECT *
    FROM TBL_DEPARTAMENTOS
    WHERE ESTADO = 1;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE GET_MUNICIPIOS_1()
BEGIN
    SELECT *
    FROM TBL_MUNICIPIOS
    WHERE ESTADO = 1;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE GET_OBJETOS()
BEGIN
    SELECT *
    FROM TBL_MS_OBJETOS;
END //

DELIMITER ;

DELIMITER //
CREATE PROCEDURE INS_OBJETO(
    IN p_nom_objeto VARCHAR(100),
    IN p_des_objeto VARCHAR(100),
    IN p_usr_creo VARCHAR(50)
)
BEGIN
    DECLARE v_objeto_existe INT;

    -- Validar si el objeto ya existe
    SELECT COUNT(*) INTO v_objeto_existe 
    FROM TBL_MS_OBJETOS 
    WHERE NOM_OBJETO = p_nom_objeto;

    -- Si el objeto no existe, proceder con la inserción
    IF v_objeto_existe = 0 THEN
        START TRANSACTION;
        
        BEGIN
            DECLARE EXIT HANDLER FOR SQLEXCEPTION
            BEGIN
                ROLLBACK;
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Error al insertar el objeto. Verifica los datos ingresados.';
            END;

            INSERT INTO TBL_MS_OBJETOS (NOM_OBJETO, DES_OBJETO, USR_CREO)
            VALUES (p_nom_objeto, p_des_objeto, p_usr_creo);
            
            COMMIT;
            
            SELECT 'Objeto insertado correctamente.' AS mensaje, TRUE AS success;
        END;
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El nombre del objeto ya existe.';
    END IF;
END //
DELIMITER ;

DELIMITER $$

CREATE PROCEDURE UPD_OBJETO_ESTADO(
    IN p_COD_OBJETO BIGINT,
    IN p_ESTADO BOOLEAN,
    IN p_USR_MODIFICO VARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Si ocurre un error, hacemos rollback y mostramos un mensaje
        ROLLBACK;
        SELECT 'Error al actualizar el estado del objeto' AS mensaje;
    END;
    
    -- Iniciar transacción
    START TRANSACTION;
    
    -- Actualizar el estado del objeto
    UPDATE TBL_MS_OBJETOS
    SET ESTADO = p_ESTADO,
        USR_MODIFICO = p_USR_MODIFICO,
        FEC_MODIFICO = NOW()
    WHERE COD_OBJETO = p_COD_OBJETO;
    
    -- Confirmar cambios si no hubo errores
    COMMIT;
    
    -- Mensaje de éxito
    SELECT 'Estado del objeto actualizado correctamente' AS mensaje;
END $$

DELIMITER ;

DELIMITER //

CREATE PROCEDURE UPD_OBJETO(
    IN p_cod_objeto BIGINT,
    IN p_nom_objeto VARCHAR(100),
    IN p_des_objeto VARCHAR(100),
    IN p_usr_modifico VARCHAR(50)
)
BEGIN
    DECLARE v_objeto_existe INT;

    -- Verificar si el nombre del objeto ya existe en otro registro
    SELECT COUNT(*) INTO v_objeto_existe 
    FROM TBL_MS_OBJETOS 
    WHERE NOM_OBJETO = p_nom_objeto AND COD_OBJETO != p_cod_objeto;

    IF v_objeto_existe = 0 THEN
        -- Iniciar la transacción
        START TRANSACTION;
        
        BEGIN
            -- Manejar cualquier excepción que ocurra durante la transacción
            DECLARE EXIT HANDLER FOR SQLEXCEPTION
            BEGIN
                ROLLBACK;
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Error al actualizar el objeto. Verifica los datos ingresados.';
            END;

            -- Intentar actualizar el objeto existente
            UPDATE TBL_MS_OBJETOS
            SET NOM_OBJETO = p_nom_objeto,
                DES_OBJETO = p_des_objeto,
                USR_MODIFICO = p_usr_modifico,
                FEC_MODIFICO = CURRENT_TIMESTAMP
            WHERE COD_OBJETO = p_cod_objeto;
            
            COMMIT;
            SELECT 'Objeto actualizado correctamente.' AS mensaje, TRUE AS success;
        END;
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El nombre del objeto ya existe.';
    END IF;
END //

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE INS_PERMISOS (
    IN p_fk_cod_rol BIGINT,
    IN p_fk_cod_objeto BIGINT,
    IN p_des_permiso_ins INT,
    IN p_des_permiso_elim INT,
    IN p_des_permiso_act INT,
    IN p_des_permiso_cons INT,
    IN p_permiso_reporte INT,
    IN p_usr_creo VARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- En caso de error, deshacer la transacción y mostrar mensaje
        ROLLBACK;
        SELECT 'Error al insertar el permiso, transacción revertida.' AS mensaje;
    END;

    -- Iniciar la transacción
    START TRANSACTION;

    -- Insertar el nuevo permiso
    INSERT INTO TBL_MS_PERMISOS (
        FK_COD_ROL,
        FK_COD_OBJETO,
        DES_PERMISO_INSERCCION,
        DES_PERMISO_ELIMINACION,
        DES_PERMISO_ACTUALIZACION,
        DES_PERMISO_CONSULTAR,
        PERMISO_REPORTE,
        USR_CREO
    )
    VALUES (
        p_fk_cod_rol,
        p_fk_cod_objeto,
        p_des_permiso_ins,
        p_des_permiso_elim,
        p_des_permiso_act,
        p_des_permiso_cons,
        p_permiso_reporte,
        p_usr_creo
    );

    -- Confirmar la transacción
    COMMIT;

    -- Mensaje de éxito
    SELECT 'Permiso insertado correctamente.' AS mensaje;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE GET_ALL_COUNTRIES()
BEGIN
    SELECT 
        P.COD_PAIS, 
        P.NOM_PAIS, 
        P.NUM_ZONA, 
        P.ESTADO, 
        P.USR_CREO, 
        P.FEC_CREACION, 
        P.USR_MODIFICO, 
        P.FEC_MODIFICO
    FROM TBL_PAISES P;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE GET_COUNTRIES_WITH_DEPARTMENTS(
    IN p_cod_pais INT               -- Código del país (requerido para este procedimiento)
)
BEGIN
    SELECT 
        DISTINCT 
        P.COD_PAIS, 
        P.NOM_PAIS, 
        P.NUM_ZONA, 
        P.ESTADO AS ESTADO_PAIS,
        D.COD_DEPARTAMENTO, 
        D.NOM_DEPARTAMENTO, 
        D.ESTADO AS ESTADO_DEPARTAMENTO
    FROM TBL_PAISES P
    LEFT JOIN TBL_DEPARTAMENTOS D ON P.COD_PAIS = D.FK_COD_PAIS
    WHERE P.COD_PAIS = p_cod_pais -- Filtrar por país
    ORDER BY P.COD_PAIS, D.COD_DEPARTAMENTO;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE GET_CITIES_BY_COUNTRY_AND_DEPARTMENT(
    IN p_cod_pais INT,              -- Código del país (requerido para este procedimiento)
    IN p_cod_departamento INT        -- Código del departamento (requerido para este procedimiento)
)
BEGIN
    SELECT 
        P.COD_PAIS, 
        P.NOM_PAIS, 
        D.COD_DEPARTAMENTO, 
        D.NOM_DEPARTAMENTO, 
        M.COD_MUNICIPIO, 
        M.NOM_MUNICIPIO, 
        M.ID_POSTAL, 
        M.ESTADO AS ESTADO_MUNICIPIO
    FROM TBL_PAISES P
    LEFT JOIN TBL_DEPARTAMENTOS D ON P.COD_PAIS = D.FK_COD_PAIS
    LEFT JOIN TBL_MUNICIPIOS M ON D.COD_DEPARTAMENTO = M.FK_COD_DEPARTAMENTO
    WHERE P.COD_PAIS = p_cod_pais  -- Filtrar por país
      AND D.COD_DEPARTAMENTO = p_cod_departamento -- Filtrar por departamento
    ORDER BY P.COD_PAIS, D.COD_DEPARTAMENTO, M.COD_MUNICIPIO;
END$$

DELIMITER ;

DELIMITER //

CREATE PROCEDURE GET_ROLES()
BEGIN
    SELECT *
    FROM TBL_MS_ROLES; -- Devuelve todos los roles sin filtro
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE GET_ROLES_1()
BEGIN
    SELECT *
    FROM TBL_MS_ROLES
    WHERE ESTADO = 1;
END //

DELIMITER ;

DELIMITER //
CREATE PROCEDURE INS_ROL(
    IN p_nom_rol VARCHAR(100),
    IN p_des_rol VARCHAR(100),
    IN p_usr_creo VARCHAR(50)
)
BEGIN
    DECLARE v_rol_existe INT;

    -- Validar si el rol ya existe
    SELECT COUNT(*) INTO v_rol_existe 
    FROM TBL_MS_ROLES 
    WHERE NOM_ROL = p_nom_rol;

    -- Si el rol no existe, proceder con la inserción
    IF v_rol_existe = 0 THEN
        START TRANSACTION;
        
        BEGIN
            DECLARE EXIT HANDLER FOR SQLEXCEPTION
            BEGIN
                ROLLBACK;
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Error al insertar el rol. Verifica los datos ingresados.';
            END;
            
            INSERT INTO TBL_MS_ROLES (NOM_ROL, DES_ROL, USR_CREO)
            VALUES (p_nom_rol, p_des_rol, p_usr_creo);
            
            COMMIT;
            
            SELECT 'Rol insertado correctamente.' AS mensaje, TRUE AS success;
        END;
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El nombre del rol ya existe.';
    END IF;
END //
DELIMITER ;

DELIMITER $$

CREATE PROCEDURE UPD_ROL_ESTADO(
    IN p_COD_ROL BIGINT,
    IN p_ESTADO BOOLEAN,
    IN p_USR_MODIFICO VARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Si ocurre un error, hacemos rollback y mostramos un mensaje
        ROLLBACK;
        SELECT 'Error al actualizar el estado del rol' AS mensaje;
    END;
    
    -- Iniciar transacción
    START TRANSACTION;
    
    -- Actualizar el estado del rol
    UPDATE TBL_MS_ROLES
    SET ESTADO = p_ESTADO,
        USR_MODIFICO = p_USR_MODIFICO,
        FEC_MODIFICO = NOW()
    WHERE COD_ROL = p_COD_ROL;
    
    -- Confirmar cambios si no hubo errores
    COMMIT;
    
    -- Mensaje de éxito
    SELECT 'Estado del rol actualizado correctamente' AS mensaje;
END $$

DELIMITER ;

DELIMITER //
CREATE PROCEDURE UPD_ROL(
    IN p_cod_rol BIGINT,
    IN p_nom_rol VARCHAR(100),
    IN p_des_rol VARCHAR(100),
    IN p_usr_modifico VARCHAR(50)
)
BEGIN
    DECLARE v_rol_existe INT;

    -- Verificar si el nombre del rol ya existe en otro registro
    SELECT COUNT(*) INTO v_rol_existe 
    FROM TBL_MS_ROLES 
    WHERE NOM_ROL = p_nom_rol AND COD_ROL != p_cod_rol;

    IF v_rol_existe = 0 THEN
        -- Iniciar la transacción
        START TRANSACTION;
        
	BEGIN
        -- Manejar cualquier excepción que ocurra durante la transacción
        DECLARE EXIT HANDLER FOR SQLEXCEPTION
        BEGIN
            ROLLBACK;
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Error al actualizar el rol. Verifica los datos ingresados.';
        END;

        -- Intentar actualizar el rol existente
        UPDATE TBL_MS_ROLES
        SET NOM_ROL = p_nom_rol,
            DES_ROL = p_des_rol,
            USR_MODIFICO = p_usr_modifico,
            FEC_MODIFICO = CURRENT_TIMESTAMP
        WHERE COD_ROL = p_cod_rol;
        
            COMMIT;
            SELECT 'Rol actualizado correctamente.' AS mensaje, TRUE AS success;
        END;
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El nombre del rol ya existe.';
    END IF;
END //
DELIMITER ;

DELIMITER //

CREATE PROCEDURE UPD_CONTRASENA (
    IN p_cod_usuario BIGINT,
    IN p_nueva_contrasena VARCHAR(255),
    IN p_usr_modifico VARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- En caso de error, deshacer los cambios y devolver un mensaje de error
        ROLLBACK;
        SELECT 'Error al actualizar la contraseña' AS mensaje;
    END;

    -- Iniciar la transacción
    START TRANSACTION;

    -- Actualizar la contraseña y usuario que modifica
    UPDATE TBL_MS_USUARIOS
    SET CONTRASENA = p_nueva_contrasena,
        USR_MODIFICO = p_usr_modifico,
        FEC_MODIFICACION = NOW()
    WHERE COD_USUARIO = p_cod_usuario;

    -- Confirmar si se realizó el cambio
    IF ROW_COUNT() > 0 THEN
        -- Confirmar los cambios
        COMMIT;
        SELECT 'Contraseña actualizada exitosamente' AS mensaje;
    ELSE
        -- Deshacer los cambios si no se afectó ninguna fila
        ROLLBACK;
        SELECT 'No se encontró el usuario o no se pudo actualizar la contraseña' AS mensaje;
    END IF;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE GET_PERMISOS()
BEGIN
    SELECT 
        permisos.COD_PERMISO,
        roles.NOM_ROL,
        objetos.NOM_OBJETO,
        permisos.DES_PERMISO_INSERCCION,
        permisos.DES_PERMISO_ELIMINACION,
        permisos.DES_PERMISO_ACTUALIZACION,
        permisos.DES_PERMISO_CONSULTAR,
        permisos.PERMISO_REPORTE,
        permisos.ESTADO,
        permisos.USR_CREO,
        permisos.FEC_CREACION,
        permisos.USR_MODIFICO,
        permisos.FEC_MODIFICO
    FROM TBL_MS_PERMISOS AS permisos
    JOIN TBL_MS_ROLES AS roles ON permisos.FK_COD_ROL = roles.COD_ROL
    JOIN TBL_MS_OBJETOS AS objetos ON permisos.FK_COD_OBJETO = objetos.COD_OBJETO;
END //

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE UPD_PERMISO_ESTADO(
    IN p_COD_PERMISO BIGINT,
    IN p_ESTADO BOOLEAN,
    IN p_USR_MODIFICO VARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Si ocurre un error, hacemos rollback y mostramos un mensaje
        ROLLBACK;
        SELECT 'Error al actualizar el estado del permiso' AS mensaje;
    END;
    
    -- Iniciar transacción
    START TRANSACTION;
    
    -- Actualizar el estado del permiso
    UPDATE TBL_MS_PERMISOS
    SET ESTADO = p_ESTADO,
        USR_MODIFICO = p_USR_MODIFICO,
        FEC_MODIFICO = NOW()
    WHERE COD_PERMISO = p_COD_PERMISO;
    
    -- Confirmar cambios si no hubo errores
    COMMIT;
    
    -- Mensaje de éxito
    SELECT 'Estado del permiso actualizado correctamente' AS mensaje;
END $$

DELIMITER ;

DELIMITER //

CREATE PROCEDURE INS_PERMISO(
    IN p_fk_cod_rol BIGINT,
    IN p_fk_cod_objeto BIGINT,
    IN p_permiso_inserccion INT,
    IN p_permiso_eliminacion INT,
    IN p_permiso_actualizacion INT,
    IN p_permiso_consultar INT,
    IN p_permiso_reporte INT,
    IN p_usr_creo VARCHAR(50)
)
BEGIN
    DECLARE v_permiso_existe INT;

    -- Validar si ya existe un permiso para el rol y objeto específicos
    SELECT COUNT(*) INTO v_permiso_existe 
    FROM TBL_MS_PERMISOS 
    WHERE FK_COD_ROL = p_fk_cod_rol AND FK_COD_OBJETO = p_fk_cod_objeto;

    -- Si el permiso no existe, proceder con la inserción
    IF v_permiso_existe = 0 THEN
        START TRANSACTION;

        BEGIN
            DECLARE EXIT HANDLER FOR SQLEXCEPTION
            BEGIN
                ROLLBACK;
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Error al insertar el permiso. Verifica los datos ingresados.';
            END;

            INSERT INTO TBL_MS_PERMISOS (
                FK_COD_ROL, FK_COD_OBJETO, DES_PERMISO_INSERCCION, DES_PERMISO_ELIMINACION,
                DES_PERMISO_ACTUALIZACION, DES_PERMISO_CONSULTAR, PERMISO_REPORTE, USR_CREO
            )
            VALUES (
                p_fk_cod_rol, p_fk_cod_objeto, p_permiso_inserccion, p_permiso_eliminacion,
                p_permiso_actualizacion, p_permiso_consultar, p_permiso_reporte, p_usr_creo
            );

            COMMIT;

            SELECT 'Permiso insertado correctamente.' AS mensaje, TRUE AS success;
        END;
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El permiso para este rol y objeto ya existe.';
    END IF;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE UPD_PERMISO(
    IN p_cod_permiso BIGINT,
    IN p_permiso_inserccion INT,
    IN p_permiso_eliminacion INT,
    IN p_permiso_actualizacion INT,
    IN p_permiso_consultar INT,
    IN p_permiso_reporte INT,
    IN p_usr_modifico VARCHAR(50)
)
BEGIN
    DECLARE v_permiso_existe INT;

    -- Verificar si existe un permiso con el COD_PERMISO especificado
    SELECT COUNT(*) INTO v_permiso_existe 
    FROM TBL_MS_PERMISOS 
    WHERE COD_PERMISO = p_cod_permiso;

    -- Si el permiso existe, proceder con la actualización
    IF v_permiso_existe > 0 THEN
        START TRANSACTION;

        BEGIN
            DECLARE EXIT HANDLER FOR SQLEXCEPTION
            BEGIN
                ROLLBACK;
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Error al actualizar el permiso. Verifica los datos ingresados.';
            END;

            UPDATE TBL_MS_PERMISOS
            SET DES_PERMISO_INSERCCION = p_permiso_inserccion,
                DES_PERMISO_ELIMINACION = p_permiso_eliminacion,
                DES_PERMISO_ACTUALIZACION = p_permiso_actualizacion,
                DES_PERMISO_CONSULTAR = p_permiso_consultar,
                PERMISO_REPORTE = p_permiso_reporte,
                USR_MODIFICO = p_usr_modifico,
                FEC_MODIFICO = CURRENT_TIMESTAMP
            WHERE COD_PERMISO = p_cod_permiso;

            COMMIT;

            SELECT 'Permiso actualizado correctamente.' AS mensaje, TRUE AS success;
        END;
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No existe un permiso con el COD_PERMISO especificado para actualizar.';
    END IF;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE GET_USERS()
BEGIN
    SELECT COD_USUARIO, NOM_USUARIO, NUM_INTENTOS, ESTADO
    FROM TBL_MS_USUARIOS;
END //

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE INS_USER (
    IN p_fk_cod_rol BIGINT,
    IN p_id_persona VARCHAR(30),
    IN p_nom_persona VARCHAR(250),
    IN p_fk_cod_genero BIGINT,
    IN p_fk_cod_pais BIGINT,
    IN p_fk_cod_departamento BIGINT,
    IN p_fk_cod_municipio BIGINT,
    IN p_nom_usuario VARCHAR(50),
    IN p_contrasena VARCHAR(255),
    IN p_telefono VARCHAR(15),
    IN p_correo VARCHAR(50),
    IN p_usr_creo VARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- En caso de error, deshacer la transacción y mostrar mensaje
        ROLLBACK;
        SELECT 'Error al insertar el usuario o datos relacionados, transacción revertida.' AS mensaje;
    END;

    -- Iniciar la transacción
    START TRANSACTION;

    -- Insertar la persona con sus detalles de género, país, departamento y municipio
    INSERT INTO TBL_PERSONAS (
        ID_PERSONA,
        NOM_PERSONA,
        FK_COD_GENERO,
        FK_COD_PAIS,
        FK_COD_DEPARTAMENTO,
        FK_COD_MUNICIPIO,
        USR_CREO
    )
    VALUES (
        p_id_persona,
        p_nom_persona,
        p_fk_cod_genero,
        p_fk_cod_pais,
        p_fk_cod_departamento,
        p_fk_cod_municipio,
        p_usr_creo
    );

    -- Insertar el nuevo usuario
    INSERT INTO TBL_MS_USUARIOS (
        FK_COD_ROL,
        FK_COD_PERSONA,
        NOM_USUARIO,
        CONTRASENA,
        FEC_ULTIMA_CONEXION,
        FEC_VENCIMIENTO,
        USR_CREO
    )
    VALUES (
        p_fk_cod_rol,
        LAST_INSERT_ID(), -- Utiliza el ID de la persona recién insertada
        p_nom_usuario,
        p_contrasena,
        NOW(), -- Asignar fecha y hora actuales
        DATE_ADD(NOW(), INTERVAL 30 DAY), -- Vencimiento en 30 días
        p_usr_creo
    );

    -- Insertar el teléfono de la persona
    INSERT INTO TBL_TELEFONOS (
        FK_COD_PERSONA,
        TELEFONO,
        USR_CREO
    )
    VALUES (
        LAST_INSERT_ID(),
        p_telefono,
        p_usr_creo
    );

    -- Insertar el correo de la persona
    INSERT INTO TBL_CORREOS (
        FK_COD_PERSONA,
        CORREO,
        USR_CREO
    )
    VALUES (
        LAST_INSERT_ID(),
        p_correo,
        p_usr_creo
    );

    -- Confirmar la transacción
    COMMIT;

    -- Mensaje de éxito
    SELECT 'Usuario, género, país, departamento, municipio, teléfono y correo insertados correctamente.' AS mensaje;
END$$

DELIMITER ;

DELIMITER //

CREATE PROCEDURE UPD_USER (
    IN p_cod_usuario BIGINT,
    IN p_nom_persona VARCHAR(250),
    IN p_id_persona VARCHAR(30),
    IN p_fk_cod_genero BIGINT,
    IN p_fk_cod_pais BIGINT,
    IN p_fk_cod_departamento BIGINT,
    IN p_fk_cod_municipio BIGINT,
    IN p_usr_modifico VARCHAR(50),
    IN p_telefono VARCHAR(15),
    IN p_fk_cod_rol BIGINT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Ha ocurrido un error. Se ha realizado un ROLLBACK.' AS mensaje;
    END;

    START TRANSACTION;

    -- Actualizar TBL_PERSONAS
    UPDATE TBL_PERSONAS 
    SET 
        NOM_PERSONA = p_nom_persona,
        ID_PERSONA = p_id_persona,
        FK_COD_GENERO = p_fk_cod_genero,
        FK_COD_PAIS = p_fk_cod_pais,
        FK_COD_DEPARTAMENTO = p_fk_cod_departamento,
        FK_COD_MUNICIPIO = p_fk_cod_municipio,
        USR_MODIFICO = p_usr_modifico,
        FEC_MODIFICO = CURRENT_TIMESTAMP
    WHERE COD_PERSONA = (
        SELECT FK_COD_PERSONA FROM TBL_MS_USUARIOS WHERE COD_USUARIO = p_cod_usuario
    );

    -- Actualizar TBL_TELEFONOS
    UPDATE TBL_TELEFONOS
    SET 
        TELEFONO = p_telefono,
        USR_MODIFICO = p_usr_modifico,
        FEC_MODIFICO = CURRENT_TIMESTAMP
    WHERE FK_COD_PERSONA = (
        SELECT FK_COD_PERSONA FROM TBL_MS_USUARIOS WHERE COD_USUARIO = p_cod_usuario
    );

    -- Actualizar FK_COD_ROL en TBL_MS_USUARIOS
    UPDATE TBL_MS_USUARIOS
    SET 
        FK_COD_ROL = p_fk_cod_rol,
        USR_MODIFICO = p_usr_modifico,
        FEC_MODIFICACION = CURRENT_TIMESTAMP
    WHERE COD_USUARIO = p_cod_usuario;

    COMMIT;
    SELECT 'Actualización exitosa.' AS mensaje;
END;
//

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE UPD_USER_ESTADO (
    IN p_id_usuario BIGINT,
    IN p_estado BOOLEAN,
    IN p_usr_modifico VARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error al actualizar el estado, transacción revertida.' AS mensaje;
    END;

    START TRANSACTION;

    UPDATE TBL_MS_USUARIOS
    SET ESTADO = p_estado,
        USR_MODIFICO = p_usr_modifico,
        FEC_MODIFICACION = NOW()
    WHERE COD_USUARIO = p_id_usuario;

    COMMIT;

    SELECT 'Estado del usuario actualizado correctamente.' AS mensaje;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE GET_CITIES_BY_DEPARTMENT(
    IN p_cod_departamento INT -- Código del departamento (requerido para este procedimiento)
)
BEGIN
    SELECT 
        P.COD_PAIS, 
        P.NOM_PAIS, 
        D.COD_DEPARTAMENTO, 
        D.NOM_DEPARTAMENTO, 
        M.COD_MUNICIPIO, 
        M.NOM_MUNICIPIO, 
        M.ID_POSTAL, 
        M.ESTADO AS ESTADO_MUNICIPIO
    FROM TBL_PAISES P
    LEFT JOIN TBL_DEPARTAMENTOS D ON P.COD_PAIS = D.FK_COD_PAIS
    LEFT JOIN TBL_MUNICIPIOS M ON D.COD_DEPARTAMENTO = M.FK_COD_DEPARTAMENTO
    WHERE D.COD_DEPARTAMENTO = p_cod_departamento -- Filtrar por departamento
    ORDER BY P.COD_PAIS, D.COD_DEPARTAMENTO, M.COD_MUNICIPIO;
END$$

DELIMITER ;

DELIMITER //
CREATE PROCEDURE INS_GENERO(
    IN p_genero VARCHAR(15),
    IN p_usr_creo VARCHAR(50)
)
BEGIN
    DECLARE v_genero_existe INT;

    -- Validar si el género ya existe
    SELECT COUNT(*) INTO v_genero_existe 
    FROM TBL_GENEROS 
    WHERE GENERO = p_genero;

    -- Si el género no existe, proceder con la inserción
    IF v_genero_existe = 0 THEN
        START TRANSACTION;
        
        BEGIN
            DECLARE EXIT HANDLER FOR SQLEXCEPTION
            BEGIN
                ROLLBACK;
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Error al insertar el género. Verifica los datos ingresados.';
            END;
            
            INSERT INTO TBL_GENEROS (GENERO, USR_CREO)
            VALUES (p_genero, p_usr_creo);
            
            COMMIT;
            
            SELECT 'Género insertado correctamente.' AS mensaje, TRUE AS success;
        END;
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El género ya existe.';
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE UPD_GENERO(
    IN p_cod_genero BIGINT,
    IN p_genero VARCHAR(15),
    IN p_usr_modifico VARCHAR(50)
)
BEGIN
    DECLARE v_genero_existe INT;

    -- Validar si el género ya existe con un nombre diferente al que se está actualizando
    SELECT COUNT(*) INTO v_genero_existe
    FROM TBL_GENEROS
    WHERE GENERO = p_genero AND COD_GENERO != p_cod_genero;

    -- Si el género no existe, proceder con la actualización
    IF v_genero_existe = 0 THEN
        START TRANSACTION;

        BEGIN
            DECLARE EXIT HANDLER FOR SQLEXCEPTION
            BEGIN
                ROLLBACK;
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Error al actualizar el género. Verifica los datos ingresados.';
            END;

            UPDATE TBL_GENEROS
            SET GENERO = p_genero,
                USR_MODIFICO = p_usr_modifico,
                FEC_MODIFICO = NOW()
            WHERE COD_GENERO = p_cod_genero;

            COMMIT;

            SELECT 'Género actualizado correctamente.' AS mensaje, TRUE AS success;
        END;
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El nombre del género ya existe.';
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE GET_GENEROS()
BEGIN
	SELECT * FROM TBL_GENEROS;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE GET_GENEROS_1()
BEGIN
	SELECT * FROM TBL_GENEROS
    WHERE ESTADO = true;
END //
DELIMITER ;

DELIMITER $$

CREATE PROCEDURE UPD_GENERO_ESTADO(
    IN p_COD_GENERO BIGINT,
    IN p_ESTADO BOOLEAN,
    IN p_USR_MODIFICO VARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Si ocurre un error, hacemos rollback y mostramos un mensaje
        ROLLBACK;
        SELECT 'Error al actualizar el estado del género' AS mensaje;
    END;
    
    -- Iniciar transacción
    START TRANSACTION;
    
    -- Actualizar el estado del género
    UPDATE TBL_GENEROS
    SET ESTADO = p_ESTADO,
        USR_MODIFICO = p_USR_MODIFICO,
        FEC_MODIFICO = NOW()
    WHERE COD_GENERO = p_COD_GENERO;
    
    -- Confirmar cambios si no hubo errores
    COMMIT;
    
    -- Mensaje de éxito
    SELECT 'Estado del género actualizado correctamente' AS mensaje;
END $$

DELIMITER ;

DELIMITER //
CREATE PROCEDURE INS_PRECIO(
    IN p_fk_cod_pais BIGINT,
    IN p_precio DECIMAL(10,2),
    IN p_usr_creo VARCHAR(50)
)
BEGIN
    DECLARE v_precio_existe INT;

    -- Validar si ya existe un precio para el país
    SELECT COUNT(*) INTO v_precio_existe 
    FROM TBL_PRECIOS 
    WHERE FK_COD_PAIS = p_fk_cod_pais;

    -- Si no existe un precio para el país, proceder con la inserción
    IF v_precio_existe = 0 THEN
        START TRANSACTION;

        BEGIN
            DECLARE EXIT HANDLER FOR SQLEXCEPTION
            BEGIN
                ROLLBACK;
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Error al insertar el precio. Verifica los datos ingresados.';
            END;

            INSERT INTO TBL_PRECIOS (FK_COD_PAIS, PRECIO, USR_CREO)
            VALUES (p_fk_cod_pais, p_precio, p_usr_creo);

            COMMIT;

            SELECT 'Precio insertado correctamente.' AS mensaje, TRUE AS success;
        END;
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Ya existe un precio para este país.';
    END IF;
END //
DELIMITER ;

DELIMITER $$

CREATE PROCEDURE GET_PRECIOS_POR_PAIS()
BEGIN
    SELECT 
        p.COD_PRECIO,
        p.FK_COD_PAIS,
        pa.NOM_PAIS,
        p.PRECIO,
        p.USR_CREO,
        p.FEC_CREACION,
        p.USR_MODIFICO,
        p.FEC_MODIFICO
    FROM 
        TBL_PRECIOS p
    INNER JOIN 
        TBL_PAISES pa ON p.FK_COD_PAIS = pa.COD_PAIS;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE UPD_PRECIO(
    IN p_COD_PAIS BIGINT,
    IN p_COD_PRECIO BIGINT,
    IN p_NUEVO_PRECIO DECIMAL(10,2),
    IN p_USR_MODIFICO VARCHAR(50)
)
BEGIN
    DECLARE v_precio_existe INT;

    -- Validar si ya existe un precio para el país y el código específico
    SELECT COUNT(*) INTO v_precio_existe
    FROM TBL_PRECIOS
    WHERE FK_COD_PAIS = p_COD_PAIS AND COD_PRECIO = p_COD_PRECIO;

    IF v_precio_existe = 1 THEN
        -- Iniciar la transacción
        START TRANSACTION;

        BEGIN
            DECLARE EXIT HANDLER FOR SQLEXCEPTION
            BEGIN
                ROLLBACK;
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Error al actualizar el precio. Verifica los datos ingresados.';
            END;

            -- Actualizar el precio y los campos de modificación
            UPDATE TBL_PRECIOS
            SET 
                PRECIO = p_NUEVO_PRECIO,
                USR_MODIFICO = p_USR_MODIFICO,
                FEC_MODIFICO = NOW()
            WHERE 
                FK_COD_PAIS = p_COD_PAIS AND COD_PRECIO = p_COD_PRECIO;

            -- Confirmar la transacción
            COMMIT;

            -- Mensaje de éxito
            SELECT 'Actualización exitosa.' AS mensaje, TRUE AS success;
        END;
    ELSE
        -- Si no existe el precio, lanzar error
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No existe un precio para este país y código especificado.';
    END IF;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE INS_CAJA(
    IN p_FK_COD_PRECIO BIGINT,
    IN p_ID_CAJA VARCHAR(50),
    IN p_DETALLE VARCHAR(255),
    IN p_USR_CREO VARCHAR(50)
)
BEGIN
    DECLARE v_caja_existe INT;
    DECLARE v_precio_existe INT;

    -- Verificar si ya existe una caja con el mismo FK_COD_PRECIO y ID_CAJA
    SELECT COUNT(*) INTO v_caja_existe
    FROM TBL_CAJAS
    WHERE FK_COD_PRECIO = p_FK_COD_PRECIO AND ID_CAJA = p_ID_CAJA;

    -- Verificar si existe el precio en TBL_PRECIOS
    SELECT COUNT(*) INTO v_precio_existe
    FROM TBL_PRECIOS
    WHERE COD_PRECIO = p_FK_COD_PRECIO;

    -- Si ya existe la caja, lanzar error
    IF v_caja_existe > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: Ya existe una caja con el mismo código de precio y ID de caja.';
    ELSEIF v_precio_existe = 0 THEN
        -- Si no existe el precio, lanzar error
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: No existe un precio con el código especificado.';
    ELSE
        -- Iniciar la transacción
        START TRANSACTION;

        BEGIN
            DECLARE EXIT HANDLER FOR SQLEXCEPTION
            BEGIN
                ROLLBACK;
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Error al insertar la caja. Verifica los datos ingresados.';
            END;

            -- Insertar la nueva caja
            INSERT INTO TBL_CAJAS (
                FK_COD_PRECIO, 
                ID_CAJA, 
                DETALLE, 
                USR_CREO, 
                FEC_CREACION
            ) VALUES (
                p_FK_COD_PRECIO, 
                p_ID_CAJA, 
                p_DETALLE, 
                p_USR_CREO, 
                NOW()
            );

            -- Confirmar la transacción
            COMMIT;

            -- Mensaje de éxito
            SELECT 'Caja insertada exitosamente.' AS mensaje, TRUE AS success;
        END;
    END IF;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE UPD_CAJA(
    IN p_COD_CAJA BIGINT,
    IN p_FK_COD_PRECIO BIGINT,
    IN p_ID_CAJA VARCHAR(50),
    IN p_DETALLE VARCHAR(255),
    IN p_USR_MODIFICO VARCHAR(50)
)
BEGIN
    DECLARE v_caja_existe INT;
    DECLARE v_precio_existe INT;

    -- Verificar si ya existe otra caja con el mismo FK_COD_PRECIO e ID_CAJA
    SELECT COUNT(*) INTO v_caja_existe
    FROM TBL_CAJAS
    WHERE FK_COD_PRECIO = p_FK_COD_PRECIO 
      AND ID_CAJA = p_ID_CAJA 
      AND COD_CAJA != p_COD_CAJA;

    -- Verificar si existe el precio en TBL_PRECIOS
    SELECT COUNT(*) INTO v_precio_existe
    FROM TBL_PRECIOS
    WHERE COD_PRECIO = p_FK_COD_PRECIO;

    -- Si ya existe la combinación en otra caja, lanzar error
    IF v_caja_existe > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: Ya existe otra caja con el mismo código de precio y ID de caja.';
    ELSEIF v_precio_existe = 0 THEN
        -- Si no existe el precio, lanzar error
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: No existe un precio con el código especificado.';
    ELSE
        -- Iniciar la transacción
        START TRANSACTION;

        BEGIN
            DECLARE EXIT HANDLER FOR SQLEXCEPTION
            BEGIN
                ROLLBACK;
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Error al actualizar la caja. Verifica los datos ingresados.';
            END;

            -- Actualizar la caja
            UPDATE TBL_CAJAS
            SET FK_COD_PRECIO = p_FK_COD_PRECIO,
                ID_CAJA = p_ID_CAJA,
                DETALLE = p_DETALLE,
                USR_MODIFICO = p_USR_MODIFICO,
                FEC_MODIFICO = NOW()
            WHERE COD_CAJA = p_COD_CAJA;

            -- Confirmar la transacción
            COMMIT;

            -- Mensaje de éxito
            SELECT 'Caja actualizada exitosamente.' AS mensaje, TRUE AS success;
        END;
    END IF;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE GET_CAJAS_CON_PAISES()
BEGIN
    SELECT 
        c.COD_CAJA,
        p.COD_PRECIO,
        pais.COD_PAIS,
        pais.NOM_PAIS,
        p.PRECIO,
        c.ID_CAJA,
        c.DETALLE,
        c.USR_CREO,
        c.FEC_CREACION,
        c.USR_MODIFICO,
        c.FEC_MODIFICO
    FROM 
        TBL_CAJAS c
    INNER JOIN 
        TBL_PRECIOS p ON c.FK_COD_PRECIO = p.COD_PRECIO
    INNER JOIN 
        TBL_PAISES pais ON p.FK_COD_PAIS = pais.COD_PAIS;
END$$

DELIMITER ;

DELIMITER //

CREATE PROCEDURE INS_TIPO_DESCUENTO(
    IN p_detalle VARCHAR(50),
    IN p_es_porcentaje BOOLEAN,
    IN p_usr_creo VARCHAR(50)
)
BEGIN
    DECLARE v_tipo_descuento_existe INT;

    -- Validar si el tipo de descuento ya existe por detalle
    SELECT COUNT(*) INTO v_tipo_descuento_existe 
    FROM TBL_TIPO_DESCUENTOS
    WHERE DETALLE = p_detalle;

    -- Si el tipo de descuento no existe, proceder con la inserción
    IF v_tipo_descuento_existe = 0 THEN
        START TRANSACTION;
        
        BEGIN
            DECLARE EXIT HANDLER FOR SQLEXCEPTION
            BEGIN
                ROLLBACK;
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Error al insertar el tipo de descuento. Verifica los datos ingresados.';
            END;
            
            INSERT INTO TBL_TIPO_DESCUENTOS (DETALLE, ES_PORCENTAJE, USR_CREO)
            VALUES (p_detalle, p_es_porcentaje, p_usr_creo);
            
            COMMIT;
            
            SELECT 'Tipo de descuento insertado correctamente.' AS mensaje, TRUE AS success;
        END;
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El tipo de descuento con el mismo detalle ya existe.';
    END IF;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE INS_DESCUENTO(
    IN p_fk_cod_tipo_descuento BIGINT,
    IN p_nombre VARCHAR(100),
    IN p_cantidad DECIMAL(10,2),
    IN p_usr_creo VARCHAR(50)
)
BEGIN
    DECLARE v_descuento_existe INT;

    -- Validar si el descuento ya existe por nombre
    SELECT COUNT(*) INTO v_descuento_existe 
    FROM TBL_DESCUENTOS
    WHERE NOMBRE = p_nombre;

    -- Si el descuento no existe, proceder con la inserción
    IF v_descuento_existe = 0 THEN
        START TRANSACTION;
        
        BEGIN
            DECLARE EXIT HANDLER FOR SQLEXCEPTION
            BEGIN
                ROLLBACK;
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'Error al insertar el descuento. Verifica los datos ingresados.';
            END;
            
            INSERT INTO TBL_DESCUENTOS (FK_COD_TIPO_DESCUENTO, NOMBRE, CANTIDAD, USR_CREO)
            VALUES (p_fk_cod_tipo_descuento, p_nombre, p_cantidad, p_usr_creo);
            
            COMMIT;
            
            SELECT 'Descuento insertado correctamente.' AS mensaje, TRUE AS success;
        END;
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El nombre del descuento ya existe.';
    END IF;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE GET_TIPO_DESCUENTO()
BEGIN
    -- Obtener todos los tipos de descuento
    SELECT 
        COD_TIPO_DESCUENTO,
        DETALLE,
        ES_PORCENTAJE,
        USR_CREO,
        FEC_CREACION,
        USR_MODIFICO,
        FEC_MODIFICO
    FROM TBL_TIPO_DESCUENTOS;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE GET_DESCUENTOS()
BEGIN
    -- Obtener todos los descuentos con el detalle y el porcentaje del tipo de descuento
    SELECT 
        d.COD_DESCUENTO,
        d.FK_COD_TIPO_DESCUENTO,
        d.NOMBRE,
        d.CANTIDAD,
        d.USR_CREO,
        d.FEC_CREACION,
        d.USR_MODIFICO,
        d.FEC_MODIFICO,
        t.DETALLE,
        t.ES_PORCENTAJE
    FROM TBL_DESCUENTOS d
    INNER JOIN TBL_TIPO_DESCUENTOS t ON d.FK_COD_TIPO_DESCUENTO = t.COD_TIPO_DESCUENTO;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE UPDATE_TIPO_DESCUENTO(
    IN p_cod_tipo_desc BIGINT,
    IN p_detalle VARCHAR(50),
    IN p_es_porcentaje BOOLEAN,
    IN p_usr_modifico VARCHAR(50)
)
BEGIN
    -- Actualizar el tipo de descuento
    UPDATE TBL_TIPO_DESCUENTOS
    SET 
        DETALLE = p_detalle,
        ES_PORCENTAJE = p_es_porcentaje,
        USR_MODIFICO = p_usr_modifico,
        FEC_MODIFICO = NOW()
    WHERE COD_TIPO_DESCUENTO = p_cod_tipo_desc;
    
    -- Comprobar si la actualización fue exitosa
    IF ROW_COUNT() > 0 THEN
        SELECT 'Tipo de descuento actualizado correctamente.' AS mensaje, TRUE AS success;
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No se encontró el tipo de descuento con el código proporcionado.';
    END IF;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE UPDATE_DESCUENTO(
    IN p_cod_desc BIGINT,
    IN p_fk_cod_tipo_desc BIGINT,
    IN p_nombre VARCHAR(100),
    IN p_cantidad DECIMAL(10,2),
    IN p_usr_modifico VARCHAR(50)
)
BEGIN
    -- Actualizar el descuento
    UPDATE TBL_DESCUENTOS
    SET 
        FK_COD_TIPO_DESCUENTO = p_fk_cod_tipo_desc,
        NOMBRE = p_nombre,
        CANTIDAD = p_cantidad,
        USR_MODIFICO = p_usr_modifico,
        FEC_MODIFICO = NOW()
    WHERE COD_DESCUENTO = p_cod_desc;
    
    -- Comprobar si la actualización fue exitosa
    IF ROW_COUNT() > 0 THEN
        SELECT 'Descuento actualizado correctamente.' AS mensaje, TRUE AS success;
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No se encontró el descuento con el código proporcionado.';
    END IF;
END //

DELIMITER ;








DELIMITER $$

CREATE PROCEDURE getUsers()
BEGIN
    SELECT 
        u.COD_USUARIO,
        u.FK_COD_ROL,
        u.NOM_USUARIO,
        u.NUM_INTENTOS,
        u.ESTADO,
        r.NOM_ROL,
        p.NOM_PERSONA,
        p.FK_COD_GENERO,
        p.FK_COD_PAIS,
        p.FK_COD_DEPARTAMENTO,
        p.FK_COD_MUNICIPIO,
        p.ID_PERSONA,
        t.TELEFONO
    FROM 
        TBL_MS_USUARIOS u
    JOIN 
        TBL_MS_ROLES r ON u.FK_COD_ROL = r.COD_ROL
    JOIN 
        TBL_PERSONAS p ON u.FK_COD_PERSONA = p.COD_PERSONA
    LEFT JOIN 
        TBL_TELEFONOS t ON p.COD_PERSONA = t.FK_COD_PERSONA;
END$$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE getUsers()
BEGIN
    SELECT 
        u.COD_USUARIO,
        u.FK_COD_ROL,
        u.NOM_USUARIO,
        u.NUM_INTENTOS,
        u.ESTADO,
        r.NOM_ROL,
        p.NOM_PERSONA,
        p.FK_COD_GENERO,
        g.GENERO AS NOM_GENERO,  -- Nombre del género
        p.FK_COD_PAIS,
        pa.NOM_PAIS AS NOM_PAIS,  -- Nombre del país
        p.FK_COD_DEPARTAMENTO,
        d.NOM_DEPARTAMENTO AS NOM_DEPARTAMENTO,  -- Nombre del departamento
        p.FK_COD_MUNICIPIO,
        m.NOM_MUNICIPIO AS NOM_MUNICIPIO,  -- Nombre del municipio
        p.ID_PERSONA,
        t.TELEFONO
    FROM 
        TBL_MS_USUARIOS u
    JOIN 
        TBL_MS_ROLES r ON u.FK_COD_ROL = r.COD_ROL
    JOIN 
        TBL_PERSONAS p ON u.FK_COD_PERSONA = p.COD_PERSONA
    LEFT JOIN 
        TBL_TELEFONOS t ON p.COD_PERSONA = t.FK_COD_PERSONA
    LEFT JOIN 
        TBL_GENEROS g ON p.FK_COD_GENERO = g.COD_GENERO
    LEFT JOIN 
        TBL_PAISES pa ON p.FK_COD_PAIS = pa.COD_PAIS
    LEFT JOIN 
        TBL_DEPARTAMENTOS d ON p.FK_COD_DEPARTAMENTO = d.COD_DEPARTAMENTO
    LEFT JOIN 
        TBL_MUNICIPIOS m ON p.FK_COD_MUNICIPIO = m.COD_MUNICIPIO;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE INS_CLIENTE(
    -- Datos de persona
    IN p_id_persona VARCHAR(30),
    IN p_nom_persona VARCHAR(250),
    IN p_fk_cod_genero BIGINT,
    -- Datos de ubicación
    IN p_fk_cod_pais BIGINT,
    IN p_fk_cod_departamento BIGINT,
    IN p_fk_cod_municipio BIGINT,
    -- Datos de contacto
    IN p_telefono VARCHAR(15),
    IN p_correo VARCHAR(50),
    -- Datos de dirección
    IN p_direccion VARCHAR(255),
    -- Usuario que crea
    IN p_usr_creo VARCHAR(50)
)
BEGIN
    DECLARE v_cod_persona BIGINT;
    
    -- Manejador de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error al crear el cliente' AS Mensaje;
    END;

    START TRANSACTION;
    
    -- Insertar persona
    INSERT INTO TBL_PERSONAS (
        ID_PERSONA,
        NOM_PERSONA,
        FK_COD_GENERO,
        FK_COD_PAIS,
        FK_COD_DEPARTAMENTO,
        FK_COD_MUNICIPIO,
        USR_CREO
    ) VALUES (
        p_id_persona,
        p_nom_persona,
        p_fk_cod_genero,
        p_fk_cod_pais,
        p_fk_cod_departamento,
        p_fk_cod_municipio,
        p_usr_creo
    );
    
    -- Obtener el código de persona generado
    SET v_cod_persona = LAST_INSERT_ID();
    
    -- Insertar teléfono
    INSERT INTO TBL_TELEFONOS (
        FK_COD_PERSONA,
        TELEFONO,
        USR_CREO
    ) VALUES (
        v_cod_persona,
        p_telefono,
        p_usr_creo
    );
    
    -- Insertar correo
    INSERT INTO TBL_CORREOS (
        FK_COD_PERSONA,
        CORREO,
        USR_CREO
    ) VALUES (
        v_cod_persona,
        p_correo,
        p_usr_creo
    );
    
    -- Insertar dirección
    INSERT INTO TBL_DIRECCIONES (
        FK_COD_PERSONA,
        FK_COD_MUNICIPIO,
        DIRECCION,
        USR_CREO
    ) VALUES (
        v_cod_persona,
        p_fk_cod_municipio,
        p_direccion,
        p_usr_creo
    );
    
    -- Insertar cliente
    INSERT INTO TBL_OP_CLIENTES (
        FK_COD_PERSONA,
        USR_CREO
    ) VALUES (
        v_cod_persona,
        p_usr_creo
    );
    
    COMMIT;
    
    SELECT 'Cliente creado exitosamente' AS Mensaje;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE GET_CLIENTES()
BEGIN
    SELECT 
        -- Datos del cliente
        cl.COD_CLIENTE,
        -- Datos de la persona
        p.COD_PERSONA,
        p.ID_PERSONA,
        p.NOM_PERSONA,
        -- Datos del género
        g.COD_GENERO,
        g.GENERO,
        -- Datos de ubicación
        pa.COD_PAIS,
        pa.NOM_PAIS,
        pa.NUM_ZONA,
        dep.COD_DEPARTAMENTO,
        dep.NOM_DEPARTAMENTO,
        mun.COD_MUNICIPIO,
        mun.NOM_MUNICIPIO,
        mun.ID_POSTAL,
        -- Datos de dirección
        d.COD_DIRECCION,
        d.DIRECCION,
        -- Datos de contacto
        t.TELEFONO,
        c.CORREO
    FROM TBL_OP_CLIENTES cl
    -- Join con persona
    INNER JOIN TBL_PERSONAS p ON cl.FK_COD_PERSONA = p.COD_PERSONA
    -- Join con género
    INNER JOIN TBL_GENEROS g ON p.FK_COD_GENERO = g.COD_GENERO
    -- Joins con ubicación
    INNER JOIN TBL_PAISES pa ON p.FK_COD_PAIS = pa.COD_PAIS
    INNER JOIN TBL_DEPARTAMENTOS dep ON p.FK_COD_DEPARTAMENTO = dep.COD_DEPARTAMENTO
    INNER JOIN TBL_MUNICIPIOS mun ON p.FK_COD_MUNICIPIO = mun.COD_MUNICIPIO
    -- Join con dirección
    LEFT JOIN TBL_DIRECCIONES d ON p.COD_PERSONA = d.FK_COD_PERSONA
    -- Join con teléfono
    LEFT JOIN TBL_TELEFONOS t ON p.COD_PERSONA = t.FK_COD_PERSONA
    -- Join con correo
    LEFT JOIN TBL_CORREOS c ON p.COD_PERSONA = c.FK_COD_PERSONA
    -- Ordenar por código de cliente
    ORDER BY cl.COD_CLIENTE DESC;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE UPD_CLIENTE(
    -- Datos de persona
    IN p_cod_persona BIGINT,
    IN p_id_persona VARCHAR(30),
    IN p_nom_persona VARCHAR(250),
    IN p_fk_cod_genero BIGINT,
    -- Datos de ubicación
    IN p_fk_cod_pais BIGINT,
    IN p_fk_cod_departamento BIGINT,
    IN p_fk_cod_municipio BIGINT,
    -- Datos de contacto
    IN p_telefono VARCHAR(15),
    IN p_correo VARCHAR(50),
    -- Datos de dirección
    IN p_direccion VARCHAR(255),
    -- Usuario que modifica
    IN p_usr_modifico VARCHAR(50)
)
BEGIN
    DECLARE v_cod_telefono BIGINT;
    DECLARE v_cod_correo BIGINT;
    DECLARE v_cod_direccion BIGINT;
    
    -- Declarar handler para errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error al actualizar al cliente' AS Mensaje, FALSE AS success;
    END;
    
    START TRANSACTION;
    
    -- Actualizar datos de la persona
    UPDATE TBL_PERSONAS 
    SET ID_PERSONA = p_id_persona,
        NOM_PERSONA = p_nom_persona,
        FK_COD_GENERO = p_fk_cod_genero,
        FK_COD_PAIS = p_fk_cod_pais,
        FK_COD_DEPARTAMENTO = p_fk_cod_departamento,
        FK_COD_MUNICIPIO = p_fk_cod_municipio,
        USR_MODIFICO = p_usr_modifico,
        FEC_MODIFICO = CURRENT_TIMESTAMP
    WHERE COD_PERSONA = p_cod_persona;
    
    -- Obtener códigos existentes
    SELECT COD_TELEFONO INTO v_cod_telefono 
    FROM TBL_TELEFONOS 
    WHERE FK_COD_PERSONA = p_cod_persona 
    LIMIT 1;
    
    SELECT COD_CORREO INTO v_cod_correo 
    FROM TBL_CORREOS 
    WHERE FK_COD_PERSONA = p_cod_persona 
    LIMIT 1;
    
    SELECT COD_DIRECCION INTO v_cod_direccion 
    FROM TBL_DIRECCIONES 
    WHERE FK_COD_PERSONA = p_cod_persona 
    LIMIT 1;
    
    -- Actualizar o insertar teléfono
    IF v_cod_telefono IS NOT NULL THEN
        UPDATE TBL_TELEFONOS 
        SET TELEFONO = p_telefono,
            USR_MODIFICO = p_usr_modifico,
            FEC_MODIFICO = CURRENT_TIMESTAMP
        WHERE COD_TELEFONO = v_cod_telefono;
    ELSE
        INSERT INTO TBL_TELEFONOS (FK_COD_PERSONA, TELEFONO, USR_CREO)
        VALUES (p_cod_persona, p_telefono, p_usr_modifico);
    END IF;
    
    -- Actualizar o insertar correo
    IF v_cod_correo IS NOT NULL THEN
        UPDATE TBL_CORREOS 
        SET CORREO = p_correo,
            USR_MODIFICO = p_usr_modifico,
            FEC_MODIFICO = CURRENT_TIMESTAMP
        WHERE COD_CORREO = v_cod_correo;
    ELSE
        INSERT INTO TBL_CORREOS (FK_COD_PERSONA, CORREO, USR_CREO)
        VALUES (p_cod_persona, p_correo, p_usr_modifico);
    END IF;
    
    -- Actualizar o insertar dirección
    IF v_cod_direccion IS NOT NULL THEN
        UPDATE TBL_DIRECCIONES 
        SET FK_COD_MUNICIPIO = p_fk_cod_municipio,
            DIRECCION = p_direccion,
            USR_MODIFICO = p_usr_modifico,
            FEC_MODIFICO = CURRENT_TIMESTAMP
        WHERE COD_DIRECCION = v_cod_direccion;
    ELSE
        INSERT INTO TBL_DIRECCIONES (FK_COD_PERSONA, FK_COD_MUNICIPIO, DIRECCION, USR_CREO)
        VALUES (p_cod_persona, p_fk_cod_municipio, p_direccion, p_usr_modifico);
    END IF;
    
    COMMIT;
    
    SELECT 'Cliente actualizados correctamente' AS Mensaje, TRUE AS success;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE INS_DATOS_ENVIO(
    IN p_fk_cod_cliente BIGINT,
    IN p_cantidad_cajas INT,
    IN p_fk_cod_pais_origen BIGINT,
    IN p_fk_cod_pais_destino BIGINT,
    IN p_fk_cod_departamento BIGINT,
    IN p_fk_cod_municipio BIGINT,
    IN p_fk_cod_direccion BIGINT,
    IN p_fk_cod_persona BIGINT,
    IN p_num_envio VARCHAR(50),
    IN p_usr_creo VARCHAR(50)
)
BEGIN
    DECLARE v_cod_envio BIGINT;
    
    -- Manejador de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error al crear el registro de envío' AS Mensaje;
    END;

    START TRANSACTION;

    -- Insertar datos de envío
    INSERT INTO TBL_DATOS_ENVIO (
        FK_COD_CLIENTE,
        CANTIDAD_CAJAS,
        FK_COD_PAIS_ORIGEN,
        FK_COD_PAIS_DESTINO,
        FK_COD_DEPARTAMENTO,
        FK_COD_MUNICIPIO,
        FK_COD_DIRECCION,
        FK_COD_PERSONA,
        NUM_ENVIO,
        USR_CREO
    ) VALUES (
        p_fk_cod_cliente,
        p_cantidad_cajas,
        p_fk_cod_pais_origen,
        p_fk_cod_pais_destino,
        p_fk_cod_departamento,
        p_fk_cod_municipio,
        p_fk_cod_direccion,
        p_fk_cod_persona,
        p_num_envio,
        p_usr_creo
    );

    -- Obtener el código de envío generado
    SET v_cod_envio = LAST_INSERT_ID();

    COMMIT;

    SELECT 'Datos de envío creados exitosamente', v_cod_envio AS CodigoEnvio;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE GET_DATOS_ENVIO()
BEGIN
    SELECT 
        de.COD_ENVIO,
        de.NUM_ENVIO,
        cl.COD_CLIENTE,
        cl.FK_COD_PERSONA,
        p.NOM_PERSONA,
        de.FK_COD_PAIS_ORIGEN,
        pa.NOM_PAIS AS PAIS_ORIGEN,
        de.FK_COD_PAIS_DESTINO,
        pd.NOM_PAIS AS PAIS_DESTINO,
        d.COD_DIRECCION,
        d.DIRECCION,
        d.FK_COD_MUNICIPIO,
        m.NOM_MUNICIPIO,
        dp.NOM_DEPARTAMENTO,
        de.CANTIDAD_CAJAS
    FROM TBL_DATOS_ENVIO de
    INNER JOIN TBL_OP_CLIENTES cl ON de.FK_COD_CLIENTE = cl.COD_CLIENTE
    INNER JOIN TBL_PERSONAS p ON cl.FK_COD_PERSONA = p.COD_PERSONA
    INNER JOIN TBL_PAISES pa ON de.FK_COD_PAIS_ORIGEN = pa.COD_PAIS
    INNER JOIN TBL_PAISES pd ON de.FK_COD_PAIS_DESTINO = pd.COD_PAIS
    INNER JOIN TBL_DIRECCIONES d ON de.FK_COD_DIRECCION = d.COD_DIRECCION
    INNER JOIN TBL_MUNICIPIOS m ON d.FK_COD_MUNICIPIO = m.COD_MUNICIPIO
    INNER JOIN TBL_DEPARTAMENTOS dp ON de.FK_COD_DEPARTAMENTO = dp.COD_DEPARTAMENTO;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE INS_PAQUETE(
    IN p_fk_cod_caja BIGINT,
    IN p_fk_cod_cliente BIGINT,
    IN p_fk_cod_envio BIGINT,
    IN p_fec_entrega DATETIME,
    IN p_usr_creo VARCHAR(50)
)
BEGIN
    DECLARE v_cod_paquete BIGINT;
    
    -- Manejador de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error al crear el registro de paquete' AS Mensaje;
    END;

    START TRANSACTION;

    -- Insertar datos del paquete
    INSERT INTO TBL_PAQUETE (
        FK_COD_CAJA,
        FK_COD_CLIENTE,
        FK_COD_ENVIO,
        FEC_ENTREGA,
        USR_CREO
    ) VALUES (
        p_fk_cod_caja,
        p_fk_cod_cliente,
        p_fk_cod_envio,
        p_fec_entrega,
        p_usr_creo
    );

    -- Obtener el código del paquete generado
    SET v_cod_paquete = LAST_INSERT_ID();

    COMMIT;

    SELECT 'Paquete creado exitosamente', v_cod_paquete AS CodigoPaquete;
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE GET_PAQUETES()
BEGIN
    SELECT 
        p.COD_PAQUETE,
        p.FK_COD_CAJA,
        c.ID_CAJA,
        p.ESTADO,
        p.FK_COD_CLIENTE,
        cl.FK_COD_PERSONA,
        pe.NOM_PERSONA,
        p.FK_COD_ENVIO,
        e.NUM_ENVIO,
        p.FEC_ENTREGA
    FROM 
        TBL_PAQUETE p
    INNER JOIN 
        TBL_CAJAS c ON p.FK_COD_CAJA = c.COD_CAJA
    INNER JOIN 
        TBL_OP_CLIENTES cl ON p.FK_COD_CLIENTE = cl.COD_CLIENTE
    INNER JOIN 
        TBL_PERSONAS pe ON cl.FK_COD_PERSONA = pe.COD_PERSONA
    INNER JOIN 
        TBL_DATOS_ENVIO e ON p.FK_COD_ENVIO = e.COD_ENVIO;
END$$

DELIMITER ;

DELIMITER //

CREATE PROCEDURE GET_PAISES_CON_DETALLES()
BEGIN
    SELECT 
        P.COD_PAIS,
        P.NOM_PAIS,
        P.NUM_ZONA,
        P.ESTADO,
        D.COD_DEPARTAMENTO,
        D.NOM_DEPARTAMENTO,
        D.ESTADO,
        M.COD_MUNICIPIO,
        M.NOM_MUNICIPIO,
        M.ID_POSTAL,
        M.ESTADO
    FROM TBL_PAISES P
    LEFT JOIN TBL_DEPARTAMENTOS D ON P.COD_PAIS = D.FK_COD_PAIS
    LEFT JOIN TBL_MUNICIPIOS M ON D.COD_DEPARTAMENTO = M.FK_COD_DEPARTAMENTO
    ORDER BY P.COD_PAIS, D.COD_DEPARTAMENTO, M.COD_MUNICIPIO;
END //

DELIMITER ;
