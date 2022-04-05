const SerialPort = require('serialport')

function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    let max = arr[0];
    let maxIndex = 0;

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}

module.exports = {

    getPortList() {
        return SerialPort.list().then((ports) => {
            let paths = []
            for (const port of ports)
                paths.push(port.path)

            return paths
        }).catch((e)=>{
            console.log(`Error occurred while getting ports ${e.message}`)
        })
    },

    openPortConnection(portId, io) {

        let port = new SerialPort(portId, {
            baudRate: 9600
        })
        console.log(`OPENED CONNECTION -> ${port}`)

        port.on('data', (line) => {

            line = line.toString()

            io.emit('data-income',{
                // length: arrayLength,
                // maxItemIndex: indexOfMaxItem,
                // maxItem: maxItem,
                // allValuesInt: intArray,
                line: line,
            })
        })
    }
}