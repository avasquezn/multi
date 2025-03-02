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
    useMediaQuery,
    Box,
    Typography,
    Collapse
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { getClientes } from '../../../services/ClientesService';
import { getDestinatariosPorCliente } from '../../../services/DestinatariosService';
import { useAuth } from '../../../actions/authContext';
import InsertCliente from './Actions/InsertCliente';
import UpdateCliente from './Actions/UpdateCliente';
import InsertDestinatario from './Actions/insertDestinatario';

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
    const [expandedRow, setExpandedRow] = useState(null);
    const [destinatarios, setDestinatarios] = useState({});
    const [loadingDestinatarios, setLoadingDestinatarios] = useState(false);
    const [insertDestinatarioOpen, setInsertDestinatarioOpen] = useState(false);

    const showActionsColumn = rolPermission?.canUpdate === 1 || rolPermission?.canInsert === 1;

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
        } catch (error) {
            console.error('Error fetching clientes:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDestinatarios = async (codCliente) => {
        setLoadingDestinatarios(true);
        try {
            const response = await getDestinatariosPorCliente(codCliente);
            setDestinatarios(prev => ({
                ...prev,
                [codCliente]: response.data
            }));
        } catch (error) {
            console.error('Error fetching destinatarios:', error);
        } finally {
            setLoadingDestinatarios(false);
        }
    };

    const handleExpand = async (codCliente) => {
        if (expandedRow === codCliente) {
            setExpandedRow(null);
        } else {
            setExpandedRow(codCliente);
            if (!destinatarios[codCliente]) {
                await fetchDestinatarios(codCliente);
            }
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

    const handleAddDestinatario = (cliente) => {
        setSelectedCliente(cliente);
        setInsertDestinatarioOpen(true);
    };

    const renderTableRows = () => {
        return filteredClientes
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((cliente) => (
                <React.Fragment key={cliente.COD_CLIENTE}>
                    <TableRow>
                        <TableCell>
                            <IconButton
                                size="small"
                                onClick={() => handleExpand(cliente.COD_CLIENTE)}
                                disabled={loadingDestinatarios}
                            >
                                <i 
                                    className={`bi bi-chevron-${expandedRow === cliente.COD_CLIENTE ? 'down' : 'right'}`}
                                    style={{ 
                                        transition: 'transform 0.2s',
                                        color: theme.palette.primary.main 
                                    }}
                                />
                            </IconButton>
                            {cliente.ID_PERSONA}
                        </TableCell>
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
                                        <IconButton color="primary" onClick={() => handleEdit(cliente)}>
                                            <i className="bi bi-pencil-square" />
                                        </IconButton>
                                    </Tooltip>
                                )}
                                {rolPermission?.canInsert === 1 && (
                                    <Tooltip title="Agregar destinatario">
                                        <IconButton color="secondary" onClick={() => handleAddDestinatario(cliente)}>
                                            <i className="bi bi-person-plus-fill" />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </TableCell>
                        )}
                    </TableRow>
                    
                    <TableRow>
                        <TableCell 
                            style={{ padding: 0 }} 
                            colSpan={
                                (isMobile ? 2 : 6) + (showActionsColumn ? 1 : 0)
                            }
                        >
                            <Collapse 
                                in={expandedRow === cliente.COD_CLIENTE} 
                                timeout="auto" 
                                unmountOnExit
                            >
                                <Box sx={{ 
                                    margin: 1,
                                    backgroundColor: theme.palette.background.default,
                                    borderRadius: 2,
                                    p: 2
                                }}>
                                    <Typography variant="subtitle1" gutterBottom>
                                        Destinatarios asociados
                                    </Typography>
                                    {loadingDestinatarios ? (
                                        <Typography variant="body2">
                                            Cargando destinatarios...
                                        </Typography>
                                    ) : (
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Nombre</TableCell>
                                                    <TableCell>Teléfono</TableCell>
                                                    <TableCell>Dirección</TableCell>
                                                    {!isMobile && <TableCell>Municipio</TableCell>}
                                                    {!isMobile && <TableCell>Correo</TableCell>}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {destinatarios[cliente.COD_CLIENTE]?.map((destinatario) => (
                                                    <TableRow key={destinatario.COD_DESTINATARIO}>
                                                        <TableCell>{destinatario.NOM_PERSONA}</TableCell>
                                                        <TableCell>{destinatario.TELEFONO}</TableCell>
                                                        <TableCell>
                                                            {`${destinatario.DIRECCION || 'N/A'}`}
                                                        </TableCell>
                                                        {!isMobile && (
                                                            <TableCell>
                                                                {destinatario.NOM_MUNICIPIO}
                                                            </TableCell>
                                                        )}
                                                        {!isMobile && (
                                                            <TableCell>
                                                                {destinatario.CORREO || 'N/A'}
                                                            </TableCell>
                                                        )}
                                                    </TableRow>
                                                ))}
                                                {!destinatarios[cliente.COD_CLIENTE]?.length && (
                                                    <TableRow>
                                                        <TableCell 
                                                            colSpan={isMobile ? 3 : 5} 
                                                            align="center"
                                                        >
                                                            No se encontraron destinatarios
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    )}
                                </Box>
                            </Collapse>
                        </TableCell>
                    </TableRow>
                </React.Fragment>
            ));
    };

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
                InputProps={{
                    endAdornment: <i className="bi bi-search" style={{ marginLeft: 8 }} />
                }}
            />

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow sx={{ 
                            borderBottom: '2px solid',
                            borderBottomColor: theme.palette.divider
                        }}>
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
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    Cargando clientes...
                                </TableCell>
                            </TableRow>
                        ) : renderTableRows()}
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
                                labelDisplayedRows={({ from, to, count }) => 
                                    `${from}-${to} de ${count}`
                                }
                                sx={{
                                    '.MuiTablePagination-toolbar': {
                                        padding: 1
                                    }
                                }}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>

            <InsertCliente
                show={insertClienteOpen}
                handleClose={handleCloseInsertCliente}
                onClienteInserted={handleClienteInserted}
            />

            <InsertDestinatario 
                show={insertDestinatarioOpen} 
                handleClose={() => setInsertDestinatarioOpen(false)} 
                fk_cod_cliente={selectedCliente?.COD_CLIENTE} 
                onDestinatarioInserted={fetchClientes} 
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
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbarSeverity}
                    variant="filled"
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default ClientesTable;