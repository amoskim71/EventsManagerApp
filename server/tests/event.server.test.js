import chai from 'chai';
import chaiHttp from 'chai-http';
import '../env.test';
import app from '../server';
import model from '../models';

const Centers = model.Center;


chai.use(chaiHttp);


let token;
let notAdminToken; //eslint-disable-line
let eventID;
let centerID;

describe('Test API', () => {
  describe('GET /', () => {
    // Testing for incorrect routes
    it('Incorrect Routes should return HTTP 404', (done) => {
      chai.request(app)
        .post('/any/incorrect/route')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.an('object');
          done();
        });
    });
  });

  describe('Testing Api endpoints for event', () => {
    it('should return HTTP 200 when email and password are correct', (done) => {
      chai.request(app)
        .post('/api/v1/users/login')
        .send({
          email: 'segunmatthews@outlook.com',
          password: 'minerva'
        })
        .end((err, res) => {
          token = res.body.Token;
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('message').eql('Authentication Is Successful!');
          res.body.should.have.property('Token');
          done();
        });
    });

    it('Should return HTTP 201 with response object', (done) => {
      chai.request(app)
        .post('/api/v1/centers/')
        .set('x-access-token', token)
        .send({
          name: 'Mock Center',
          stateId: 1,
          address: '7, xyz avenue, ikaja',
          hallCapacity: '600',
          carParkCapacity: '200',
          facilities: ['swimming pool, projectors, cctv, vip lounges'],
          price: '1200000',
          image: 'test/image/url'
        })
        .end((err, res) => {
          centerID = res.body.centerId;
          res.should.have.status(201);
          res.body.should.be.an('object');
          res.body.should.have.property('message').eql('New Center Created');
          res.body.should.have.property('centerId');
          res.body.should.have.property('statusCode');
          done();
        });
    });


    describe('POST /api/v1/events', () => {
      // Testing for creating an event
      // ======INVALID REQUEST ===== //
      it('Should return 400 and message for post without centerId', (done) => {
        chai.request(app)
          .post('/api/v1/events/')
          .set('x-access-token', token)
          .send({
            eventName: 'The Wedding Party',
            startDate: '21-09-1991',
            days: 4,
            userId: 5,
          })
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.an('object');
            res.body.should.have.property('message');
            res.body.message.errors.should.have.property('centerId');
            res.body.message.errors.centerId.should.be.an('array');
            res.body.message.errors.centerId[0].should.eql('The centerId field is required.');
            done();
          });
      });

      it('Should return 400 and message for post without eventName', (done) => {
        chai.request(app)
          .post('/api/v1/events')
          .set('x-access-token', token)
          .send({
            startDate: '21-09-1991',
            days: 4,
            userId: 5,
            centerId: 4
          })
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.an('object');
            res.body.should.have.property('message');
            res.body.message.errors.should.have.property('eventName');
            res.body.message.errors.eventName.should.be.an('array');
            res.body.message.errors.eventName[0].should.eql('The eventName field is required.');
            done();
          });
      });

      it('Should return 400 if days is not specified', (done) => {
        chai.request(app)
          .post('/api/v1/events')
          .set('x-access-token', token)
          .send({
            centerId: '24',
            eventName: 'The Wedding Party',
            startDate: '21-09-2017',
          })
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.an('object');
            res.body.should.have.property('message');
            res.body.should.have.property('message');
            res.body.message.errors.should.have.property('days');
            res.body.message.errors.days.should.be.an('array');
            res.body.message.errors.days[0].should.eql('The days field is required.');
            done();
          });
      });
      it('Should return 400 and message for post without startDate', (done) => {
        chai.request(app)
          .post('/api/v1/events')
          .set('x-access-token', token)
          .send({
            eventName: 'The Wedding Party',
            days: 4,
            userId: 5,
            centerId: 4
          })
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.an('object');
            res.body.should.have.property('message');
            res.body.message.errors.should.have.property('startDate');
            res.body.message.errors.startDate.should.be.an('array');
            res.body.message.errors.startDate[0].should.eql('The startDate field is required.');
            done();
          });
      });

      it('Should return 400 if centerId is not a number', (done) => {
        chai.request(app)
          .post('/api/v1/events')
          .set('x-access-token', token)
          .send({
            centerId: 'bdhwvdhi',
            eventName: 'The Wedding Party',
            startDate: '2020-12-22',
            days: '6',
          })
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property('message');
            res.body.message.errors.should.have.property('centerId');
            res.body.message.errors.centerId.should.be.an('array');
            res.body.message.errors.centerId[0].should.eql('The centerId must be an integer.');
            done();
          });
      });

      it('Should return 400 if days is not a number', (done) => {
        chai.request(app)
          .post('/api/v1/events')
          .set('x-access-token', token)
          .send({
            centerId: '24',
            eventName: 'The Wedding Party',
            startDate: '21-09-2017',
            days: 'jwhvhwi',
          })
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.an('object');
            res.body.should.have.property('message');
            res.body.message.should.have.property('errors');
            res.body.message.errors.should.have.property('days');
            res.body.message.errors.days.should.be.an('array');
            res.body.message.errors.days[0].should.eql('The days must be a number.');
            done();
          });
      });

      it('Should return 400 if selected startDate is in the future', (done) => {
        chai.request(app)
          .post('/api/v1/events')
          .set('x-access-token', token)
          .send({
            centerId: centerID,
            eventName: 'The Wedding',
            startDate: '1909-11-12',
            days: '4',
          })
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.an('object');
            res.body.should.have.property('message').eql('Date must be in the future');
            res.body.should.have.property('statusCode').eql(400);
            done();
          });
      });

      // ======VALID REQUEST ===== //
      it('Should return 201 and event created for post if all request object properties exist', (done) => {
        chai.request(app)
          .post('/api/v1/events')
          .set('x-access-token', token)
          .send({
            centerId: centerID.toString(),
            eventName: 'The Wedding',
            startDate: '2040-11-12',
            days: '4',
          })
          .end((err, res) => {
            eventID = res.body.createdEvent.id;
            res.should.have.status(201);
            res.body.should.be.an('object');
            res.body.should.have.property('message');
            res.body.should.have.property('statusCode');
            done();
          });
      });

      it('Should return 400 if event date is already booked', (done) => {
        chai.request(app)
          .post('/api/v1/events')
          .set('x-access-token', token)
          .send({
            centerId: centerID.toString(),
            eventName: 'The Wedding',
            startDate: '2040-11-11',
            days: '4',
          })
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.an('object');
            res.body.should.have.property('message').eql('The selected date is booked');
            done();
          });
      });
    });
  });

  describe('GET /api/v1/events', () => {
    // Testing  to get all events
    it('Should return 200 with an array of all events', (done) => {
      chai.request(app)
        .get('/api/v1/events')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('message');
          res.body.should.have.property('statusCode').eql(200);
          res.body.should.have.property('data');
          res.body.should.have.property('metadata');
          res.body.metadata.should.be.an('object');
          res.body.data.should.be.an('array');
          done();
        });
    });
  });

  describe('GET /api/v1/events/:eventId', () => {
    // Testing to get all centers
    it('Should return 404 if eventId is not found', (done) => {
      chai.request(app)
        .get(`/api/v1/events/${-1}`)
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.an('object');
          res.body.should.have.property('message');
          res.body.message.should.eql('Event Not Found');
          done();
        });
    });

    // Testing to get all centers
    it('Should return 400 if eventId is not a number', (done) => {
      chai.request(app)
        .get('/api/v1/events/bjfdljbd/')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('message').eql('Invalid eventId');
          done();
        });
    });
    // Testing to get a single event
    it('Should return 200 with event object requested for', (done) => {
      chai.request(app)
        .get(`/api/v1/events/${eventID}`)
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('event');
          res.body.event.should.have.property('id');
          res.body.event.should.have.property('eventName');
          res.body.event.should.have.property('startDate');
          res.body.event.should.have.property('endDate');
          done();
        });
    });
  });
});

describe('PUT /api/v1/events/:id', () => {
  it('Should return 404 if event does not exist', (done) => {
    chai.request(app)
      .put(`/api/v1/events/${0}`)
      .set('x-access-token', token)
      .send({
        centerId: centerID.toString(),
        eventName: 'My Wedding',
        startDate: '2040-12-12',
        days: '4'
      })
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.an('object');
        res.body.should.have.property('message').eql('Event not found');
        done();
      });
  });

  it('Should return 400 if selected event date is in the past', (done) => {
    chai.request(app)
      .put(`/api/v1/events/${eventID}`)
      .set('x-access-token', token)
      .send({
        centerId: centerID.toString(),
        eventName: 'My Wedding',
        startDate: '1999-12-12',
        days: '4'
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('message').eql('Date must be in the future');
        done();
      });
  });

  it('Should return 400 if days is not a string', (done) => {
    chai.request(app)
      .put(`/api/v1/events/${eventID}`)
      .set('x-access-token', token)
      .send({
        centerId: centerID.toString(),
        eventName: 'My Wedding',
        startDate: '2022-12-12',
        days: 'kwkwgwb'
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('message');
        res.body.message.should.have.property('errors');
        res.body.message.errors.should.have.property('days');
        res.body.message.errors.days.should.be.an('array');
        res.body.message.errors.days[0].should.eql('The days must be a number.');
        done();
      });
  });


  it('Should return 200 with modified event', (done) => {
    const newEvent = {
      centerId: centerID.toString(),
      eventName: 'My Wedding',
      startDate: '2040-12-12',
      days: 4
    };
    chai.request(app)
      .put(`/api/v1/events/${eventID}`)
      .set('x-access-token', token)
      .send(newEvent)
      .end((err, res) => {
        const response = res.body.modifiedEvent;
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('message');
        res.body.should.have.property('modifiedEvent');
        res.body.should.have.property('statusCode');
        res.body.statusCode.should.eql(200);
        response.eventName.should.eql(newEvent.eventName);
        response.days.should.eql(newEvent.days);
        response.centerId.should.eql(newEvent.centerId);
        done();
      });
  });

  it('Should return 200 with modified event', (done) => {
    chai.request(app)
      .put(`/api/v1/events/${eventID}`)
      .set('x-access-token', token)
      .send({})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('message');
        res.body.should.have.property('modifiedEvent');
        res.body.should.have.property('statusCode');
        res.body.statusCode.should.eql(200);
        done();
      });
  });

  it('Should return 400 if eventId is not a number', (done) => {
    chai.request(app)
      .put('/api/v1/events/jdwvjhv/')
      .set('x-access-token', token)
      .send({
        centerId: centerID.toString(),
        eventName: 'My Wedding',
        startDate: '2040-12-12',
        days: '4'
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('message');
        res.body.should.have.property('statusCode');
        res.body.statusCode.should.eql(400);
        done();
      });
  });
});

describe('PUT /events/response/:eventId Admin response to events', () => {
  it('Should return 404 if event does not exist', (done) => {
    chai.request(app)
      .put('/api/v1/events/response')
      .set('x-access-token', token)
      .send({
        id: 0,
        status: 'cancelled'
      })
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.an('object');
        res.body.should.have.property('message').eql('Event not found');
        done();
      });
  });


  it('Should return 200 with modified event', (done) => {
    chai.request(app)
      .put('/api/v1/events/response')
      .set('x-access-token', token)
      .send({
        id: eventID,
        status: 'cancelled'
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        done();
      });
  });

  it('Should return 400 if eventId is not a number', (done) => {
    chai.request(app)
      .put('/api/v1/events/response')
      .set('x-access-token', token)
      .send({
        id: 'gcgcgc',
        status: 'cancelled'
      })
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('message');
        res.body.should.have.property('statusCode');
        res.body.statusCode.should.eql(400);
        done();
      });
  });
});

describe('DELETE /api/v1/events/:id', () => {
// Testing to modify an event
  it('Should return 404 if event does not exist', (done) => {
    chai.request(app)
      .delete(`/api/v1/events/${-1}`)
      .set('x-access-token', token)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.an('object');
        res.body.should.have.property('message').eql('Event does not exist');
        done();
      });
  });

  it('Should return 500 if eventId is not a number', (done) => {
    chai.request(app)
      .delete(`/api/v1/events/${undefined}/`)
      .set('x-access-token', token)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('message');
        res.body.should.have.property('statusCode');
        res.body.statusCode.should.eql(400);
        done();
      });
  });

  it('Should return 200 with success message', (done) => {
    chai.request(app)
      .delete(`/api/v1/events/${eventID}`)
      .set('x-access-token', token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('message').eql('Event is successfully  deleted');
        done();
      });
  });
  after((done) => {
    Centers.destroy({
      where: {
        name: 'Mock Center'
      }
    });
    done();
  });
});
