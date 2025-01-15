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
import { getDiscounts } from '../../../services/descuentosService'; // Servicio para obtener descuentos
import { useAuth } from '../../../actions/authContext';
import InsertDiscount from './Actions/InsertDescuentos'; // Modal para insertar descuento
import UpdateDiscount from './Actions/UpdateDescuentos'; // Modal para actualizar descuento

const DiscountsTable = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { user } = useAuth();
    const rolPermission = user?.permisos?.find(permiso => permiso.objectName === 'Descuentos');
    const [discounts, setDiscounts] = useState([]);
    const [filteredDiscounts, setFilteredDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [selectedDiscount, setSelectedDiscount] = useState(null);
    const [insertDiscountOpen, setInsertDiscountOpen] = useState(false);
    const [updateDiscountOpen, setUpdateDiscountOpen] = useState(false);

    const showActionsColumn = rolPermission?.canUpdate === 1;

    useEffect(() => {
        fetchDiscounts();
    }, []);

    useEffect(() => {
        filterDiscounts();
    }, [discounts, searchTerm]);

    const fetchDiscounts = async () => {
        setLoading(true);
        try {
            const data = await getDiscounts(); // Esta función llama al procedimiento almacenado `GET_DESCUENTOS`
            setDiscounts(data);
            setFilteredDiscounts(data);
        } catch (error) {
            console.error('Error fetching descuentos:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterDiscounts = () => {
        const filtered = discounts.filter((discount) =>
            Object.values(discount).some(
                (val) => typeof val === 'string' && val.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredDiscounts(filtered);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleEdit = (discount) => {
        setSelectedDiscount(discount);
        setUpdateDiscountOpen(true);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleInsertDiscount = () => {
        setInsertDiscountOpen(true);
    };

    const handleCloseInsertDiscount = () => {
        setInsertDiscountOpen(false);
    };

    const handleDiscountInserted = () => {
        fetchDiscounts();
    };

    const handleCloseUpdateDiscount = () => {
        setUpdateDiscountOpen(false);
        setSelectedDiscount(null);
    };

    const renderTable = () => (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow sx={{ borderBottom: '2px solid #666' }}>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Cantidad</TableCell>
                        <TableCell>Tipo de Descuento</TableCell>
                        <TableCell>¿Es Porcentaje?</TableCell>
                        {showActionsColumn && <TableCell>Acciones</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredDiscounts
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((discount) => (
                            <TableRow key={discount.COD_DESCUENTO}>
                                <TableCell>{discount.NOMBRE}</TableCell>
                                <TableCell>{discount.CANTIDAD}</TableCell>
                                <TableCell>{discount.DETALLE}</TableCell>
                                <TableCell>{discount.ES_PORCENTAJE ? 'Sí' : 'No'}</TableCell>
                                {showActionsColumn && (
                                    <TableCell>
                                        <Tooltip title="Editar">
                                            <IconButton color="primary" onClick={() => handleEdit(discount)}>
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
                            count={filteredDiscounts.length}
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
                    onClick={handleInsertDiscount}
                    sx={{ mb: 2 }}
                    startIcon={<i className="bi bi-plus-circle" />}
                >
                    Agregar nuevo descuento
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

            <InsertDiscount
                show={insertDiscountOpen}
                handleClose={handleCloseInsertDiscount}
                onDiscountInserted={handleDiscountInserted}
            />

            <UpdateDiscount
                show={updateDiscountOpen}
                handleClose={handleCloseUpdateDiscount}
                onDiscountUpdated={fetchDiscounts}
                initialDiscountData={selectedDiscount}
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

export default DiscountsTable;
