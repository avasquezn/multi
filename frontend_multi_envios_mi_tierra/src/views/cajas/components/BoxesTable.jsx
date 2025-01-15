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
import { getBoxesWithCountry } from '../../../services/CajasService';
import { useAuth } from '../../../actions/authContext';
import InsertBox from './Actions/InsertBox';
import UpdateBox from './Actions/UpdateBox';

const BoxTable = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { user } = useAuth();
    const rolPermission = user?.permisos?.find(permiso => permiso.objectName === 'Cajas');
    const [boxes, setBoxes] = useState([]);
    const [filteredBoxes, setFilteredBoxes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [insertBoxOpen, setInsertBoxOpen] = useState(false);
    const [updateBoxOpen, setUpdateBoxOpen] = useState(false);
    const [selectedBox, setSelectedBox] = useState(null);

    const showActionsColumn = rolPermission?.canUpdate === 1 || rolPermission?.canDelete === 1;

    useEffect(() => {
        fetchBoxes();
    }, []);

    useEffect(() => {
        filterBoxes();
    }, [boxes, searchTerm]);

    const fetchBoxes = async () => {
        setLoading(true);
        try {
            const data = await getBoxesWithCountry();
            setBoxes(data);
            setFilteredBoxes(data);
        } catch (error) {
            console.error('Error fetching cajas:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterBoxes = () => {
        const filtered = boxes.filter((box) =>
            Object.values(box).some(
                (val) => typeof val === 'string' && val.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredBoxes(filtered);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleEdit = (box) => {
        console.log('Caja seleccionada para editar:', box);
        setSelectedBox({
            COD_CAJA: box.COD_CAJA,
            COD_PRECIO: box.COD_PRECIO,
            ID_CAJA: box.ID_CAJA,
            DETALLE: box.DETALLE,
            PRECIO: box.PRECIO
        });
        setUpdateBoxOpen(true);
    };

    const handleInsertBox = () => {
        setInsertBoxOpen(true);
    };

    const handleCloseInsertBox = () => {
        setInsertBoxOpen(false);
    };

    const handleBoxInserted = () => {
        fetchBoxes();
    };

    const handleCloseUpdateBox = () => {
        setUpdateBoxOpen(false);
        setSelectedBox(null);
    };

    const renderTable = () => (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow sx={{ borderBottom: '2px solid #666' }}>
                        <TableCell>Detalle</TableCell>
                        <TableCell>ID Caja</TableCell>
                        <TableCell>Precio</TableCell>
                        <TableCell>País</TableCell>
                        {showActionsColumn && <TableCell>Acciones</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredBoxes
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((box) => (
                            <TableRow key={box.COD_CAJA}>
                                <TableCell>{box.DETALLE}</TableCell>
                                <TableCell>{box.ID_CAJA}</TableCell>
                                <TableCell>{box.PRECIO}</TableCell>
                                <TableCell>{box.NOM_PAIS}</TableCell>
                                {showActionsColumn && (
                                    <TableCell>
                                        {rolPermission?.canUpdate === 1 && (
                                            <Tooltip title="Editar">
                                                <IconButton color="primary" onClick={() => handleEdit(box)}>
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
                            count={filteredBoxes.length}
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
                    onClick={handleInsertBox}
                    sx={{ mb: 2 }}
                    startIcon={<i className="bi bi-plus-circle" />}
                >
                    Agregar nueva caja
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

            <InsertBox
                show={insertBoxOpen}
                handleClose={handleCloseInsertBox}
                onBoxInserted={handleBoxInserted}
            />

            <UpdateBox
                show={updateBoxOpen}
                handleClose={handleCloseUpdateBox}
                onBoxUpdated={fetchBoxes}
                initialCajaData={selectedBox}
            />

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default BoxTable;