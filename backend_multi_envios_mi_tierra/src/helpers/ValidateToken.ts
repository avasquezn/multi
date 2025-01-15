import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface TokenRequest extends Request {
    body: {
        token: string;
    }
}

interface JwtPayload {
    cod_usuario: string;
    nom_usuario: string,
    iat: number;
    exp: number;
}

interface ValidationError extends Error {
    code?: string;
}

export const validateResetToken = async (req: TokenRequest, res: Response): Promise<void> => {
    const { token } = req.body;
    
    if (!token) {
        res.status(400).json({ 
            valid: false,
            message: 'Token no proporcionado' 
        });
        return;
    }
    
    try {
        // Verify JWT_SECRET is set
        const jwtSecret = process.env.JWTSECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET no configurado');
        }

        // Verify the token with explicit typing
        const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
        
        // Validate required fields
        if (!decoded.cod_usuario) {
            throw new Error('Token malformado: falta cod_usuario');
        }

        // Check token expiration explicitly
        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < now) {
            throw new jwt.TokenExpiredError('Token expirado', new Date(decoded.exp * 1000));
        }

        // All validations passed
        res.status(200).json({ 
            valid: true,
            cod_usuario: decoded.cod_usuario, 
            nom_usuario: decoded.nom_usuario
        });
        
    } catch (error) {
        const err = error as ValidationError;
        
        // Handle specific JWT errors
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(400).json({ 
                valid: false,
                message: 'Token de reseteo no válido',
                details: err.message 
            });
            return;
        }
        
        if (error instanceof jwt.TokenExpiredError) {
            res.status(400).json({ 
                valid: false,
                message: 'El token ha expirado',
                expiredAt: error.expiredAt 
            });
            return;
        }
        
        if (error instanceof jwt.NotBeforeError) {
            res.status(400).json({ 
                valid: false,
                message: 'El token aún no es válido',
                date: error.date 
            });
            return;
        }

        // Log unexpected errors for debugging
        console.error('Error inesperado al validar el token:', err);
        
        // Generic error response
        res.status(500).json({ 
            valid: false,
            message: 'Error al validar el token',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};