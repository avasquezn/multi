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
    IconButton,
    Tooltip,
    Snackbar,
    Alert,
    Button,
    useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { getClientes} from '../../../services/ClientesService';
import { useAuth } from '../../../actions/authContext';
import InsertCliente from './actions/InsertCliente';
import UpdateCliente from './actions/UpdateCliente';

const ClientesTable = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { user } = useAuth();
    const rolPermission = user?.permisos?.find(permiso => permiso.objectName === 'Clientes');
    const [clientes, setClientes] = useState([]);
    const [filteredClientes, setFilteredClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [insertClienteOpen, setInsertClienteOpen] = useState(false);
    const [updateClienteOpen, setUpdateClienteOpen] = useState(false);

    const showActionsColumn = rolPermission?.canUpdate === 1;

    useEffect(() => {
        fetchClientes();
    }, []);

    useEffect(() => {
        filterClientes();
    }, [clientes, searchTerm]);

    const fetchClientes = async () => {
        setLoading(true);
        try {
            const response = await getClientes();
            setClientes(response.data);
            setFilteredClientes(response.data);
            console.log('Clientes fetched:', response.data);
        } catch (error) {
            console.error('Error fetching clientes:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterClientes = () => {
        const filtered = clientes.filter((cliente) =>
            Object.values(cliente).some(
                (val) => typeof val === 'string' && val.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredClientes(filtered);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleEdit = (cliente) => {
        setSelectedCliente(cliente);
        setUpdateClienteOpen(true);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleInsertCliente = () => {
        setInsertClienteOpen(true);
    };

    const handleCloseInsertCliente = () => {
        setInsertClienteOpen(false);
    };

    const handleClienteInserted = () => {
        fetchClientes();
        setSnackbarMessage('Cliente agregado correctamente');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
    };

    const handleCloseUpdateCliente = () => {
        setUpdateClienteOpen(false);
        setSelectedCliente(null);
    };

    const handleClienteUpdated = () => {
        fetchClientes();
        setSnackbarMessage('Cliente actualizado correctamente');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
    };

    const renderTable = () => (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow sx={{ borderBottom: '2px solid #666' }}>
                        <TableCell>ID Persona</TableCell>
                        <TableCell>Nombre</TableCell>
                        {!isMobile && (
                            <>
                                <TableCell>Género</TableCell>
                                <TableCell>Teléfono</TableCell>
                                <TableCell>Correo</TableCell>
                                <TableCell>Ubicación</TableCell>
                            </>
                        )}
                        {showActionsColumn && <TableCell>Acciones</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredClientes
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((cliente) => (
                            <TableRow key={cliente.COD_CLIENTE}>
                                <TableCell>{cliente.ID_PERSONA}</TableCell>
                                <TableCell>{cliente.NOM_PERSONA}</TableCell>
                                {!isMobile && (
                                    <>
                                        <TableCell>{cliente.GENERO}</TableCell>
                                        <TableCell>{cliente.TELEFONO}</TableCell>
                                        <TableCell>{cliente.CORREO}</TableCell>
                                        <TableCell>
                                            {`${cliente.NOM_MUNICIPIO}, ${cliente.NOM_DEPARTAMENTO}`}
                                        </TableCell>
                                    </>
                                )}
                                {showActionsColumn && (
                                    <TableCell>
                                        {rolPermission?.canUpdate === 1 && (
                                            <Tooltip title="Editar">
                                                <IconButton 
                                                    color="primary" 
                                                    onClick={() => handleEdit(cliente)}
                                                >
                                                    <i className="bi bi-pencil-square" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            count={filteredClientes.length}
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
                    onClick={handleInsertCliente}
                    sx={{ mb: 2 }}
                    startIcon={<i className="bi bi-plus-circle" />}
                >
                    Agregar nuevo cliente
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

            <InsertCliente
                show={insertClienteOpen}
                handleClose={handleCloseInsertCliente}
                onClienteInserted={handleClienteInserted}
            />

            <UpdateCliente
                show={updateClienteOpen}
                handleClose={handleCloseUpdateCliente}
                onClientUpdated={handleClienteUpdated}
                initialClientData={selectedCliente}
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

export default ClientesTable;