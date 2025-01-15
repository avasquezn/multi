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
import { getObjects, updateObjectStatus } from '../../../../services/ObjectService';
import { useAuth } from '../../../../actions/authContext';
import UpdateStatus from './Actions/UpdateStatus';
import InsertObject from './Actions/InsertObject';
import UpdateObject from './Actions/UpdateObject';

const ObjectTable = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { user } = useAuth();
    const rolPermission = user?.permisos?.find(permiso => permiso.objectName === 'Objetos');
    const [objects, setObjects] = useState([]);
    const [filteredObjects, setFilteredObjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedObject, setSelectedObject] = useState(null);
    const [insertObjectOpen, setInsertObjectOpen] = useState(false);
    const [updateObjectsOpen, setUpdateObjectsOpen] = useState(false);

    // Verificar si se debe mostrar la columna de acciones
    const showActionsColumn = rolPermission?.canUpdate === 1 || rolPermission?.canDelete === 1;

    useEffect(() => {
        fetchObjects();
    }, []);

    useEffect(() => {
        filterObjects();
    }, [objects, searchTerm]);

    const fetchObjects = async () => {
        setLoading(true);
        try {
            const data = await getObjects();
            setObjects(data);
            setFilteredObjects(data);
        } catch (error) {
            console.error('Error fetching objetos:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterObjects = () => {
        const filtered = objects.filter((object) =>
            Object.values(object).some(
                (val) => typeof val === 'string' && val.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredObjects(filtered);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleEdit = (object) => {
        setSelectedObject(object);
        setUpdateObjectsOpen(true);
    };

    const handleDeleteConfirmation = (object) => {
        setSelectedObject(object);
        setModalOpen(true);
    };

    const handleDelete = async () => {
        if (selectedObject) {
            try {
                await updateObjectStatus({
                    COD_OBJETO: selectedObject.COD_OBJETO,
                    ESTADO: selectedObject.ESTADO === 1 ? 0 : 1,
                    USR_MODIFICO: user.nom_usuario
                });
                setSnackbarMessage(`Objeto "${selectedObject.NOM_OBJETO}" ${selectedObject.ESTADO === 1 ? 'inhabilitado' : 'habilitado'} correctamente.`);
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
                fetchObjects();
            } catch (error) {
                setSnackbarMessage(`Error al cambiar el estado del objeto: ${error.message}`);
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            } finally {
                setModalOpen(false);
                setSelectedObject(null);
            }
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleInsertObject = () => {
        setInsertObjectOpen(true);
    };

    const handleCloseInsertObject = () => {
        setInsertObjectOpen(false);
    };

    const handleObjectInserted = () => {
        fetchObjects();
    };

    const handleCloseUpdateObject = () => {
        setUpdateObjectsOpen(false);
        setSelectedObject(null);
    };

    const renderTable = () => (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow sx={{ borderBottom: '2px solid #666' }}>
                        <TableCell>Nombre</TableCell>
                        {!isMobile && <TableCell>Descripción</TableCell>}
                        <TableCell>Estado</TableCell>
                        {showActionsColumn && <TableCell>Acciones</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredObjects
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((object) => (
                            <TableRow key={object.COD_OBJETO}>
                                <TableCell>{object.NOM_OBJETO}</TableCell>
                                {!isMobile && <TableCell>{object.DES_OBJETO}</TableCell>}
                                <TableCell>
                                    <Chip
                                        label={object.ESTADO === 1 ? 'Activo' : 'Inactivo'}
                                        color={object.ESTADO === 1 ? 'success' : 'error'}
                                        variant="outlined"
                                    />
                                </TableCell>
                                {showActionsColumn && (
                                    <TableCell>
                                        {rolPermission?.canUpdate === 1 && (
                                            <Tooltip title="Editar">
                                                <IconButton color="primary" onClick={() => handleEdit(object)}>
                                                    <i className="bi bi-pencil-square" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        {rolPermission?.canDelete === 1 && (
                                            <Tooltip title={object.ESTADO === 1 ? 'Inhabilitar' : 'Habilitar'}>
                                                <IconButton
                                                    color={object.ESTADO === 1 ? 'error' : 'success'}
                                                    onClick={() => handleDeleteConfirmation(object)}
                                                >
                                                    <i className={object.ESTADO === 1 ? 'bi bi-trash' : 'bi bi-check'} />
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
                            count={filteredObjects.length}
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
                    onClick={handleInsertObject}
                    sx={{ mb: 2 }}
                    startIcon={<i className="bi bi-plus-circle" />}
                >
                    Agregar nuevo objeto
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
                objectName={selectedObject ? selectedObject.NOM_OBJETO : ''}
                isEnable={selectedObject ? selectedObject.ESTADO !== 1 : false}
            />

            <InsertObject
                show={insertObjectOpen}
                handleClose={handleCloseInsertObject}
                onObjectInserted={handleObjectInserted}
            />

            <UpdateObject
                show={updateObjectsOpen}
                handleClose={handleCloseUpdateObject}
                onObjectsUpdated={fetchObjects}
                initialObjectData={selectedObject}
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

export default ObjectTable;
