import React, { useState, useEffect } from 'react';
import { useAuth } from '../../actions/authContext';
import PricesTable from './components/PricesTable'; // Tabla para mostrar precios
import InsertPrice from './components/Actions/InsertPrice'; // Modal para insertar precios
import NoPermissionAlert from '../../utils/NoPermissionAlert'; // Alerta de falta de permisos
import '../../styles/h1.css'; // Estilo para el encabezado

const Prices = () => {
    const [showModal, setShowModal] = useState(false);
    const { user } = useAuth();
    const rolPermission = user?.permisos?.find(permiso => permiso.objectName === 'Precios');

    useEffect(() => {}, [user, rolPermission]);

    const handleCloseModal = () => setShowModal(false);

    // Verificación de permiso para visualizar
    if (rolPermission?.canView === 0) {
        return <NoPermissionAlert />;
    }

    return (
        <div className="container">
            <h1>Gestión de precios</h1>
            <PricesTable />
            <InsertPrice show={showModal} handleClose={handleCloseModal} />
        </div>
    );
};

export default Prices;
