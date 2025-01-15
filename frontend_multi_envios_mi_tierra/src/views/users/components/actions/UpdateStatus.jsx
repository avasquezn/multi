import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const UpdateUserStatus = ({ open, onClose, onConfirm, userName, isEnable }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ 
                bgcolor: 'background.paper', 
                padding: 4, 
                borderRadius: 1,
                maxWidth: 400,
                margin: 'auto'
            }}>
                <Typography variant="h6" component="h2">
                    Confirmar
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    {isEnable 
                        ? `El usuario "${userName}" se habilitará. ¿Deseas continuar?` 
                        : `El usuario "${userName}" no se eliminará, solo se inhabilitará. ¿Deseas continuar?`}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                    <Button variant="contained" color="primary" onClick={onConfirm}>
                        Aceptar
                    </Button>
                    <Button variant="outlined" onClick={onClose}>
                        Cancelar
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default UpdateUserStatus;
