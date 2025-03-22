-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 22-03-2025 a las 03:17:29
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `multi_envios_mi_tierra`
--
CREATE DATABASE IF NOT EXISTS `multi_envios_mi_tierra` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `multi_envios_mi_tierra`;

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `getUsers` ()  SQL SECURITY INVOKER BEGIN
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_ALL_COUNTRIES` ()  SQL SECURITY INVOKER BEGIN
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_ALL_LOCATIONS` (IN `p_detalle` INT, IN `p_cod_pais` INT, IN `p_cod_departamento` INT)  SQL SECURITY INVOKER BEGIN
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_CAJAS_CON_INFO` ()  SQL SECURITY INVOKER BEGIN
    SELECT 
        C.COD_CAJA,
        C.ID_CAJA,
        C.DETALLE,
        P.PRECIO,
        PA.NOM_PAIS
    FROM TBL_CAJAS C
    INNER JOIN TBL_PRECIOS P ON C.FK_COD_PRECIO = P.COD_PRECIO
    INNER JOIN TBL_PAISES PA ON P.FK_COD_PAIS = PA.COD_PAIS;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_CAJAS_CON_PAISES` ()  SQL SECURITY INVOKER BEGIN
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_CITIES_BY_COUNTRY_AND_DEPARTMENT` (IN `p_cod_pais` INT, IN `p_cod_departamento` INT)  SQL SECURITY INVOKER BEGIN
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_CITIES_BY_DEPARTMENT` (IN `p_cod_departamento` INT)  SQL SECURITY INVOKER BEGIN
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_CLIENTES` ()  SQL SECURITY INVOKER BEGIN
  SELECT 
    cl.COD_CLIENTE,
    MIN(p.ID_PERSONA) AS ID_PERSONA,
    MIN(p.COD_PERSONA) AS COD_PERSONA,
    MIN(p.NOM_PERSONA) AS NOM_PERSONA,
    GROUP_CONCAT(DISTINCT t.TELEFONO) AS TELEFONOS,
    MIN(c.CORREO) AS CORREO,
    MIN(pa.COD_PAIS) AS COD_PAIS,
    MIN(pa.NOM_PAIS) AS NOM_PAIS,
    MIN(pa.NUM_ZONA) AS NUM_ZONA,
    MIN(dep.COD_DEPARTAMENTO) AS COD_DEPARTAMENTO,
    MIN(dep.NOM_DEPARTAMENTO) AS NOM_DEPARTAMENTO,
    MIN(mun.COD_MUNICIPIO) AS COD_MUNICIPIO,
    MIN(mun.NOM_MUNICIPIO) AS NOM_MUNICIPIO,
    MIN(d.COD_DIRECCION) AS COD_DIRECCION,
    MIN(d.DIRECCION) AS DIRECCION,
	MIN(g.COD_GENERO) AS COD_GENERO,
	MIN(g.GENERO) AS GENERO
  FROM TBL_OP_CLIENTES cl
  INNER JOIN TBL_PERSONAS p ON cl.FK_COD_PERSONA = p.COD_PERSONA
  LEFT JOIN TBL_TELEFONOS t ON p.COD_PERSONA = t.FK_COD_PERSONA
  LEFT JOIN TBL_CORREOS c ON p.COD_PERSONA = c.FK_COD_PERSONA
  INNER JOIN TBL_GENEROS g ON p.FK_COD_GENERO = g.COD_GENERO
  INNER JOIN TBL_PAISES pa ON p.FK_COD_PAIS = pa.COD_PAIS
  INNER JOIN TBL_DEPARTAMENTOS dep ON p.FK_COD_DEPARTAMENTO = dep.COD_DEPARTAMENTO
  INNER JOIN TBL_MUNICIPIOS mun ON p.FK_COD_MUNICIPIO = mun.COD_MUNICIPIO
  LEFT JOIN TBL_DIRECCIONES d ON p.COD_PERSONA = d.FK_COD_PERSONA
  GROUP BY cl.COD_CLIENTE
  ORDER BY cl.COD_CLIENTE DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_CLIENTES_ENVIO` ()  SQL SECURITY INVOKER BEGIN
    SELECT 
        -- Datos del cliente
        cl.COD_CLIENTE,
        -- Datos de la persona
        p.COD_PERSONA,
        p.NOM_PERSONA,
		pa.NOM_PAIS
    FROM TBL_OP_CLIENTES cl
    -- Join con persona
    INNER JOIN TBL_PERSONAS p ON cl.FK_COD_PERSONA = p.COD_PERSONA
    -- Joins con ubicación
    INNER JOIN TBL_PAISES pa ON p.FK_COD_PAIS = pa.COD_PAIS
    -- Join con datos de envío (solo clientes con envíos IND_ESTADO = 0)
    WHERE EXISTS (
        SELECT 1
        FROM TBL_DATOS_ENVIO de
        WHERE de.FK_COD_CLIENTE = cl.COD_CLIENTE
          AND de.IND_ESTADO = 0
    )
    -- Ordenar por código de cliente
    ORDER BY cl.COD_CLIENTE DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_COUNTRIES_1` ()  SQL SECURITY INVOKER BEGIN
    SELECT *
    FROM TBL_PAISES
    WHERE ESTADO = 1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_COUNTRIES_WITH_DEPARTMENTS` (IN `p_cod_pais` INT)  SQL SECURITY INVOKER BEGIN
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_DATOS_ENVIO` ()  SQL SECURITY INVOKER BEGIN
    SELECT 
        de.COD_ENVIO,
        de.NUM_ENVIO,
        de.FEC_CREACION,

        -- Datos del Cliente (solo código y nombre)
        cl.COD_CLIENTE AS COD_CLIENTE_ENVIO,
        pc.NOM_PERSONA AS NOMBRE_CLIENTE,

        -- Datos del Destinatario
        de.FK_COD_DESTINATARIO,
        dest.FK_COD_PERSONA AS FK_PERSONA_DESTINATARIO,
        pd.NOM_PERSONA AS NOMBRE_DESTINATARIO,

        -- Información de la Dirección del Destinatario
        d.COD_DIRECCION,
        d.DIRECCION,
        d.FK_COD_MUNICIPIO,
        m.NOM_MUNICIPIO,
        dp.NOM_DEPARTAMENTO,
        p.COD_PAIS AS FK_COD_PAIS_DESTINO,
        p.NOM_PAIS AS PAIS_DESTINO,

        -- Información del Envío
        de.CANTIDAD_CAJAS,
        de.FK_COD_PAIS_ORIGEN,
        po.NOM_PAIS AS PAIS_ORIGEN
    FROM TBL_DATOS_ENVIO de
    
    -- Cliente (solo código y nombre)
    LEFT JOIN TBL_OP_CLIENTES cl ON de.FK_COD_CLIENTE = cl.COD_CLIENTE
    LEFT JOIN TBL_PERSONAS pc ON cl.FK_COD_PERSONA = pc.COD_PERSONA

    -- Destinatario
    LEFT JOIN TBL_DESTINATARIOS dest ON de.FK_COD_DESTINATARIO = dest.COD_DESTINATARIO
    LEFT JOIN TBL_PERSONAS pd ON dest.FK_COD_PERSONA = pd.COD_PERSONA

    -- Dirección del Destinatario
    LEFT JOIN TBL_DIRECCIONES d ON dest.FK_COD_PERSONA = d.FK_COD_PERSONA -- Relacionamos dirección con la persona destinataria
    LEFT JOIN TBL_MUNICIPIOS m ON d.FK_COD_MUNICIPIO = m.COD_MUNICIPIO
    LEFT JOIN TBL_DEPARTAMENTOS dp ON m.FK_COD_DEPARTAMENTO = dp.COD_DEPARTAMENTO
    LEFT JOIN TBL_PAISES p ON dp.FK_COD_PAIS = p.COD_PAIS -- País destino del destinatario

    -- País de origen del envío
    INNER JOIN TBL_PAISES po ON de.FK_COD_PAIS_ORIGEN = po.COD_PAIS

    -- Ordena los resultados del último agregado al primero
    ORDER BY de.FEC_CREACION DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_DEPARMENTS_1` ()  SQL SECURITY INVOKER BEGIN
    SELECT *
    FROM TBL_DEPARTAMENTOS
    WHERE ESTADO = 1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_DEPOSITOS` ()   BEGIN
    START TRANSACTION;
        SELECT 
            COD_PAQUETE,
            DEPOSITO,
            FEC_CREACION
        FROM TBL_PAQUETE
        WHERE DEPOSITO IS NOT NULL;
    COMMIT;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_DESCUENTOS` ()  SQL SECURITY INVOKER BEGIN
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
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_DESTINATARIOS_POR_CLIENTE` (IN `p_cod_cliente` BIGINT)   BEGIN
    SELECT 
        d.COD_DESTINATARIO,
        p.COD_PERSONA,
        p.ID_PERSONA,
        p.NOM_PERSONA,
        g.COD_GENERO,
        g.GENERO,
        pa.COD_PAIS,
        pa.NOM_PAIS,
        pa.NUM_ZONA,
        dep.COD_DEPARTAMENTO,
        dep.NOM_DEPARTAMENTO,
        mun.COD_MUNICIPIO,
        mun.NOM_MUNICIPIO,
        mun.ID_POSTAL,
        dir.COD_DIRECCION,
        dir.DIRECCION,
        GROUP_CONCAT(DISTINCT t.TELEFONO) AS TELEFONOS,
        c.CORREO
    FROM TBL_DESTINATARIOS d
    INNER JOIN TBL_PERSONAS p ON d.FK_COD_PERSONA = p.COD_PERSONA
    INNER JOIN TBL_GENEROS g ON p.FK_COD_GENERO = g.COD_GENERO
    INNER JOIN TBL_PAISES pa ON p.FK_COD_PAIS = pa.COD_PAIS
    INNER JOIN TBL_DEPARTAMENTOS dep ON p.FK_COD_DEPARTAMENTO = dep.COD_DEPARTAMENTO
    INNER JOIN TBL_MUNICIPIOS mun ON p.FK_COD_MUNICIPIO = mun.COD_MUNICIPIO
    LEFT JOIN TBL_DIRECCIONES dir ON p.COD_PERSONA = dir.FK_COD_PERSONA
    LEFT JOIN TBL_TELEFONOS t ON p.COD_PERSONA = t.FK_COD_PERSONA
    INNER JOIN TBL_CORREOS c ON p.COD_PERSONA = c.FK_COD_PERSONA
    WHERE d.FK_COD_CLIENTE = p_cod_cliente
    GROUP BY 
        d.COD_DESTINATARIO,
        p.COD_PERSONA,
        p.ID_PERSONA,
        p.NOM_PERSONA,
        g.COD_GENERO,
        g.GENERO,
        pa.COD_PAIS,
        pa.NOM_PAIS,
        pa.NUM_ZONA,
        dep.COD_DEPARTAMENTO,
        dep.NOM_DEPARTAMENTO,
        mun.COD_MUNICIPIO,
        mun.NOM_MUNICIPIO,
        mun.ID_POSTAL,
        dir.COD_DIRECCION,
        dir.DIRECCION,
        c.CORREO
    ORDER BY d.COD_DESTINATARIO DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_ENVIOS_POR_CLIENTE` (IN `p_fk_cod_cliente` BIGINT)   BEGIN
    -- Manejador de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error al obtener los datos de los envíos' AS Mensaje;
    END;

    START TRANSACTION;

    -- Obtener los envíos del cliente especificado con su cantidad de cajas, 
    -- el nombre del destinatario y el país del destinatario
    SELECT 
        e.COD_ENVIO AS CodigoEnvio,
        e.CANTIDAD_CAJAS AS CantidadCajas,
        p.NOM_PERSONA AS NombreDestinatario,
        pa.NOM_PAIS AS PaisDestinatario
    FROM 
        TBL_DATOS_ENVIO e
    LEFT JOIN 
        TBL_DESTINATARIOS d ON e.FK_COD_DESTINATARIO = d.COD_DESTINATARIO
    LEFT JOIN 
        TBL_PERSONAS p ON d.FK_COD_PERSONA = p.COD_PERSONA
    LEFT JOIN 
        TBL_PAISES pa ON p.FK_COD_PAIS = pa.COD_PAIS
    WHERE 
        e.FK_COD_CLIENTE = p_fk_cod_cliente 
        AND e.IND_ESTADO = 0;

    COMMIT;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_GENEROS` ()  SQL SECURITY INVOKER BEGIN
	SELECT * FROM TBL_GENEROS;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_GENEROS_1` ()  SQL SECURITY INVOKER BEGIN
	SELECT * FROM TBL_GENEROS
    WHERE ESTADO = true;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_MUNICIPIOS_1` ()  SQL SECURITY INVOKER BEGIN
    SELECT *
    FROM TBL_MUNICIPIOS
    WHERE ESTADO = 1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_OBJETOS` ()  SQL SECURITY INVOKER BEGIN
    SELECT *
    FROM TBL_MS_OBJETOS;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_PAISES_CON_DETALLES` ()  SQL SECURITY INVOKER BEGIN
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
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_PAQUETES` ()   BEGIN
    SELECT 
        p.COD_PAQUETE,
        c.ID_CAJA,
        p.ESTADO,

        -- Mostrar DEPOSITO solo si el estado es Pendiente
        CASE 
            WHEN p.ESTADO = 0 THEN p.DEPOSITO 
            ELSE NULL 
        END AS DEPOSITO,

        p.FK_COD_CLIENTE,
        cl.FK_COD_PERSONA,
        pe.NOM_PERSONA,
        pais.NOM_PAIS AS PAIS_PERSONA,
        g.GENERO AS GENERO_PERSONA,
        p.FK_COD_ENVIO,
        e.NUM_ENVIO,
        p.FEC_ENTREGA,
        d.CANTIDAD AS DESCUENTO_CANTIDAD,
        td.ES_PORCENTAJE,
        pr.PRECIO AS PRECIO_ORIGINAL,

        -- Calcular PRECIO_FINAL según descuento
        CASE 
            WHEN td.ES_PORCENTAJE = 1 THEN ROUND(pr.PRECIO - (pr.PRECIO * d.CANTIDAD / 100), 2)
            WHEN td.ES_PORCENTAJE = 0 THEN pr.PRECIO - d.CANTIDAD
            ELSE pr.PRECIO
        END AS PRECIO_FINAL_CON_DESCUENTO,

        -- PRECIO_FINAL restando el DEPOSITO (si existe) en todos los casos
        CASE 
            WHEN td.ES_PORCENTAJE = 1 THEN ROUND(pr.PRECIO - (pr.PRECIO * d.CANTIDAD / 100) - IFNULL(p.DEPOSITO, 0), 2)
            WHEN td.ES_PORCENTAJE = 0 THEN ROUND(pr.PRECIO - d.CANTIDAD - IFNULL(p.DEPOSITO, 0), 2)
            ELSE ROUND(pr.PRECIO - IFNULL(p.DEPOSITO, 0), 2)
        END AS PRECIO_FINAL

    FROM 
        TBL_PAQUETE p
    INNER JOIN 
        TBL_CAJAS c ON p.FK_COD_CAJA = c.COD_CAJA
    INNER JOIN 
        TBL_PRECIOS pr ON c.FK_COD_PRECIO = pr.COD_PRECIO
    INNER JOIN 
        TBL_OP_CLIENTES cl ON p.FK_COD_CLIENTE = cl.COD_CLIENTE
    INNER JOIN 
        TBL_PERSONAS pe ON cl.FK_COD_PERSONA = pe.COD_PERSONA
    INNER JOIN 
        TBL_PAISES pais ON pe.FK_COD_PAIS = pais.COD_PAIS
    INNER JOIN 
        TBL_GENEROS g ON pe.FK_COD_GENERO = g.COD_GENERO
    INNER JOIN 
        TBL_DATOS_ENVIO e ON p.FK_COD_ENVIO = e.COD_ENVIO
    LEFT JOIN 
        TBL_DESCUENTOS d ON p.FK_COD_DESCUENTO = d.COD_DESCUENTO
    LEFT JOIN 
        TBL_TIPO_DESCUENTOS td ON d.FK_COD_TIPO_DESCUENTO = td.COD_TIPO_DESCUENTO

    ORDER BY 
        p.COD_PAQUETE DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_PERMISOS` ()  SQL SECURITY INVOKER BEGIN
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
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_PERSONA_INFO_FOR_USER` (IN `userId` BIGINT)  SQL SECURITY INVOKER BEGIN
    SELECT 
        p.NOM_PERSONA
    FROM 
        TBL_MS_USUARIOS u
    JOIN 
        TBL_PERSONAS p ON u.FK_COD_PERSONA = p.COD_PERSONA
    WHERE 
        u.COD_USUARIO = userId;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_PRECIOS_POR_PAIS` ()  SQL SECURITY INVOKER BEGIN
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_ROLES` ()  SQL SECURITY INVOKER BEGIN
    SELECT *
    FROM TBL_MS_ROLES; -- Devuelve todos los roles sin filtro
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_ROLES_1` ()  SQL SECURITY INVOKER BEGIN
    SELECT *
    FROM TBL_MS_ROLES
    WHERE ESTADO = 1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_ROL_OBJETOS_PERMISOS_FOR_USER` (IN `userId` BIGINT)  SQL SECURITY INVOKER BEGIN
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_TIPO_DESCUENTO` ()  SQL SECURITY INVOKER BEGIN
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
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_ULTIMOS_6_CLIENTES` ()  SQL SECURITY INVOKER BEGIN
    SELECT 
        C.COD_CLIENTE, 
        P.NOM_PERSONA, 
        C.FEC_CREACION
    FROM TBL_OP_CLIENTES C
    JOIN TBL_PERSONAS P ON C.FK_COD_PERSONA = P.COD_PERSONA
    ORDER BY C.FEC_CREACION DESC
    LIMIT 6;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GET_USERS` ()  SQL SECURITY INVOKER BEGIN
    SELECT COD_USUARIO, NOM_USUARIO, NUM_INTENTOS, ESTADO
    FROM TBL_MS_USUARIOS;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `INS_CAJA` (IN `p_FK_COD_PRECIO` BIGINT, IN `p_ID_CAJA` VARCHAR(50), IN `p_DETALLE` VARCHAR(255), IN `p_USR_CREO` VARCHAR(50))  SQL SECURITY INVOKER BEGIN
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `INS_CLIENTE` (IN `p_id_persona` VARCHAR(30), IN `p_nom_persona` VARCHAR(250), IN `p_fk_cod_genero` BIGINT, IN `p_fk_cod_pais` BIGINT, IN `p_fk_cod_departamento` BIGINT, IN `p_fk_cod_municipio` BIGINT, IN `p_telefono1` VARCHAR(15), IN `p_telefono2` VARCHAR(15), IN `p_telefono3` VARCHAR(15), IN `p_correo` VARCHAR(50), IN `p_direccion` VARCHAR(255), IN `p_usr_creo` VARCHAR(50))  SQL SECURITY INVOKER BEGIN
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
    
    -- Insertar teléfono 1 (obligatorio o el primer valor)
    IF p_telefono1 IS NOT NULL AND p_telefono1 <> '' THEN
        INSERT INTO TBL_TELEFONOS (
            FK_COD_PERSONA,
            TELEFONO,
            USR_CREO
        ) VALUES (
            v_cod_persona,
            p_telefono1,
            p_usr_creo
        );
    END IF;
    
    -- Insertar teléfono 2 (opcional)
    IF p_telefono2 IS NOT NULL AND p_telefono2 <> '' THEN
        INSERT INTO TBL_TELEFONOS (
            FK_COD_PERSONA,
            TELEFONO,
            USR_CREO
        ) VALUES (
            v_cod_persona,
            p_telefono2,
            p_usr_creo
        );
    END IF;
    
    -- Insertar teléfono 3 (opcional)
    IF p_telefono3 IS NOT NULL AND p_telefono3 <> '' THEN
        INSERT INTO TBL_TELEFONOS (
            FK_COD_PERSONA,
            TELEFONO,
            USR_CREO
        ) VALUES (
            v_cod_persona,
            p_telefono3,
            p_usr_creo
        );
    END IF;
    
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `INS_DATOS_ENVIO` (IN `p_fk_cod_cliente` BIGINT, IN `p_fk_cod_destinatario` BIGINT, IN `p_cantidad_cajas` INT, IN `p_fk_cod_pais_origen` BIGINT, IN `p_fk_cod_pais_destino` BIGINT, IN `p_fk_cod_departamento` BIGINT, IN `p_fk_cod_municipio` BIGINT, IN `p_fk_cod_direccion` BIGINT, IN `p_fk_cod_persona` BIGINT, IN `p_num_envio` VARCHAR(50), IN `p_usr_creo` VARCHAR(50))  SQL SECURITY INVOKER BEGIN
    DECLARE v_counter INT DEFAULT 1;
    
    -- Manejador de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error al crear el registro de envío' AS Mensaje;
    END;

    START TRANSACTION;

    WHILE v_counter <= p_cantidad_cajas DO
        INSERT INTO TBL_DATOS_ENVIO (
            FK_COD_CLIENTE,
            FK_COD_DESTINATARIO,
            CANTIDAD_CAJAS,  -- siempre se inserta 1 en esta columna
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
            p_fk_cod_destinatario,
            1,
            p_fk_cod_pais_origen,
            p_fk_cod_pais_destino,
            p_fk_cod_departamento,
            p_fk_cod_municipio,
            p_fk_cod_direccion,
            p_fk_cod_persona,
            p_num_envio,
            p_usr_creo
        );
        SET v_counter = v_counter + 1;
    END WHILE;

    COMMIT;

    SELECT 'Datos de envío creados exitosamente' AS Mensaje, LAST_INSERT_ID() AS CodigoEnvio;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `INS_DEPARTAMENTO` (IN `p_fk_cod_pais` BIGINT, IN `p_nom_departamento` VARCHAR(50), IN `p_usr_creo` VARCHAR(50))  SQL SECURITY INVOKER BEGIN
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `INS_DESCUENTO` (IN `p_fk_cod_tipo_descuento` BIGINT, IN `p_nombre` VARCHAR(100), IN `p_cantidad` DECIMAL(10,2), IN `p_usr_creo` VARCHAR(50))  SQL SECURITY INVOKER BEGIN
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
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `INS_DESTINATARIO` (IN `p_id_persona` VARCHAR(30), IN `p_nom_persona` VARCHAR(250), IN `p_fk_cod_genero` BIGINT, IN `p_fk_cod_pais` BIGINT, IN `p_fk_cod_departamento` BIGINT, IN `p_fk_cod_municipio` BIGINT, IN `p_telefono1` VARCHAR(15), IN `p_telefono2` VARCHAR(15), IN `p_telefono3` VARCHAR(15), IN `p_correo` VARCHAR(50), IN `p_direccion` VARCHAR(255), IN `p_fk_cod_cliente` BIGINT, IN `p_usr_creo` VARCHAR(50))  SQL SECURITY INVOKER BEGIN
    DECLARE v_cod_persona BIGINT;

    -- Manejador de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error al crear el destinatario' AS Mensaje;
    END;

    START TRANSACTION;

    -- Insertar persona (destinatario)
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

    -- Insertar teléfono 1 (obligatorio)
    IF p_telefono1 IS NOT NULL AND p_telefono1 <> '' THEN
        INSERT INTO TBL_TELEFONOS (
            FK_COD_PERSONA,
            TELEFONO,
            USR_CREO
        ) VALUES (
            v_cod_persona,
            p_telefono1,
            p_usr_creo
        );
    END IF;

    -- Insertar teléfono 2 (opcional)
    IF p_telefono2 IS NOT NULL AND p_telefono2 <> '' THEN
        INSERT INTO TBL_TELEFONOS (
            FK_COD_PERSONA,
            TELEFONO,
            USR_CREO
        ) VALUES (
            v_cod_persona,
            p_telefono2,
            p_usr_creo
        );
    END IF;

    -- Insertar teléfono 3 (opcional)
    IF p_telefono3 IS NOT NULL AND p_telefono3 <> '' THEN
        INSERT INTO TBL_TELEFONOS (
            FK_COD_PERSONA,
            TELEFONO,
            USR_CREO
        ) VALUES (
            v_cod_persona,
            p_telefono3,
            p_usr_creo
        );
    END IF;

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

    -- Insertar destinatario vinculado al cliente
    INSERT INTO TBL_DESTINATARIOS (
        FK_COD_CLIENTE,
        FK_COD_PERSONA,
        USR_CREO
    ) VALUES (
        p_fk_cod_cliente,
        v_cod_persona,
        p_usr_creo
    );

    COMMIT;

    SELECT 'Destinatario creado exitosamente' AS Mensaje;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `INS_GENERO` (IN `p_genero` VARCHAR(15), IN `p_usr_creo` VARCHAR(50))  SQL SECURITY INVOKER BEGIN
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
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `INS_MULTIPAQUETE` (IN `p_datos_paquetes` JSON)   BEGIN
    DECLARE v_cod_paquete BIGINT;
    DECLARE v_fk_cod_caja BIGINT;
    DECLARE v_fk_cod_cliente BIGINT;
    DECLARE v_fk_cod_envio BIGINT;
    DECLARE v_fec_entrega DATE;
    DECLARE v_usr_creo VARCHAR(50);
    DECLARE v_fk_cod_descuento BIGINT;
    DECLARE v_indice INT DEFAULT 0;
    DECLARE v_total INT;
    DECLARE v_total_deposito DECIMAL(12,2);
    DECLARE v_valor_deposito_paquete DECIMAL(12,2);

    -- Manejador de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error al crear los registros de paquetes' AS Mensaje;
    END;

    START TRANSACTION;

    -- Obtener el número de elementos en el JSON
    SET v_total = JSON_LENGTH(p_datos_paquetes);

    -- Obtener el total del depósito del primer elemento del arreglo
    SET v_total_deposito = JSON_UNQUOTE(JSON_EXTRACT(p_datos_paquetes, '$[0].deposito'));

    -- Validar si el depósito es nulo o 'null'
    IF v_total_deposito IS NULL OR v_total_deposito = 'null' THEN
        SET v_valor_deposito_paquete = NULL;
    ELSE
        SET v_valor_deposito_paquete = CAST(v_total_deposito AS DECIMAL(12,2)) / v_total;
    END IF;

    -- Iterar sobre cada paquete en el JSON
    WHILE v_indice < v_total DO
        -- Extraer datos de cada paquete
        SET v_fk_cod_caja = JSON_UNQUOTE(JSON_EXTRACT(p_datos_paquetes, CONCAT('$[', v_indice, '].fk_cod_caja')));
        SET v_fk_cod_cliente = JSON_UNQUOTE(JSON_EXTRACT(p_datos_paquetes, CONCAT('$[', v_indice, '].fk_cod_cliente')));
        SET v_fk_cod_envio = JSON_UNQUOTE(JSON_EXTRACT(p_datos_paquetes, CONCAT('$[', v_indice, '].fk_cod_envio')));
        SET v_usr_creo = JSON_UNQUOTE(JSON_EXTRACT(p_datos_paquetes, CONCAT('$[', v_indice, '].usr_creo')));
        
        -- Extraer el código de descuento, si existe, de lo contrario asignar NULL
        SET v_fk_cod_descuento = CASE 
            WHEN JSON_UNQUOTE(JSON_EXTRACT(p_datos_paquetes, CONCAT('$[', v_indice, '].fk_cod_descuento'))) = 'null' THEN NULL
            ELSE JSON_UNQUOTE(JSON_EXTRACT(p_datos_paquetes, CONCAT('$[', v_indice, '].fk_cod_descuento')))
        END;

        -- Validar si la fecha es 'null' y asignar NULL en ese caso
        SET v_fec_entrega = CASE 
            WHEN JSON_UNQUOTE(JSON_EXTRACT(p_datos_paquetes, CONCAT('$[', v_indice, '].fec_entrega'))) = 'null' THEN NULL
            ELSE JSON_UNQUOTE(JSON_EXTRACT(p_datos_paquetes, CONCAT('$[', v_indice, '].fec_entrega')))
        END;

        -- Insertar datos del paquete incluyendo el campo DEPOSITO
        INSERT INTO TBL_PAQUETE (
            FK_COD_CAJA,
            FK_COD_CLIENTE,
            FK_COD_ENVIO,
            FK_COD_DESCUENTO,
            FEC_ENTREGA,
            DEPOSITO,
            USR_CREO
        ) VALUES (
            v_fk_cod_caja,
            v_fk_cod_cliente,
            v_fk_cod_envio,
            v_fk_cod_descuento,
            v_fec_entrega,
            v_valor_deposito_paquete,
            v_usr_creo
        );

        -- Obtener el código del paquete generado
        SET v_cod_paquete = LAST_INSERT_ID();

        -- Actualizar el estado en TBL_DATOS_ENVIO
        UPDATE TBL_DATOS_ENVIO
        SET IND_ESTADO = 1
        WHERE COD_ENVIO = v_fk_cod_envio;

        -- Incrementar índice
        SET v_indice = v_indice + 1;
    END WHILE;

    COMMIT;

    SELECT 'Paquetes creados exitosamente' AS Mensaje;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `INS_MUNICIPIO` (IN `p_fk_cod_departamento` BIGINT, IN `p_nom_municipio` VARCHAR(50), IN `p_id_postal` VARCHAR(20), IN `p_usr_creo` VARCHAR(50))  SQL SECURITY INVOKER BEGIN
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `INS_OBJETO` (IN `p_nom_objeto` VARCHAR(100), IN `p_des_objeto` VARCHAR(100), IN `p_usr_creo` VARCHAR(50))  SQL SECURITY INVOKER BEGIN
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
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `INS_PAIS` (IN `p_nom_pais` VARCHAR(30), IN `p_num_zona` VARCHAR(20), IN `p_usr_creo` VARCHAR(50))  SQL SECURITY INVOKER BEGIN
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `INS_PERMISO` (IN `p_fk_cod_rol` BIGINT, IN `p_fk_cod_objeto` BIGINT, IN `p_permiso_inserccion` INT, IN `p_permiso_eliminacion` INT, IN `p_permiso_actualizacion` INT, IN `p_permiso_consultar` INT, IN `p_permiso_reporte` INT, IN `p_usr_creo` VARCHAR(50))  SQL SECURITY INVOKER BEGIN
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
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `INS_PERMISOS` (IN `p_fk_cod_rol` BIGINT, IN `p_fk_cod_objeto` BIGINT, IN `p_des_permiso_ins` INT, IN `p_des_permiso_elim` INT, IN `p_des_permiso_act` INT, IN `p_des_permiso_cons` INT, IN `p_permiso_reporte` INT, IN `p_usr_creo` VARCHAR(50))  SQL SECURITY INVOKER BEGIN
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `INS_PRECIO` (IN `p_fk_cod_pais` BIGINT, IN `p_precio` DECIMAL(10,2), IN `p_usr_creo` VARCHAR(50))  SQL SECURITY INVOKER BEGIN
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
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `INS_ROL` (IN `p_nom_rol` VARCHAR(100), IN `p_des_rol` VARCHAR(100), IN `p_usr_creo` VARCHAR(50))  SQL SECURITY INVOKER BEGIN
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
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `INS_TIPO_DESCUENTO` (IN `p_detalle` VARCHAR(50), IN `p_es_porcentaje` BOOLEAN, IN `p_usr_creo` VARCHAR(50))  SQL SECURITY INVOKER BEGIN
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
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `INS_USER` (IN `p_fk_cod_rol` BIGINT, IN `p_id_persona` VARCHAR(30), IN `p_nom_persona` VARCHAR(250), IN `p_fk_cod_genero` BIGINT, IN `p_fk_cod_pais` BIGINT, IN `p_fk_cod_departamento` BIGINT, IN `p_fk_cod_municipio` BIGINT, IN `p_nom_usuario` VARCHAR(50), IN `p_contrasena` VARCHAR(255), IN `p_telefono` VARCHAR(15), IN `p_correo` VARCHAR(50), IN `p_usr_creo` VARCHAR(50))  SQL SECURITY INVOKER BEGIN
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_GET_GANANCIAS_POR_ANIO` ()  SQL SECURITY INVOKER BEGIN
    SELECT 
        YEAR(P.FEC_CREACION) AS Anio,
        SUM(Pr.PRECIO) AS Total_Ganancias
    FROM 
        TBL_PAQUETE P
    INNER JOIN 
        TBL_CAJAS C ON P.FK_COD_CAJA = C.COD_CAJA
    INNER JOIN 
        TBL_PRECIOS Pr ON C.FK_COD_PRECIO = Pr.COD_PRECIO
    GROUP BY 
        YEAR(P.FEC_CREACION)
    ORDER BY 
        YEAR(P.FEC_CREACION);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_GET_GANANCIAS_POR_DIA_MES_ANIO` ()  SQL SECURITY INVOKER BEGIN
    SELECT 
        YEAR(P.FEC_CREACION) AS Anio,
        MONTH(P.FEC_CREACION) AS Mes,
        DAY(P.FEC_CREACION) AS Dia,
        SUM(Pr.PRECIO) AS Total_Ganancias
    FROM 
        TBL_PAQUETE P
    INNER JOIN 
        TBL_CAJAS C ON P.FK_COD_CAJA = C.COD_CAJA
    INNER JOIN 
        TBL_PRECIOS Pr ON C.FK_COD_PRECIO = Pr.COD_PRECIO
    GROUP BY 
        YEAR(P.FEC_CREACION), MONTH(P.FEC_CREACION), DAY(P.FEC_CREACION)
    ORDER BY 
        YEAR(P.FEC_CREACION), MONTH(P.FEC_CREACION), DAY(P.FEC_CREACION);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SP_GET_GANANCIAS_POR_MES_ANIO` ()  SQL SECURITY INVOKER BEGIN
    SELECT 
        YEAR(P.FEC_CREACION) AS Anio,
        MONTH(P.FEC_CREACION) AS Mes,
        SUM(Pr.PRECIO) AS Total_Ganancias
    FROM 
        TBL_PAQUETE P
    INNER JOIN 
        TBL_CAJAS C ON P.FK_COD_CAJA = C.COD_CAJA
    INNER JOIN 
        TBL_PRECIOS Pr ON C.FK_COD_PRECIO = Pr.COD_PRECIO
    GROUP BY 
        YEAR(P.FEC_CREACION), MONTH(P.FEC_CREACION)
    ORDER BY 
        YEAR(P.FEC_CREACION), MONTH(P.FEC_CREACION);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UPDATE_DESCUENTO` (IN `p_cod_desc` BIGINT, IN `p_fk_cod_tipo_desc` BIGINT, IN `p_nombre` VARCHAR(100), IN `p_cantidad` DECIMAL(10,2), IN `p_usr_modifico` VARCHAR(50))  SQL SECURITY INVOKER BEGIN
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
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UPDATE_TIPO_DESCUENTO` (IN `p_cod_tipo_desc` BIGINT, IN `p_detalle` VARCHAR(50), IN `p_es_porcentaje` BOOLEAN, IN `p_usr_modifico` VARCHAR(50))  SQL SECURITY INVOKER BEGIN
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
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UPD_CAJA` (IN `p_COD_CAJA` BIGINT, IN `p_FK_COD_PRECIO` BIGINT, IN `p_ID_CAJA` VARCHAR(50), IN `p_DETALLE` VARCHAR(255), IN `p_USR_MODIFICO` VARCHAR(50))  SQL SECURITY INVOKER BEGIN
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `UPD_CLIENTE` (IN `p_cod_persona` BIGINT, IN `p_id_persona` VARCHAR(30), IN `p_nom_persona` VARCHAR(250), IN `p_fk_cod_genero` BIGINT, IN `p_fk_cod_pais` BIGINT, IN `p_fk_cod_departamento` BIGINT, IN `p_fk_cod_municipio` BIGINT, IN `p_telefono` VARCHAR(15), IN `p_correo` VARCHAR(50), IN `p_direccion` VARCHAR(255), IN `p_usr_modifico` VARCHAR(50))  SQL SECURITY INVOKER BEGIN
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `UPD_CONTRASENA` (IN `p_cod_usuario` BIGINT, IN `p_nueva_contrasena` VARCHAR(255), IN `p_usr_modifico` VARCHAR(50))  SQL SECURITY INVOKER BEGIN
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
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UPD_DATOS_ENVIO_NUM_ENVIO` (IN `p_cod_envio` BIGINT, IN `p_num_envio` VARCHAR(50), IN `p_usr_modifico` VARCHAR(50))  SQL SECURITY INVOKER BEGIN
    -- Manejo de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error al actualizar el número de envío' AS Mensaje, FALSE AS success;
    END;
    
    START TRANSACTION;
    
    -- Actualizar solo el número de envío y datos de auditoría
    UPDATE TBL_DATOS_ENVIO 
    SET 
        NUM_ENVIO = p_num_envio,
        USR_MODIFICO = p_usr_modifico,
        FEC_MODIFICO = CURRENT_TIMESTAMP
    WHERE COD_ENVIO = p_cod_envio;
    
    COMMIT;
    
    SELECT 'Número de envío actualizado correctamente' AS Mensaje, TRUE AS success;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UPD_GENERO` (IN `p_cod_genero` BIGINT, IN `p_genero` VARCHAR(15), IN `p_usr_modifico` VARCHAR(50))  SQL SECURITY INVOKER BEGIN
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
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UPD_GENERO_ESTADO` (IN `p_COD_GENERO` BIGINT, IN `p_ESTADO` BOOLEAN, IN `p_USR_MODIFICO` VARCHAR(50))  SQL SECURITY INVOKER BEGIN
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
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UPD_OBJETO` (IN `p_cod_objeto` BIGINT, IN `p_nom_objeto` VARCHAR(100), IN `p_des_objeto` VARCHAR(100), IN `p_usr_modifico` VARCHAR(50))  SQL SECURITY INVOKER BEGIN
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
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UPD_OBJETO_ESTADO` (IN `p_COD_OBJETO` BIGINT, IN `p_ESTADO` BOOLEAN, IN `p_USR_MODIFICO` VARCHAR(50))  SQL SECURITY INVOKER BEGIN
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
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UPD_PAQUETES_ESTADO_MASIVO_JSON` (IN `p_USR_MODIFICO` VARCHAR(50), IN `p_PAQUETES` JSON)  SQL SECURITY INVOKER BEGIN
    DECLARE v_i INT DEFAULT 0;
    DECLARE v_count INT;
    DECLARE v_COD_PAQUETE BIGINT;
    DECLARE v_ESTADO TINYINT;
    DECLARE v_FEC_ENTREGA DATE;

    -- Manejo de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error al actualizar los paquetes' AS Mensaje, FALSE AS success;
    END;

    -- Iniciar transacción
    START TRANSACTION;

    -- Obtener el número de paquetes en el JSON
    SET v_count = JSON_LENGTH(p_PAQUETES);

    -- Si no hay paquetes, se revierte la transacción y se envía el mensaje de error
    IF v_count IS NULL OR v_count = 0 THEN
        ROLLBACK;
        SELECT 'No se proporcionaron paquetes para actualizar' AS Mensaje, FALSE AS success;
    ELSE
        -- Iterar sobre cada paquete en el JSON
        WHILE v_i < v_count DO
            -- Extraer valores del JSON
            SET v_COD_PAQUETE = JSON_UNQUOTE(JSON_EXTRACT(p_PAQUETES, CONCAT('$[', v_i, '].COD_PAQUETE')));
            SET v_ESTADO = JSON_UNQUOTE(JSON_EXTRACT(p_PAQUETES, CONCAT('$[', v_i, '].ESTADO')));
            SET v_FEC_ENTREGA = JSON_UNQUOTE(JSON_EXTRACT(p_PAQUETES, CONCAT('$[', v_i, '].FEC_ENTREGA')));

            -- Actualizar el paquete en la base de datos
            UPDATE TBL_PAQUETE 
            SET 
                ESTADO = v_ESTADO,
                FEC_ENTREGA = v_FEC_ENTREGA,
                USR_MODIFICO = p_USR_MODIFICO,
                FEC_MODIFICO = CURRENT_TIMESTAMP
            WHERE COD_PAQUETE = v_COD_PAQUETE;

            -- Incrementar contador
            SET v_i = v_i + 1;
        END WHILE;

        -- Confirmar transacción
        COMMIT;

        -- Mensaje de éxito
        SELECT CONCAT(v_count, ' paquetes actualizados correctamente.') AS Mensaje, TRUE AS success;
    END IF;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UPD_PAQUETE_ESTADO` (IN `p_cod_paquete` BIGINT, IN `p_estado` TINYINT, IN `p_fec_entrega` DATE, IN `p_usr_modifico` VARCHAR(50))  SQL SECURITY INVOKER BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error al actualizar el paquete' AS Mensaje, FALSE AS success;
    END;
    
    START TRANSACTION;
    
    UPDATE TBL_PAQUETE 
    SET 
        ESTADO = p_estado,
        FEC_ENTREGA = p_fec_entrega,
        USR_MODIFICO = p_usr_modifico,
        FEC_MODIFICO = CURRENT_TIMESTAMP
    WHERE COD_PAQUETE = p_cod_paquete;
    
    COMMIT;
    
    SELECT 'Paquete actualizado correctamente' AS Mensaje, TRUE AS success;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UPD_PERMISO` (IN `p_cod_permiso` BIGINT, IN `p_permiso_inserccion` INT, IN `p_permiso_eliminacion` INT, IN `p_permiso_actualizacion` INT, IN `p_permiso_consultar` INT, IN `p_permiso_reporte` INT, IN `p_usr_modifico` VARCHAR(50))  SQL SECURITY INVOKER BEGIN
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
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UPD_PERMISO_ESTADO` (IN `p_COD_PERMISO` BIGINT, IN `p_ESTADO` BOOLEAN, IN `p_USR_MODIFICO` VARCHAR(50))  SQL SECURITY INVOKER BEGIN
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
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UPD_PRECIO` (IN `p_COD_PAIS` BIGINT, IN `p_COD_PRECIO` BIGINT, IN `p_NUEVO_PRECIO` DECIMAL(10,2), IN `p_USR_MODIFICO` VARCHAR(50))  SQL SECURITY INVOKER BEGIN
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `UPD_ROL` (IN `p_cod_rol` BIGINT, IN `p_nom_rol` VARCHAR(100), IN `p_des_rol` VARCHAR(100), IN `p_usr_modifico` VARCHAR(50))  SQL SECURITY INVOKER BEGIN
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
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UPD_ROL_ESTADO` (IN `p_COD_ROL` BIGINT, IN `p_ESTADO` BOOLEAN, IN `p_USR_MODIFICO` VARCHAR(50))  SQL SECURITY INVOKER BEGIN
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
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UPD_USER` (IN `p_cod_usuario` BIGINT, IN `p_nom_persona` VARCHAR(250), IN `p_id_persona` VARCHAR(30), IN `p_fk_cod_genero` BIGINT, IN `p_fk_cod_pais` BIGINT, IN `p_fk_cod_departamento` BIGINT, IN `p_fk_cod_municipio` BIGINT, IN `p_usr_modifico` VARCHAR(50), IN `p_telefono` VARCHAR(15), IN `p_fk_cod_rol` BIGINT)  SQL SECURITY INVOKER BEGIN
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
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `UPD_USER_ESTADO` (IN `p_id_usuario` BIGINT, IN `p_estado` BOOLEAN, IN `p_usr_modifico` VARCHAR(50))  SQL SECURITY INVOKER BEGIN
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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_cajas`
--

CREATE TABLE `tbl_cajas` (
  `COD_CAJA` bigint(20) NOT NULL,
  `FK_COD_PRECIO` bigint(20) NOT NULL,
  `ID_CAJA` varchar(50) NOT NULL,
  `DETALLE` varchar(255) NOT NULL,
  `USR_CREO` varchar(50) NOT NULL,
  `FEC_CREACION` datetime NOT NULL DEFAULT current_timestamp(),
  `USR_MODIFICO` varchar(50) DEFAULT NULL,
  `FEC_MODIFICO` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tbl_cajas`
--

INSERT INTO `tbl_cajas` (`COD_CAJA`, `FK_COD_PRECIO`, `ID_CAJA`, `DETALLE`, `USR_CREO`, `FEC_CREACION`, `USR_MODIFICO`, `FEC_MODIFICO`) VALUES
(1, 1, '1234567890', 'Caja pequeña', 'Selfie', '2025-01-08 05:16:14', NULL, NULL),
(2, 2, '1234567891', 'Caja grande', 'Selfie', '2025-01-21 04:40:42', NULL, NULL),
(3, 3, '1234567800', 'Caja pequeña', 'Selfie', '2025-02-26 03:08:55', NULL, NULL),
(4, 4, '4x4x4', 'Caja mediana', 'Selfie', '2025-02-26 03:10:47', NULL, NULL),
(5, 1, '32x24x24', 'Caja mediana..', 'Joseft', '2025-03-06 23:53:34', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_correos`
--

CREATE TABLE `tbl_correos` (
  `COD_CORREO` bigint(20) NOT NULL,
  `FK_COD_PERSONA` bigint(20) NOT NULL,
  `CORREO` varchar(50) NOT NULL,
  `USR_CREO` varchar(50) NOT NULL,
  `FEC_CREACION` datetime NOT NULL DEFAULT current_timestamp(),
  `USR_MODIFICO` varchar(50) DEFAULT NULL,
  `FEC_MODIFICO` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tbl_correos`
--

INSERT INTO `tbl_correos` (`COD_CORREO`, `FK_COD_PERSONA`, `CORREO`, `USR_CREO`, `FEC_CREACION`, `USR_MODIFICO`, `FEC_MODIFICO`) VALUES
(1, 1, 'avasquezn@unah.hn', 'admin', '2025-01-08 05:08:01', NULL, NULL),
(2, 2, 'marioO9@gmail.comm', 'Selfie', '2025-01-08 05:25:12', NULL, NULL),
(3, 3, 'marioO9@gmail.comas', 'Selfie', '2025-01-21 04:36:13', NULL, NULL),
(6, 6, 'marioO9@gmail.comasd', 'Selfie', '2025-01-31 00:09:44', NULL, NULL),
(7, 7, 'avasquezn@unah.hnnn', 'Selfie', '2025-01-31 00:12:26', NULL, NULL),
(8, 8, 'reynaldo@gmail.com', 'System', '2025-02-10 03:05:48', NULL, NULL),
(9, 11, 'daniel@gmail.com', 'System', '2025-02-11 04:12:49', NULL, NULL),
(10, 12, 'luis@gmail.com', 'System', '2025-02-11 04:24:21', NULL, NULL),
(11, 13, 'marioO9@gmail.com', 'Selfie', '2025-02-12 00:50:25', NULL, NULL),
(12, 14, 'MaraiLopez@gmail.com', 'Selfie', '2025-02-12 02:28:52', NULL, NULL),
(13, 15, 'suany@gmail.com', 'Selfie', '2025-02-26 02:52:41', 'Joseft', '2025-03-04 04:06:18'),
(14, 17, 'marcos@gmail.com', 'Selfie', '2025-02-26 02:55:54', NULL, NULL),
(15, 18, 'joseftposadas1@gmail.com', 'Selfie', '2025-03-02 19:05:57', NULL, NULL),
(16, 19, 'reynaldov@gmail.com', 'Selfie', '2025-03-12 01:21:19', NULL, NULL),
(17, 20, 'magda@gmail.com', 'Selfie', '2025-03-12 01:50:28', NULL, NULL),
(18, 21, 'maigirnnn@gmail.com', 'Selfie', '2025-03-12 02:12:24', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_datos_envio`
--

CREATE TABLE `tbl_datos_envio` (
  `COD_ENVIO` bigint(20) NOT NULL,
  `FK_COD_CLIENTE` bigint(20) NOT NULL,
  `CANTIDAD_CAJAS` int(11) NOT NULL,
  `FK_COD_PAIS_ORIGEN` bigint(20) NOT NULL,
  `FK_COD_PAIS_DESTINO` bigint(20) NOT NULL,
  `FK_COD_DEPARTAMENTO` bigint(20) NOT NULL,
  `FK_COD_MUNICIPIO` bigint(20) NOT NULL,
  `FK_COD_DIRECCION` bigint(20) NOT NULL,
  `FK_COD_PERSONA` bigint(20) NOT NULL,
  `NUM_ENVIO` varchar(50) DEFAULT NULL,
  `USR_CREO` varchar(50) NOT NULL,
  `FEC_CREACION` datetime NOT NULL DEFAULT current_timestamp(),
  `USR_MODIFICO` varchar(50) DEFAULT NULL,
  `FEC_MODIFICO` datetime DEFAULT NULL,
  `IND_ESTADO` tinyint(4) NOT NULL DEFAULT 0,
  `FK_COD_DESTINATARIO` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tbl_datos_envio`
--

INSERT INTO `tbl_datos_envio` (`COD_ENVIO`, `FK_COD_CLIENTE`, `CANTIDAD_CAJAS`, `FK_COD_PAIS_ORIGEN`, `FK_COD_PAIS_DESTINO`, `FK_COD_DEPARTAMENTO`, `FK_COD_MUNICIPIO`, `FK_COD_DIRECCION`, `FK_COD_PERSONA`, `NUM_ENVIO`, `USR_CREO`, `FEC_CREACION`, `USR_MODIFICO`, `FEC_MODIFICO`, `IND_ESTADO`, `FK_COD_DESTINATARIO`) VALUES
(1, 1, 1, 1, 1, 1, 1, 1, 2, '47', 'Selfie', '2025-01-08 05:25:51', NULL, NULL, 1, NULL),
(2, 1, 1, 1, 1, 1, 1, 1, 2, '100', 'Selfie', '2025-01-12 20:46:53', NULL, NULL, 1, NULL),
(3, 1, 1, 1, 2, 1, 1, 1, 2, '04', 'Selfie', '2025-01-17 04:02:19', 'Selfie', '2025-01-30 02:03:58', 1, NULL),
(4, 1, 1, 1, 1, 1, 1, 1, 2, '101', 'Selfie', '2025-01-21 04:12:37', 'Selfie', '2025-02-01 02:36:19', 1, NULL),
(5, 1, 1, 1, 1, 1, 1, 1, 2, '66', 'Selfie', '2025-01-21 04:30:34', 'System', '2025-01-30 01:53:03', 1, NULL),
(6, 1, 3, 1, 1, 1, 1, 2, 3, '81', 'Selfie', '2025-01-21 04:37:10', 'System', '2025-01-30 01:52:34', 0, NULL),
(7, 3, 1, 1, 2, 1, 1, 3, 6, '', 'Selfie', '2025-01-31 00:10:10', NULL, NULL, 1, NULL),
(8, 4, 1, 1, 2, 1, 1, 4, 7, '', 'Selfie', '2025-01-31 00:15:36', NULL, NULL, 1, NULL),
(9, 4, 2, 1, 2, 1, 1, 4, 7, '', 'Selfie', '2025-01-31 00:17:29', NULL, NULL, 1, NULL),
(10, 3, 1, 1, 2, 1, 1, 3, 6, '', 'Selfie', '2025-01-31 00:20:56', NULL, NULL, 1, NULL),
(11, 4, 2, 1, 2, 1, 1, 4, 7, '', 'Selfie', '2025-01-31 00:23:17', NULL, NULL, 1, NULL),
(12, 4, 3, 1, 2, 1, 1, 4, 7, '301', 'Selfie', '2025-02-01 02:34:06', 'Selfie', '2025-02-11 04:00:03', 1, NULL),
(13, 1, 1, 6, 1, 1, 1, 5, 2, '300', 'Selfie', '2025-02-11 03:57:00', 'Selfie', '2025-02-11 04:00:03', 0, NULL),
(14, 1, 1, 5, 1, 1, 1, 7, 2, '3002', 'Selfie', '2025-02-11 04:24:44', 'Selfie', '2025-02-11 04:26:40', 1, 3),
(15, 1, 2, 4, 1, 1, 1, 6, 2, '3003', 'Selfie', '2025-02-11 04:24:58', 'Selfie', '2025-02-11 04:26:46', 1, 2),
(16, 1, 4, 3, 1, 1, 1, 5, 2, '3004', 'Selfie', '2025-02-11 05:06:34', 'Selfie', '2025-02-11 05:08:22', 1, 1),
(17, 3, 1, 2, 2, 2, 2, 9, 6, '', 'Selfie', '2025-02-12 02:29:46', NULL, NULL, 1, 5),
(18, 5, 1, 2, 1, 1, 1, 11, 15, '2040', 'Selfie', '2025-02-26 02:56:34', 'Joseft', '2025-03-07 00:01:52', 1, 6),
(19, 5, 2, 2, 1, 1, 1, 11, 15, '', 'Selfie', '2025-02-27 02:49:35', NULL, NULL, 1, 6),
(20, 5, 2, 2, 1, 1, 1, 11, 15, '', 'Selfie', '2025-02-27 03:47:15', NULL, NULL, 1, 6),
(21, 4, 2, 2, 2, 2, 2, 8, 7, '', 'Joseft', '2025-03-07 00:08:06', NULL, NULL, 1, 4),
(22, 5, 3, 2, 1, 1, 1, 11, 15, '', 'Selfie', '2025-03-11 01:36:46', NULL, NULL, 1, 6),
(23, 4, 1, 2, 2, 2, 2, 8, 7, '', 'Selfie', '2025-03-19 02:40:53', NULL, NULL, 0, 4),
(24, 4, 1, 2, 2, 2, 2, 8, 7, '', 'Selfie', '2025-03-19 02:40:53', NULL, NULL, 0, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_departamentos`
--

CREATE TABLE `tbl_departamentos` (
  `COD_DEPARTAMENTO` bigint(20) NOT NULL,
  `FK_COD_PAIS` bigint(20) DEFAULT NULL,
  `NOM_DEPARTAMENTO` varchar(50) NOT NULL,
  `ESTADO` tinyint(1) NOT NULL DEFAULT 1,
  `USR_CREO` varchar(50) NOT NULL,
  `FEC_CREACION` datetime NOT NULL DEFAULT current_timestamp(),
  `USR_MODIFICO` varchar(50) DEFAULT NULL,
  `FEC_MODIFICO` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tbl_departamentos`
--

INSERT INTO `tbl_departamentos` (`COD_DEPARTAMENTO`, `FK_COD_PAIS`, `NOM_DEPARTAMENTO`, `ESTADO`, `USR_CREO`, `FEC_CREACION`, `USR_MODIFICO`, `FEC_MODIFICO`) VALUES
(1, 1, 'Francisco Morazan', 1, 'admin', '2025-01-08 05:05:58', NULL, NULL),
(2, 2, 'California', 1, '', '2025-01-14 04:38:31', NULL, NULL),
(3, 2, 'Texas', 1, 'Selfie', '2025-01-14 04:42:12', NULL, NULL),
(4, 2, 'Florida', 1, 'Selfie', '2025-01-14 04:42:51', NULL, NULL),
(5, 3, 'DF', 1, 'Selfie', '2025-02-26 02:50:43', NULL, NULL),
(6, 7, 'Matagalpa', 1, 'Joseft', '2025-03-06 23:44:41', NULL, NULL),
(7, 7, 'Chinandenga', 1, 'Joseft', '2025-03-06 23:45:11', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_descuentos`
--

CREATE TABLE `tbl_descuentos` (
  `COD_DESCUENTO` bigint(20) NOT NULL,
  `FK_COD_TIPO_DESCUENTO` bigint(20) NOT NULL,
  `NOMBRE` varchar(100) NOT NULL,
  `CANTIDAD` decimal(10,2) NOT NULL,
  `USR_CREO` varchar(50) NOT NULL,
  `FEC_CREACION` datetime NOT NULL DEFAULT current_timestamp(),
  `USR_MODIFICO` varchar(50) DEFAULT NULL,
  `FEC_MODIFICO` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tbl_descuentos`
--

INSERT INTO `tbl_descuentos` (`COD_DESCUENTO`, `FK_COD_TIPO_DESCUENTO`, `NOMBRE`, `CANTIDAD`, `USR_CREO`, `FEC_CREACION`, `USR_MODIFICO`, `FEC_MODIFICO`) VALUES
(1, 1, 'Descuento tercera edad', 10.00, 'Selfie', '2025-01-08 05:16:55', NULL, NULL),
(2, 2, 'personal', 20.00, 'Joseft', '2025-03-06 23:55:10', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_destinatarios`
--

CREATE TABLE `tbl_destinatarios` (
  `COD_DESTINATARIO` bigint(20) NOT NULL,
  `FK_COD_CLIENTE` bigint(20) NOT NULL,
  `FK_COD_PERSONA` bigint(20) NOT NULL,
  `USR_CREO` varchar(50) NOT NULL,
  `FEC_CREACION` datetime NOT NULL DEFAULT current_timestamp(),
  `USR_MODIFICO` varchar(50) DEFAULT NULL,
  `FEC_MODIFICACION` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tbl_destinatarios`
--

INSERT INTO `tbl_destinatarios` (`COD_DESTINATARIO`, `FK_COD_CLIENTE`, `FK_COD_PERSONA`, `USR_CREO`, `FEC_CREACION`, `USR_MODIFICO`, `FEC_MODIFICACION`) VALUES
(1, 1, 8, 'System', '2025-02-10 03:05:48', NULL, NULL),
(2, 1, 11, 'System', '2025-02-11 04:12:49', NULL, NULL),
(3, 1, 12, 'System', '2025-02-11 04:24:21', NULL, NULL),
(4, 4, 13, 'Selfie', '2025-02-12 00:50:25', NULL, NULL),
(5, 3, 14, 'Selfie', '2025-02-12 02:28:52', NULL, NULL),
(6, 5, 17, 'Selfie', '2025-02-26 02:55:54', NULL, NULL),
(7, 7, 21, 'Selfie', '2025-03-12 02:12:24', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_direcciones`
--

CREATE TABLE `tbl_direcciones` (
  `COD_DIRECCION` bigint(20) NOT NULL,
  `FK_COD_PERSONA` bigint(20) DEFAULT NULL,
  `FK_COD_MUNICIPIO` bigint(20) DEFAULT NULL,
  `DIRECCION` varchar(255) DEFAULT NULL,
  `USR_CREO` varchar(50) NOT NULL,
  `FEC_CREACION` datetime NOT NULL DEFAULT current_timestamp(),
  `USR_MODIFICO` varchar(50) DEFAULT NULL,
  `FEC_MODIFICO` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tbl_direcciones`
--

INSERT INTO `tbl_direcciones` (`COD_DIRECCION`, `FK_COD_PERSONA`, `FK_COD_MUNICIPIO`, `DIRECCION`, `USR_CREO`, `FEC_CREACION`, `USR_MODIFICO`, `FEC_MODIFICO`) VALUES
(1, 2, 1, 'Col. Rodriguez', 'Selfie', '2025-01-08 05:25:12', NULL, NULL),
(2, 3, 1, 'Col. Rodriguez', 'Selfie', '2025-01-21 04:36:13', NULL, NULL),
(3, 6, 1, 'Las uvas', 'Selfie', '2025-01-31 00:09:44', NULL, NULL),
(4, 7, 1, 'Col. Rodriguez', 'Selfie', '2025-01-31 00:12:26', NULL, NULL),
(5, 8, 1, 'Las uvas', 'System', '2025-02-10 03:05:48', NULL, NULL),
(6, 11, 1, 'La centroamericana', 'System', '2025-02-11 04:12:49', NULL, NULL),
(7, 12, 1, 'La centroamericana', 'System', '2025-02-11 04:24:21', NULL, NULL),
(8, 13, 2, 'Casa 56', 'Selfie', '2025-02-12 00:50:25', NULL, NULL),
(9, 14, 2, 'Las casitas', 'Selfie', '2025-02-12 02:28:52', NULL, NULL),
(10, 15, 3, 'Ciudad de méxico', 'Selfie', '2025-02-26 02:52:41', 'Joseft', '2025-03-04 04:06:18'),
(11, 17, 1, 'Colonia las Uvas', 'Selfie', '2025-02-26 02:55:54', NULL, NULL),
(12, 19, 1, 'Colonia Rodriguez', 'Selfie', '2025-03-12 01:21:19', NULL, NULL),
(13, 20, 1, 'La uvas', 'Selfie', '2025-03-12 01:50:28', NULL, NULL),
(14, 21, 1, 'La kennedy', 'Selfie', '2025-03-12 02:12:24', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_estados`
--

CREATE TABLE `tbl_estados` (
  `COD_ESTADO` bigint(20) NOT NULL,
  `TIP_ESTADO` varchar(20) NOT NULL,
  `DETALLE` varchar(100) NOT NULL,
  `ESTADO` tinyint(1) NOT NULL DEFAULT 1,
  `USR_CREO` varchar(50) NOT NULL,
  `FEC_CREACION` datetime NOT NULL DEFAULT current_timestamp(),
  `USR_MODIFICO` varchar(50) DEFAULT NULL,
  `FEC_MODIFICO` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_generos`
--

CREATE TABLE `tbl_generos` (
  `COD_GENERO` bigint(20) NOT NULL,
  `GENERO` varchar(15) NOT NULL,
  `ESTADO` tinyint(1) NOT NULL DEFAULT 1,
  `USR_CREO` varchar(50) NOT NULL,
  `FEC_CREACION` datetime NOT NULL DEFAULT current_timestamp(),
  `USR_MODIFICO` varchar(50) DEFAULT NULL,
  `FEC_MODIFICO` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tbl_generos`
--

INSERT INTO `tbl_generos` (`COD_GENERO`, `GENERO`, `ESTADO`, `USR_CREO`, `FEC_CREACION`, `USR_MODIFICO`, `FEC_MODIFICO`) VALUES
(1, 'Masculino', 1, 'admin', '2025-01-08 05:05:18', NULL, NULL),
(2, 'Femenino', 1, 'Selfie', '2025-02-26 02:49:58', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_ms_bitacora`
--

CREATE TABLE `tbl_ms_bitacora` (
  `COD_BITACORA` bigint(20) NOT NULL,
  `FECHA` datetime NOT NULL,
  `USR_BITACORA` varchar(50) NOT NULL,
  `OBJ_BITACORA` varchar(100) NOT NULL,
  `ACCION` varchar(20) NOT NULL,
  `DESCRIPCION` varchar(1000) NOT NULL,
  `USR_CREO` varchar(50) NOT NULL,
  `FEC_CREACION` datetime NOT NULL DEFAULT current_timestamp(),
  `USR_MODIFICO` varchar(50) DEFAULT NULL,
  `FEC_MODIFICO` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_ms_objetos`
--

CREATE TABLE `tbl_ms_objetos` (
  `COD_OBJETO` bigint(20) NOT NULL,
  `NOM_OBJETO` varchar(100) NOT NULL,
  `DES_OBJETO` varchar(100) NOT NULL,
  `ESTADO` tinyint(1) NOT NULL DEFAULT 1,
  `USR_CREO` varchar(50) NOT NULL,
  `FEC_CREACION` datetime NOT NULL DEFAULT current_timestamp(),
  `USR_MODIFICO` varchar(50) DEFAULT NULL,
  `FEC_MODIFICO` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tbl_ms_objetos`
--

INSERT INTO `tbl_ms_objetos` (`COD_OBJETO`, `NOM_OBJETO`, `DES_OBJETO`, `ESTADO`, `USR_CREO`, `FEC_CREACION`, `USR_MODIFICO`, `FEC_MODIFICO`) VALUES
(1, 'Dashboard', 'Dashboard', 1, 'admin', '2025-01-08 05:04:59', NULL, NULL),
(2, 'Objetos', 'Objetos', 1, 'admin', '2025-01-08 05:10:56', NULL, NULL),
(3, 'Permisos', 'Permisos', 1, 'Selfie', '2025-01-08 05:11:46', NULL, NULL),
(4, 'Roles', 'Roles', 1, 'Selfie', '2025-01-08 05:12:00', NULL, NULL),
(5, 'Usuarios', 'Usuarios', 1, 'Selfie', '2025-01-08 05:12:16', NULL, NULL),
(6, 'Géneros', 'Géneros', 1, 'Selfie', '2025-01-08 05:12:34', NULL, NULL),
(7, 'Precios', 'Precios', 1, 'Selfie', '2025-01-08 05:12:42', NULL, NULL),
(8, 'Cajas', 'Cajas', 1, 'Selfie', '2025-01-08 05:12:51', NULL, NULL),
(9, 'Tipo de descuentos', 'Tipo de descuentos', 1, 'Selfie', '2025-01-08 05:13:00', NULL, NULL),
(10, 'Descuentos', 'Descuentos', 1, 'Selfie', '2025-01-08 05:13:05', NULL, NULL),
(11, 'Clientes', 'Clientes', 1, 'Selfie', '2025-01-08 05:13:11', NULL, NULL),
(12, 'Envios', 'Envios', 1, 'Selfie', '2025-01-08 05:13:16', NULL, NULL),
(13, 'Paquetes', 'Paquetes', 1, 'Selfie', '2025-01-09 03:55:38', NULL, NULL),
(14, 'Paises', 'Paises', 1, 'Selfie', '2025-01-14 02:31:24', NULL, NULL),
(15, 'Flujo de efectivo', 'Flujo de efectivo', 1, 'Selfie', '2025-02-22 02:50:46', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_ms_parametros`
--

CREATE TABLE `tbl_ms_parametros` (
  `COD_PARAMETRO` bigint(20) NOT NULL,
  `NOM_PARAMETRO` varchar(100) NOT NULL,
  `VAL_PARAMETRO` varchar(100) NOT NULL,
  `USR_CREO` varchar(50) NOT NULL,
  `FEC_CREACION` datetime NOT NULL DEFAULT current_timestamp(),
  `USR_MODIFICO` varchar(50) DEFAULT NULL,
  `FEC_MODIFICACION` datetime DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_ms_permisos`
--

CREATE TABLE `tbl_ms_permisos` (
  `COD_PERMISO` bigint(20) NOT NULL,
  `FK_COD_ROL` bigint(20) NOT NULL,
  `FK_COD_OBJETO` bigint(20) NOT NULL,
  `DES_PERMISO_INSERCCION` int(11) NOT NULL,
  `DES_PERMISO_ELIMINACION` int(11) NOT NULL,
  `DES_PERMISO_ACTUALIZACION` int(11) NOT NULL,
  `DES_PERMISO_CONSULTAR` int(11) NOT NULL,
  `PERMISO_REPORTE` int(11) NOT NULL,
  `ESTADO` tinyint(1) NOT NULL DEFAULT 1,
  `USR_CREO` varchar(50) NOT NULL,
  `FEC_CREACION` datetime NOT NULL DEFAULT current_timestamp(),
  `USR_MODIFICO` varchar(50) DEFAULT NULL,
  `FEC_MODIFICO` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tbl_ms_permisos`
--

INSERT INTO `tbl_ms_permisos` (`COD_PERMISO`, `FK_COD_ROL`, `FK_COD_OBJETO`, `DES_PERMISO_INSERCCION`, `DES_PERMISO_ELIMINACION`, `DES_PERMISO_ACTUALIZACION`, `DES_PERMISO_CONSULTAR`, `PERMISO_REPORTE`, `ESTADO`, `USR_CREO`, `FEC_CREACION`, `USR_MODIFICO`, `FEC_MODIFICO`) VALUES
(1, 1, 1, 1, 1, 1, 1, 1, 1, 'admin', '2025-01-08 05:07:02', NULL, NULL),
(2, 1, 2, 1, 1, 1, 1, 1, 1, 'admin', '2025-01-08 05:11:30', NULL, NULL),
(3, 1, 3, 1, 1, 1, 1, 1, 1, 'admin', '2025-01-08 05:13:52', NULL, NULL),
(4, 1, 4, 1, 1, 1, 1, 1, 1, 'Selfie', '2025-01-08 05:14:07', 'Selfie', '2025-01-08 05:14:13'),
(5, 1, 5, 1, 1, 1, 1, 1, 1, 'Selfie', '2025-01-08 05:14:23', NULL, NULL),
(6, 1, 6, 1, 1, 1, 1, 1, 1, 'Selfie', '2025-01-08 05:14:33', NULL, NULL),
(7, 1, 7, 1, 1, 1, 1, 1, 1, 'Selfie', '2025-01-08 05:14:41', NULL, NULL),
(8, 1, 8, 1, 1, 1, 1, 1, 1, 'Selfie', '2025-01-08 05:14:57', NULL, NULL),
(9, 1, 9, 1, 1, 1, 1, 1, 1, 'Selfie', '2025-01-08 05:15:05', 'Selfie', '2025-02-26 03:14:06'),
(10, 1, 10, 1, 1, 1, 1, 1, 1, 'Selfie', '2025-01-08 05:15:12', 'Selfie', '2025-02-26 03:14:11'),
(11, 1, 11, 1, 1, 1, 1, 1, 1, 'Selfie', '2025-01-08 05:15:19', NULL, NULL),
(12, 1, 12, 1, 1, 1, 1, 1, 1, 'Selfie', '2025-01-08 05:15:26', 'Selfie', '2025-01-30 02:30:39'),
(13, 1, 13, 1, 1, 1, 1, 1, 1, 'Selfie', '2025-01-09 03:55:46', NULL, NULL),
(14, 1, 14, 1, 1, 1, 1, 1, 1, 'Selfie', '2025-01-14 02:31:36', NULL, NULL),
(15, 1, 15, 0, 0, 0, 1, 0, 1, 'Selfie', '2025-02-22 02:51:06', 'Selfie', '2025-02-26 02:48:25'),
(16, 2, 1, 1, 1, 1, 1, 1, 1, 'Selfie', '2025-02-26 03:03:33', NULL, NULL),
(17, 2, 15, 0, 0, 0, 1, 0, 1, 'Selfie', '2025-02-26 03:03:46', NULL, NULL),
(18, 2, 5, 1, 1, 1, 1, 1, 1, 'Selfie', '2025-02-26 03:04:17', NULL, NULL),
(19, 2, 6, 1, 1, 1, 1, 1, 1, 'Selfie', '2025-02-26 03:04:41', NULL, NULL),
(20, 2, 7, 1, 1, 1, 1, 1, 1, 'Selfie', '2025-02-26 03:04:57', NULL, NULL),
(21, 2, 8, 1, 1, 1, 1, 1, 1, 'Selfie', '2025-02-26 03:05:04', NULL, NULL),
(22, 2, 11, 1, 1, 1, 1, 1, 1, 'Selfie', '2025-02-26 03:05:39', NULL, NULL),
(23, 2, 12, 1, 1, 1, 1, 1, 1, 'Selfie', '2025-02-26 03:05:46', NULL, NULL),
(24, 2, 13, 1, 1, 1, 1, 1, 1, 'Selfie', '2025-02-26 03:05:53', NULL, NULL),
(25, 2, 14, 1, 1, 1, 1, 1, 1, 'Selfie', '2025-02-26 03:06:06', NULL, NULL),
(26, 3, 1, 1, 1, 1, 1, 1, 1, 'Selfie', '2025-02-26 03:06:13', NULL, NULL),
(27, 3, 15, 0, 0, 0, 0, 0, 1, 'Selfie', '2025-02-26 03:06:22', NULL, NULL),
(28, 3, 7, 0, 0, 0, 0, 0, 1, 'Selfie', '2025-02-26 03:06:56', 'Selfie', '2025-02-26 03:08:00'),
(29, 3, 8, 0, 0, 0, 0, 0, 1, 'Selfie', '2025-02-26 03:07:07', 'Selfie', '2025-02-26 03:08:04');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_ms_roles`
--

CREATE TABLE `tbl_ms_roles` (
  `COD_ROL` bigint(20) NOT NULL,
  `NOM_ROL` varchar(100) NOT NULL,
  `DES_ROL` varchar(100) NOT NULL,
  `USR_CREO` varchar(50) NOT NULL,
  `FEC_CREACION` datetime NOT NULL DEFAULT current_timestamp(),
  `USR_MODIFICO` varchar(50) DEFAULT NULL,
  `FEC_MODIFICO` datetime DEFAULT NULL,
  `ESTADO` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tbl_ms_roles`
--

INSERT INTO `tbl_ms_roles` (`COD_ROL`, `NOM_ROL`, `DES_ROL`, `USR_CREO`, `FEC_CREACION`, `USR_MODIFICO`, `FEC_MODIFICO`, `ESTADO`) VALUES
(1, 'Administrador', 'Administrador', 'admin', '2025-01-08 05:06:41', NULL, NULL, 1),
(2, 'Supervisor', 'Supervisor', 'Selfie', '2025-02-26 03:02:02', NULL, NULL, 1),
(3, 'Empleado', 'Empleado', 'Selfie', '2025-02-26 03:02:28', NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_ms_usuarios`
--

CREATE TABLE `tbl_ms_usuarios` (
  `COD_USUARIO` bigint(20) NOT NULL,
  `FK_COD_ROL` bigint(20) NOT NULL,
  `FK_COD_PERSONA` bigint(20) NOT NULL,
  `NOM_USUARIO` varchar(50) NOT NULL,
  `CONTRASENA` varchar(255) NOT NULL,
  `TOKEN` varchar(255) DEFAULT NULL,
  `FEC_ULTIMA_CONEXION` datetime NOT NULL,
  `FEC_VENCIMIENTO` date NOT NULL,
  `NUM_INTENTOS` int(11) NOT NULL DEFAULT 0,
  `USR_CREO` varchar(50) NOT NULL,
  `FEC_CREACION` datetime NOT NULL DEFAULT current_timestamp(),
  `USR_MODIFICO` varchar(50) DEFAULT NULL,
  `FEC_MODIFICACION` datetime DEFAULT NULL,
  `ESTADO` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tbl_ms_usuarios`
--

INSERT INTO `tbl_ms_usuarios` (`COD_USUARIO`, `FK_COD_ROL`, `FK_COD_PERSONA`, `NOM_USUARIO`, `CONTRASENA`, `TOKEN`, `FEC_ULTIMA_CONEXION`, `FEC_VENCIMIENTO`, `NUM_INTENTOS`, `USR_CREO`, `FEC_CREACION`, `USR_MODIFICO`, `FEC_MODIFICACION`, `ESTADO`) VALUES
(1, 1, 1, 'Selfie', 'P@ssword1', NULL, '2025-01-08 05:08:01', '2025-02-07', 0, 'admin', '2025-01-08 05:08:01', NULL, NULL, 1),
(2, 1, 18, 'Joseft', 'Vale1020.', NULL, '2025-03-02 19:05:57', '2025-04-01', 0, 'Selfie', '2025-03-02 19:05:57', NULL, NULL, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_municipios`
--

CREATE TABLE `tbl_municipios` (
  `COD_MUNICIPIO` bigint(20) NOT NULL,
  `FK_COD_DEPARTAMENTO` bigint(20) DEFAULT NULL,
  `NOM_MUNICIPIO` varchar(50) NOT NULL,
  `ID_POSTAL` varchar(20) DEFAULT NULL,
  `ESTADO` tinyint(1) NOT NULL DEFAULT 1,
  `USR_CREO` varchar(50) NOT NULL,
  `FEC_CREACION` datetime NOT NULL DEFAULT current_timestamp(),
  `USR_MODIFICO` varchar(50) DEFAULT NULL,
  `FEC_MODIFICO` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tbl_municipios`
--

INSERT INTO `tbl_municipios` (`COD_MUNICIPIO`, `FK_COD_DEPARTAMENTO`, `NOM_MUNICIPIO`, `ID_POSTAL`, `ESTADO`, `USR_CREO`, `FEC_CREACION`, `USR_MODIFICO`, `FEC_MODIFICO`) VALUES
(1, 1, 'Distrito central', '11101', 1, 'admin', '2025-01-08 05:06:23', NULL, NULL),
(2, 2, 'Los Angeles', '90001', 1, 'Selfie', '2025-01-14 05:17:18', NULL, NULL),
(3, 5, 'CDM', '32323', 1, 'Selfie', '2025-02-26 02:51:04', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_op_clientes`
--

CREATE TABLE `tbl_op_clientes` (
  `COD_CLIENTE` bigint(20) NOT NULL,
  `FK_COD_PERSONA` bigint(20) NOT NULL,
  `USR_CREO` varchar(50) NOT NULL,
  `FEC_CREACION` datetime NOT NULL DEFAULT current_timestamp(),
  `USR_MODIFICO` varchar(50) DEFAULT NULL,
  `FEC_MODIFICACION` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tbl_op_clientes`
--

INSERT INTO `tbl_op_clientes` (`COD_CLIENTE`, `FK_COD_PERSONA`, `USR_CREO`, `FEC_CREACION`, `USR_MODIFICO`, `FEC_MODIFICACION`) VALUES
(1, 2, 'Selfie', '2025-01-08 05:25:12', NULL, NULL),
(2, 3, 'Selfie', '2025-01-21 04:36:13', NULL, NULL),
(3, 6, 'Selfie', '2025-01-31 00:09:44', NULL, NULL),
(4, 7, 'Selfie', '2025-01-31 00:12:26', NULL, NULL),
(5, 15, 'Selfie', '2025-02-26 02:52:41', NULL, NULL),
(6, 19, 'Selfie', '2025-03-12 01:21:19', NULL, NULL),
(7, 20, 'Selfie', '2025-03-12 01:50:28', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_paises`
--

CREATE TABLE `tbl_paises` (
  `COD_PAIS` bigint(20) NOT NULL,
  `NOM_PAIS` varchar(30) NOT NULL,
  `NUM_ZONA` varchar(20) DEFAULT NULL,
  `ESTADO` tinyint(1) NOT NULL DEFAULT 1,
  `USR_CREO` varchar(50) NOT NULL,
  `FEC_CREACION` datetime NOT NULL DEFAULT current_timestamp(),
  `USR_MODIFICO` varchar(50) DEFAULT NULL,
  `FEC_MODIFICO` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tbl_paises`
--

INSERT INTO `tbl_paises` (`COD_PAIS`, `NOM_PAIS`, `NUM_ZONA`, `ESTADO`, `USR_CREO`, `FEC_CREACION`, `USR_MODIFICO`, `FEC_MODIFICO`) VALUES
(1, 'Honduras', '504', 1, 'admin', '2025-01-08 05:05:37', NULL, NULL),
(2, 'Estados Unidos', '1', 1, 'Selfie', '2025-01-14 03:52:37', NULL, NULL),
(3, 'México', '52', 1, 'Selfie', '2025-01-14 04:02:08', NULL, NULL),
(4, 'Guatemala', '502', 1, 'Selfie', '2025-01-14 04:09:41', NULL, NULL),
(5, 'San Salvador', '503', 1, 'Selfie', '2025-01-14 04:12:26', NULL, NULL),
(6, 'Panamá', '507', 1, 'Selfie', '2025-01-14 04:13:29', NULL, NULL),
(7, 'Nicaragua', 'Nicaragua', 1, 'Joseft', '2025-03-06 23:43:47', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_paquete`
--

CREATE TABLE `tbl_paquete` (
  `COD_PAQUETE` bigint(20) NOT NULL,
  `FK_COD_CAJA` bigint(20) NOT NULL,
  `ESTADO` tinyint(4) NOT NULL DEFAULT 0,
  `FK_COD_CLIENTE` bigint(20) NOT NULL,
  `FK_COD_ENVIO` bigint(20) NOT NULL,
  `FEC_ENTREGA` date DEFAULT NULL,
  `USR_CREO` varchar(50) NOT NULL,
  `FEC_CREACION` datetime NOT NULL DEFAULT current_timestamp(),
  `USR_MODIFICO` varchar(50) DEFAULT NULL,
  `FEC_MODIFICO` datetime DEFAULT NULL,
  `FK_COD_DESCUENTO` bigint(20) DEFAULT NULL,
  `DEPOSITO` decimal(12,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tbl_paquete`
--

INSERT INTO `tbl_paquete` (`COD_PAQUETE`, `FK_COD_CAJA`, `ESTADO`, `FK_COD_CLIENTE`, `FK_COD_ENVIO`, `FEC_ENTREGA`, `USR_CREO`, `FEC_CREACION`, `USR_MODIFICO`, `FEC_MODIFICO`, `FK_COD_DESCUENTO`, `DEPOSITO`) VALUES
(1, 1, 1, 1, 1, '2025-02-19', 'admin', '2024-12-08 05:30:39', 'Selfie', '2025-02-20 02:23:03', NULL, NULL),
(2, 1, 1, 1, 1, '2025-01-30', 'Selfie', '2025-01-09 05:11:30', 'Selfie', '2025-01-30 02:45:56', NULL, NULL),
(3, 1, 2, 1, 1, '2025-01-29', 'Selfie', '2025-10-21 04:26:07', 'Selfie', '2025-01-30 02:38:31', NULL, NULL),
(4, 1, 0, 2, 6, '2025-01-23', 'Selfie', '2025-11-24 02:00:07', NULL, NULL, NULL, NULL),
(5, 2, 0, 2, 6, '2025-01-23', 'Selfie', '2025-02-24 02:00:07', NULL, NULL, NULL, NULL),
(6, 1, 0, 2, 6, '2025-01-23', 'Selfie', '2025-01-24 02:00:07', NULL, NULL, NULL, NULL),
(7, 1, 1, 1, 2, '2025-03-06', 'Selfie', '2024-12-24 02:05:12', 'Joseft', '2025-03-06 23:58:22', NULL, NULL),
(8, 1, 0, 2, 6, NULL, 'Selfie', '2024-12-24 02:07:35', NULL, NULL, NULL, NULL),
(9, 2, 0, 2, 6, NULL, 'Selfie', '2024-12-24 02:07:35', NULL, NULL, NULL, NULL),
(10, 1, 0, 2, 6, NULL, 'Selfie', '2024-12-24 02:11:17', NULL, NULL, NULL, NULL),
(11, 2, 0, 2, 6, NULL, 'Selfie', '2024-12-24 02:11:17', NULL, NULL, NULL, NULL),
(12, 1, 0, 2, 6, NULL, 'Selfie', '2024-12-24 02:11:17', NULL, NULL, NULL, NULL),
(13, 1, 1, 1, 3, '2025-03-06', 'Selfie', '2024-12-24 02:19:19', 'Joseft', '2025-03-06 23:58:22', NULL, NULL),
(14, 1, 0, 3, 7, NULL, 'Selfie', '2025-01-31 00:11:06', NULL, NULL, NULL, NULL),
(15, 2, 2, 4, 8, '2025-02-21', 'Selfie', '2025-01-31 00:17:13', 'Selfie', '2025-02-22 02:46:43', NULL, NULL),
(16, 1, 2, 4, 9, '2025-02-21', 'Selfie', '2025-01-31 00:20:27', 'Selfie', '2025-02-22 02:46:43', NULL, NULL),
(17, 2, 2, 4, 9, '2025-02-21', 'Selfie', '2025-01-31 00:20:27', 'Selfie', '2025-02-22 02:46:43', NULL, NULL),
(18, 1, 0, 3, 10, NULL, 'Selfie', '2025-01-31 00:23:35', NULL, NULL, NULL, NULL),
(19, 1, 2, 4, 12, '2025-02-21', 'Selfie', '2025-02-01 02:36:05', 'Selfie', '2025-02-22 02:46:43', NULL, NULL),
(20, 2, 2, 4, 12, '2025-01-31', 'Selfie', '2025-02-01 02:36:05', 'Selfie', '2025-02-01 02:37:06', NULL, NULL),
(21, 1, 0, 4, 12, NULL, 'Selfie', '2025-02-01 02:36:05', NULL, NULL, NULL, NULL),
(22, 1, 1, 1, 14, '2025-03-06', 'Selfie', '2025-02-11 04:25:38', 'Joseft', '2025-03-06 23:58:22', NULL, NULL),
(23, 1, 0, 1, 15, NULL, 'Selfie', '2025-02-11 04:25:47', NULL, NULL, NULL, NULL),
(24, 2, 2, 1, 15, '2025-02-19', 'Selfie', '2025-02-11 04:25:47', 'Selfie', '2025-02-20 02:24:07', NULL, NULL),
(25, 1, 0, 1, 16, NULL, 'Selfie', '2025-02-20 02:23:51', NULL, NULL, NULL, NULL),
(26, 1, 0, 1, 16, NULL, 'Selfie', '2025-02-20 02:23:51', NULL, NULL, NULL, NULL),
(27, 1, 0, 1, 16, NULL, 'Selfie', '2025-02-20 02:23:51', NULL, NULL, NULL, NULL),
(28, 2, 1, 1, 16, '2025-03-06', 'Selfie', '2025-02-20 02:23:51', 'Joseft', '2025-03-06 23:58:22', NULL, NULL),
(29, 2, 2, 5, 18, '2025-02-26', 'Selfie', '2025-02-26 02:57:02', 'Selfie', '2025-02-26 02:57:50', NULL, NULL),
(30, 4, 0, 4, 11, NULL, 'Selfie', '2025-02-26 03:11:29', NULL, NULL, NULL, NULL),
(31, 3, 0, 4, 11, NULL, 'Selfie', '2025-02-26 03:11:29', NULL, NULL, NULL, NULL),
(32, 3, 0, 3, 17, NULL, 'Selfie', '2025-02-27 02:46:49', NULL, NULL, 1, NULL),
(33, 4, 0, 5, 19, NULL, 'Selfie', '2025-02-27 02:50:01', NULL, NULL, 1, NULL),
(34, 4, 0, 5, 19, NULL, 'Selfie', '2025-02-27 02:50:01', NULL, NULL, 1, NULL),
(35, 4, 0, 5, 20, NULL, 'Selfie', '2025-02-27 03:47:36', NULL, NULL, 1, NULL),
(36, 4, 0, 5, 20, NULL, 'Selfie', '2025-02-27 03:47:36', NULL, NULL, 1, NULL),
(37, 1, 0, 4, 21, '2025-03-06', 'Joseft', '2025-03-07 00:10:28', NULL, NULL, 1, NULL),
(38, 2, 0, 4, 21, '2025-03-06', 'Joseft', '2025-03-07 00:10:28', NULL, NULL, 1, NULL),
(39, 1, 0, 5, 22, NULL, 'Selfie', '2025-03-11 01:42:00', NULL, NULL, NULL, NULL),
(40, 5, 0, 5, 22, NULL, 'Selfie', '2025-03-11 01:42:00', NULL, NULL, NULL, NULL),
(41, 2, 0, 5, 22, NULL, 'Selfie', '2025-03-11 01:42:00', NULL, NULL, NULL, NULL),
(42, 1, 0, 1, 15, NULL, 'Selfie', '2025-03-21 01:58:55', NULL, NULL, NULL, 25.00),
(43, 4, 1, 1, 15, '2025-03-20', 'Selfie', '2025-03-21 01:58:55', 'Selfie', '2025-03-21 02:14:35', NULL, 25.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_personas`
--

CREATE TABLE `tbl_personas` (
  `COD_PERSONA` bigint(20) NOT NULL,
  `ID_PERSONA` varchar(30) NOT NULL,
  `NOM_PERSONA` varchar(250) NOT NULL,
  `FK_COD_GENERO` bigint(20) NOT NULL,
  `FK_COD_PAIS` bigint(20) NOT NULL,
  `FK_COD_DEPARTAMENTO` bigint(20) NOT NULL,
  `FK_COD_MUNICIPIO` bigint(20) NOT NULL,
  `USR_CREO` varchar(50) NOT NULL,
  `FEC_CREACION` datetime NOT NULL DEFAULT current_timestamp(),
  `USR_MODIFICO` varchar(50) DEFAULT NULL,
  `FEC_MODIFICO` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tbl_personas`
--

INSERT INTO `tbl_personas` (`COD_PERSONA`, `ID_PERSONA`, `NOM_PERSONA`, `FK_COD_GENERO`, `FK_COD_PAIS`, `FK_COD_DEPARTAMENTO`, `FK_COD_MUNICIPIO`, `USR_CREO`, `FEC_CREACION`, `USR_MODIFICO`, `FEC_MODIFICO`) VALUES
(1, '-22228', 'Alexis Vasquez', 1, 1, 1, 1, 'admin', '2025-01-08 05:08:01', NULL, NULL),
(2, '0801-1998-00000', 'Jose Mario Lopez', 1, 1, 1, 1, 'Selfie', '2025-01-08 05:25:12', NULL, NULL),
(3, '0801-1998-00001', 'Lucas Jose Martinez', 1, 1, 1, 1, 'Selfie', '2025-01-21 04:36:13', NULL, NULL),
(6, '0801200021021', 'Jose Roberto Diaz', 1, 1, 1, 1, 'Selfie', '2025-01-31 00:09:44', NULL, NULL),
(7, '0801-2000-21029', 'Alexis Josué Vasquez Nuñez', 1, 1, 1, 1, 'Selfie', '2025-01-31 00:12:26', NULL, NULL),
(8, '0801-5000-50001', 'Reynaldo Rafael Vasquez', 1, 1, 1, 1, 'System', '2025-02-10 03:05:48', NULL, NULL),
(11, '0801-5000-50002', 'Danie Eduardo Sosa Nuñez', 1, 1, 1, 1, 'System', '2025-02-11 04:12:49', NULL, NULL),
(12, '0801-5000-50022', 'Luis Enrique Sosa Nuñez', 1, 1, 1, 1, 'System', '2025-02-11 04:24:21', NULL, NULL),
(13, '6565-0000-32320', 'Wilfredo Nolasco', 1, 2, 2, 2, 'Selfie', '2025-02-12 00:50:25', NULL, NULL),
(14, '0606-0606-06066', 'Maria Roberta Lopez', 1, 2, 2, 2, 'Selfie', '2025-02-12 02:28:52', NULL, NULL),
(15, '0801196532321', 'Soany Nolasco', 2, 3, 5, 3, 'Selfie', '2025-02-26 02:52:41', 'Joseft', '2025-03-04 04:06:18'),
(17, '0801200132322', 'Marcos Martinez', 1, 1, 1, 1, 'Selfie', '2025-02-26 02:55:54', NULL, NULL),
(18, '0801656532322', 'Wilfredo Nolasco', 1, 1, 1, 1, 'Selfie', '2025-03-02 19:05:57', NULL, NULL),
(19, '0801-1998-00000', 'Reynaldo Rafael Vasquez', 1, 1, 1, 1, 'Selfie', '2025-03-12 01:21:19', NULL, NULL),
(20, '0000-0000-0000', 'Magda Eleonara Nuñez', 2, 1, 1, 1, 'Selfie', '2025-03-12 01:50:28', NULL, NULL),
(21, '0000-0000-0000', 'Maira Griselda nuñez', 2, 1, 1, 1, 'Selfie', '2025-03-12 02:12:24', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_precios`
--

CREATE TABLE `tbl_precios` (
  `COD_PRECIO` bigint(20) NOT NULL,
  `FK_COD_PAIS` bigint(20) NOT NULL,
  `PRECIO` decimal(10,2) NOT NULL,
  `USR_CREO` varchar(50) NOT NULL,
  `FEC_CREACION` datetime NOT NULL DEFAULT current_timestamp(),
  `USR_MODIFICO` varchar(50) DEFAULT NULL,
  `FEC_MODIFICO` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tbl_precios`
--

INSERT INTO `tbl_precios` (`COD_PRECIO`, `FK_COD_PAIS`, `PRECIO`, `USR_CREO`, `FEC_CREACION`, `USR_MODIFICO`, `FEC_MODIFICO`) VALUES
(1, 1, 200.00, 'Selfie', '2025-01-08 05:15:54', 'Joseft', '2025-03-06 23:52:31'),
(2, 1, 2.00, 'Selfie', '2025-01-21 04:40:22', NULL, NULL),
(3, 3, 3.50, 'Selfie', '2025-02-26 03:08:41', NULL, NULL),
(4, 1, 180.00, 'Selfie', '2025-02-26 03:09:40', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_telefonos`
--

CREATE TABLE `tbl_telefonos` (
  `COD_TELEFONO` bigint(20) NOT NULL,
  `FK_COD_PERSONA` bigint(20) NOT NULL,
  `TELEFONO` varchar(15) NOT NULL,
  `USR_CREO` varchar(50) NOT NULL,
  `FEC_CREACION` datetime NOT NULL DEFAULT current_timestamp(),
  `USR_MODIFICO` varchar(50) DEFAULT NULL,
  `FEC_MODIFICO` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tbl_telefonos`
--

INSERT INTO `tbl_telefonos` (`COD_TELEFONO`, `FK_COD_PERSONA`, `TELEFONO`, `USR_CREO`, `FEC_CREACION`, `USR_MODIFICO`, `FEC_MODIFICO`) VALUES
(1, 1, '96247772', 'admin', '2025-01-08 05:08:01', NULL, NULL),
(2, 2, '98789878', 'Selfie', '2025-01-08 05:25:12', NULL, NULL),
(3, 3, '3232-3232', 'Selfie', '2025-01-21 04:36:13', NULL, NULL),
(6, 6, '98787777', 'Selfie', '2025-01-31 00:09:44', NULL, NULL),
(7, 7, '96247770', 'Selfie', '2025-01-31 00:12:26', NULL, NULL),
(8, 8, '9625-2525', 'System', '2025-02-10 03:05:48', NULL, NULL),
(11, 11, '9625-2535', 'System', '2025-02-11 04:12:49', NULL, NULL),
(12, 12, '9625-2555', 'System', '2025-02-11 04:24:21', NULL, NULL),
(13, 13, '6565-3232', 'Selfie', '2025-02-12 00:50:25', NULL, NULL),
(14, 14, '3232-6565', 'Selfie', '2025-02-12 02:28:52', NULL, NULL),
(15, 15, '6565-8598', 'Selfie', '2025-02-26 02:52:41', 'Joseft', '2025-03-04 04:06:18'),
(17, 17, '0000-6666', 'Selfie', '2025-02-26 02:55:54', NULL, NULL),
(18, 2, '6825833140', 'Selfie', '2025-03-02 19:05:57', NULL, NULL),
(19, 19, '78787878', 'Selfie', '2025-03-12 01:21:19', NULL, NULL),
(20, 20, '77887788', 'Selfie', '2025-03-12 01:50:28', NULL, NULL),
(21, 20, '88778877', 'Selfie', '2025-03-12 01:50:28', NULL, NULL),
(22, 21, '11223344', 'Selfie', '2025-03-12 02:12:24', NULL, NULL),
(23, 21, '44332211', 'Selfie', '2025-03-12 02:12:24', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_tipo_descuentos`
--

CREATE TABLE `tbl_tipo_descuentos` (
  `COD_TIPO_DESCUENTO` bigint(20) NOT NULL,
  `DETALLE` varchar(50) NOT NULL,
  `ES_PORCENTAJE` tinyint(1) NOT NULL,
  `USR_CREO` varchar(50) NOT NULL,
  `FEC_CREACION` datetime DEFAULT current_timestamp(),
  `USR_MODIFICO` varchar(50) DEFAULT NULL,
  `FEC_MODIFICO` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tbl_tipo_descuentos`
--

INSERT INTO `tbl_tipo_descuentos` (`COD_TIPO_DESCUENTO`, `DETALLE`, `ES_PORCENTAJE`, `USR_CREO`, `FEC_CREACION`, `USR_MODIFICO`, `FEC_MODIFICO`) VALUES
(1, 'Descuento tercera edad', 1, 'Selfie', '2025-01-08 05:16:30', 'Joseft', '2025-03-06 23:54:19'),
(2, 'personal', 0, 'Joseft', '2025-03-06 23:54:07', 'Joseft', '2025-03-06 23:54:46');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `tbl_cajas`
--
ALTER TABLE `tbl_cajas`
  ADD PRIMARY KEY (`COD_CAJA`),
  ADD KEY `FK_COD_PRECIO` (`FK_COD_PRECIO`);

--
-- Indices de la tabla `tbl_correos`
--
ALTER TABLE `tbl_correos`
  ADD PRIMARY KEY (`COD_CORREO`),
  ADD UNIQUE KEY `CORREO` (`CORREO`),
  ADD KEY `FK_COD_PERSONA` (`FK_COD_PERSONA`);

--
-- Indices de la tabla `tbl_datos_envio`
--
ALTER TABLE `tbl_datos_envio`
  ADD PRIMARY KEY (`COD_ENVIO`),
  ADD KEY `FK_COD_CLIENTE` (`FK_COD_CLIENTE`),
  ADD KEY `FK_COD_PAIS_ORIGEN` (`FK_COD_PAIS_ORIGEN`),
  ADD KEY `FK_COD_PAIS_DESTINO` (`FK_COD_PAIS_DESTINO`),
  ADD KEY `FK_COD_DEPARTAMENTO` (`FK_COD_DEPARTAMENTO`),
  ADD KEY `FK_COD_MUNICIPIO` (`FK_COD_MUNICIPIO`),
  ADD KEY `FK_COD_DIRECCION` (`FK_COD_DIRECCION`),
  ADD KEY `FK_COD_PERSONA` (`FK_COD_PERSONA`),
  ADD KEY `FK_TBL_DATOS_ENVIO_DESTINATARIO` (`FK_COD_DESTINATARIO`);

--
-- Indices de la tabla `tbl_departamentos`
--
ALTER TABLE `tbl_departamentos`
  ADD PRIMARY KEY (`COD_DEPARTAMENTO`),
  ADD UNIQUE KEY `NOM_DEPARTAMENTO` (`NOM_DEPARTAMENTO`),
  ADD KEY `FK_COD_PAIS` (`FK_COD_PAIS`);

--
-- Indices de la tabla `tbl_descuentos`
--
ALTER TABLE `tbl_descuentos`
  ADD PRIMARY KEY (`COD_DESCUENTO`);

--
-- Indices de la tabla `tbl_destinatarios`
--
ALTER TABLE `tbl_destinatarios`
  ADD PRIMARY KEY (`COD_DESTINATARIO`),
  ADD KEY `FK_COD_CLIENTE` (`FK_COD_CLIENTE`),
  ADD KEY `FK_COD_PERSONA` (`FK_COD_PERSONA`);

--
-- Indices de la tabla `tbl_direcciones`
--
ALTER TABLE `tbl_direcciones`
  ADD PRIMARY KEY (`COD_DIRECCION`),
  ADD KEY `FK_COD_MUNICIPIO` (`FK_COD_MUNICIPIO`),
  ADD KEY `FK_COD_PERSONA` (`FK_COD_PERSONA`);

--
-- Indices de la tabla `tbl_estados`
--
ALTER TABLE `tbl_estados`
  ADD PRIMARY KEY (`COD_ESTADO`),
  ADD UNIQUE KEY `TIP_ESTADO` (`TIP_ESTADO`);

--
-- Indices de la tabla `tbl_generos`
--
ALTER TABLE `tbl_generos`
  ADD PRIMARY KEY (`COD_GENERO`),
  ADD UNIQUE KEY `GENERO` (`GENERO`);

--
-- Indices de la tabla `tbl_ms_bitacora`
--
ALTER TABLE `tbl_ms_bitacora`
  ADD PRIMARY KEY (`COD_BITACORA`);

--
-- Indices de la tabla `tbl_ms_objetos`
--
ALTER TABLE `tbl_ms_objetos`
  ADD PRIMARY KEY (`COD_OBJETO`);

--
-- Indices de la tabla `tbl_ms_parametros`
--
ALTER TABLE `tbl_ms_parametros`
  ADD PRIMARY KEY (`COD_PARAMETRO`);

--
-- Indices de la tabla `tbl_ms_permisos`
--
ALTER TABLE `tbl_ms_permisos`
  ADD PRIMARY KEY (`COD_PERMISO`),
  ADD KEY `FK_COD_ROL` (`FK_COD_ROL`),
  ADD KEY `FK_COD_OBJETO` (`FK_COD_OBJETO`);

--
-- Indices de la tabla `tbl_ms_roles`
--
ALTER TABLE `tbl_ms_roles`
  ADD PRIMARY KEY (`COD_ROL`),
  ADD UNIQUE KEY `NOM_ROL` (`NOM_ROL`);

--
-- Indices de la tabla `tbl_ms_usuarios`
--
ALTER TABLE `tbl_ms_usuarios`
  ADD PRIMARY KEY (`COD_USUARIO`),
  ADD KEY `FK_COD_ROL` (`FK_COD_ROL`),
  ADD KEY `FK_COD_PERSONA` (`FK_COD_PERSONA`);

--
-- Indices de la tabla `tbl_municipios`
--
ALTER TABLE `tbl_municipios`
  ADD PRIMARY KEY (`COD_MUNICIPIO`),
  ADD UNIQUE KEY `NOM_MUNICIPIO` (`NOM_MUNICIPIO`),
  ADD KEY `FK_COD_DEPARTAMENTO` (`FK_COD_DEPARTAMENTO`);

--
-- Indices de la tabla `tbl_op_clientes`
--
ALTER TABLE `tbl_op_clientes`
  ADD PRIMARY KEY (`COD_CLIENTE`),
  ADD KEY `FK_COD_PERSONA` (`FK_COD_PERSONA`);

--
-- Indices de la tabla `tbl_paises`
--
ALTER TABLE `tbl_paises`
  ADD PRIMARY KEY (`COD_PAIS`),
  ADD UNIQUE KEY `NOM_PAIS` (`NOM_PAIS`);

--
-- Indices de la tabla `tbl_paquete`
--
ALTER TABLE `tbl_paquete`
  ADD PRIMARY KEY (`COD_PAQUETE`),
  ADD KEY `FK_COD_CAJA` (`FK_COD_CAJA`),
  ADD KEY `FK_COD_CLIENTE` (`FK_COD_CLIENTE`),
  ADD KEY `FK_COD_ENVIO` (`FK_COD_ENVIO`),
  ADD KEY `FK_PAQUETE_DESCUENTO` (`FK_COD_DESCUENTO`);

--
-- Indices de la tabla `tbl_personas`
--
ALTER TABLE `tbl_personas`
  ADD PRIMARY KEY (`COD_PERSONA`),
  ADD KEY `FK_COD_GENERO` (`FK_COD_GENERO`),
  ADD KEY `FK_COD_PAIS` (`FK_COD_PAIS`),
  ADD KEY `FK_COD_DEPARTAMENTO` (`FK_COD_DEPARTAMENTO`),
  ADD KEY `FK_COD_MUNICIPIO` (`FK_COD_MUNICIPIO`);

--
-- Indices de la tabla `tbl_precios`
--
ALTER TABLE `tbl_precios`
  ADD PRIMARY KEY (`COD_PRECIO`),
  ADD KEY `FK_COD_PAIS` (`FK_COD_PAIS`);

--
-- Indices de la tabla `tbl_telefonos`
--
ALTER TABLE `tbl_telefonos`
  ADD PRIMARY KEY (`COD_TELEFONO`),
  ADD UNIQUE KEY `TELEFONO` (`TELEFONO`),
  ADD KEY `FK_COD_PERSONA` (`FK_COD_PERSONA`);

--
-- Indices de la tabla `tbl_tipo_descuentos`
--
ALTER TABLE `tbl_tipo_descuentos`
  ADD PRIMARY KEY (`COD_TIPO_DESCUENTO`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `tbl_cajas`
--
ALTER TABLE `tbl_cajas`
  MODIFY `COD_CAJA` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `tbl_correos`
--
ALTER TABLE `tbl_correos`
  MODIFY `COD_CORREO` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `tbl_datos_envio`
--
ALTER TABLE `tbl_datos_envio`
  MODIFY `COD_ENVIO` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `tbl_departamentos`
--
ALTER TABLE `tbl_departamentos`
  MODIFY `COD_DEPARTAMENTO` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `tbl_descuentos`
--
ALTER TABLE `tbl_descuentos`
  MODIFY `COD_DESCUENTO` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `tbl_destinatarios`
--
ALTER TABLE `tbl_destinatarios`
  MODIFY `COD_DESTINATARIO` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `tbl_direcciones`
--
ALTER TABLE `tbl_direcciones`
  MODIFY `COD_DIRECCION` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `tbl_estados`
--
ALTER TABLE `tbl_estados`
  MODIFY `COD_ESTADO` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tbl_generos`
--
ALTER TABLE `tbl_generos`
  MODIFY `COD_GENERO` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `tbl_ms_bitacora`
--
ALTER TABLE `tbl_ms_bitacora`
  MODIFY `COD_BITACORA` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tbl_ms_objetos`
--
ALTER TABLE `tbl_ms_objetos`
  MODIFY `COD_OBJETO` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `tbl_ms_parametros`
--
ALTER TABLE `tbl_ms_parametros`
  MODIFY `COD_PARAMETRO` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tbl_ms_permisos`
--
ALTER TABLE `tbl_ms_permisos`
  MODIFY `COD_PERMISO` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT de la tabla `tbl_ms_roles`
--
ALTER TABLE `tbl_ms_roles`
  MODIFY `COD_ROL` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `tbl_ms_usuarios`
--
ALTER TABLE `tbl_ms_usuarios`
  MODIFY `COD_USUARIO` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `tbl_municipios`
--
ALTER TABLE `tbl_municipios`
  MODIFY `COD_MUNICIPIO` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `tbl_op_clientes`
--
ALTER TABLE `tbl_op_clientes`
  MODIFY `COD_CLIENTE` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `tbl_paises`
--
ALTER TABLE `tbl_paises`
  MODIFY `COD_PAIS` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `tbl_paquete`
--
ALTER TABLE `tbl_paquete`
  MODIFY `COD_PAQUETE` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT de la tabla `tbl_personas`
--
ALTER TABLE `tbl_personas`
  MODIFY `COD_PERSONA` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `tbl_precios`
--
ALTER TABLE `tbl_precios`
  MODIFY `COD_PRECIO` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `tbl_telefonos`
--
ALTER TABLE `tbl_telefonos`
  MODIFY `COD_TELEFONO` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `tbl_tipo_descuentos`
--
ALTER TABLE `tbl_tipo_descuentos`
  MODIFY `COD_TIPO_DESCUENTO` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `tbl_cajas`
--
ALTER TABLE `tbl_cajas`
  ADD CONSTRAINT `TBL_CAJAS_ibfk_1` FOREIGN KEY (`FK_COD_PRECIO`) REFERENCES `tbl_precios` (`COD_PRECIO`);

--
-- Filtros para la tabla `tbl_correos`
--
ALTER TABLE `tbl_correos`
  ADD CONSTRAINT `TBL_CORREOS_ibfk_1` FOREIGN KEY (`FK_COD_PERSONA`) REFERENCES `tbl_personas` (`COD_PERSONA`);

--
-- Filtros para la tabla `tbl_datos_envio`
--
ALTER TABLE `tbl_datos_envio`
  ADD CONSTRAINT `FK_TBL_DATOS_ENVIO_DESTINATARIO` FOREIGN KEY (`FK_COD_DESTINATARIO`) REFERENCES `tbl_destinatarios` (`COD_DESTINATARIO`),
  ADD CONSTRAINT `TBL_DATOS_ENVIO_ibfk_1` FOREIGN KEY (`FK_COD_CLIENTE`) REFERENCES `tbl_op_clientes` (`COD_CLIENTE`),
  ADD CONSTRAINT `TBL_DATOS_ENVIO_ibfk_2` FOREIGN KEY (`FK_COD_PAIS_ORIGEN`) REFERENCES `tbl_paises` (`COD_PAIS`),
  ADD CONSTRAINT `TBL_DATOS_ENVIO_ibfk_3` FOREIGN KEY (`FK_COD_PAIS_DESTINO`) REFERENCES `tbl_paises` (`COD_PAIS`),
  ADD CONSTRAINT `TBL_DATOS_ENVIO_ibfk_4` FOREIGN KEY (`FK_COD_DEPARTAMENTO`) REFERENCES `tbl_departamentos` (`COD_DEPARTAMENTO`),
  ADD CONSTRAINT `TBL_DATOS_ENVIO_ibfk_5` FOREIGN KEY (`FK_COD_MUNICIPIO`) REFERENCES `tbl_municipios` (`COD_MUNICIPIO`),
  ADD CONSTRAINT `TBL_DATOS_ENVIO_ibfk_6` FOREIGN KEY (`FK_COD_DIRECCION`) REFERENCES `tbl_direcciones` (`COD_DIRECCION`),
  ADD CONSTRAINT `TBL_DATOS_ENVIO_ibfk_7` FOREIGN KEY (`FK_COD_PERSONA`) REFERENCES `tbl_personas` (`COD_PERSONA`);

--
-- Filtros para la tabla `tbl_departamentos`
--
ALTER TABLE `tbl_departamentos`
  ADD CONSTRAINT `TBL_DEPARTAMENTOS_ibfk_1` FOREIGN KEY (`FK_COD_PAIS`) REFERENCES `tbl_paises` (`COD_PAIS`);

--
-- Filtros para la tabla `tbl_destinatarios`
--
ALTER TABLE `tbl_destinatarios`
  ADD CONSTRAINT `TBL_DESTINATARIOS_ibfk_1` FOREIGN KEY (`FK_COD_CLIENTE`) REFERENCES `tbl_op_clientes` (`COD_CLIENTE`),
  ADD CONSTRAINT `TBL_DESTINATARIOS_ibfk_2` FOREIGN KEY (`FK_COD_PERSONA`) REFERENCES `tbl_personas` (`COD_PERSONA`);

--
-- Filtros para la tabla `tbl_direcciones`
--
ALTER TABLE `tbl_direcciones`
  ADD CONSTRAINT `TBL_DIRECCIONES_ibfk_1` FOREIGN KEY (`FK_COD_MUNICIPIO`) REFERENCES `tbl_municipios` (`COD_MUNICIPIO`),
  ADD CONSTRAINT `TBL_DIRECCIONES_ibfk_2` FOREIGN KEY (`FK_COD_PERSONA`) REFERENCES `tbl_personas` (`COD_PERSONA`);

--
-- Filtros para la tabla `tbl_ms_permisos`
--
ALTER TABLE `tbl_ms_permisos`
  ADD CONSTRAINT `TBL_MS_PERMISOS_ibfk_1` FOREIGN KEY (`FK_COD_ROL`) REFERENCES `tbl_ms_roles` (`COD_ROL`),
  ADD CONSTRAINT `TBL_MS_PERMISOS_ibfk_2` FOREIGN KEY (`FK_COD_OBJETO`) REFERENCES `tbl_ms_objetos` (`COD_OBJETO`);

--
-- Filtros para la tabla `tbl_ms_usuarios`
--
ALTER TABLE `tbl_ms_usuarios`
  ADD CONSTRAINT `TBL_MS_USUARIOS_ibfk_1` FOREIGN KEY (`FK_COD_ROL`) REFERENCES `tbl_ms_roles` (`COD_ROL`),
  ADD CONSTRAINT `TBL_MS_USUARIOS_ibfk_2` FOREIGN KEY (`FK_COD_PERSONA`) REFERENCES `tbl_personas` (`COD_PERSONA`);

--
-- Filtros para la tabla `tbl_municipios`
--
ALTER TABLE `tbl_municipios`
  ADD CONSTRAINT `TBL_MUNICIPIOS_ibfk_1` FOREIGN KEY (`FK_COD_DEPARTAMENTO`) REFERENCES `tbl_departamentos` (`COD_DEPARTAMENTO`);

--
-- Filtros para la tabla `tbl_op_clientes`
--
ALTER TABLE `tbl_op_clientes`
  ADD CONSTRAINT `TBL_OP_CLIENTES_ibfk_1` FOREIGN KEY (`FK_COD_PERSONA`) REFERENCES `tbl_personas` (`COD_PERSONA`);

--
-- Filtros para la tabla `tbl_paquete`
--
ALTER TABLE `tbl_paquete`
  ADD CONSTRAINT `FK_PAQUETE_DESCUENTO` FOREIGN KEY (`FK_COD_DESCUENTO`) REFERENCES `tbl_descuentos` (`COD_DESCUENTO`),
  ADD CONSTRAINT `TBL_PAQUETE_ibfk_1` FOREIGN KEY (`FK_COD_CAJA`) REFERENCES `tbl_cajas` (`COD_CAJA`),
  ADD CONSTRAINT `TBL_PAQUETE_ibfk_2` FOREIGN KEY (`FK_COD_CLIENTE`) REFERENCES `tbl_op_clientes` (`COD_CLIENTE`),
  ADD CONSTRAINT `TBL_PAQUETE_ibfk_3` FOREIGN KEY (`FK_COD_ENVIO`) REFERENCES `tbl_datos_envio` (`COD_ENVIO`);

--
-- Filtros para la tabla `tbl_personas`
--
ALTER TABLE `tbl_personas`
  ADD CONSTRAINT `TBL_PERSONAS_ibfk_1` FOREIGN KEY (`FK_COD_GENERO`) REFERENCES `tbl_generos` (`COD_GENERO`),
  ADD CONSTRAINT `TBL_PERSONAS_ibfk_2` FOREIGN KEY (`FK_COD_PAIS`) REFERENCES `tbl_paises` (`COD_PAIS`),
  ADD CONSTRAINT `TBL_PERSONAS_ibfk_3` FOREIGN KEY (`FK_COD_DEPARTAMENTO`) REFERENCES `tbl_departamentos` (`COD_DEPARTAMENTO`),
  ADD CONSTRAINT `TBL_PERSONAS_ibfk_4` FOREIGN KEY (`FK_COD_MUNICIPIO`) REFERENCES `tbl_municipios` (`COD_MUNICIPIO`);

--
-- Filtros para la tabla `tbl_precios`
--
ALTER TABLE `tbl_precios`
  ADD CONSTRAINT `TBL_PRECIOS_ibfk_1` FOREIGN KEY (`FK_COD_PAIS`) REFERENCES `tbl_paises` (`COD_PAIS`);

--
-- Filtros para la tabla `tbl_telefonos`
--
ALTER TABLE `tbl_telefonos`
  ADD CONSTRAINT `TBL_TELEFONOS_ibfk_1` FOREIGN KEY (`FK_COD_PERSONA`) REFERENCES `tbl_personas` (`COD_PERSONA`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
