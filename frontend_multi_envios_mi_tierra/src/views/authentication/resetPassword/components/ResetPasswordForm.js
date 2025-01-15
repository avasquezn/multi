import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Snackbar,
  Alert
} from '@mui/material';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import { PasswordValidations } from '../../../../validations/Validations';

export const ResetPasswordForm = ({
  formState,
  handleSubmit,
  handlePasswordChange
}) => {
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handlePasswordValidationChange = (isValid) => {
    setIsPasswordValid(isValid);
  };

  const isFormValid = isPasswordValid && formState.newPassword === formState.confirmPassword;

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (isFormValid) {
      handleSubmit(event);
    } else {
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Paper elevation={0} sx={{ p: 4, width: '100%' }}>
      <form onSubmit={handleFormSubmit}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Restablecer contraseña
        </Typography>

        <Box mb={3}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="newPassword"
            mb={1}
          >
            Nueva contraseña
          </Typography>
          <CustomTextField
            id="newPassword"
            type="password"
            variant="outlined"
            fullWidth
            value={formState.newPassword}
            onChange={handlePasswordChange('newPassword')}
            disabled={formState.loading || !formState.tokenValidated}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
          />
          {isPasswordFocused && (
            <PasswordValidations
              password={formState.newPassword}
              onValidationChange={handlePasswordValidationChange}
            />
          )}
        </Box>

        <Box mb={3}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="confirmPassword"
            mb={1}
          >
            Confirmar contraseña
          </Typography>
          <CustomTextField
            id="confirmPassword"
            type="password"
            variant="outlined"
            fullWidth
            value={formState.confirmPassword}
            onChange={handlePasswordChange('confirmPassword')}
            disabled={formState.loading || !formState.tokenValidated}
          />
        </Box>

        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          type="submit"
          disabled={formState.loading || !formState.tokenValidated}
        >
          {formState.loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Actualizar contraseña'
          )}
        </Button>
      </form>

      {/* Snackbar para mostrar mensaje de advertencia */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="warning" sx={{ width: '100%' }}>
          Cumple los requisitos mencionados en la nueva contraseña
        </Alert>
      </Snackbar>
    </Paper>
  );
};
