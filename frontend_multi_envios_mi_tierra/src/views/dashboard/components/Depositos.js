import React, { useState, useEffect } from 'react';
import { Box, Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '../../../components/shared/DashboardCard';
import Chart from 'react-apexcharts';
import { getDepositos } from '../../../services/DashboardService';

// Función de ayuda para agrupar los depósitos según el tipo de vista
const aggregateDeposits = (data, viewType) => {
  const aggregated = {};
  data.forEach(item => {
    // Se asume que FEC_CREACION viene en un formato de fecha válido
    const date = new Date(item.FEC_CREACION);
    let key = '';
    if (viewType === 'day') {
      key = date.toLocaleDateString(); // Ejemplo: "1/28/2025" (dependerá de la configuración regional)
    } else if (viewType === 'month') {
      // Formato: "MM/YYYY"
      key = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    } else if (viewType === 'year') {
      key = date.getFullYear().toString();
    }
    if (!aggregated[key]) {
      aggregated[key] = 0;
    }
    aggregated[key] += parseFloat(item.DEPOSITO);
  });

  // Ordenar las claves cronológicamente
  const sortedKeys = Object.keys(aggregated).sort((a, b) => {
    if (viewType === 'day') {
      return new Date(a) - new Date(b);
    } else if (viewType === 'month') {
      const [monthA, yearA] = a.split('/').map(Number);
      const [monthB, yearB] = b.split('/').map(Number);
      return new Date(yearA, monthA - 1) - new Date(yearB, monthB - 1);
    } else if (viewType === 'year') {
      return Number(a) - Number(b);
    }
    return 0;
  });

  const categories = sortedKeys;
  const series = sortedKeys.map(key => aggregated[key]);

  return { categories, series };
};

const Depositos = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  const [deposits, setDeposits] = useState([]);
  const [viewType, setViewType] = useState('day');
  const [categories, setCategories] = useState([]);
  const [series, setSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Obtener los depósitos desde el backend
  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        setIsLoading(true);
        const data = await getDepositos();
        setDeposits(data);
      } catch (error) {
        console.error('Error fetching deposits:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDeposits();
  }, []);

  // Agregar los depósitos según la vista seleccionada
  useEffect(() => {
    if (deposits.length > 0) {
      const { categories, series } = aggregateDeposits(deposits, viewType);
      setCategories(categories);
      setSeries(series);
    }
  }, [deposits, viewType]);

  const handleViewChange = (event) => {
    setViewType(event.target.value);
  };

  const chartOptions = {
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
        formatter: (value) => `$${value}`,
      },
    },
    xaxis: {
      categories: categories,
      axisBorder: {
        show: false,
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
      y: {
        formatter: (value) =>
          `$${value.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
      },
    },
  };

  const chartSeries = [
    {
      name: 'Depósitos',
      data: series,
    },
  ];

  return (
    <DashboardCard
      title="Depósitos"
      action={
        <FormControl variant="outlined" size="small">
          <InputLabel id="view-type-label">Vista</InputLabel>
          <Select
            labelId="view-type-label"
            id="view-type"
            value={viewType}
            onChange={handleViewChange}
            label="Vista"
          >
            <MenuItem value="day">Día</MenuItem>
            <MenuItem value="month">Mes</MenuItem>
            <MenuItem value="year">Año</MenuItem>
          </Select>
        </FormControl>
      }
    >
      {isLoading ? (
        <Typography variant="subtitle2" textAlign="center">
          Cargando datos...
        </Typography>
      ) : categories.length > 0 ? (
        <Chart options={chartOptions} series={chartSeries} type="bar" height="300px" />
      ) : (
        <Typography variant="subtitle2" textAlign="center">
          No hay datos disponibles
        </Typography>
      )}
    </DashboardCard>
  );
};

export default Depositos;
