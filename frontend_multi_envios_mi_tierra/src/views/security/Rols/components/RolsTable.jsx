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
import { getRoles, updateRoleStatus } from '../../../../services/RolsService';
import { useAuth } from '../../../../actions/authContext';
import UpdateStatus from './Actions/UpdateStatus';
import InsertRol from './Actions/InsertRol';
import UpdateRol from './Actions/UpdateRol';

const RolesTable = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { user } = useAuth();
    const rolPermission = user?.permisos?.find(permiso => permiso.objectName === 'Roles');
    const [roles, setRoles] = useState([]);
    const [filteredRoles, setFilteredRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [insertRolOpen, setInsertRolOpen] = useState(false);
    const [updateRolOpen, setUpdateRolOpen] = useState(false);

    // Verificar si se debe mostrar la columna de acciones
    const showActionsColumn = rolPermission?.canUpdate === 1 || rolPermission?.canDelete === 1;

    useEffect(() => {
        fetchRoles();
    }, []);

    useEffect(() => {
        filterRoles();
    }, [roles, searchTerm]);

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const data = await getRoles();
            setRoles(data);
            setFilteredRoles(data);
        } catch (error) {
            console.error('Error fetching roles:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterRoles = () => {
        const filtered = roles.filter((role) =>
            Object.values(role).some(
                (val) => typeof val === 'string' && val.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredRoles(filtered);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleEdit = (role) => {
        setSelectedRole(role);
        setUpdateRolOpen(true);
    };

    const handleDeleteConfirmation = (role) => {
        setSelectedRole(role);
        setModalOpen(true);
    };

    const handleDelete = async () => {
        if (selectedRole) {
            try {
                await updateRoleStatus({
                    COD_ROL: selectedRole.COD_ROL,
                    ESTADO: selectedRole.ESTADO === 1 ? 0 : 1,
                    USR_MODIFICO: user.nom_usuario
                });
                setSnackbarMessage(`Rol "${selectedRole.NOM_ROL}" ${selectedRole.ESTADO === 1 ? 'inhabilitado' : 'habilitado'} correctamente.`);
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
                fetchRoles();
            } catch (error) {
                setSnackbarMessage(`Error al cambiar el estado del rol: ${error.message}`);
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            } finally {
                setModalOpen(false);
                setSelectedRole(null);
            }
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleInsertRol = () => {
        setInsertRolOpen(true);
    };

    const handleCloseInsertRol = () => {
        setInsertRolOpen(false);
    };

    const handleRoleInserted = () => {
        fetchRoles();
    };

    const handleCloseUpdateRol = () => {
        setUpdateRolOpen(false);
        setSelectedRole(null);
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
                    {filteredRoles
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((role) => (
                            <TableRow key={role.COD_ROL}>
                                <TableCell>{role.NOM_ROL}</TableCell>
                                {!isMobile && <TableCell>{role.DES_ROL}</TableCell>}
                                <TableCell>
                                    <Chip
                                        label={role.ESTADO === 1 ? 'Activo' : 'Inactivo'}
                                        color={role.ESTADO === 1 ? 'success' : 'error'}
                                        variant="outlined"
                                    />
                                </TableCell>
                                {showActionsColumn && (
                                    <TableCell>
                                        {rolPermission?.canUpdate === 1 && (
                                            <Tooltip title="Editar">
                                                <IconButton color="primary" onClick={() => handleEdit(role)}>
                                                    <i className="bi bi-pencil-square" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        {rolPermission?.canDelete === 1 && (
                                            <Tooltip title={role.ESTADO === 1 ? 'Inhabilitar' : 'Habilitar'}>
                                                <IconButton
                                                    color={role.ESTADO === 1 ? 'error' : 'success'}
                                                    onClick={() => handleDeleteConfirmation(role)}
                                                >
                                                    <i className={role.ESTADO === 1 ? 'bi bi-trash' : 'bi bi-check'} />
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
                            count={filteredRoles.length}
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
                    onClick={handleInsertRol}
                    sx={{ mb: 2 }}
                    startIcon={<i className="bi bi-plus-circle" />}
                >
                    Agregar nuevo rol
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
                roleName={selectedRole ? selectedRole.NOM_ROL : ''}
                isEnable={selectedRole ? selectedRole.ESTADO !== 1 : false}
            />

            <InsertRol
                show={insertRolOpen}
                handleClose={handleCloseInsertRol}
                onRoleInserted={handleRoleInserted}
            />

            <UpdateRol
                show={updateRolOpen}
                handleClose={handleCloseUpdateRol}
                onRoleUpdated={fetchRoles}
                initialRoleData={selectedRole}
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

export default RolesTable;
