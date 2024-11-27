'use client';
import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Modal, TextField, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'Dni', headerName: 'DNI', width: 150 },
  { field: 'Name', headerName: 'Nombre', width: 150 },
  { field: 'Last_Name', headerName: 'Apellido', width: 150 },
  { field: 'Telefono', headerName: 'Teléfono', width: 150 },
  { field: 'Id_Key', headerName: 'Llave', width: 100 },
  { field: 'company_name', headerName: 'Empresa', width: 200 },
  { field: 'Active', headerName: 'Activo', width: 100 },
  {
    field: 'actions',
    headerName: 'Acciones',
    width: 150,
    renderCell: (params) => (
      <Box display="flex" gap={1}>
        <Button
          size="small"
          variant="outlined"
          onClick={() => params.row.onEdit(params.row)}
        >
          Editar
        </Button>
        <Button
          size="small"
          color="error"
          variant="outlined"
          onClick={() => params.row.onDelete(params.row.Dni)}
        >
          Eliminar
        </Button>
      </Box>
    ),
  },
];

const UserCRUD = () => {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [providers, setProviders] = useState([]); // Lista de empresas
  const [searchTerm, setSearchTerm] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const fetchRows = async () => {
    const response = await fetch('http://localhost/adeco/api/users.php');
    const data = await response.json();
    const processedData = data.map((row) => ({
      ...row,
      onEdit: handleEdit,
      onDelete: handleDelete,
    }));
    setRows(processedData);
    setFilteredRows(processedData);
  };

  const fetchProviders = async () => {
    const response = await fetch('http://localhost/adeco/api/get-providers.php');
    const data = await response.json();
    setProviders(data);
  };

  useEffect(() => {
    fetchRows();
    fetchProviders();
  }, []);

  const handleEdit = (row) => {
    setCurrentRow(row);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDelete = async (dni) => {
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;

    await fetch(`http://localhost/adeco/api/delete-user.php?dni=${dni}`, {
      method: 'DELETE',
    });
    fetchRows();
  };

  const handleSave = async () => {
    const url = isEditing
      ? 'http://localhost/adeco/api/update-user.php'
      : 'http://localhost/adeco/api/create-user.php';

    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentRow),
    });

    fetchRows();
    setOpen(false);
    setCurrentRow({});
    setIsEditing(false);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = rows.filter((row) =>
      (row.Dni?.toString() || '').toLowerCase().includes(value) ||
      (row.Name || '').toLowerCase().includes(value) ||
      (row.Last_Name || '').toLowerCase().includes(value) ||
      (row.Id_Key || '').toLowerCase().includes(value) ||
      (row.company_name || '').toLowerCase().includes(value)
    );

    setFilteredRows(filtered);
  };

  const toggleActiveFilter = () => {
    setShowActiveOnly(!showActiveOnly);
    if (!showActiveOnly) {
      setFilteredRows(rows.filter((row) => row.Active.toLowerCase() === 'yes' || row.Active.toLowerCase() === 'True' ));
    } else {
      setFilteredRows(rows);
    }
  };

  return (
    <Box>
      <Typography variant="h4" mb={2}>
        Gestión de Usuarios
      </Typography>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <TextField
          label="Buscar por DNI, Nombre, Apellido o Empresa"
          fullWidth
          value={searchTerm}
          onChange={handleSearch}
        />
        <Button variant="contained" color="secondary" onClick={toggleActiveFilter}>
          {showActiveOnly ? 'Mostrar Todos' : 'Mostrar Activos'}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setCurrentRow({});
            setIsEditing(false);
            setOpen(true);
          }}
        >
          Agregar Usuario
        </Button>
      </Box>
      <Box style={{ height: 400, width: '100%' }}>
        <DataGrid rows={filteredRows} columns={columns} pageSize={5} />
      </Box>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            width: '400px',
          }}
        >
          <Typography variant="h6" mb={2}>
            {isEditing ? 'Editar Usuario' : 'Agregar Usuario'}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="DNI"
                fullWidth
                value={currentRow.Dni || ''}
                onChange={(e) =>
                  setCurrentRow({ ...currentRow, Dni: e.target.value })
                }
                disabled={isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre"
                fullWidth
                value={currentRow.Name || ''}
                onChange={(e) =>
                  setCurrentRow({ ...currentRow, Name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Apellido"
                fullWidth
                value={currentRow.Last_Name || ''}
                onChange={(e) =>
                  setCurrentRow({ ...currentRow, Last_Name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Teléfono"
                fullWidth
                value={currentRow.Telefono || ''}
                onChange={(e) =>
                  setCurrentRow({ ...currentRow, Telefono: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="LLave"
                fullWidth
                value={currentRow.Id_Key || ''}
                onChange={(e) =>
                  setCurrentRow({ ...currentRow, Id_Key: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Empresa</InputLabel>
                <Select
                  value={currentRow.Id_Customer || ''}
                  onChange={(e) =>
                    setCurrentRow({ ...currentRow, Id_Customer: e.target.value })
                  }
                >
                  {providers.map((provider) => (
                    <MenuItem key={provider.id} value={provider.id}>
                      {provider.company_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{ mr: 2 }}
            >
              Guardar
            </Button>
            <Button variant="outlined" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default UserCRUD;
