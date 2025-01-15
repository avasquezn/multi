import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { Check, X } from 'lucide-react';

export const onlyLettersInput = (value) => {
    return value.replace(/[^a-zA-Z]/g, '');
  };

  export const PasswordValidations = ({ password, onValidationChange }) => {
    const validations = [
      {
        id: 'length',
        label: 'Entre 8 y 15 caracteres',
        isValid: () => password.length >= 8 && password.length <= 15,
      },
      {
        id: 'uppercase',
        label: 'Al menos dos mayúsculas',
        isValid: () => (password.match(/[A-Z]/g) || []).length >= 2,
      },
      {
        id: 'lowercase',
        label: 'Al menos una minúscula',
        isValid: () => /[a-z]/.test(password),
      },
      {
        id: 'special',
        label: 'Al menos dos caracteres especiales',
        isValid: () => (password.match(/[!@#$%^&*(),.?":{}|<>]/g) || []).length >= 2,
      },
    ];
  
    const allValid = validations.every((validation) => validation.isValid());
  
    useEffect(() => {
      onValidationChange(allValid);
    }, [allValid, onValidationChange]);
  
    return (
      <Box sx={{ mt: 1 }}>
        {validations.map((validation) => (
          <Box
            key={validation.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 0.5,
            }}
          >
            {validation.isValid() ? (
              <Check size={16} className="text-green-500" />
            ) : (
              <X size={16} className="text-red-500" />
            )}
            <Typography
              variant="caption"
              sx={{
                color: validation.isValid() ? 'success.main' : 'error.main',
              }}
            >
              {validation.label}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };