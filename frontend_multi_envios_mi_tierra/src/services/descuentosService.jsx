import api from '../utils/Fetch';

// Obtener todos los tipos de descuento
export const getDiscountTypes = async () => {
    try {
        const response = await api.get('descuentos/tipos-descuento');
        return response.data;
    } catch (error) {
        console.error('Error al obtener los tipos de descuento:', error);
        throw error;
    }
};

// Obtener todos los descuentos
export const getDiscounts = async () => {
    try {
        const response = await api.get('/descuentos/descuentos');
        return response.data;
    } catch (error) {
        console.error('Error al obtener los descuentos:', error);
        throw error;
    }
};

// Insertar un nuevo tipo de descuento
export const insertDiscountType = async (discountTypeData) => {
    try {
        const response = await api.post('/descuentos/tipo-descuento/insert', discountTypeData);
        return response.data?.message || 'Tipo de descuento insertado correctamente';
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error al insertar el tipo de descuento';
        console.error('Error al insertar el tipo de descuento:', errorMessage);
        throw new Error(errorMessage);
    }
};

// Insertar un nuevo descuento
export const insertDiscount = async (discountData) => {
    try {
        const response = await api.post('/descuentos/descuento/insert', discountData);
        return response.data?.message || 'Descuento insertado correctamente';
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error al insertar el descuento';
        console.error('Error al insertar el descuento:', errorMessage);
        throw new Error(errorMessage);
    }
};

// Actualizar un tipo de descuento existente
export const updateDiscountType = async (discountTypeData) => {
    try {
        const response = await api.post('/descuentos/tipo-descuento/update', discountTypeData);
        return response.data?.message || 'Tipo de descuento actualizado correctamente';
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error al actualizar el tipo de descuento';
        console.error('Error al actualizar el tipo de descuento:', errorMessage);
        throw new Error(errorMessage);
    }
};

// Actualizar un descuento existente
export const updateDiscount = async (discountData) => {
    try {
        const response = await api.post('/descuentos/descuento/update', discountData);
        return response.data?.message || 'Descuento actualizado correctamente';
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error al actualizar el descuento';
        console.error('Error al actualizar el descuento:', errorMessage);
        throw new Error(errorMessage);
    }
};
