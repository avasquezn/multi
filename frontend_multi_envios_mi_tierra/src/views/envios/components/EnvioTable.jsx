import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    TablePagination,
    TableFooter,
    Snackbar,
    Alert,
    Button,
    useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { getEnvios } from '../../../services/EnviosService'; // Servicio para obtener datos de envíos
import { useAuth } from '../../../actions/authContext';
import InsertEnvio from './Actions/EnvioInsert'; // Modal para insertar envío

const EnviosTable = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { user } = useAuth();
    const rolPermission = user?.permisos?.find(permiso => permiso.objectName === 'Envios');
    const [envios, setEnvios] = useState([]);
    const [filteredEnvios, setFilteredEnvios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [insertEnvioOpen, setInsertEnvioOpen] = useState(false);

    useEffect(() => {
        fetchEnvios();
    }, []);

    useEffect(() => {
        filterEnvios();
    }, [envios, searchTerm]);

    const fetchEnvios = async () => {
        setLoading(true);
        try {
            const data = await getEnvios(); // Llama al procedimiento almacenado `GET_DATOS_ENVIO`
            setEnvios(data);
            setFilteredEnvios(data);
        } catch (error) {
            console.error('Error fetching envíos:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterEnvios = () => {
        const filtered = envios.filter((envio) =>
            Object.values(envio).some(
                (val) => typeof val === 'string' && val.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredEnvios(filtered);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleInsertEnvio = () => {
        setInsertEnvioOpen(true);
    };

    const handleCloseInsertEnvio = () => {
        setInsertEnvioOpen(false);
    };

    const handleEnvioInserted = () => {
        fetchEnvios();
        setSnackbarMessage('Envío agregado exitosamente.');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
    };

    const renderTable = () => (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow sx={{ borderBottom: '2px solid #666' }}>
                        <TableCell># Envío</TableCell>
                        <TableCell>Cliente</TableCell>
                        <TableCell>Persona</TableCell>
                        <TableCell>País Origen</TableCell>
                        <TableCell>País Destino</TableCell>
                        <TableCell>Dirección</TableCell>
                        <TableCell>Cantidad Cajas</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredEnvios
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((envio) => (
                            <TableRow key={envio.COD_ENVIO}>
                                <TableCell>{envio.NUM_ENVIO}</TableCell>
                                <TableCell>{envio.COD_CLIENTE}</TableCell>
                                <TableCell>{envio.NOM_PERSONA}</TableCell>
                                <TableCell>{envio.PAIS_ORIGEN}</TableCell>
                                <TableCell>{envio.PAIS_DESTINO}</TableCell>
                                <TableCell>{envio.DIRECCION}</TableCell>
                                <TableCell>{envio.CANTIDAD_CAJAS}</TableCell>
                            </TableRow>
                        ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            count={filteredEnvios.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            labelRowsPerPage="Filas por página"
                            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );

    return (
        <Paper sx={{ p: 2 }}>
            {rolPermission?.canInsert === 1 && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleInsertEnvio}
                    sx={{ mb: 2 }}
                    startIcon={<i className="bi bi-plus-circle" />}
                >
                    Agregar nuevo envío
                </Button>
            )}
            <TextField
                label="Buscar"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {loading ? <div>Cargando...</div> : renderTable()}

            <InsertEnvio
                show={insertEnvioOpen}
                handleClose={handleCloseInsertEnvio}
                onEnvioInserted={handleEnvioInserted}
            />

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default EnviosTable;
