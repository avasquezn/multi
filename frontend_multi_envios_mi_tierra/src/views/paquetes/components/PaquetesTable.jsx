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
    Checkbox,
    MenuItem,
    Toolbar,
    Typography,
    useMediaQuery,
    IconButton,
    Tooltip,
    Chip,
    Box
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { getPaquetes, updatePaquetesEstadoMasivo } from '../../../services/PaqueteService';
import { useAuth } from '../../../actions/authContext';
import InsertPaquete from './Actions/PaqueteInsert';
import UpdatePaquete from './Actions/PaqueteUpdate';

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
    const [updatePaqueteOpen, setUpdatePaqueteOpen] = useState(false);
    const [selectedPaquete, setSelectedPaquete] = useState(null);
    
    // Estados para filtros existentes
    const [filterCliente, setFilterCliente] = useState('');
    const [filterEstado, setFilterEstado] = useState('');
    
    // NUEVOS estados para filtros por país y género
    const [filterPais, setFilterPais] = useState('');
    const [filterGenero, setFilterGenero] = useState('');
    
    // Estados para actualización masiva
    const [selected, setSelected] = useState([]);
    const [bulkEstado, setBulkEstado] = useState('');
    const [bulkFechaEntrega, setBulkFechaEntrega] = useState('');

    const getEstadoChip = (estado) => {
        switch (estado) {
            case 0: return { label: 'Pendiente', color: 'warning' };
            case 1: return { label: 'En tránsito', color: 'primary' };
            case 2: return { label: 'Entregado', color: 'success' };
            default: return { label: 'Desconocido', color: 'default' };
        }
    };

    useEffect(() => {
        fetchPaquetes();
    }, []);

    useEffect(() => {
        filterPaquetes();
    }, [paquetes, searchTerm, filterCliente, filterEstado, filterPais, filterGenero]);

    const fetchPaquetes = async () => {
        setLoading(true);
        try {
            const data = await getPaquetes();
            setPaquetes(data);
            setFilteredPaquetes(data);
        } catch (error) {
            console.error('Error fetching paquetes:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterPaquetes = () => {
        const filtered = paquetes.filter((paquete) => {
            // Filtro de búsqueda general
            const matchesSearch = Object.values(paquete).some(
                (val) =>
                    typeof val === 'string' &&
                    val.toLowerCase().includes(searchTerm.toLowerCase())
            ) || getEstadoChip(paquete.ESTADO).label.toLowerCase().includes(searchTerm.toLowerCase());
            
            // Filtro por cliente
            const matchesCliente = filterCliente 
                ? paquete.NOM_PERSONA.toLowerCase().includes(filterCliente.toLowerCase())
                : true;
            
            // Filtro por estado
            const matchesEstado = filterEstado !== '' 
                ? paquete.ESTADO === parseInt(filterEstado)
                : true;
            
            // Filtro por país (asumiendo que el campo es "PAIS_PERSONA")
            const matchesPais = filterPais 
                ? paquete.PAIS_PERSONA && paquete.PAIS_PERSONA.toLowerCase().includes(filterPais.toLowerCase())
                : true;
            
            // Filtro por género (asumiendo que el campo es "GENERO_PERSONA")
            const matchesGenero = filterGenero 
                ? paquete.GENERO_PERSONA && paquete.GENERO_PERSONA.toLowerCase().includes(filterGenero.toLowerCase())
                : true;

            return matchesSearch && matchesCliente && matchesEstado && matchesPais && matchesGenero;
        });

        const sorted = filtered.sort((a, b) => a.ESTADO - b.ESTADO);
        setFilteredPaquetes(sorted);
        setPage(0);
    };

    // Manejo de selección múltiple
    const handleSelectAll = (event) => {
        if (event.target.checked) {
            const newSelected = filteredPaquetes.map(p => p.COD_PAQUETE);
            setSelected(newSelected);
        } else {
            setSelected([]);
        }
    };

    const handleSelect = (codPaquete) => {
        const selectedIndex = selected.indexOf(codPaquete);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = [...selected, codPaquete];
        } else {
            newSelected = selected.filter(id => id !== codPaquete);
        }
        setSelected(newSelected);
    };

    const handlePaqueteInserted = () => {
        fetchPaquetes();
        setSnackbarMessage('Paquete agregado exitosamente.');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
    };

    const handleInsertPaquete = () => {
        setInsertPaqueteOpen(true);
    };

    const handleCloseInsertPaquete = () => {
        setInsertPaqueteOpen(false);
    };

    const handleCloseUpdatePaquete = () => {
        setUpdatePaqueteOpen(false);
        setSelectedPaquete(null);
    };

    const handlePaqueteUpdated = () => {
        fetchPaquetes();
        setSnackbarMessage('Paquete actualizado exitosamente.');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Actualización masiva
    const handleBulkUpdate = async () => {
        if (!rolPermission?.canUpdate) {
            showSnackbar('No tienes permiso para actualizar paquetes', 'error');
            return;
        }

        if (selected.length === 0) {
            showSnackbar('Selecciona al menos un paquete', 'warning');
            return;
        }

        try {
            const paquetesToUpdate = selected.map(codPaquete => {
                const paquete = paquetes.find(p => p.COD_PAQUETE === codPaquete);
                return {
                    COD_PAQUETE: codPaquete,
                    ESTADO: bulkEstado !== '' ? bulkEstado : paquete.ESTADO,
                    FEC_ENTREGA: bulkFechaEntrega || paquete.FEC_ENTREGA
                };
            });

            await updatePaquetesEstadoMasivo({
                usr_modifico: user?.nom_usuario || '',
                paquetes: paquetesToUpdate
            });

            fetchPaquetes();
            showSnackbar('Paquetes actualizados exitosamente', 'success');
            setSelected([]);
            setBulkEstado('');
            setBulkFechaEntrega('');
        } catch (error) {
            showSnackbar(error.message || 'Error al actualizar paquetes', 'error');
        }
    };

    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setOpenSnackbar(true);
    };

    const handleEdit = (paquete) => {
        setSelectedPaquete({
            COD_PAQUETE: paquete.COD_PAQUETE,
            ESTADO: paquete.ESTADO,
            FEC_ENTREGA: paquete.FEC_ENTREGA,
            usr_modifico: user?.nom_usuario || ''
        });
        setUpdatePaqueteOpen(true);
    };

    const renderTable = () => (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow sx={{ borderBottom: '2px solid #666' }}>
                        <TableCell padding="checkbox">
                            <Checkbox
                                indeterminate={selected.length > 0 && selected.length < filteredPaquetes.length}
                                checked={filteredPaquetes.length > 0 && selected.length === filteredPaquetes.length}
                                onChange={handleSelectAll}
                            />
                        </TableCell>
                        <TableCell># Paquete</TableCell>
                        <TableCell>Caja</TableCell>
                        <TableCell>Estado</TableCell>
                        <TableCell>Nombre Cliente</TableCell>
                        <TableCell># Envío</TableCell>
                        <TableCell>Subtotal</TableCell>
                        <TableCell>Descuento</TableCell>
                        <TableCell>Depósito</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Fecha Entrega</TableCell>
                        {rolPermission?.canUpdate === 1 && <TableCell>Acciones</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredPaquetes
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((paquete) => (
                            <TableRow key={paquete.COD_PAQUETE}>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selected.indexOf(paquete.COD_PAQUETE) !== -1}
                                        onChange={() => handleSelect(paquete.COD_PAQUETE)}
                                    />
                                </TableCell>
                                <TableCell>{paquete.COD_PAQUETE}</TableCell>
                                <TableCell>{paquete.ID_CAJA}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={getEstadoChip(paquete.ESTADO).label}
                                        color={getEstadoChip(paquete.ESTADO).color}
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>{paquete.NOM_PERSONA}</TableCell>
                                <TableCell>{paquete.NUM_ENVIO}</TableCell>
                                <TableCell>$ {paquete.PRECIO_ORIGINAL}</TableCell>
                                <TableCell>
                                    {paquete.DESCUENTO_CANTIDAD !== null ? (
                                        paquete.ES_PORCENTAJE === 1 
                                            ? `${parseFloat(paquete.DESCUENTO_CANTIDAD) % 1 === 0 
                                                ? parseInt(paquete.DESCUENTO_CANTIDAD) 
                                                : paquete.DESCUENTO_CANTIDAD} %` 
                                            : `$ ${paquete.DESCUENTO_CANTIDAD}`
                                    ) : 'N/A'}
                                </TableCell>
                                <TableCell>
                                    {paquete.ESTADO === 0 && paquete.DEPOSITO !== null ? `$ ${parseFloat(paquete.DEPOSITO).toFixed(2)}` : '—'}
                                </TableCell>
                                <TableCell>$ {paquete.PRECIO_FINAL}</TableCell>
                                <TableCell>{paquete.FEC_ENTREGA}</TableCell>
                                {rolPermission?.canUpdate === 1 && (
                                    <TableCell>
                                        <Tooltip title="Editar">
                                            <IconButton color="primary" onClick={() => handleEdit(paquete)}>
                                                <i className="bi bi-pencil-square" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                )}
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
            {/* Barra de herramientas para actualización masiva */}
            {selected.length > 0 && (
                <Toolbar sx={{ 
                    bgcolor: theme.palette.action.selected,
                    mb: 2,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2
                }}>
                    <Typography variant="subtitle1">
                        {selected.length} seleccionados
                    </Typography>
                    
                    <TextField
                        select
                        label="Estado"
                        size="small"
                        value={bulkEstado}
                        onChange={(e) => setBulkEstado(e.target.value)}
                        sx={{ minWidth: 120 }}
                    >
                        <MenuItem value=""><em>Mantener actual</em></MenuItem>
                        <MenuItem value={0}>Pendiente</MenuItem>
                        <MenuItem value={1}>En tránsito</MenuItem>
                        <MenuItem value={2}>Entregado</MenuItem>
                    </TextField>

                    <TextField
                        type="date"
                        label="Fecha Entrega"
                        size="small"
                        InputLabelProps={{ shrink: true }}
                        value={bulkFechaEntrega}
                        onChange={(e) => setBulkFechaEntrega(e.target.value)}
                        sx={{ minWidth: 180 }}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleBulkUpdate}
                        startIcon={<i className="bi bi-save" />}
                    >
                        Aplicar cambios
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={() => setSelected([])}
                        startIcon={<i className="bi bi-x-circle" />}
                    >
                        Cancelar
                    </Button>
                </Toolbar>
            )}

            {/* Sección de filtros y botón de agregar */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                {rolPermission?.canInsert === 1 && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleInsertPaquete}
                        startIcon={<i className="bi bi-plus-circle" />}
                    >
                        Agregar nuevo paquete
                    </Button>
                )}
            </Box>

            <TextField
                label="Buscar"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Filtros adicionales */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                    select
                    label="Filtrar por cliente"
                    fullWidth
                    value={filterCliente}
                    onChange={(e) => setFilterCliente(e.target.value)}
                >
                    <MenuItem value="">Todos los clientes</MenuItem>
                    {[...new Set(paquetes.map(p => p.NOM_PERSONA))].sort().map((nombre, index) => (
                        <MenuItem key={index} value={nombre}>
                            {nombre}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    select
                    label="Filtrar por estado"
                    fullWidth
                    value={filterEstado}
                    onChange={(e) => setFilterEstado(e.target.value)}
                >
                    <MenuItem value="">Todos los estados</MenuItem>
                    <MenuItem value={0}>Pendiente</MenuItem>
                    <MenuItem value={1}>En tránsito</MenuItem>
                    <MenuItem value={2}>Entregado</MenuItem>
                </TextField>

                <TextField
                    select
                    label="Filtrar por país"
                    fullWidth
                    value={filterPais}
                    onChange={(e) => setFilterPais(e.target.value)}
                >
                    <MenuItem value="">Todos los países</MenuItem>
                    {[...new Set(paquetes.map(p => p.PAIS_PERSONA))].sort().map((pais, index) => (
                        <MenuItem key={index} value={pais}>
                            {pais}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    select
                    label="Filtrar por género"
                    fullWidth
                    value={filterGenero}
                    onChange={(e) => setFilterGenero(e.target.value)}
                >
                    <MenuItem value="">Todos los géneros</MenuItem>
                    {[...new Set(paquetes.map(p => p.GENERO_PERSONA))].sort().map((genero, index) => (
                        <MenuItem key={index} value={genero}>
                            {genero}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>

            {loading ? <div>Cargando...</div> : renderTable()}

            <InsertPaquete
                show={insertPaqueteOpen}
                handleClose={handleCloseInsertPaquete}
                onPaqueteInserted={handlePaqueteInserted}
            />

            <UpdatePaquete
                show={updatePaqueteOpen}
                handleClose={handleCloseUpdatePaquete}
                onPaqueteUpdated={handlePaqueteUpdated}
                initialPaqueteData={selectedPaquete}
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
