import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const UpdateGenderStatus = ({ open, onClose, onConfirm, genderName, isEnable, codGenero }) => {
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
                        ? `El género "${genderName}" se habilitará. ¿Deseas continuar?` 
                        : `El género "${genderName}" no se eliminará, solo se inhabilitará. ¿Deseas continuar?`}
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

export default UpdateGenderStatus;
