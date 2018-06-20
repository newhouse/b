/* global before after describe it */

const dotenv        = require('dotenv').config();

// Set the NODE_ENV to be testing
process.env.NODE_ENV = 'testing';

const chai          = require('chai');
const chaiHttp      = require('chai-http');

const { app }       = require('./app');

chai.should();
chai.use(chaiHttp);

let requestor;

before(done => {
  requestor = chai.request(app).keepOpen();
  return done();
});

after(() => {
  requestor.close();
  setTimeout(() => {process.exit();}, 1000);
});


describe('Testing the API', function() {
  this.timeout(60000);

  it('Should return expected data', async function() {

    let res = await requestor.get('/providers').query({ state: 'AL' });
    res.body.should.have.length(3636);
    res.body[0]['Provider State'].should.equal('AL');

    res = await requestor.get('/providers').query({ max_discharges: 11 });
    res.body.should.have.length(7815);

    res = await requestor.get('/providers').query({ min_discharges: 100 });
    res.body.should.have.length(12764);

    res = await requestor.get('/providers').query({ max_average_covered_charges: 10000 });
    res.body.should.have.length(10967);

    res = await requestor.get('/providers').query({ min_average_covered_charges: 100000 });
    res.body.should.have.length(7913);

    res = await requestor.get('/providers').query({ max_average_medicare_payments: 2000 });
    res.body.should.have.length(284);

    res = await requestor.get('/providers').query({ min_average_medicare_payments: 100000 });
    res.body.should.have.length(8);

    res = await requestor.get('/providers').query(
      {
        state: 'AL',
        max_discharges: 20,
        min_discharges: 17,
        max_average_covered_charges: 8000,
        min_average_covered_charges: 4000,
        max_average_medicare_payments: 2000,
        min_average_medicare_payments: 1900
      }
    );
    res.body.should.have.length(1);

    res = await requestor.get('/providers').query(
      {
        max_discharges: 17,
        min_discharges: 20
      }
    );
    res.body.should.have.length(0);

    res = await requestor.get('/providers').query(
      {
        max_average_covered_charges: 4000,
        min_average_covered_charges: 8000
      }
    );
    res.body.should.have.length(0);

    res = await requestor.get('/providers').query(
      {
        max_average_medicare_payments: 1900,
        min_average_medicare_payments: 2000
      }
    );
    res.body.should.have.length(0);

    return;
  });


  it('Should validate inputs', async function() {

    let res = await requestor.get('/providers').query({ state: 'AM' });
    res.statusCode.should.equal(400);
    res.text.should.contain('"state" must be one of');

    const params = [
      'max_discharges',
      'min_discharges',
      'max_average_medicare_payments',
      'min_average_medicare_payments',
      'max_average_covered_charges',
      'min_average_covered_charges'
    ];

    for (let i=0, param; i < params.length; i++) {
      param = params[i];
      res = await requestor.get('/providers').query({ [param]: 'foo' });
      res.statusCode.should.equal(400);
      res.text.should.contain(' must be a number');
    }

  });

});