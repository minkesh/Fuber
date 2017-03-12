import {getMongoDBInstance, calculateDistance, calculatePrice, Point} from '../util';

export async function findRide(currentPosition, color) {
    try {
        const db = await getMongoDBInstance();
        const ridesQuery = {is_available: true};
        const result = {};
        if (color) {
            ridesQuery.color = color.toLowerCase();
        }
        const availableRideArr = await db.collection('ride_current_status').find(ridesQuery, {_id: 0}).toArray();

        if (availableRideArr.length) {
            let shortestDistance = Number.MAX_SAFE_INTEGER;
            let nearestRide;

            availableRideArr.forEach((ride) => {
                const ridePosition = new Point(ride.lat, ride.lon);
                const distance = calculateDistance(currentPosition, ridePosition);
                if (distance < shortestDistance) {
                   shortestDistance = distance;
                   nearestRide = ride.id;
                }
            });

            // Constraint to check minimum distance can be added here
            if (nearestRide) {
                const rideInfo = await db.collection('ride').find({id: nearestRide}, {_id: 0}).toArray();
                result.rideInfo = rideInfo[0];
                result.distance = Math.ceil(shortestDistance) + ' k.m.';

                return result;
            }
        }

        return result;
    } catch(e) {
        console.log('Error finding rides %s', e.message);
        throw new Error('Unkown server error');
    }
}

export async function confirmRide(id, user_id) {
    try {
        const db = await getMongoDBInstance();
        const rideStatus = await fetchRideInfo(id);
        if (rideStatus.is_available) {
            const updateResult = await db.collection('ride_current_status').findAndModify(
                {id: Number(id)},
                [['id', 'ascending']],
                {$set : {is_available: false, traveller_id: Number(user_id), timestamp: Date.now()}},
                {upsert: true});

            return updateResult.ok;
        }

        throw new Error('Ride already in transit');
    } catch(e) {
        console.log('Error confirming ride %s', e.message);
        throw e;
    }
}

export async function finishRide(id, currentPosition) {
    try {
        const db = await getMongoDBInstance();
        const {lat, lon} = currentPosition;
        const {is_available} = await fetchRideInfo(id);
        const updateResult = await db.collection('ride_current_status').findAndModify(
            {id: Number(id)},
            [['id', 'ascending']],
            {$set : {is_available: true, lat: Number(lat), lon: Number(lon)}, $unset: {traveller_id: 1, timestamp: 1}},
            {upsert: true});

        return updateResult;
    } catch (e) {
        console.log('Error finshing ride %s', e.message);
        throw e;
    }
}

export async function getPrice(id, finshingPoint) {
    try {
        const {lat, lon, color, timestamp, is_available} = await fetchRideInfo(Number(id));
        if (!is_available) {
            const boardingPoint = new Point(lat, lon);
            const distance = calculateDistance(boardingPoint, finshingPoint);
            const timeTaken = (Date.now() - timestamp) / (1000 * 60); //In minutes

            return calculatePrice(distance, timeTaken, color);
        }

        throw new Error('Ride is not in transit');
    } catch(e) {
        console.log('Error calculating price %s', e);
        throw e;
    }
}

async function fetchRideInfo(id) {
    const db = await getMongoDBInstance();
    const rideInfo = await db.collection('ride_current_status').find({id}, {_id: 0}).toArray();

    return rideInfo[0];
}

export async function findAllRides() {
    const db = await getMongoDBInstance();
    const ridesArr = await db.collection('ride_current_status').find({}, {_id: 0}).toArray();

    return ridesArr;
}
