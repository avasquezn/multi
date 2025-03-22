import React, { useState } from 'react';
import { Grid, Box, Button } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import { useAuth } from '../../actions/authContext';
import InsertCliente from 'src/views/clientes/components/Actions/InsertCliente';
import EnvioInsert from 'src/views/envios/components/Actions/EnvioInsert';
import PaqueteInsert from 'src/views/paquetes/components/Actions/PaqueteInsert';

// Componentes para los reportes
import SalesOverview from './components/SalesOverview';
import YearlyBreakup from './components/YearlyBreakup';
import RecentTransactions from './components/RecentTransactions';
import ProductPerformance from './components/ProductPerformance';
import MonthlyEarnings from './components/MonthlyEarnings';
import Depositos from './components/Depositos';

const Dashboard = () => {
  const [showInsertClienteModal, setShowInsertClienteModal] = useState(false);
  const [showInsertEnvioModal, setShowInsertEnvioModal] = useState(false);
  const [showInsertPaqueteModal, setShowInsertPaqueteModal] = useState(false);
  const { user } = useAuth();
  
  // Permisos para acciones específicas
  const clientesPermission = user?.permisos?.find(permiso => permiso.objectName === 'Clientes');
  const enviosPermission = user?.permisos?.find(permiso => permiso.objectName === 'Envios');
  const paquetesPermission = user?.permisos?.find(permiso => permiso.objectName === 'Paquetes');

  // Permiso para ver los reportes del Dashboard (puedes ajustar el objectName según convenga)
  const dashboardPermission = user?.permisos?.find(permiso => permiso.objectName === 'Flujo de efectivo');

  const handleCloseClienteModal = () => setShowInsertClienteModal(false);
  const handleCloseEnvioModal = () => setShowInsertEnvioModal(false);
  const handleClosePaqueteModal = () => setShowInsertPaqueteModal(false);

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        {/* Sección de Botones */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, px: 2, flexWrap: 'wrap' }}>
          {clientesPermission?.canInsert === 1 && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowInsertClienteModal(true)}
              startIcon={<i className="bi bi-plus-circle" />}
            >
              Agregar cliente
            </Button>
          )}

          {enviosPermission?.canInsert === 1 && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowInsertEnvioModal(true)}
              startIcon={<i className="bi bi-plus-circle" />}
            >
              Nuevo envío
            </Button>
          )}

          {paquetesPermission?.canInsert === 1 && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowInsertPaqueteModal(true)}
              startIcon={<i className="bi bi-plus-circle" />}
            >
              Nuevo paquete
            </Button>
          )}
        </Box>

        {/* Contenido del Dashboard */}
        <Grid container spacing={3}>
          {dashboardPermission?.canView !== 0 && (
            <>
              <Grid item xs={12} lg={8}>
                <SalesOverview />
              </Grid>
              <Grid item xs={12} lg={4}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <YearlyBreakup />
                  </Grid>
                  <Grid item xs={12}>
                    <MonthlyEarnings />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Depositos />
              </Grid>
            </>
          )}
          <Grid item xs={12} lg={4}>
            <RecentTransactions />
          </Grid>
          <Grid item xs={12} lg={8}>
            <ProductPerformance />
          </Grid>
        </Grid>

        {/* Modales */}
        <InsertCliente 
          show={showInsertClienteModal} 
          handleClose={handleCloseClienteModal}
          onClienteInserted={handleCloseClienteModal}
        />

        <EnvioInsert 
          show={showInsertEnvioModal}
          handleClose={handleCloseEnvioModal}
          onEnvioInserted={handleCloseEnvioModal}
        />

        <PaqueteInsert 
          show={showInsertPaqueteModal}
          handleClose={handleClosePaqueteModal}
          onPaqueteInserted={handleClosePaqueteModal}
        />
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
