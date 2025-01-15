import React, { useState, useEffect } from 'react';
import { useAuth } from '../../actions/authContext';
import GendersTable from './components/GendersTable';
import InsertGender from './components/Actions/InsertGender';
import NoPermissionAlert from '../../utils/NoPermissionAlert';
import '../../styles/h1.css';

const Genders = () => {
    const [showModal, setShowModal] = useState(false);
    const { user } = useAuth();
    const rolPermission = user?.permisos?.find(permiso => permiso.objectName === 'Géneros');

    useEffect(() => {
    }, [user, rolPermission]);

    const handleCloseModal = () => setShowModal(false);

    if (rolPermission?.canView === 0) {
        return <NoPermissionAlert />;
    }

    return (
        <div className="container">
            <h1>Gestión de géneros</h1>
            <GendersTable />
            <InsertGender show={showModal} handleClose={handleCloseModal} />
        </div>
    );
};

export default Genders;
