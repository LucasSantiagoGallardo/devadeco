const express = require('express');
const { Gpio } = require('pigpio'); // Si estás usando pigpio
const app = express();
const path = require('path');
const i2c = require('i2c-bus'); // Importar el módulo i2c-bus

const DEVICE_ADDRESS = 0x20; // Dirección del Arduino en el bus I2C
const i2cBus = i2c.openSync(1); // Usar bus I2C 1


// Configuración del GPIO (puedes ajustar según tu lógica)
const gpio14 = new Gpio(14, { mode: Gpio.OUTPUT });

// Middleware para manejar JSON
app.use(express.json());

// Ruta para servir el archivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/uid', (req, res) => {
    try {
        const buffer = Buffer.alloc(4); // Leer 4 bytes
        i2cBus.i2cReadSync(DEVICE_ADDRESS, 4, buffer);
        const uid = buffer.toString('hex').toUpperCase();
        res.json({ uid }); // Responder con JSON
    } catch (err) {
        res.status(500).json({ error: 'Error al leer el UID: ' + err.message });
    }
});


// Ruta para controlar el GPIO
app.post('/gpio', (req, res) => {
    const action = req.body.action;
    if (action === 'on') {
        gpio14.digitalWrite(1); // Encender GPIO14
        res.json({ status: 'on' });
    } else if (action === 'off') {
        gpio14.digitalWrite(0); // Apagar GPIO14
        res.json({ status: 'off' });
    } else {
        res.status(400).json({ error: 'Acción inválida' });
    }
});

// Iniciar el servidor
app.listen(5000, () => {
    console.log('Servidor iniciado en http://localhost:5000');
});

// Limpiar GPIO al salir
process.on('SIGINT', () => {
    gpio14.digitalWrite(0); // Apagar GPIO antes de salir
    process.exit();
});
