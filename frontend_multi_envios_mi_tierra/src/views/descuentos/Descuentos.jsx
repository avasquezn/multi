import React, { useState, useEffect } from 'react';
import { useAuth } from '../../actions/authContext';
import DiscountsTable from './components/DescuentosTable'; // Tabla para mostrar descuentos
import InsertDiscount from './components/Actions/InsertDescuentos'; // Modal para insertar descuento
import NoPermissionAlert from '../../utils/NoPermissionAlert'; // Alerta de falta de permisos
import '../../styles/h1.css'; // Estilo para el encabezado

const Discounts = () => {
    const [showModal, setShowModal] = useState(false);
    const { user } = useAuth();
    const rolPermission = user?.permisos?.find(permiso => permiso.objectName === 'Descuentos');

    useEffect(() => {}, [user, rolPermission]);

    const handleCloseModal = () => setShowModal(false);

    // Verificación de permiso para visualizar
    if (rolPermission?.canView === 0) {
        return <NoPermissionAlert />;
    }

    return (
        <div className="container">
            <h1>Gestión de descuentos</h1>
            <DiscountsTable />
            <InsertDiscount show={showModal} handleClose={handleCloseModal} />
        </div>
    );
};

export default Discounts;
