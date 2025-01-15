import React, { useState, useEffect } from 'react';
import { useAuth } from '../../actions/authContext';
import PaquetesTable from './components/PaquetesTable';
import PaqueteInsert from './components/Actions/PaqueteInsert';
import NoPermissionAlert from '../../utils/NoPermissionAlert';
import '../../styles/h1.css';

const Paquetes = () => {
    const [showModal, setShowModal] = useState(false);
    const { user } = useAuth();
    const rolPermission = user?.permisos?.find(permiso => permiso.objectName === 'Paquetes');

    useEffect(() => {}, [user, rolPermission]);

    const handleCloseModal = () => setShowModal(false);

    if (rolPermission?.canView === 0) {
        return <NoPermissionAlert />;
    }

    return (
        <div className="container">
            <h1>Gestión de paquetes</h1>
            <PaquetesTable />
            <PaqueteInsert show={showModal} handleClose={handleCloseModal} />
        </div>
    );
};

export default Paquetes;
