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
    Chip,
    IconButton,
    Tooltip,
    Snackbar,
    Alert,
    Button,
    useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { getGenders, updateGenderStatus } from '../../../services/GenderService';
import { useAuth } from '../../../actions/authContext';
import UpdateStatus from './Actions/UpdateStatus';
import InsertGender from './Actions/InsertGender';
import UpdateGender from './Actions/UpdateGender';

const GenderTable = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { user } = useAuth();
    const rolPermission = user?.permisos?.find(permiso => permiso.objectName === 'Géneros');
    const [genders, setGenders] = useState([]);
    const [filteredGenders, setFilteredGenders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedGender, setSelectedGender] = useState(null);
    const [insertGenderOpen, setInsertGenderOpen] = useState(false);
    const [updateGenderOpen, setUpdateGenderOpen] = useState(false);

    // Verificar si se debe mostrar la columna de acciones
    const showActionsColumn = rolPermission?.canUpdate === 1 || rolPermission?.canDelete === 1;

    useEffect(() => {
        fetchGenders();
    }, []);

    useEffect(() => {
        filterGenders();
    }, [genders, searchTerm]);

    const fetchGenders = async () => {
        setLoading(true);
        try {
            const data = await getGenders();
            setGenders(data);
            setFilteredGenders(data);
        } catch (error) {
            console.error('Error fetching géneros:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterGenders = () => {
        const filtered = genders.filter((gender) =>
            Object.values(gender).some(
                (val) => typeof val === 'string' && val.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredGenders(filtered);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleEdit = (gender) => {
        console.log(gender);
        setSelectedGender(gender);
        setUpdateGenderOpen(true);
    };

    const handleDeleteConfirmation = (gender) => {
        setSelectedGender(gender);
        setModalOpen(true);
    };

    const handleDelete = async () => {
        if (selectedGender) {
            try {
                await updateGenderStatus({
                    COD_GENERO: selectedGender.COD_GENERO,
                    ESTADO: selectedGender.ESTADO === 1 ? 0 : 1,
                    USR_MODIFICO: user.nom_usuario
                });
                setSnackbarMessage(`Género "${selectedGender.GENERO}" ${selectedGender.ESTADO === 1 ? 'inhabilitado' : 'habilitado'} correctamente.`);
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
                fetchGenders();
            } catch (error) {
                setSnackbarMessage(`Error al cambiar el estado del género: ${error.message}`);
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            } finally {
                setModalOpen(false);
                setSelectedGender(null);
            }
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleInsertGender = () => {
        setInsertGenderOpen(true);
    };

    const handleCloseInsertGender = () => {
        setInsertGenderOpen(false);
    };

    const handleGenderInserted = () => {
        fetchGenders();
    };

    const handleCloseUpdateGender = () => {
        setUpdateGenderOpen(false);
        setSelectedGender(null);
    };

    const renderTable = () => (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow sx={{ borderBottom: '2px solid #666' }}>
                        <TableCell>Género</TableCell>
                        <TableCell>Estado</TableCell>
                        {showActionsColumn && <TableCell>Acciones</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredGenders
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((gender) => (
                            <TableRow key={gender.COD_GENERO}>
                                <TableCell>{gender.GENERO}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={gender.ESTADO === 1 ? 'Activo' : 'Inactivo'}
                                        color={gender.ESTADO === 1 ? 'success' : 'error'}
                                        variant="outlined"
                                    />
                                </TableCell>
                                {showActionsColumn && (
                                    <TableCell>
                                        {rolPermission?.canUpdate === 1 && (
                                            <Tooltip title="Editar">
                                                <IconButton color="primary" onClick={() => handleEdit(gender)}>
                                                    <i className="bi bi-pencil-square" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        {rolPermission?.canDelete === 1 && (
                                            <Tooltip title={gender.ESTADO === 1 ? 'Inhabilitar' : 'Habilitar'}>
                                                <IconButton
                                                    color={gender.ESTADO === 1 ? 'error' : 'success'}
                                                    onClick={() => handleDeleteConfirmation(gender)}
                                                >
                                                    <i className={gender.ESTADO === 1 ? 'bi bi-trash' : 'bi bi-check'} />
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
                            count={filteredGenders.length}
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
                    onClick={handleInsertGender}
                    sx={{ mb: 2 }}
                    startIcon={<i className="bi bi-plus-circle" />}
                >
                    Agregar nuevo género
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

            <UpdateStatus
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleDelete}
                objectName={selectedGender ? selectedGender.GENERO : ''}
                isEnable={selectedGender ? selectedGender.ESTADO !== 1 : false}
            />

            <InsertGender
                show={insertGenderOpen}
                handleClose={handleCloseInsertGender}
                onGenderInserted={handleGenderInserted}
            />

            <UpdateGender
                show={updateGenderOpen}
                handleClose={handleCloseUpdateGender}
                onGenderUpdated={fetchGenders}
                initialGenderData={selectedGender}
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

export default GenderTable;
