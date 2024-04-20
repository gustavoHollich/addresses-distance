const readCSVToMap = require('./Utils/csvReader').readCSVToMap;
const getLatLonFromAddress = require('./Utils/addressParser').getLatLonFromAddress;
const getDistanceFromLatLonInKm = require('./Utils/haversineFormula.js').getDistanceFromLatLonInKm;
const saveSortedMapToCSV = require('./Utils/csvWriter').saveSortedMapToCSV;

const path = require('path');

const csvFilePath = path.resolve(__dirname, 'AddressesInput.csv');

let dataMap = new Map();
let distanceMap = new Map();

let keyOrigin = 'Origin';
let latOrigin = null;
let lonOrigin = null;

async function getAddressesMapped() {

    console.log("Starting process...")
    console.group()
    //Read CSV file
    await readCSVToMap(csvFilePath)
        .then(async map => {
            //console.log("Map with data readed from csv file", map)
            console.log("Starting OpenStreetMap api calls to geolocate "+ map.size +" addresses...")
            //Get lat and lon from each row in input file
            for(let [key, value] of map.entries()){
                //Sleep 1 second to avoid request limit
                await sleep(1000);
                let {address, number, city, country} = value;
                let ll = await getLatLonFromAddress(number, address, city, country);
                dataMap.set(key,ll)
                //If it´s Origen, set latOrigin and lonOrigin to calculate distance
                if(key === keyOrigin){latOrigin = ll.resLat;lonOrigin = ll.resLon}
            }
            //console.log("Map with data obtained from API", dataMap)

            //Calculate distance
            for(let [key, value] of dataMap.entries()){
                if(key !== keyOrigin) {
                    let distance = getDistanceFromLatLonInKm(latOrigin, lonOrigin, value.resLat, value.resLon)
                    let lat = value.resLat
                    let lon = value.resLon
                    let address = dataMap.get(key).address
                    let number = dataMap.get(key).number
                    console.log
                    let resSub = value.resSub
                    let postCode = value.postCode
                    let city = value.resCity
                    let country = value.resCountry
                    distanceMap.set(key, {distance,address,number,resSub,postCode,city,country,lat, lon})
                }
            }

            //Order Data by distance asc
            const array = [...distanceMap];
            const sortedArray = array.sort((a,b) => a[1].distance - b[1].distance);
            const sortedMap = new Map(sortedArray);
            //console.log("Sorted Map by distance in Km ", sortedMap)

            //Create CSV file
            const outputFilePath = path.resolve(__dirname, 'AddressesOutput.csv');
            saveSortedMapToCSV(sortedMap, outputFilePath);
            console.groupEnd();
        })
        .catch(error => console.error(error));
}

//Method to start the process
getAddressesMapped().then(r => null);

//Aux method to thread sleep
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}