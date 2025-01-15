import React from 'react';
import { Alert, AlertTitle } from '@mui/material';

const NoPermissionAlert = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Alert 
                severity="warning" 
                icon={<i className="bi bi-shield-exclamation" style={{ fontSize: '2rem', color: '#ff9800' }}></i>} 
                style={{
                    maxWidth: '600px',
                    fontSize: '1.2rem',
                    padding: '20px',
                    backgroundColor: '#fff3e0',
                    border: '1px solid #ff9800',
                    borderRadius: '8px',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                }}
            >
                <AlertTitle style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Acceso Denegado</AlertTitle>
                No tienes permisos para ver esta pantalla. Si crees que esto es un error, contacta al administrador del sistema.
            </Alert>
        </div>
    );
};

export default NoPermissionAlert;
