// Init reqs
/* jslint node: true */
/* global describe: false, it: false */
'use strict';

var amzSel = require('../'),
    expect = require('chai').expect;

// Tests

// Test the module
describe('amazon-seller', function() {

  var sellerId = 'A3TYU8WJN37NYT';

  // Test for seller info
  describe('sellerInfo', function() {
    it('should get info for ' + sellerId, function(done) {
      amzSel.sellerInfo({sellerId: sellerId, marketplace: 'US'}, function(err, data) {
        if(err) {
          done(err.message);
          return;
        }

        expect(data).to.have.property('id', sellerId);
        expect(data.name).to.be.a('string');
        expect(data.name).to.contain('YoYo.com');
        expect(data.url).to.be.a('object');
        expect(data.url).to.have.property('mobile');
        expect(data.url).to.have.property('full');
        expect(data.feedback).to.be.a('object');
        expect(data.feedback).to.have.property('star').to.be.a('number');
        expect(data.feedback).to.have.property('rating').to.be.a('number');
        expect(data.feedback).to.have.property('history').to.be.a('object');
        expect(data.marketplace).to.be.a('object');
        expect(data.marketplace).to.have.property('id', 'ATVPDKIKX0DER');
        expect(data.marketplace).to.have.property('name', 'US');
        expect(data.marketplace).to.have.property('url', 'www.amazon.com');
        expect(data.marketplace).to.have.property('country');
        expect(data.marketplace.country).to.have.property('code', 'US');
        expect(data.marketplace.country).to.have.property('name', 'United States');
        done();
      });
    });
  });
});