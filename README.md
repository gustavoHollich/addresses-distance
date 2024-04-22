Addresses-distance 🗺️📍📐
===========================

## Get information about the distance of directions to a known address.

### How to use the Application?
1. Verify you have installed Node.js before run the app, works well on v12.13.0, check version with `node -v`. If you don't have it installed, you can download it from [Node.js](https://nodejs.org/en/download/).
2. Run `npm install` to install the dependencies -only the first time you build the app-.
3. Place your own csv file called AddressInput.csv on root with the addresses you want to calculate the distance. 
4. Run `npm start` to run the process.
5. At the end, process will create AddressesOutput.csv file on root with data ordered by distance given reference indicated in the file. In case of errors processing some addresses, AddressesOutputErrors.csv will be created with the addresses that could not be processed.

### Csv Input file
AddressesInput.csv file should be present on root and should have the following format:

| Name                    | Address                          | City       | Country  |
|-------------------------|----------------------------------|------------|----------|
| Origin                  | Dr. Luis Bonavita 1294           | Montevideo | Uruguay  |
| Montevideo Shopping     | Av. Luis Alberto de Herrera 1290 | Montevideo | Uruguay  |
| Punta Carretas Shopping | Jose Ellauri 350                 | Montevideo | Uruguay  |
| Nuevo Centro Shopping   | Av. Luis Alberto de Herrera 3365 | Montevideo | Uruguay  |
| Portones Shopping       | Av. Italia 5775                  | Montevideo | Uruguay  |
| G Punta del Este        | Avenida Roosevelt y 20100        | Maldonado  | Uruguay  |
| G Medellin              | Torre Ilustre                    | Medellin   | Colombia |

- Values are separated by `,` and the file should have a header with the columns names detailed.
- `Name` and `Address` are mandatory fields, `City` and `Country` are optional, in case of `null || undefined`, Montevideo, Uruguay will be taken.
- Row with `Name = Origin` will be considered the reference to calculate distance from others points.

### Csv Output files
#### Addresses successfully compared
AddressesOutput.csv file will be created on root with the following format:

|Position|Name|Distance in Kilometers|Address|Suburb|PostCode|City|Country|AddressLat|AddressLon|
|-|------------------|--------------|-----------|-----------------|------------------|--------------|-----------|--------------|-----------|
|1|Montevideo Shopping|0.180|Av. Luis Alberto de Herrera 1290|Buceo|11300|Montevideo|Uruguay|-34.9030628|-56.13636551266029|
|2|Punta Carretas Shopping|3.263|Jose Ellauri 350|Punta Carretas|11303|Montevideo|Uruguay|-34.9237331|-56.159439|
|3|Nuevo Centro Shopping|4.982|Av. Luis Alberto de Herrera 3365|Jacinto Vera|12000|Montevideo|Uruguay|-34.8684338|-56.1695721|
|4|Portones Shopping|5.356|Av. Italia 5775|Punta Gorda|11500|Montevideo|Uruguay|-34.8814063|-56.0817779|

- This file contains the addresses well processed ordered ascending by distance in kilometers against the reference point indicated as `Origin` in AddressesInput.csv.

#### Addresses incorrectly processed
AddressesOutputErrors.csv file will be created on root if errors occurs with the following format:

|Position| Name|Address| City    | Country  |
|-|----------------|--------------|---------|----------|
|1|G Punta del Este|Avenida Roosevelt y 20100|Maldonado| Uruguay|
|2|G Medellin|undefined undefined|undefined| undefined |

- This file contains the addresses that could not be processed due to an error in the address or the geolocation service could not find the address.
  - Some known issues are:
    - Special characters in the address
    - Address not found
    - Address not well formatted
    - Address not well geolocated

### Behind the hood
- Geolocate is a process to find the geographic location of an object in the world, the API used to Geolocate addresses is [Nominatim](https://nominatim.openstreetmap.org/ui/search.html) from the [OpenStreetMap](https://www.openstreetmap.org/#map=12/-34.8083/-56.1453).
- The way distance is calculated currently is using the [Haversine formula](https://en.wikipedia.org/wiki/Haversine_formula).
  - By the way it works, formula will underestimate distances in some situations. 
    - E.g.: From London Eye to the Korean War Memorial, using haversine distance you would think it’s only 300 metres away. However, once you account for the Thames in the middle and decide you will not try to swim through it, you’ll find that the distance is actually three times what you thought, 900 metres.
- WIP to replace the Haversine formula to use [Open Source Routing Machine](https://project-osrm.org/) to calculate the distance avoiding underestimation. Other possibility is provid our own [GeoServer](https://geoserver.org/) instance for geo-spacial operations 💚.

### Teck Stack
[![NodeJS](https://skillicons.dev/icons?i=nodejs&theme=dark)](https://nodejs.org/en) 
