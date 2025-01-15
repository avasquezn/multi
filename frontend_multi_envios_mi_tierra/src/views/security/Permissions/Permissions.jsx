import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../actions/authContext';
import PermisionsTable from './components/PermissionsTable';
import InsertPermission from './components/Actions/InsertPermission';
import NoPermissionAlert from '../../../utils/NoPermissionAlert';
import '../../../styles/h1.css'

const Permission = () => {
    const [showModal, setShowModal] = useState(false);
    const { user } = useAuth();
    const rolPermission = user?.permisos?.find(permiso => permiso.objectName === 'Permisos');

    useEffect(() => {
    }, [user, rolPermission]);

    const handleCloseModal = () => setShowModal(false);

    if (rolPermission?.canView === 0) {
        return <NoPermissionAlert />;
    }

    return (
        <div className="container">
            <h1>Gestión de permisos</h1>
            <PermisionsTable />
            <InsertPermission show={showModal} handleClose={handleCloseModal} />
        </div>
    );
};

export default Permission;
