const fs = require('fs');

function saveSortedMapToCSV(sortedMap, outputFilePath) {
    let csvContent = "Position,Name,Distance in Kilometers,Address,Suburb,PostCode,City,Country,AddressLat,AddressLon\n"; // start CSV string with headers
    let distance, address,number, suburb, postCode, city, country, addressLat, addressLon;
    let position = 1
    for (let [key, value] of sortedMap.entries()) {
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

    fs.writeFile(outputFilePath, csvContent, (err) => {
        if (err) throw err;
        console.log("Process completed successfully for", sortedMap.size,"records, CSV file saved on", outputFilePath);
    });
}
function replacePlusWithSpaces(inputString) {
    if(!inputString || inputString === '') return inputString;
    return inputString.replace('+',' ');
}

module.exports = {
    saveSortedMapToCSV
};
