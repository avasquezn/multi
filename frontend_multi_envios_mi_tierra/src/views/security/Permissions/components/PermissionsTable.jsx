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
import { getPermisos, updatePermisoStatus } from '../../../../services/PermissionsService';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useAuth } from '../../../../actions/authContext';
import UpdateStatus from './Actions/UpdateStatus';
import InsertPermission from './Actions/InsertPermission';
import UpdatePermission from './Actions/UpdatePermission';

const PermissionsTable = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { user } = useAuth();
    const rolPermission = user?.permisos?.find(permiso => permiso.objectName === 'Permisos');
    const [permissions, setPermissions] = useState([]);
    const [filteredPermissions, setFilteredPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPermission, setSelectedPermission] = useState(null);
    const [insertPermissionOpen, setInsertPermissionOpen] = useState(false);
    const [updatePermissionOpen, setUpdatePermissionOpen] = useState(false);

    const showActionsColumn = rolPermission?.canUpdate === 1 || rolPermission?.canDelete === 1;

    useEffect(() => {
        fetchPermissions();
    }, []);

    useEffect(() => {
        filterPermissions();
    }, [permissions, searchTerm]);

    const fetchPermissions = async () => {
        setLoading(true);
        try {
            const data = await getPermisos();
            setPermissions(data);
            setFilteredPermissions(data);
        } catch (error) {
            console.error('Error fetching permissions:', error);
            setSnackbarMessage('Error al cargar los permisos');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    const filterPermissions = () => {
        const filtered = permissions.filter((permission) =>
            Object.values(permission).some(
                (val) => val && typeof val === 'string' && val.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredPermissions(filtered);
        setPage(0);
    };

    const handleDeleteConfirmation = (permission) => {
        setSelectedPermission(permission);
        setModalOpen(true);
    };

    const handleDelete = async () => {
        if (selectedPermission) {
            try {
                await updatePermisoStatus({
                    COD_PERMISO: selectedPermission.COD_PERMISO,
                    ESTADO: selectedPermission.ESTADO === 1 ? 0 : 1,
                    USR_MODIFICO: user.nom_usuario
                });
                setSnackbarMessage(`Permiso para el rol "${selectedPermission.NOM_ROL}" con objeto "${selectedPermission.NOM_OBJETO}" ${selectedPermission.ESTADO === 1 ? 'inhabilitado' : 'habilitado'} correctamente.`);
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
                fetchPermissions();
            } catch (error) {
                setSnackbarMessage(`Error al cambiar el estado del permiso: ${error.message}`);
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            } finally {
                setModalOpen(false);
                setSelectedPermission(null);
            }
        }
    };

    const handleEdit = (permission) => {
        setSelectedPermission(permission);
        setUpdatePermissionOpen(true);
    };

    const handleCloseUpdatePermission = () => {
        setUpdatePermissionOpen(false);
        setSelectedPermission(null);
    };

    const handleInsertPermission = () => {
        setInsertPermissionOpen(true);
    };

    const handleCloseInsertPermission = () => {
        setInsertPermissionOpen(false);
    };

    const handlePermissionInserted = () => {
        fetchPermissions();
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

    const renderPermissionStatus = (value) => (
        <Chip 
            label={value === 1 ? 'Permitido' : 'Denegado'} 
            color={value === 1 ? 'success' : 'error'}
            variant="outlined"
        />
    );

    const renderTable = () => (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow sx={{ borderBottom: '2px solid #666' }}>
                        <TableCell>Rol</TableCell>
                        <TableCell>Objeto</TableCell>
                        {!isMobile && <TableCell>Insertar</TableCell>}
                        {!isMobile && <TableCell>Eliminar</TableCell>}
                        {!isMobile && <TableCell>Actualizar</TableCell>}
                        {!isMobile && <TableCell>Consultar</TableCell>}
                        {!isMobile && <TableCell>Reportes</TableCell>}
                        <TableCell>Estado</TableCell>
                        {showActionsColumn && <TableCell>Acciones</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredPermissions
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((permission) => (
                            <TableRow key={permission.COD_PERMISO}>
                                <TableCell>{permission.NOM_ROL}</TableCell>
                                <TableCell>{permission.NOM_OBJETO}</TableCell>
                                {!isMobile && (
                                    <TableCell>
                                        {renderPermissionStatus(permission.DES_PERMISO_INSERCCION)}
                                    </TableCell>
                                )}
                                {!isMobile && (
                                    <TableCell>
                                        {renderPermissionStatus(permission.DES_PERMISO_ELIMINACION)}
                                    </TableCell>
                                )}
                                {!isMobile && (
                                    <TableCell>
                                        {renderPermissionStatus(permission.DES_PERMISO_ACTUALIZACION)}
                                    </TableCell>
                                )}
                                {!isMobile && (
                                    <TableCell>
                                        {renderPermissionStatus(permission.DES_PERMISO_CONSULTAR)}
                                    </TableCell>
                                )}
                                {!isMobile && (
                                    <TableCell>
                                        {renderPermissionStatus(permission.PERMISO_REPORTE)}
                                    </TableCell>
                                )}
                                <TableCell>
                                    <Chip 
                                        label={permission.ESTADO === 1 ? 'Activo' : 'Inactivo'} 
                                        color={permission.ESTADO === 1 ? 'success' : 'error'}
                                        variant="outlined"
                                    />
                                </TableCell>
                                {showActionsColumn && (
                                    <TableCell>
                                        {rolPermission?.canUpdate === 1 && (
                                            <Tooltip title="Editar">
                                                <IconButton color="primary" onClick={() => handleEdit(permission)}>
                                                    <i className="bi bi-pencil-square" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        {rolPermission?.canDelete === 1 && (
                                            <Tooltip title={permission.ESTADO === 1 ? "Inhabilitar" : "Habilitar"}>
                                                <IconButton
                                                    color={permission.ESTADO === 1 ? "error" : "success"}
                                                    onClick={() => handleDeleteConfirmation(permission)}
                                                >
                                                    <i className={permission.ESTADO === 1 ? "bi bi-trash" : "bi bi-check"} />
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
                            count={filteredPermissions.length}
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
                    onClick={handleInsertPermission}
                    sx={{ mb: 2 }}
                    startIcon={<i className="bi bi-plus-circle" />}
                >
                    Agregar nuevo permiso
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
                rolName={selectedPermission?.NOM_ROL}
                objectName={selectedPermission?.NOM_OBJETO}
                isEnable={selectedPermission?.ESTADO !== 1}
            />

            <InsertPermission
                show={insertPermissionOpen}
                handleClose={handleCloseInsertPermission}
                onPermissionInserted={handlePermissionInserted}
            />

            <UpdatePermission
                show={updatePermissionOpen}
                handleClose={handleCloseUpdatePermission}
                onPermissionUpdated={fetchPermissions}
                initialPermissionData={selectedPermission}
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

export default PermissionsTable;
