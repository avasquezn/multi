import React, { useState, useEffect } from 'react';
import { Select, MenuItem, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '../../../components/shared/DashboardCard';
import Chart from 'react-apexcharts';
import { getEarningsByDayMonthYear } from '../../../services/DashboardService';

const SalesOverview = () => {
    // Estados
    const [month, setMonth] = useState(null);
    const [year, setYear] = useState(null);
    const [earningsData, setEarningsData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [availableMonths, setAvailableMonths] = useState([]);
    const [availableYears, setAvailableYears] = useState([]);

    // Manejar cambios en los selects
    const handleMonthChange = (event) => {
        setMonth(event.target.value);
    };

    const handleYearChange = (event) => {
        setYear(event.target.value);
    };

    // chart color
    const theme = useTheme();
    const primary = theme.palette.primary.main;

    // chart options
    const optionscolumnchart = {
        chart: {
            type: 'bar',
            fontFamily: "'Plus Jakarta Sans', sans-serif;",
            foreColor: '#adb0bb',
            toolbar: {
                show: false,
            },
            height: 370,
        },
        colors: [primary],
        plotOptions: {
            bar: {
                horizontal: false,
                barHeight: '60%',
                columnWidth: '42%',
                borderRadius: [6],
                borderRadiusApplication: 'end',
                borderRadiusWhenStacked: 'all',
            },
        },
        stroke: {
            show: true,
            width: 5,
            lineCap: "butt",
            colors: ["transparent"],
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        grid: {
            borderColor: 'rgba(0,0,0,0.1)',
            strokeDashArray: 3,
            xaxis: {
                lines: {
                    show: false,
                },
            },
        },
        yaxis: {
            tickAmount: 4,
            labels: {
                formatter: (value) => `$${value}`, // Concatenar el "$" en el eje Y
            },
        },
        xaxis: {
            categories: categories, // Días del mes
            axisBorder: {
                show: false,
            },
        },
        tooltip: {
            theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
            fillSeriesColor: false,
            y: {
                formatter: (value) => `$${value}`, // Concatenar el "$" en el tooltip
            },
        },
    };

    // Series dinámicas basadas en las ganancias
    const seriescolumnchart = [
        {
            name: 'Ganancias de este mes',
            data: earningsData, // Datos de ganancias con "$"
        },
    ];

    // Obtener datos del procedimiento
    useEffect(() => {
        const fetchEarnings = async () => {
            try {
                const data = await getEarningsByDayMonthYear();
                const sortedData = [...data].sort((a, b) => a.Anio === b.Anio ? a.Mes - b.Mes : a.Anio - b.Anio);

                const uniqueYears = [...new Set(sortedData.map((item) => item.Anio))];
                const uniqueMonths = [...new Set(sortedData.map((item) => item.Mes))].sort((a, b) => a - b); // Ordenar meses

                setAvailableYears(uniqueYears);
                setAvailableMonths(uniqueMonths);

                const lastItem = sortedData[sortedData.length - 1];
                setYear(lastItem?.Anio || uniqueYears[0]);
                setMonth(lastItem?.Mes || uniqueMonths[0]);

                const filteredData = sortedData.filter(item => item.Mes === lastItem.Mes && item.Anio === lastItem.Anio);
                const newCategories = filteredData.map((item) => `${item.Dia}/${item.Mes}`);
                const newEarningsData = filteredData.map((item) => item.Total_Ganancias);

                setCategories(newCategories);
                setEarningsData(newEarningsData);
            } catch (error) {
                console.error('Error al obtener las ganancias:', error.message);
            }
        };

        fetchEarnings();
    }, []);

    // Actualizar los datos cuando cambien el mes o el año
    useEffect(() => {
        const fetchEarningsBySelection = async () => {
            try {
                const data = await getEarningsByDayMonthYear();
                const filteredData = data.filter((item) => item.Mes === month && item.Anio === year);
                const newCategories = filteredData.map((item) => `${item.Dia}/${item.Mes}`);
                const newEarningsData = filteredData.map((item) => item.Total_Ganancias);

                setCategories(newCategories);
                setEarningsData(newEarningsData);
            } catch (error) {
                console.error('Error al obtener las ganancias por selección:', error.message);
            }
        };

        if (month && year) fetchEarningsBySelection();
    }, [month, year]);

    return (
        <DashboardCard
            title="Ingresos"
            action={
                <Box display="flex" gap={1}>
                    <Select labelId="month-dd" id="month-dd" value={month} size="small" onChange={handleMonthChange}>
                        {availableMonths.map((m) => (
                            <MenuItem key={m} value={m}>
                                {new Date(2000, m - 1).toLocaleString('default', { month: 'long' })}
                            </MenuItem>
                        ))}
                    </Select>
                    <Select
                        labelId="year-dd"
                        id="year-dd"
                        value={year}
                        size="small"
                        onChange={handleYearChange}
                    >
                        {availableYears.map((y) => (
                            <MenuItem key={y} value={y}>
                                {y}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
            }
        >
            <Chart
                options={optionscolumnchart}
                series={seriescolumnchart}
                type="bar"
                height="370px"
            />
        </DashboardCard>
    );
};

export default SalesOverview;
