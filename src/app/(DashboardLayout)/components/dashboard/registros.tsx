'use client';
import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const AccessHistory = () => {
  const [accessData, setAccessData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost/adeco/api/get-access-hist.php');
        const data = await response.json();
        setAccessData(data);
      } catch (error) {
        console.error('Error fetching access history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Separar los datos por barrera y tipo de movimiento
  const barrier1Data = accessData.filter(
    (row) => row.ID_Access_Point === '1' || row.ID_Access_Point === '2'
  );
  const barrier2Data = accessData.filter(
    (row) => row.ID_Access_Point === '3' || row.ID_Access_Point === '4'
  );

  // Configuración de columnas
  const columns: GridColDef[] = [
    { field: 'Event_Date', headerName: 'Fecha y Hora', width: 200 },
    { field: 'Name', headerName: 'Nombre', width: 150 },
    { field: 'Last_Name', headerName: 'Apellido', width: 150 },
    {
      field: 'Type_Mov',
      headerName: 'Movimiento',
      width: 150,
      renderCell: (params) =>
        params.row.Type_Mov === 'IN' ? (
          <Box display="flex" alignItems="center" color="green">
            <ArrowUpwardIcon />
            <Typography ml={1}>Entrada</Typography>
          </Box>
        ) : (
          <Box display="flex" alignItems="center" color="red">
            <ArrowDownwardIcon />
            <Typography ml={1}>Salida</Typography>
          </Box>
        ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={3}>
        Historial de Accesos
      </Typography>
      <Grid container spacing={3}>
        {/* Barrera 1 */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" mb={2}>
            Barrera 1
          </Typography>
          <Box style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={barrier1Data.map((row, index) => ({ id: index, ...row }))}
              columns={columns}
              pageSize={5}
              loading={loading}
            />
          </Box>
        </Grid>

        {/* Barrera 2 */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" mb={2}>
            Barrera 2
          </Typography>
          <Box style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={barrier2Data.map((row, index) => ({ id: index, ...row }))}
              columns={columns}
              pageSize={5}
              loading={loading}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AccessHistory;
