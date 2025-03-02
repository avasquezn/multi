import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Typography, Avatar } from '@mui/material';
import { IconArrowUpLeft, IconArrowDownRight } from '@tabler/icons-react';

import DashboardCard from '../../../components/shared/DashboardCard';
import { getEarningsByYear } from '../../../services/DashboardService';

const YearlyBreakup = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = '#ecf2ff';
  const successlight = theme.palette.success.light;
  const errorlight = '#fdede8';

  // Estados
  const [earnings, setEarnings] = useState([]);
  const [years, setYears] = useState([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [previousYear, setPreviousYear] = useState(new Date().getFullYear() - 1);
  const [currentEarnings, setCurrentEarnings] = useState(0);
  const [previousEarnings, setPreviousEarnings] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchYearlyEarnings = async () => {
      try {
        setIsLoading(true);
        const data = await getEarningsByYear();

        if (!data || data.length === 0) {
          setEarnings([]);
          setYears([]);
          return;
        }

        // Ordenar datos por año
        const sortedData = data.sort((a, b) => a.Anio - b.Anio);

        // Obtener los últimos dos años disponibles y convertir ganancias a número
        const lastTwoYears = sortedData.slice(-2);
        const lastTwoYearsEarnings = lastTwoYears.map(item => parseFloat(item.Total_Ganancias) || 0);
        const lastTwoYearsLabels = lastTwoYears.map(item => item.Anio.toString());

        // Actualizar estados
        setEarnings(lastTwoYearsEarnings);
        setYears(lastTwoYearsLabels);

        if (lastTwoYears.length > 0) {
          setCurrentYear(lastTwoYears[lastTwoYears.length - 1].Anio);
          setCurrentEarnings(parseFloat(lastTwoYears[lastTwoYears.length - 1].Total_Ganancias) || 0);
        }
        if (lastTwoYears.length > 1) {
          setPreviousYear(lastTwoYears[lastTwoYears.length - 2].Anio);
          setPreviousEarnings(parseFloat(lastTwoYears[lastTwoYears.length - 2].Total_Ganancias) || 0);
        }

        // Calcular cambio porcentual
        if (lastTwoYears.length > 1 && lastTwoYears[lastTwoYears.length - 2].Total_Ganancias > 0) {
          const change = ((parseFloat(lastTwoYears[lastTwoYears.length - 1].Total_Ganancias) - parseFloat(lastTwoYears[lastTwoYears.length - 2].Total_Ganancias)) /
            parseFloat(lastTwoYears[lastTwoYears.length - 2].Total_Ganancias)) * 100;
          setPercentageChange(change.toFixed(2));
        }
      }finally {
        setIsLoading(false);
      }
    };

    fetchYearlyEarnings();
  }, []);

  // Configuración del gráfico
  const optionscolumnchart = {
    chart: {
      type: 'donut',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 250,
    },
    labels: years.length > 0 ? years : ["Sin datos", "Sin datos"],
    colors: [primary, primarylight],
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
  };

  return (
    <DashboardCard title={`Ingresos de ${currentYear}`}>
      <Grid container spacing={3}>
        {/* Columna de datos */}
        <Grid item xs={7} sm={7}>
          <Typography variant="h3" fontWeight="700">
            ${parseFloat(currentEarnings).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Typography>
          <Stack direction="row" spacing={1} mt={1} alignItems="center">
            <Avatar sx={{ bgcolor: percentageChange >= 0 ? successlight : errorlight, width: 27, height: 27 }}>
              {percentageChange >= 0 ? (
                <IconArrowUpLeft width={20} color="#39B69A" />
              ) : (
                <IconArrowDownRight width={20} color="#FA896B" />
              )}
            </Avatar>
            <Typography variant="subtitle2" fontWeight="600" color={percentageChange >= 0 ? "#39B69A" : "#FA896B"}>
              {previousEarnings === 0 ? `0%` : `${percentageChange > 0 ? `+${percentageChange}%` : `${percentageChange}%`}`}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              Comparado con {previousYear}
            </Typography>
          </Stack>
          <Stack spacing={3} mt={5} direction="row">
            {years.map((year, index) => (
              <Stack key={year} direction="row" spacing={1} alignItems="center">
                <Avatar sx={{ width: 9, height: 9, bgcolor: index === 0 ? primary : primarylight }}></Avatar>
                <Typography variant="subtitle2" color="textSecondary">
                  {year}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Grid>
        {/* Columna de gráfico */}
        <Grid item xs={5} sm={5}>
          {isLoading ? (
            <Typography variant="subtitle2" color="textSecondary" textAlign="center">
              Cargando datos...
            </Typography>
          ) : earnings.length > 0 ? (
            <Chart 
              options={optionscolumnchart} 
              series={earnings} 
              type="donut" 
              height="250px" 
            />
          ) : (
            <Typography variant="subtitle2" color="textSecondary" textAlign="center">
              No hay datos disponibles
            </Typography>
          )}
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default YearlyBreakup;
