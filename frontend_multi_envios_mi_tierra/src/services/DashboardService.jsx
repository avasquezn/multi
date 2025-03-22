import api from '../utils/Fetch';

// Obtener ganancias por día, mes y año
export const getEarningsByDayMonthYear = async () => {
    try {
        const response = await api.get('/dashboard/earnings');
        return response.data?.data || [];
    } catch (error) {
        console.error('Error al obtener las ganancias:', error);
        throw new Error(error.response?.data?.message || 'Error al obtener las ganancias.');
    }
};

export const getEarningsByMonthYear = async () => {
    try {
        const response = await api.get('/dashboard/earnings/month');
        return response.data?.data || [];
    } catch (error) {
        console.error('Error al obtener las ganancias:', error);
        throw new Error(error.response?.data?.message || 'Error al obtener las ganancias.');
    }
};

export const getEarningsByYear = async () => {
    try {
        const response = await api.get('/dashboard/earnings/year');
        return response.data?.data || [];
    } catch (error) {
        console.error('Error al obtener las ganancias:', error);
        throw new Error(error.response?.data?.message || 'Error al obtener las ganancias.');
    }
};

export const getLast6Clients = async () => {
    try {
        const response = await api.get('/dashboard/lastes/clientes');
        return response.data?.data || [];
    } catch (error) {
        console.error('Error al obtener los últimos 6 clientes:', error);
        throw new Error(error.response?.data?.message || 'Error al obtener los últimos 6 clientes.');
    }
};

export const getCajasConInfo = async () => {
    try {
        const response = await api.get('/dashboard/all/cajas');
        return response.data?.data || [];
    } catch (error) {
        console.error('Error al obtener las cajas:', error);
        throw new Error(error.response?.data?.message || 'Error al obtener las cajas.');
    }
};

export const getDepositos = async () => {
    try {
        const response = await api.get('/dashboard/depositos');
        return response.data?.data || [];
    } catch (error) {
        console.error('Error al obtener los depósitos:', error);
        throw new Error(error.response?.data?.message || 'Error al obtener los depósitos.');
    }
};