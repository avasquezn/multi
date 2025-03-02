import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar, Fab } from '@mui/material';
import { IconArrowDownRight, IconCurrencyDollar, IconArrowUpLeft } from '@tabler/icons-react';
import DashboardCard from '../../../components/shared/DashboardCard';
import { getEarningsByMonthYear } from '../../../services/DashboardService';

const MonthlyEarnings = () => {
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;
  const secondarylight = '#f5fcff';
  const errorlight = '#fdede8';
  const successlight = theme.palette.success.light;

  // Estados
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);
  const [earningsTrend, setEarningsTrend] = useState([]);
  const [percentageChange, setPercentageChange] = useState(0);
  const [previousMonthEarnings, setPreviousMonthEarnings] = useState(0);
  const [currentMonthName, setCurrentMonthName] = useState('');
  const [previousMonthName, setPreviousMonthName] = useState('');

  // Función para convertir número de mes a nombre
  const getMonthName = (monthNumber) => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[monthNumber - 1] || 'Desconocido';
  };

  useEffect(() => {
    const fetchMonthlyEarnings = async () => {
      try {
        const data = await getEarningsByMonthYear();

        // Agrupar ingresos por año y mes
        const groupedData = {};
        data.forEach(item => {
          const key = `${item.Anio}-${item.Mes}`;
          if (!groupedData[key]) {
            groupedData[key] = 0;
          }
          groupedData[key] += item.Total_Ganancias;
        });

        // Convertir a array ordenado por año y mes
        const sortedData = Object.entries(groupedData)
          .map(([key, total]) => {
            const [year, month] = key.split('-').map(Number);
            return { Anio: year, Mes: month, Total: total };
          })
          .sort((a, b) => (a.Anio === b.Anio ? a.Mes - b.Mes : a.Anio - b.Anio));

        // Obtener el mes y el año actuales
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
        const previousMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

        // Encontrar ingresos del mes actual y del mes anterior
        const currentMonthData = sortedData.find(item => item.Anio === currentYear && item.Mes === currentMonth);
        const previousMonthData = sortedData.find(item => item.Anio === previousMonthYear && item.Mes === previousMonth);

        const totalCurrentMonth = currentMonthData ? currentMonthData.Total : 0;
        const totalPreviousMonth = previousMonthData ? previousMonthData.Total : 0;

        setMonthlyEarnings(totalCurrentMonth);
        setPreviousMonthEarnings(totalPreviousMonth);

        // Guardar nombres de los meses
        setCurrentMonthName(getMonthName(currentMonth));
        setPreviousMonthName(getMonthName(previousMonth));

        // Calcular porcentaje de cambio
        let percentage = 0;
        if (totalPreviousMonth > 0) {
          percentage = ((totalCurrentMonth - totalPreviousMonth) / totalPreviousMonth) * 100;
        }
        setPercentageChange(percentage.toFixed(2));

        // Obtener los últimos 7 meses para el gráfico de tendencia
        const trendData = sortedData.slice(-7).map(item => item.Total);
        setEarningsTrend(trendData);

      } catch (error) {
        console.error('Error fetching monthly earnings:', error.message);
      }
    };

    fetchMonthlyEarnings();
  }, []);

  // Configuración del gráfico
  const optionscolumnchart = {
    chart: {
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 60,
      sparkline: {
        enabled: true,
      },
      group: 'sparklines',
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      colors: [secondarylight],
      type: 'solid',
      opacity: 0.05,
    },
    markers: {
      size: 0,
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      y: {
        formatter: (value) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, // Formato con "$" y 2 decimales
      },
    },
  };

  const seriescolumnchart = [
    {
      name: 'Ingresos',
      color: secondary,
      data: earningsTrend,
    },
  ];

  return (
    <DashboardCard
      title={`Ingresos de ${currentMonthName}`}
      action={
        <Fab color="secondary" size="medium" sx={{ color: '#ffffff' }}>
          <IconCurrencyDollar width={24} />
        </Fab>
      }
      footer={
        <Chart options={optionscolumnchart} series={seriescolumnchart} type="area" height="60px" />
      }
    >
      <>
        <Typography variant="h3" fontWeight="700" mt="-20px">
          ${parseFloat(monthlyEarnings).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Typography>
        <Stack direction="row" spacing={1} my={1} alignItems="center">
          <Avatar sx={{ 
            bgcolor: percentageChange >= 0 ? successlight : errorlight, 
            width: 27, 
            height: 27 
          }}>
            {percentageChange >= 0 ? (
              <IconArrowUpLeft width={20} color="#4caf50" />
            ) : (
              <IconArrowDownRight width={20} color="#FA896B" />
            )}
          </Avatar>
          <Typography variant="subtitle2" fontWeight="600" color={percentageChange < 0 ? "#FA896B" : "#4caf50"}>
            {previousMonthEarnings === 0 ? `0%` : `${percentageChange > 0 ? `+${percentageChange}%` : `${percentageChange}%`}`}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            Comparado con {previousMonthName}
          </Typography>
        </Stack>
      </>
    </DashboardCard>
  );
};

export default MonthlyEarnings;
