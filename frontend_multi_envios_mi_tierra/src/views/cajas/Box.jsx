import React, { useState, useEffect } from 'react';
import { useAuth } from '../../actions/authContext';
import BoxesTable from './components/BoxesTable'; // Tabla para mostrar cajas
import InsertBox from './components/Actions/InsertBox'; // Modal para insertar cajas
import NoPermissionAlert from '../../utils/NoPermissionAlert'; // Alerta de falta de permisos
import '../../styles/h1.css'; // Estilo para el encabezado

const Boxes = () => {
    const [showModal, setShowModal] = useState(false);
    const { user } = useAuth();
    const rolPermission = user?.permisos?.find(permiso => permiso.objectName === 'Cajas');

    useEffect(() => {}, [user, rolPermission]);

    const handleCloseModal = () => setShowModal(false);

    // Verificación de permiso para visualizar
    if (rolPermission?.canView === 0) {
        return <NoPermissionAlert />;
    }

    return (
        <div className="container">
            <h1>Gestión de Cajas</h1>
            <BoxesTable />
            <InsertBox show={showModal} handleClose={handleCloseModal} />
        </div>
    );
};

export default Boxes;
