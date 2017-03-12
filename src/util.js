import mongodb from 'mongodb';
import config from './config';

const mongoDBCLient = mongodb.MongoClient;

export async function getMongoDBInstance() {
    try {
        return await mongoDBCLient.connect(config.mongodb_url);;
    } catch(e) {
        console.log('Error connecting to db ', e.message);
        throw(e);
    }
}

// Applying pyhtagoras theorm between two coordinates
export function calculateDistance(p1, p2) {
    const latDiff = 111.19 * (p2.lat - p1.lat); //to measure in k.m.
    const lonDiff = p2.lon - p1.lon;

    return Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
}

export class Point {
    constructor(lat, lon) {
        this.lat = Number(lat);
        this.lon = Number(lon);
    }
}

export function calculatePrice(distanceInKm, durationInMin, color) {
    let price = config.price_per_minute * durationInMin;
    price += config.price_per_kilometer * distanceInKm;

    switch (color) {
        case 'pink':
            price += config.price_pink_ride_addon;
            break;
        default:
            price += 0;
    }

console.log(price);
    return price;
}
