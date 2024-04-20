const nominatim = require('../Services/nominatim');

async function getLatLonFromAddress(number,address,city = 'Montevideo',country = 'Uruguay') {

    //Call to Nominatim API
    let latLonResponded = await nominatim.getLatLonFromAddress(number,address,city,country);
    //Response Parsing
    let resJson = JSON.parse(latLonResponded)
    if(resJson[0] !== undefined){
        let resLat = resJson[0].lat
        let resLon = resJson[0].lon
        let resSub = resJson[0].address.suburb
        let postCode = resJson[0].address.postcode
        let resCity = resJson[0].address.city
        let resCountry = resJson[0].address.country
        return {resLat, resLon, resSub, postCode, resCity, resCountry,number,address}
    }else{
        return null
    }
}

module.exports = {
    getLatLonFromAddress
};