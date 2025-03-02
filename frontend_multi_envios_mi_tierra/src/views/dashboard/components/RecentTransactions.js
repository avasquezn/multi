import React, { useEffect, useState } from 'react';
import DashboardCard from '../../../components/shared/DashboardCard';
import {
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  timelineOppositeContentClasses,
} from '@mui/lab';
import { Link, Typography, CircularProgress, Box } from '@mui/material';
import { getLast6Clients } from '../../../services/DashboardService';

const RecentTransactions = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getLast6Clients();
        setClients(data);
      } catch (err) {
        setError('Error al cargar los clientes.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  return (
    <DashboardCard title="Ultimo Clientes">
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" p={3}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" textAlign="center">{error}</Typography>
      ) : (
        <Timeline
          className="theme-timeline"
          sx={{
            p: 0,
            mb: '-40px',
            '& .MuiTimelineConnector-root': {
              width: '1px',
              backgroundColor: '#efefef',
            },
            [`& .${timelineOppositeContentClasses.root}`]: {
              flex: 0.5,
              paddingLeft: 0,
            },
          }}
        >
          {clients.map((client, index) => (
            <TimelineItem key={client.COD_CLIENTE || index}>
              <TimelineOppositeContent>
                {new Date(client.FEC_CREACION).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color="primary" variant="outlined" />
                {index !== clients.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Typography fontWeight="600">{client.NOM_PERSONA}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Registrado el {new Date(client.FEC_CREACION).toLocaleDateString()}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      )}
    </DashboardCard>
  );
};

export default RecentTransactions;
