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
import { getDiscountTypes } from '../../../services/descuentosService'; // Asegúrate de tener este servicio para obtener los tipos de descuento
import { useAuth } from '../../../actions/authContext';
import InsertDiscountType from './Actions/InsertTipoDescuento'; // Modal para insertar tipo de descuento
import UpdateDiscountType from './Actions/UpdateTipoDescuento'; // Modal para actualizar tipo de descuento

const DiscountTypeTable = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { user } = useAuth();
    const rolPermission = user?.permisos?.find(permiso => permiso.objectName === 'Tipo de descuentos');
    const [discountTypes, setDiscountTypes] = useState([]);
    const [filteredDiscountTypes, setFilteredDiscountTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [selectedDiscountType, setSelectedDiscountType] = useState(null);
    const [insertDiscountTypeOpen, setInsertDiscountTypeOpen] = useState(false);
    const [updateDiscountTypeOpen, setUpdateDiscountTypeOpen] = useState(false);

    const showActionsColumn = rolPermission?.canUpdate === 1;

    useEffect(() => {
        fetchDiscountTypes();
    }, []);

    useEffect(() => {
        filterDiscountTypes();
    }, [discountTypes, searchTerm]);

    const fetchDiscountTypes = async () => {
        setLoading(true);
        try {
            const data = await getDiscountTypes(); // Esta función debe hacer la llamada al backend
            setDiscountTypes(data);
            setFilteredDiscountTypes(data);
        } catch (error) {
            console.error('Error fetching tipos de descuento:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterDiscountTypes = () => {
        const filtered = discountTypes.filter((discountType) =>
            Object.values(discountType).some(
                (val) => typeof val === 'string' && val.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredDiscountTypes(filtered);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleEdit = (discountType) => {
        setSelectedDiscountType(discountType);
        setUpdateDiscountTypeOpen(true);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleInsertDiscountType = () => {
        setInsertDiscountTypeOpen(true);
    };

    const handleCloseInsertDiscountType = () => {
        setInsertDiscountTypeOpen(false);
    };

    const handleDiscountTypeInserted = () => {
        fetchDiscountTypes();
    };

    const handleCloseUpdateDiscountType = () => {
        setUpdateDiscountTypeOpen(false);
        setSelectedDiscountType(null);
    };

    const renderTable = () => (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow sx={{ borderBottom: '2px solid #666' }}>
                        <TableCell>Detalle</TableCell>
                        <TableCell>Es Porcentaje</TableCell>
                        {showActionsColumn && <TableCell>Acciones</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredDiscountTypes
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((discountType) => (
                            <TableRow key={discountType.COD_TIPO_DESCUENTO}>
                                <TableCell>{discountType.DETALLE}</TableCell>
                                <TableCell>{discountType.ES_PORCENTAJE ? 'Sí' : 'No'}</TableCell>
                                {showActionsColumn && (
                                    <TableCell>
                                        <Tooltip title="Editar">
                                            <IconButton color="primary" onClick={() => handleEdit(discountType)}>
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
                            count={filteredDiscountTypes.length}
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
                    onClick={handleInsertDiscountType}
                    sx={{ mb: 2 }}
                    startIcon={<i className="bi bi-plus-circle" />}
                >
                    Agregar nuevo tipo de descuento
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

            <InsertDiscountType
                show={insertDiscountTypeOpen}
                handleClose={handleCloseInsertDiscountType}
                onDiscountInserted={handleDiscountTypeInserted}
            />

            <UpdateDiscountType
                show={updateDiscountTypeOpen}
                handleClose={handleCloseUpdateDiscountType}
                onDiscountUpdated={fetchDiscountTypes}
                initialDiscountData={selectedDiscountType}
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

export default DiscountTypeTable;
