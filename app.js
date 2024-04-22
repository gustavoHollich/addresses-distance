const readCSVToMap = require('./Utils/csvReader').readCSVToMap;
const getLatLonFromAddress = require('./Utils/addressParser').getLatLonFromAddress;
const getDistanceFromLatLonInKm = require('./Utils/haversineFormula.js').getDistanceFromLatLonInKm;
const saveMapToCSV = require('./Utils/csvWriter').saveMapToCSV;
const nominatim = require('./Services/nominatim');
const path = require('path');

//Paths and headers for files
const inputFilePath = path.resolve(__dirname, 'AddressesInput.csv');
const outputFilePath = path.resolve(__dirname, 'AddressesOutput.csv');
const outputFileHeader = "Position,Name,Distance in Kilometers,Address,Suburb,PostCode,City,Country,AddressLat,AddressLon\n";
const errorsFilePath = path.resolve(__dirname, 'AddressesErrors.csv');
const errorsFileHeader = "Position,Name,Address,City,Country\n";

//milliseconds timeout
const timeOut = 1000;

//Stored data from input file
let dataMap = new Map();
//Stored data from input whit distance calculated
let distanceMap = new Map();
//Rows that present errors to get Geolocation data
let errorsMap = new Map();

//'Origin' is the key to calculate distance from other addresses
let keyOrigin = 'Origin';
let latOrigin = null;
let lonOrigin = null;

async function main() {
    try {
        console.clear()
        console.log("Starting process...")
        console.group()
        //Check geoserver is running
        console.log("Checking Geolocation service is running.")
        let apiStatus = await nominatim.getStatus();
        if (apiStatus === 'OK') {
            //Read input CSV file
            await readCSVToMap(inputFilePath)
                .then(async map => {
                    //console.log("Map with data readed from csv file", map)
                    console.log("Starting api calls to geolocate Origin + " + (map.size-1) + " addresses read.")
                    //Get lat and lon from each row in input file
                    for (let [key, value] of map.entries()) {
                        //Sleep 1 second to avoid request limit
                        await sleep(timeOut);
                        let {address, number, city, country} = value;
                        let ll = await getLatLonFromAddress(number, address, city, country);
                        //Data was fetched correctly from API
                        ll !== null ? dataMap.set(key, ll) : errorsMap.set(key, {address, number, city, country});
                        //If it´s Origen, set latOrigin and lonOrigin to calculate distance
                        if (key === keyOrigin) {
                            latOrigin = ll.resLat;
                            lonOrigin = ll.resLon
                        }
                    }

                    //Calculate distance
                    for (let [key, value] of dataMap.entries()) {
                        if (key !== keyOrigin) {
                            let distance = getDistanceFromLatLonInKm(latOrigin, lonOrigin, value.resLat, value.resLon)
                            let lat = value.resLat
                            let lon = value.resLon
                            let address = dataMap.get(key).address
                            let number = dataMap.get(key).number
                            let resSub = value.resSub
                            let postCode = value.postCode
                            let city = value.resCity
                            let country = value.resCountry
                            distanceMap.set(key, {distance, address, number, resSub, postCode, city, country, lat, lon})
                        }
                    }

                    //Order Data by distance asc
                    const array = [...distanceMap];
                    const sortedArray = array.sort((a, b) => a[1].distance - b[1].distance);
                    const sortedMap = new Map(sortedArray);

                    //Write CSV file
                    saveMapToCSV(sortedMap, outputFilePath, outputFileHeader, 'success');
                    console.groupEnd();
                })
                .catch(error => console.error(error));
        } else {
            throw new Error(apiStatus.toString())
        }
    } catch (error) {
        console.error(error)
    }
}

//Method to start the process
main().then(async () => {
    await sleep(timeOut);
    if (errorsMap.size > 0) {
        saveMapToCSV(errorsMap, errorsFilePath, errorsFileHeader, 'error');
    }
});

//Aux method to thread sleep
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
