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
import { getUsers, updateUserStatus } from '../../../services/UsersService';
import { useAuth } from '../../../actions/authContext';
import UpdateStatus from './Actions/UpdateStatus';
import InsertUser from './actions/InsertUser';
import UpdateUser from './actions/UpdateUser'

const UsersTable = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { user } = useAuth();
    const rolPermission = user?.permisos?.find(permiso => permiso.objectName === 'Usuarios');
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [insertUserOpen, setInsertUserOpen] = useState(false);
    const [updateUserOpen, setUpdateUserOpen] = useState(false);

    const showActionsColumn = rolPermission?.canUpdate === 1 || rolPermission?.canDelete === 1;

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [users, searchTerm]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getUsers();
            setUsers(data);
            setFilteredUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterUsers = () => {
        const filtered = users.filter((user) =>
            Object.values(user).some(
                (val) => typeof val === 'string' && val.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        setFilteredUsers(filtered);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setUpdateUserOpen(true);
    };
    

    const handleDeleteConfirmation = (user) => {
        setSelectedUser(user);
        setModalOpen(true);
    };

    const handleDelete = async () => {
        if (selectedUser) {
            try {
                await updateUserStatus({
                    id_usuario: selectedUser.COD_USUARIO,
                    estado: selectedUser.ESTADO === 1 ? 0 : 1,
                    usr_modifico: user.nom_usuario
                });
                setSnackbarMessage(`Usuario "${selectedUser.NOM_USUARIO}" ${selectedUser.ESTADO === 1 ? 'inhabilitado' : 'habilitado'} correctamente.`);
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
                fetchUsers();
            } catch (error) {
                setSnackbarMessage(`Error al cambiar el estado del usuario: ${error.message}`);
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            } finally {
                setModalOpen(false);
                setSelectedUser(null);
            }
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleInsertUser = () => {
        setInsertUserOpen(true);
    };

    const handleCloseInsertUser = () => {
        setInsertUserOpen(false);
    };

    const handleUserInserted = () => {
        fetchUsers();
    };

    const handleCloseUpdateUser = () => {
        setUpdateUserOpen(false);
        setSelectedUser(null);
    };

    const renderTable = () => (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow sx={{ borderBottom: '2px solid #666' }}>
                        <TableCell>Nombre de persona</TableCell>
                        {!isMobile && <TableCell>Nombre de usuario</TableCell>}
                        <TableCell>Estado</TableCell>
                        {showActionsColumn && <TableCell>Acciones</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredUsers
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((user) => (
                            <TableRow key={user.COD_USUARIO}>
                                <TableCell>{user.NOM_PERSONA}</TableCell>
                                {!isMobile && <TableCell>{user.NOM_USUARIO}</TableCell>}
                                <TableCell>
                                    <Chip
                                        label={user.ESTADO === 1 ? 'Activo' : 'Inactivo'}
                                        color={user.ESTADO === 1 ? 'success' : 'error'}
                                        variant="outlined"
                                    />
                                </TableCell>
                                {showActionsColumn && (
                                    <TableCell>
                                        {rolPermission?.canUpdate === 1 && (
                                            <Tooltip title="Editar">
                                                <IconButton color="primary" onClick={() => handleEdit(user)}>
                                                    <i className="bi bi-pencil-square" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        {rolPermission?.canDelete === 1 && (
                                            <Tooltip title={user.ESTADO === 1 ? 'Inhabilitar' : 'Habilitar'}>
                                                <IconButton
                                                    color={user.ESTADO === 1 ? 'error' : 'success'}
                                                    onClick={() => handleDeleteConfirmation(user)}
                                                >
                                                    <i className={user.ESTADO === 1 ? 'bi bi-trash' : 'bi bi-check'} />
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
                            count={filteredUsers.length}
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
                    onClick={handleInsertUser}
                    sx={{ mb: 2 }}
                    startIcon={<i className="bi bi-plus-circle" />}
                >
                    Agregar nuevo usuario
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
                userName={selectedUser ? selectedUser.NOM_USUARIO : ''}
                isEnable={selectedUser ? selectedUser.ESTADO !== 1 : false}
            />

            <InsertUser
                show={insertUserOpen}
                handleClose={handleCloseInsertUser}
                onUserInserted={handleUserInserted}
            />

            <UpdateUser
                show={updateUserOpen}
                handleClose={handleCloseUpdateUser}
                onUserUpdated={fetchUsers}
                initialUserData={selectedUser}
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

export default UsersTable;
