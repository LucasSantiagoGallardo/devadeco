'use client';
import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, Card, CardContent, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import AccessHistory from './registros';

const Dashboard2 = () => {
  const [metrics, setMetrics] = useState({
    active_users: 0,
    total_providers: 0,
    active_keys: 0,
    inactive_keys: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Dashboard Metrics
  const fetchMetrics = async () => {
    try {
      const response = await fetch('http://localhost/adeco/api/get-dashboard-metrics.php');
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  // Fetch Recent Users
  const fetchRecentUsers = async () => {
    try {
      const response = await fetch('http://localhost/adeco/api/get-recent-users.php');
      const data = await response.json();
      setRecentUsers(data);
    } catch (error) {
      console.error('Error fetching recent users:', error);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchMetrics(), fetchRecentUsers()]).then(() => setLoading(false));
  }, []);

  // Datos para el gráfico circular
  const pieData = [
    { name: 'Activas', value: metrics.active_keys },
    { name: 'Inactivas', value: metrics.inactive_keys },
  ];

  const columns = [
    { field: 'Dni', headerName: 'DNI', width: 150 },
    { field: 'Name', headerName: 'Nombre', width: 150 },
    { field: 'Active', headerName: 'Activo', width: 100 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={3}>
        Panel de Control
      </Typography>

      <Grid container spacing={3}>
        {/* Resumen Rápido */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Usuarios Activos</Typography>
                  <Typography variant="h4">{metrics.active_users}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Proveedores</Typography>
                  <Typography variant="h4">{metrics.total_providers}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Llaves Activas</Typography>
                  <Typography variant="h4">{metrics.active_keys}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Llaves Caducadas</Typography>
                  <Typography variant="h4">{metrics.inactive_keys}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Gráfico Circular */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Estado de Llaves
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    label
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? '#82ca9d' : '#ff7979'}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Tabla de Usuarios */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Usuarios Recientes
              </Typography>
              <Box style={{ height: 300, width: '100%' }}>
                <DataGrid rows={recentUsers} columns={columns} pageSize={5} loading={loading} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Historial de Accesos */}
        <Grid item xs={12}>
          <AccessHistory />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard2;
