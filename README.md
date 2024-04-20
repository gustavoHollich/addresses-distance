Addresses
=============

## Get information about distance given two addresses.


### How to run locally the Application?
1. Verify you have installed Node.js before to run the app, works well on v12.13.0, check version with `node -v`. If you don't have it installed, you can download it from [Node.js](https://nodejs.org/en/download/).
2. Run `npm install` to install the dependencies - only the first time you build the app-.
3. Place your own csv file called AddressInput.csv with the addresses you want to calculate the distance on root. 
4. Run `npm start` to run the process.
5. At the end, process will create AddressesOutput.csv file on root with data ordered by distance given reference indicated in the file.

### Csv Input file
AddressInput.csv file should be present on root and should have the following format:

| Name            | Address          | City         | Country   |
|-----------------|------------------|--------------|-----------|
| Origin          | Av. Italia 6201  | Montevideo   | Uruguay   |
| Johannes Kepler | Av. Brasil 3090  | Maldonado    | Uruguay   |
| Marie Curie     | 18 de julio 1249 | Buenos Aires | Argentina |
| Herman Hesse    | Mones Roses 6937 |              |           |

- Values are separated by `,` and the file should have a header with the columns names detailed.
- `Name` and `Address` are mandatory fields, `City` and `Country` are optional.
- Row with `Name = Origin` will be considered the reference to calculate distance from others points.

### How its works?
- The API used to Geolocate addresses is [Nominatim](https://nominatim.openstreetmap.org/ui/search.html) from the [OpenStreetMap](https://www.openstreetmap.org/#map=12/-34.8083/-56.1453). Geolocate is a process to find the geographic location of an object in the world.
- The way distance is calculated is using the [Haversine formula](https://en.wikipedia.org/wiki/Haversine_formula).
  - By the way it works, formula will underestimate distances in some situations. 
    - E.g.: From London Eye to the Korean War Memorial, using haversine distance you would think it’s only 300 metres away. However, once you account for the Thames in the middle and decide you will not try to swim through it, you’ll find that the distance is actually three times what you thought, 900 metres.
- WIP to replace the Haversine formula to use [Open Source Routing Machine](https://project-osrm.org/) to calculate the distance and avoid the underestimation of the distance.



### Teck Stack
[![NodeJS](https://skillicons.dev/icons?i=nodejs&theme=dark)](https://nodejs.org/en) 
## Hope you enjoy it 💚
<img src="https://media.tenor.com/JV8INozhBKkAAAAM/map-what.gif" width="73" height="73">