process.env.NODE_ENV = 'test';

var mongodb = require('mongodb');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.babel');
var should = chai.should();

chai.use(chaiHttp);

describe('/Find Ride', ()=> {
   it('It should find the nearest Ride to you', (done)=> {
       chai.request(server)
       .get('/api/ride/find?lat=12.8984&lon=77.6179')
       .end((err, res)=> {
         res.should.have.status(200);
         res.body.should.have.property('success');
         res.body.success.should.equal(true);
         res.body.should.not.have.property('error');
         res.body.should.have.property('rideInfo');
         done();
       });
   });

   it('It should find the nearest Ride to you having mentioned color', (done)=> {
       chai.request(server)
       .get('/api/ride/find?lat=12.8984&lon=77.6179&color=pink')
       .end((err, res)=> {
         res.should.have.status(200);
         res.body.should.have.property('success');
         res.body.success.should.equal(true);
         res.body.should.not.have.property('error');
         res.body.should.have.property('rideInfo');
         res.body.should.have.property('distance');
         res.body.rideInfo.should.have.property('model');
         done();
       });
   });

   it('It should throw an error if query params are not passed', (done)=> {
       chai.request(server)
       .get('/api/ride/find')
       .end((err, res)=> {
         res.should.have.status(500);
         res.body.should.have.property('success');
         res.body.success.should.equal(false);
         res.body.should.have.property('error');
         done();
       });
   });
});

describe('/Confirm Ride', ()=> {
   it('It should confirm ride for the given ride id', (done) => {
      chai.request(server)
      .post('/api/ride/confirm')
      .send({id: 1, user_id: 432})
      .end((err, res)=> {
         res.should.have.status(200);
         res.body.should.have.property('success');
         res.body.success.should.equal(true);
         done();
      })
   });

   it('It should not confirm the ride again since it has been assigned to another user', (done) => {
      chai.request(server)
      .post('/api/ride/confirm')
      .send({id: 1, user_id: 42})
      .end((err, res)=> {
         res.should.have.status(500);
         res.body.should.have.property('success');
         res.body.should.have.property('error');
         res.body.success.should.equal(false);
         done();
      })
   });

   it('It should throw an error when ride id is not assigned', (done) => {
      chai.request(server)
      .post('/api/ride/confirm')
      .send({user_id: 42})
      .end((err, res)=> {
         res.should.have.status(500);
         res.body.should.have.property('success');
         res.body.should.have.property('error');
         res.body.success.should.equal(false);
         done();
      });
   });
});

describe('/Finish Ride', ()=> {
   var lat = 12.8399;
   var lon = 77.6770;

   it('It should finish the ride which was started previously and the position of the ride must change', (done)=> {
      chai.request(server)
      .post('/api/ride/finish?lat=' + lat + '&lon=' + lon)
      .send({id: 1})
      .end((err, res)=> {
         res.should.have.status(200);
         res.body.should.have.property('success');
         res.body.should.have.property('totalFare');
         res.body.should.not.have.property('error');
         res.body.success.should.equal(true);
         done();
      });
   });

   it('It should throw error since the ride is no longer in transit', (done)=> {
      chai.request(server)
      .post('/api/ride/finish?lat=' + lat + '&lon=' + lon)
      .send({id: 1})
      .end((err, res)=> {
         res.should.have.status(500);
         res.body.should.have.property('success');
         res.body.should.have.property('error');
         res.body.should.not.have.property('totalFare');
         res.body.success.should.equal(false);
         done();
      });
   });
});

describe('/Find All rides', ()=> {

   it('It should give the list of all the rides', (done)=> {
      chai.request(server)
      .get('/api/ride/findAll')
      .end((err, res) => {
         res.should.have.status(200);
         res.body.should.have.property('success');
         res.body.success.should.equal(true);
         res.body.rides.should.be.a('array');
         done();
      });
   })
});
