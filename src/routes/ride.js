import BaseRoute from './base_route';
import bodyParser from 'body-parser';
import {findRide, confirmRide, finishRide, getPrice, findAllRides} from '../lib/ride';
import {Point} from '../util';

export default class RideRoute extends BaseRoute {
    constructor() {
        super();
        this.route.use(bodyParser.json());
        this.path = '/ride';
        this.route.get('/find', this.findRide);
        this.route.post('/confirm', this.confirmRide);
        this.route.post('/finish', this.finishRide);
        this.route.get('/findAll', this.findAllRide);
    }

    async findRide(req, res) {
        try {
            const {lat, lon, color} = req.query;
            if (!lat || !lon) {
               throw new Error('latitude and longitude no present');
            }
            const currentPosition = new Point(lat, lon);
            const rideInfo = await findRide(currentPosition, color);

            if (rideInfo) {
               return res.status(200).json({success: true , ...rideInfo});
            }

            res.status(404).json({success: false, error: 'No rides found'});
        } catch(e) {
            res.status(500).json({success: false, error: e.message});
        }

    }

    async confirmRide(req, res) {
        try {
            const {id, user_id} = req.body;
            if (!id) {
               throw new Error('Ride id not available');
            }
            const result = await confirmRide(id, user_id);

            if (result) {
                return res.status(200).send({success: true})
            }

            res.status(200).send({success: false});
        } catch(e) {
            res.status(500).json({success: false, error: e.message})
        }
    }

   async finishRide(req, res) {
       try {
          const {lat, lon} = req.query;
          const {id} = req.body;
          const position = new Point(lat, lon);
          const totalFare = await getPrice(id, position);
          const result = await finishRide(id, position);

          res.status(200).json({success: true, totalFare: Math.ceil(totalFare) + ' dogecoin'});
       } catch(e) {
          console.log('message', e.message);
          res.status(500).json({success: false, error: e.message});
       }
   }

   async findAllRide(req, res) {
      try {
         const ridesArr = await findAllRides();
         res.status(200).json({success: true, rides: ridesArr})
      } catch(e) {
         res.status(500).json({success: false, error: e.message});
      }
   }
}
