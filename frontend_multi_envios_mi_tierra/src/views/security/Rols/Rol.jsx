import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../actions/authContext';
import RolTable from './components/RolsTable';
import InsertRol from './components/Actions/InsertRol';
import NoPermissionAlert from '../../../utils/NoPermissionAlert';
import '../../../styles/h1.css'

const Rol = () => {
    const [showModal, setShowModal] = useState(false);
    const { user } = useAuth();
    const rolPermission = user?.permisos?.find(permiso => permiso.objectName === 'Roles');

    useEffect(() => {
    }, [user, rolPermission]);

    const handleCloseModal = () => setShowModal(false);

    if (rolPermission?.canView === 0) {
        return <NoPermissionAlert />; // Usar el nuevo componente aquí
    }

    return (
        <div className="container">
            <h1>Gestión de roles</h1>
            <RolTable />
            <InsertRol show={showModal} handleClose={handleCloseModal} />
        </div>
    );
};

export default Rol;
