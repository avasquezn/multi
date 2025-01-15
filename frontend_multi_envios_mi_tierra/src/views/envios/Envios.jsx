import React, { useState, useEffect } from 'react';
import { useAuth } from '../../actions/authContext';
import EnvioTable from './components/EnvioTable';
import EnvioInsert from './components/Actions/EnvioInsert';
import NoPermissionAlert from '../../utils/NoPermissionAlert';
import '../../styles/h1.css';

const Discounts = () => {
    const [showModal, setShowModal] = useState(false);
    const { user } = useAuth();
    const rolPermission = user?.permisos?.find(permiso => permiso.objectName === 'Envios');

    useEffect(() => {}, [user, rolPermission]);

    const handleCloseModal = () => setShowModal(false);

    if (rolPermission?.canView === 0) {
        return <NoPermissionAlert />;
    }

    return (
        <div className="container">
            <h1>Gestión de envios</h1>
            <EnvioTable />
            <EnvioInsert show={showModal} handleClose={handleCloseModal} />
        </div>
    );
};

export default Discounts;
