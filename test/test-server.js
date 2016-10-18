const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server.js');
const User = require('../models/users.js');
const Currency = require('../models/currencies.js');

const should = chai.should();
const app = server.app;

chai.use(chaiHttp);

describe('Currency Converter', function() {
    before(function(done) {
        server.runServer(function() {
            User.create({
                username: 'Mocha_Test_User',
                password: 'password'
            }, function() {
                done();
            });
        });
    });

    it('should return status 200 and be html', function(done) {
        chai.request(app).get('/').end(function(err, res) {
            res.should.have.status(200);
            res.should.be.html;
            done();
        });
    });
});

    it('should sign-up a new user', function(done) {
      chai.request(app)
          .post('/signup')
          .send({
            username: 'Test_Mocha_User2',
            password: 'password2'
          })
          .end(function(err, res) {
            should.equal(err, null);
            console.log('res: ', res.body);
            res.should.have.status(201);
            // res.should.be.json;
            // res.body.should.have.property('_id');
            // res.body.should.have.property('username');
            // res.body.should.have.property('password');
            // res.body.username.should.equal('Test_Mocha_User2');
            // res.body.password.should.be.a('string');
            // res.body.password.should.equal('password2');
            done();
          });
    });
