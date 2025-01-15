import React, { useState, useEffect } from 'react';
import { useAuth } from '../../actions/authContext';
import DiscountTypesTable from './components/TipoDescuentoTable'; // Tabla para mostrar tipos de descuento
import InsertDiscountType from './components/Actions/InsertTipoDescuento'; // Modal para insertar tipo de descuento
import NoPermissionAlert from '../../utils/NoPermissionAlert'; // Alerta de falta de permisos
import '../../styles/h1.css'; // Estilo para el encabezado

const DiscountTypes = () => {
    const [showModal, setShowModal] = useState(false);
    const { user } = useAuth();
    const rolPermission = user?.permisos?.find(permiso => permiso.objectName === 'Tipo de descuentos');

    useEffect(() => {}, [user, rolPermission]);

    const handleCloseModal = () => setShowModal(false);

    // Verificación de permiso para visualizar
    if (rolPermission?.canView === 0) {
        return <NoPermissionAlert />;
    }

    return (
        <div className="container">
            <h1>Gestión de tipos de descuento</h1>
            <DiscountTypesTable />
            <InsertDiscountType show={showModal} handleClose={handleCloseModal} />
        </div>
    );
};

export default DiscountTypes;
