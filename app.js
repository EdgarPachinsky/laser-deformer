const express = require('express')
const http = require('http')
const socket = require('socket.io')
const path = require('path');

const SerialConnection = require('./serial_ports.js');

const constants = require('./constant/vars.js')
const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const server = http.Server(app);
const io = new socket.Server(server, {cors: {origin: "http://91.103.29.205:3001"}});

io.on('connection', (socket) => {

    socket.on('get-ports', () => {
        console.log('GET_PORT_REQUEST')

        SerialConnection.getPortList().then((portList) => {
            io.emit('port-list', portList)
        }).catch((e) => {
            console.log(`Error occurred while emitting ports ${e.message}`)
        })
    })

    socket.on('select-port', async (data) => {
        console.log(`PORT -> ${data.port}`)
        try {
            SerialConnection.openPortConnection(data.port, io)
        } catch (e) {
            io.emit('data-income', {
                line: '#',
                message: e.message
            })
        }
    })
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'dashboard/index.html'));
});


app.listen(constants.PORT, constants.HOST, (err) => {

    if (!err) {

        console.log(`STARTING SERVER - OK - : ${constants.PORT}`);

        server.listen(constants.SOCKET_PORT, (err) => {
            if (!err) {
                console.log(`STARTING SOCKET SERVER - OK - : ${constants.SOCKET_PORT}`);
            } else {
                console.log(`STARTING SERVER - ERROR - ${err.message}`)
            }
        })
    } else {
        console.log(`STARTING SERVER - ERROR - : ${err}`);
    }
})

