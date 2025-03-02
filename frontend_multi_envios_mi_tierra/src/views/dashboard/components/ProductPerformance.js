import React, { useEffect, useState } from 'react';
import {
    Typography, Box, Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Chip,
    CircularProgress
} from '@mui/material';
import DashboardCard from '../../../components/shared/DashboardCard';
import { getCajasConInfo } from '../../../services/DashboardService';

const ITEMS_PER_PAGE = 4; // Cantidad de cajas por página

const ProductPerformance = () => {
    const [cajas, setCajas] = useState([]);
    const [visibleCajas, setVisibleCajas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchCajas = async () => {
            try {
                const data = await getCajasConInfo();
                setCajas(data);
                setVisibleCajas(data.slice(0, ITEMS_PER_PAGE)); // Mostrar las primeras 4 cajas
            } catch (err) {
                setError(err.message || 'Error al obtener las cajas.');
            } finally {
                setLoading(false);
            }
        };

        fetchCajas();
    }, []);

    const handleShowMore = () => {
        const nextPage = currentPage + 1;
        const startIndex = nextPage * ITEMS_PER_PAGE - ITEMS_PER_PAGE;
        const newVisibleCajas = cajas.slice(0, startIndex + ITEMS_PER_PAGE);

        setVisibleCajas(newVisibleCajas);
        setCurrentPage(nextPage);
    };

    return (
        <DashboardCard title="Listado de Cajas">
            <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error" textAlign="center">{error}</Typography>
                ) : (
                    <>
                        <Table
                            aria-label="tabla de cajas"
                            sx={{
                                whiteSpace: "nowrap",
                                mt: 2
                            }}
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight={600}>
                                            Id Caja
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight={600}>
                                            ID Caja
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight={600}>
                                            Detalle
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight={600}>
                                            País
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight={600}>
                                            Precio
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {visibleCajas.map((caja) => (
                                    <TableRow key={caja.COD_CAJA}>
                                        <TableCell>
                                            <Typography sx={{ fontSize: "15px", fontWeight: "500" }}>
                                                {caja.COD_CAJA}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="subtitle2" fontWeight={600}>
                                                {caja.ID_CAJA}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                                                {caja.DETALLE}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                sx={{
                                                    px: "4px",
                                                    backgroundColor: "primary.main",
                                                    color: "#fff",
                                                }}
                                                size="small"
                                                label={caja.NOM_PAIS}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="h6">${caja.PRECIO}</Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Box textAlign="center" mt={2}>
                            {visibleCajas.length < cajas.length && (
                                <Button variant="contained" color="primary" onClick={handleShowMore}>
                                    Mostrar más
                                </Button>
                            )}
                        </Box>
                    </>
                )}
            </Box>
        </DashboardCard>
    );
};

export default ProductPerformance;
