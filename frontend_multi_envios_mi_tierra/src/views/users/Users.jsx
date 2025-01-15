import React, { useState, useEffect } from 'react';
import { useAuth } from '../../actions/authContext';
import UserTable from './components/UsersTable';
import InsertUser from './components/actions/InsertUser';
import NoPermissionAlert from '../../utils/NoPermissionAlert';
import '../../styles/h1.css';

const Users = () => {
    const [showModal, setShowModal] = useState(false);
    const { user } = useAuth();
    const rolPermission = user?.permisos?.find(permiso => permiso.objectName === 'Usuarios');

    useEffect(() => {
    }, [user, rolPermission]);

    const handleCloseModal = () => setShowModal(false);

    if (rolPermission?.canView === 0) {
        return <NoPermissionAlert />;
    }

    return (
        <div className="container">
            <h1>Gestión de usuarios</h1>
            <UserTable />
            <InsertUser show={showModal} handleClose={handleCloseModal} />
        </div>
    );
};

export default Users;
