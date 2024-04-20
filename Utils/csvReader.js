const csv = require('csv-parser');
const fs = require('fs');

async function readCSVToMap(filePath) {
    const map = new Map();
    const regexPattern = /(.*\D)(\d+)/;

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                let city = row.City;
                let country = row.Country;
                const matches = row.Address.match(regexPattern);
                if (matches) {
                    const address = replaceSpacesWithPlus(matches[1].trim());
                    const number = matches[2];
                    city = replaceSpacesWithPlus(city)
                    country = replaceSpacesWithPlus(country)
                    map.set(row['Name'], {address, number, city , country})
                }else {
                    map.set(row['Name'], "Not possible read their address.");
                }
            })
            .on('end', () => {
                resolve(map);
            })
            .on('error', reject);
    });
}

//Method to replace spaces with plus
function replaceSpacesWithPlus(inputString) {
    if(!inputString || inputString === '') return inputString;
    return inputString.replace(/ /g, '+');
}

module.exports = {
    readCSVToMap
};