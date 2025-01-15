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
import { getPaquetes } from '../../../services/PaqueteService'; // Servicio para obtener datos de paquetes
import { useAuth } from '../../../actions/authContext';
import InsertPaquete from './Actions/PaqueteInsert'; // Modal para insertar paquete

const PaquetesTable = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { user } = useAuth();
    const rolPermission = user?.permisos?.find(permiso => permiso.objectName === 'Paquetes');
    const [paquetes, setPaquetes] = useState([]);
    const [filteredPaquetes, setFilteredPaquetes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [insertPaqueteOpen, setInsertPaqueteOpen] = useState(false);

    useEffect(() => {
        fetchPaquetes();
    }, []);

    useEffect(() => {
        filterPaquetes();
    }, [paquetes, searchTerm]);

    const fetchPaquetes = async () => {
        setLoading(true);
        try {
            const data = await getPaquetes(); // Llama al procedimiento almacenado `GET_PAQUETES`
            setPaquetes(data);
            setFilteredPaquetes(data);
        } catch (error) {
            console.error('Error fetching paquetes:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterPaquetes = () => {
        const filtered = paquetes.filter((paquete) =>
            Object.values(paquete).some(
                (val) => typeof val === 'string' && val.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredPaquetes(filtered);
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

    const handleInsertPaquete = () => {
        setInsertPaqueteOpen(true);
    };

    const handleCloseInsertPaquete = () => {
        setInsertPaqueteOpen(false);
    };

    const handlePaqueteInserted = () => {
        fetchPaquetes();
        setSnackbarMessage('Paquete agregado exitosamente.');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
    };

    const renderTable = () => (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow sx={{ borderBottom: '2px solid #666' }}>
                        <TableCell># Paquete</TableCell>
                        <TableCell>Caja</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Nombre Cliente</TableCell>
                        <TableCell># Envío</TableCell>
                        <TableCell>Fecha Entrega</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredPaquetes
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((paquete) => (
                            <TableRow key={paquete.COD_PAQUETE}>
                                <TableCell>{paquete.COD_PAQUETE}</TableCell>
                                <TableCell>{paquete.ID_CAJA}</TableCell>
                                <TableCell>{paquete.ESTADO}</TableCell>
                                <TableCell>{paquete.NOM_PERSONA}</TableCell>
                                <TableCell>{paquete.NUM_ENVIO}</TableCell>
                                <TableCell>{paquete.FEC_ENTREGA}</TableCell>
                            </TableRow>
                        ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            count={filteredPaquetes.length}
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
                    onClick={handleInsertPaquete}
                    sx={{ mb: 2 }}
                    startIcon={<i className="bi bi-plus-circle" />}
                >
                    Agregar nuevo paquete
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

            <InsertPaquete
                show={insertPaqueteOpen}
                handleClose={handleCloseInsertPaquete}
                onPaqueteInserted={handlePaqueteInserted}
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

export default PaquetesTable;
