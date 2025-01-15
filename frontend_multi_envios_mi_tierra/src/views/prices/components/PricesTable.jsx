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
import { getPrices } from '../../../services/PricesService';
import { useAuth } from '../../../actions/authContext';
import InsertPrice from './Actions/InsertPrice';
import UpdatePrice from './Actions/UpdatePrice';

const PriceTable = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { user } = useAuth();
    const rolPermission = user?.permisos?.find(permiso => permiso.objectName === 'Precios');
    const [prices, setPrices] = useState([]);
    const [filteredPrices, setFilteredPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [selectedPrice, setSelectedPrice] = useState(null);
    const [insertPriceOpen, setInsertPriceOpen] = useState(false);
    const [updatePriceOpen, setUpdatePriceOpen] = useState(false);

    const showActionsColumn = rolPermission?.canUpdate === 1;

    useEffect(() => {
        fetchPrices();
    }, []);

    useEffect(() => {
        filterPrices();
    }, [prices, searchTerm]);

    const fetchPrices = async () => {
        setLoading(true);
        try {
            const data = await getPrices();
            setPrices(data);
            setFilteredPrices(data);
        } catch (error) {
            console.error('Error fetching precios:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterPrices = () => {
        const filtered = prices.filter((price) =>
            Object.values(price).some(
                (val) => typeof val === 'string' && val.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredPrices(filtered);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleEdit = (price) => {
        setSelectedPrice(price);
        setUpdatePriceOpen(true);
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleInsertPrice = () => {
        setInsertPriceOpen(true);
    };

    const handleCloseInsertPrice = () => {
        setInsertPriceOpen(false);
    };

    const handlePriceInserted = () => {
        fetchPrices();
    };

    const handleCloseUpdatePrice = () => {
        setUpdatePriceOpen(false);
        setSelectedPrice(null);
    };

    const renderTable = () => (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow sx={{ borderBottom: '2px solid #666' }}>
                        <TableCell>País</TableCell>
                        <TableCell>Precio</TableCell>
                        {showActionsColumn && <TableCell>Acciones</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredPrices
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((price) => (
                            <TableRow key={price.COD_PRECIO}>
                                <TableCell>{price.NOM_PAIS}</TableCell>
                                <TableCell>{price.PRECIO}</TableCell>
                                {showActionsColumn && (
                                    <TableCell>
                                        <Tooltip title="Editar">
                                            <IconButton color="primary" onClick={() => handleEdit(price)}>
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
                            count={filteredPrices.length}
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
                    onClick={handleInsertPrice}
                    sx={{ mb: 2 }}
                    startIcon={<i className="bi bi-plus-circle" />}
                >
                    Agregar nuevo precio
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

            <InsertPrice
                show={insertPriceOpen}
                handleClose={handleCloseInsertPrice}
                onPriceInserted={handlePriceInserted}
            />

            <UpdatePrice
                show={updatePriceOpen}
                handleClose={handleCloseUpdatePrice}
                onPriceUpdated={fetchPrices}
                initialPriceData={selectedPrice}
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

export default PriceTable;
