const SerialPort = require("serialport");
const openingPort = "COM1"

let port = new SerialPort(openingPort)

const sensors = 4
const pixels = 64
// let values = {}

setInterval(function (){

    let dataString = "#"

    for (let i = 0 ; i < sensors ; i ++){

        dataString += `${i}`
        // values[i] = []

        for (let j = 0; j < pixels; j++) {

            const pixelValue = getRandomIntInclusive(0, 255)
            // values[i].push(pixelValue)

            let pixelValueHex = pixelValue.toString(16)

            if(pixelValueHex.length < 2)
                pixelValueHex = `0${pixelValueHex}`

            dataString += `${j}${pixelValueHex}`
        }
    }


    console.log(`Writing data to ${openingPort} -> ${dataString}`)
    // console.log(`Int values -> `, values)
    port.write(dataString);
},1000)

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
