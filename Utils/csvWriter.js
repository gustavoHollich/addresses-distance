const fs = require('fs');

function saveMapToCSV(map, filePath, header, flow) {
    let csvContent = header;
    let distance, address,number, suburb, postCode, city, country, addressLat, addressLon;
    let position = 1
    if(flow === 'success') {
        for (let [key, value] of map.entries()) {
            distance = value.distance;
            address = replacePlusWithSpaces(value.address);
            number = value.number;
            suburb = value.resSub;
            postCode = value.postCode;
            city = value.city;
            country = value.country;
            addressLat = value.lat;
            addressLon = value.lon;
            csvContent += `${position},${key},${distance},${address} ${number},${suburb},${postCode},${city},${country},${addressLat},${addressLon}\n`;
            position++;
        }
        fs.writeFile(filePath, csvContent, (err) => {
            if (err) throw err;
            console.log("Process completed successfully for", map.size,"records, CSV file saved on", filePath);
        });
    } else if(flow === 'error') {
        for (let [key, value] of map.entries()) {
            address = replacePlusWithSpaces(value.address);
            number = value.number;
            city = value.city;
            country = value.country;
            csvContent += `${position},${key},${address} ${number},${city},${country}\n`;
            position++;
        }
        fs.writeFile(filePath, csvContent, (err) => {
            if (err) throw err;
            console.error("\nProcess throw errors for",map.size, "records, these rows could be checked on", filePath)
        });
    } else {
        throw new Error('csv writer flow not defined, check the parser flow');
    }

}
function replacePlusWithSpaces(inputString) {
    if(!inputString || inputString === '') return inputString;
    return inputString.replace('+',' ');
}

module.exports = {
    saveMapToCSV
};
