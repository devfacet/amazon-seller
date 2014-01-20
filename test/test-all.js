// Init reqs
/* jslint node: true */
'use strict';

var mAmzSel   = require('../');

// Init vars
var gTestList = {
      SELLERINFO: true
    }
;

// Tests
console.log('test-all.js');

// Test for sellerInfo
if(gTestList.SELLERINFO === true) {
  mAmzSel.sellerInfo({sellerId: "A3TYU8WJN37NYT", marketplace: "US"}, function(err, data) {
    console.log('SELLERINFO:');

    if(!err) {
      console.log(JSON.stringify(data, null, 2));
    }
    else {
      console.log("ERROR!:" + JSON.stringify(err, null, 2));
    }
  });
}