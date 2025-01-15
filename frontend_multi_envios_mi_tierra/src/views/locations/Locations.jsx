import React, { useState, useEffect } from 'react';
import { useAuth } from '../../actions/authContext';
import LocationsTable from './components/LocationTable';
import InsertPais from './components/Actions/InsertPais';
import NoPermissionAlert from '../../utils/NoPermissionAlert';
import '../../styles/h1.css';

const Locations = () => {
    const [showModal, setShowModal] = useState(false);
    const { user } = useAuth();
    const rolPermission = user?.permisos?.find(permiso => permiso.objectName === 'Paises');

    useEffect(() => {}, [user, rolPermission]);

    const handleCloseModal = () => setShowModal(false);

    if (rolPermission?.canView === 0) {
        return <NoPermissionAlert />;
    }

    return (
        <div className="container">
            <h1>Gestión de ubicaciones</h1>
            <LocationsTable />
            <InsertPais show={showModal} handleClose={handleCloseModal} />
        </div>
    );
};

export default Locations;
