// Init reqs
/* jslint node: true */
/* global describe: false */
/* global it: false */
'use strict';

var amzSel = require('../'),
    expect = require('chai').expect
;

// Tests

// Test for amazon seller module
describe('amzSel', function() {

  // Init vars
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
        expect(data.url).to.be.a('object');
        expect(data.feedback).to.be.a('object');
        expect(data.marketplace).to.be.a('object');
        expect(data.marketplace).to.have.property('name', 'US');
        expect(data.marketplace).to.have.property('country');
        expect(data.marketplace.country).to.have.property('code', 'US');
        done();
      });
    });
  });
});