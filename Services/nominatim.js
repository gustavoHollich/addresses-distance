const https = require('https');
async function getLatLonFromAddress(number,address,city = 'Montevideo',country = 'Uruguay') {
    //Url API
    const url = 'https://nominatim.openstreetmap.org/search?q='+number+'+'+address+'+'+city+'+'+country+'&format=json&addressdetails=1';
    console.group();
    console.log("-->", url, 'at', new Date().toISOString());
    console.groupEnd();
    //Config headers
    const options = {
        headers: {
            'Referer': 'http://www.yourapp.com/',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
        }
    };
    //HTTP GET request
    return new Promise((resolve, reject) => {
        https.get(url,options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve(data);
            });

        }).on('error', (error) => {
            console.error(`Error making GET request to ${url}: ${error}`);
            reject(error);
        });
    });
}

async function getStatus() {
    const url = 'https://nominatim.openstreetmap.org/status';

    const options = {
        headers: {
            'Referer': 'http://www.yourapp.com/',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
        }
    };

    return new Promise((resolve, reject) => {
        https.get(url, options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve(data);
            });

        }).on('error', (error) => {
            console.error(`Error making GET request to ${url}: ${error}`);
            reject(error);
        });
    });
}


module.exports = {
    getLatLonFromAddress,
    getStatus
};