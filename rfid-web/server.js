const express = require('express');
const Gpio = require('onoff').Gpio;
const i2c = require('i2c-bus');

const app = express();
const gpio14 = new Gpio(15, 'out'); // Configurar GPIO14 como salida
const DEVICE_ADDRESS = 0x20; // Dirección del Arduino
const i2cBus = i2c.openSync(1); // Usar bus I2C 1

// Middleware para parsear JSON
app.use(express.json());

// Ruta para obtener el UID del RC522
app.get('/uid', (req, res) => {
    try {
        const buffer = Buffer.alloc(4); // Leer 4 bytes
        i2cBus.i2cReadSync(DEVICE_ADDRESS, 4, buffer);
        const uid = buffer.toString('hex').toUpperCase();
        res.json({ uid });
    } catch (err) {
        res.status(500).json({ error: 'Error al leer el UID: ' + err.message });
    }
});

// Ruta para controlar el GPIO14
app.post('/gpio', (req, res) => {
    const action = req.body.action;
    if (action === 'on') {
        gpio14.writeSync(1); // Encender GPIO14
        res.json({ status: 'on' });
    } else if (action === 'off') {
        gpio14.writeSync(0); // Apagar GPIO14
        res.json({ status: 'off' });
    } else {
        res.status(400).json({ error: 'Acción inválida' });
    }
});

// Ruta para servir la interfaz web
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Servidor escuchando en el puerto 5000
app.listen(5000, () => {
    console.log('Servidor iniciado en http://localhost:5000');
});

// Manejo al salir para limpiar GPIO
process.on('SIGINT', () => {
    gpio14.unexport();
    process.exit();
});
