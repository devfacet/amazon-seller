/*
 * Amazon Seller
 * Copyright (c) 2014 Fatih Cetinkaya (http://github.com/cmfatih/amazon-seller)
 * For the full copyright and license information, please view the LICENSE.txt file.
 */

// Init reqs
/* jslint node: true */
'use strict';

var request    = require('request'),
    htmlParser = require("htmlparser")
;

// Init the module
exports = module.exports = function() {

  var sellerInfo, // seller info - function

      urlList     = { // list of urls
        "info": {
          "mobile": "/gp/aw/sp.html/?s={{sellerId}}",
          "full": "/gp/aag/details/?seller={{sellerId}}"
        },
        "browse": {
          "mobile": "/gp/aw/b/{{sellerId}}",
          "full": "/gp/browse.html?me={{sellerId}}"
        }
      },

      mpDef       = "US", // default marketplace
      mpList      = {     // marketplace list
        "US": {
          "id": "ATVPDKIKX0DER",
          "name": "US",
          "url": "www.amazon.com",
          "country": {"code": "US", "name": "United States"}
        },
        "CA": {
          "id": "A2EUQ1WTGCTBG2",
          "name": "CA",
          "url": "www.amazon.ca",
          "country": {"code": "CA", "name": "Canada"}
        },
        "UK": {
          "id": "A1F83G8C2ARO7P",
          "name": "UK",
          "url": "www.amazon.co.uk",
          "country": {"code": "UK", "name": "United Kingdom"}
        },
        "DE": {
          "id": "A1PA6795UKMFR9",
          "name": "DE",
          "url": "www.amazon.de",
          "country": {"code": "DE", "name": "Germany"}
        },
        "ES": {
          "id": "A1RKKUPIHCS9HS",
          "name": "ES",
          "url": "www.amazon.es",
          "country": {"code": "ES", "name": "Spain"}
        },
        "FR": {
          "id": "A13V1IB3VIYZZH",
          "name": "FR",
          "url": "www.amazon.fr",
          "country": {"code": "FR", "name": "France"}
        },
        "IN": {
          "id": "A21TJRUUN4KGV",
          "name": "IN",
          "url": "www.amazon.in",
          "country": {"code": "IN", "name": "India"}
        },
        "IT": {
          "id": "APJ6JRA9NG5V4",
          "name": "IT",
          "url": "www.amazon.it",
          "country": {"code": "IT", "name": "Italy"}
        },
        "JP": {
          "id": "A1VC38T7YXB528",
          "name": "JP",
          "url": "www.amazon.co.jp",
          "country": {"code": "JP", "name": "Japan"}
        },
        "CN": {
          "id": "AAHKV2X7AFYLW",
          "name": "CN",
          "url": "www.amazon.cn",
          "country": {"code": "CN", "name": "China"}
        }
      }
  ;

  // Returns seller info
  sellerInfo = function sellerInfo(options, callback) {

    var returnData  = null,
        returnErr   = null,
        sellerId    = null,
        marketplace = null,
        reqOpt      = {
          url: null,
          method: 'GET',
          timeout: 30000
        }
    ;

    sellerId    = (options && options.sellerId)     ? options.sellerId     : null;
    marketplace = (options && options.marketplace)  ? options.marketplace  : mpDef;

    // Check options
    if(!sellerId) {
      returnErr = {
        "type": "fatal",
        "code": "amzsel-001",
        "source": "sellerInfo",
        "message": "Missing seller Id!"
      };
    }
    else if(!marketplace || !mpList[marketplace]) {
      returnErr = {
        "type": "fatal",
        "code": "amzsel-002",
        "source": "sellerInfo",
        "message": "Invalid marketplace!"
      };
    }

    if(returnErr) {
      if(callback && typeof callback === 'function') {
        return callback(returnErr, returnData);
      } else {
        return {"error": returnErr, "data": returnData};
      }
    }

    returnData = {
      "id": sellerId,
      "name": null,
      "url": {
        "mobile": ('http://' + mpList[marketplace].url + urlList.info.mobile).replace('{{sellerId}}', sellerId),
        "full": ('http://' + mpList[marketplace].url + urlList.info.full).replace('{{sellerId}}', sellerId)
      },
      "feedback": {
        "star": null,
        "rating": null,
        "history": {
          "d30": null,
          "d90": null,
          "d365": null,
          "lifetime": null
        }
      },
      "marketplace": mpList[marketplace]
    };

    // Send request
    reqOpt.url = returnData.url.mobile;

    request(reqOpt, function (err, res, body) {
    
      if(!err && res.statusCode === 200) {

        // Parse html
        var hpHandler = new htmlParser.DefaultHandler(function (err, dom) {
          if(!err) {

            //console.log(JSON.stringify(dom[0].children[1], null, 2)); // for debug

            var domBody = (dom && dom[0] && dom[0].children && dom[0].children[1] && dom[0].children[1].type === 'tag' && dom[0].children[1].name === 'body') ? dom[0].children[1] : null;
                
            if(domBody) {
              var domElems    = (domBody && domBody.children) ? domBody.children : [],
                  domElemsCnt = domElems.length
              ;

              // Check DOM
              for (var i = 0; i < domElemsCnt; i++) {
                
                // Seller name
                if(!returnData.name && domElems[i].type === 'tag' && domElems[i].attribs && domElems[i].attribs.href) {
                  if(domElems[i].attribs.href.indexOf('/gp/aw/b/' +  sellerId + '/') > -1) {
                    var selNameElem = (domElems[i].children && domElems[i].children[0]) ? domElems[i].children[0] : null;

                    if(selNameElem && selNameElem.type === 'text') {
                      returnData.name = (selNameElem && selNameElem.data) ? selNameElem.data : null;
                    }
                  }
                }

                // Feedback star
                if(!returnData.feedback.star && domElems[i].type === 'text' && domElems[i].data &&  ('' + domElems[i].data).indexOf('Average seller feedback rating') > -1) {
                  var fbStarElem = ('' + domElems[i].data).replace(/(Average seller feedback rating:|&nbsp;)/g, '').trim().split('/');
                  var fbStarVal  = (fbStarElem[0]) ? parseFloat(fbStarElem[0]) : null;

                  returnData.feedback.star = !isNaN(fbStarVal) ? fbStarVal : null;
                }

                // Feedback rating
                if(!returnData.feedback.rating && domElems[i].type === 'text' && domElems[i].data && ('' + domElems[i].data).indexOf(' ratings)') > -1) {
                  var fbRatingElem = ('' + domElems[i].data).replace(/(\(| ratings\))/g, '').trim();
                  var fbRatingVal  = (fbRatingElem) ? parseFloat(fbRatingElem) : null;

                  returnData.feedback.rating = !isNaN(fbRatingVal) ? fbRatingVal : null;
                }

                // Feedback history - Last 30 days
                if(!returnData.feedback.history.d30 && domElems[i].type === 'text' && domElems[i].data && ('' + domElems[i].data).indexOf('Last 30 days') > -1) {
                  
                  returnData.feedback.history.d30 = {"positive": null, "neutral": null, "negative": null, "rating": null};
                  if(domElems[i+2].type === 'text' && ('' + domElems[i+2].data).indexOf('Positive') > -1)        returnData.feedback.history.d30.positive  = ('' + domElems[i+2].data).replace(/(:|-|Positive)/g, '').trim();
                  if(domElems[i+4].type === 'text' && ('' + domElems[i+4].data).indexOf('Neutral') > -1)         returnData.feedback.history.d30.neutral   = ('' + domElems[i+4].data).replace(/(:|-|Neutral)/g, '').trim();
                  if(domElems[i+6].type === 'text' && ('' + domElems[i+6].data).indexOf('Negative') > -1)        returnData.feedback.history.d30.negative  = ('' + domElems[i+6].data).replace(/(:|-|Negative)/g, '').trim();
                  if(domElems[i+8].type === 'text' && ('' + domElems[i+8].data).indexOf('Feedback Rating') > -1) returnData.feedback.history.d30.rating    = ('' + domElems[i+8].data).replace(/(:|-|Feedback Rating)/g, '').trim();
                  
                  if(returnData.feedback.history.d30.rating) {
                    var fbHistory30Num = parseInt(returnData.feedback.history.d30.rating, 10);
                    if(!isNaN(fbHistory30Num)) returnData.feedback.history.d30.rating = fbHistory30Num;
                  }
                }

                // Feedback history - Last 90 days
                if(!returnData.feedback.history.d90 && domElems[i].type === 'text' && domElems[i].data && ('' + domElems[i].data).indexOf('Last 90 days') > -1) {
                  
                  returnData.feedback.history.d90 = {"positive": null, "neutral": null, "negative": null, "rating": null};
                  if(domElems[i+2].type === 'text' && ('' + domElems[i+2].data).indexOf('Positive') > -1)        returnData.feedback.history.d90.positive  = ('' + domElems[i+2].data).replace(/(:|-|Positive)/g, '').trim();
                  if(domElems[i+4].type === 'text' && ('' + domElems[i+4].data).indexOf('Neutral') > -1)         returnData.feedback.history.d90.neutral   = ('' + domElems[i+4].data).replace(/(:|-|Neutral)/g, '').trim();
                  if(domElems[i+6].type === 'text' && ('' + domElems[i+6].data).indexOf('Negative') > -1)        returnData.feedback.history.d90.negative  = ('' + domElems[i+6].data).replace(/(:|-|Negative)/g, '').trim();
                  if(domElems[i+8].type === 'text' && ('' + domElems[i+8].data).indexOf('Feedback Rating') > -1) returnData.feedback.history.d90.rating    = ('' + domElems[i+8].data).replace(/(:|-|Feedback Rating)/g, '').trim();
                  
                  if(returnData.feedback.history.d90.rating) {
                    var fbHistory90Num = parseInt(returnData.feedback.history.d90.rating, 10);
                    if(!isNaN(fbHistory90Num)) returnData.feedback.history.d90.rating = fbHistory90Num;
                  }
                }

                // Feedback history - Last 365 days
                if(!returnData.feedback.history.d365 && domElems[i].type === 'text' && domElems[i].data && ('' + domElems[i].data).indexOf('Last 365 days') > -1) {

                  returnData.feedback.history.d365 = {"positive": null, "neutral": null, "negative": null, "rating": null};
                  if(domElems[i+2].type === 'text' && ('' + domElems[i+2].data).indexOf('Positive') > -1)        returnData.feedback.history.d365.positive  = ('' + domElems[i+2].data).replace(/(:|-|Positive)/g, '').trim();
                  if(domElems[i+4].type === 'text' && ('' + domElems[i+4].data).indexOf('Neutral') > -1)         returnData.feedback.history.d365.neutral   = ('' + domElems[i+4].data).replace(/(:|-|Neutral)/g, '').trim();
                  if(domElems[i+6].type === 'text' && ('' + domElems[i+6].data).indexOf('Negative') > -1)        returnData.feedback.history.d365.negative  = ('' + domElems[i+6].data).replace(/(:|-|Negative)/g, '').trim();
                  if(domElems[i+8].type === 'text' && ('' + domElems[i+8].data).indexOf('Feedback Rating') > -1) returnData.feedback.history.d365.rating    = ('' + domElems[i+8].data).replace(/(:|-|Feedback Rating)/g, '').trim();
                  
                  if(returnData.feedback.history.d365.rating) {
                    var fbHistory365Num = parseInt(returnData.feedback.history.d365.rating, 10);
                    if(!isNaN(fbHistory365Num)) returnData.feedback.history.d365.rating = fbHistory365Num;
                  }
                }

                // Feedback history - Lifetime
                if(!returnData.feedback.history.lifetime && domElems[i].type === 'text' && domElems[i].data && ('' + domElems[i].data).indexOf('Lifetime') > -1) {

                  returnData.feedback.history.lifetime = {"positive": null, "neutral": null, "negative": null, "rating": null};
                  if(domElems[i+2].type === 'text' && ('' + domElems[i+2].data).indexOf('Positive') > -1)        returnData.feedback.history.lifetime.positive  = ('' + domElems[i+2].data).replace(/(:|-|Positive)/g, '').trim();
                  if(domElems[i+4].type === 'text' && ('' + domElems[i+4].data).indexOf('Neutral') > -1)         returnData.feedback.history.lifetime.neutral   = ('' + domElems[i+4].data).replace(/(:|-|Neutral)/g, '').trim();
                  if(domElems[i+6].type === 'text' && ('' + domElems[i+6].data).indexOf('Negative') > -1)        returnData.feedback.history.lifetime.negative  = ('' + domElems[i+6].data).replace(/(:|-|Negative)/g, '').trim();
                  if(domElems[i+8].type === 'text' && ('' + domElems[i+8].data).indexOf('Feedback Rating') > -1) returnData.feedback.history.lifetime.rating    = ('' + domElems[i+8].data).replace(/(:|-|Feedback Rating)/g, '').trim();
                  
                  if(returnData.feedback.history.lifetime.rating) {
                    var fbHistoryLTNum = parseInt(returnData.feedback.history.lifetime.rating, 10);
                    if(!isNaN(fbHistoryLTNum)) returnData.feedback.history.lifetime.rating = fbHistoryLTNum;
                  }
                }
              }
            } else {
              returnErr = {
                "type": "fatal",
                "code": "amzsel-003",
                "source": "sellerInfo",
                "message": "Invalid body content!"
              };
            }
          } else {
            returnErr = {
              "type": "fatal",
              "code": "amzsel-004",
              "source": "sellerInfo",
              "message": "HTML parsing error! (" + err + ")"
            };
          }
        }, {ignoreWhitespace: true, verbose: false});

               
        // Remove new lines and tags (font)
        var regexClr  = new RegExp('<font[^><]*>|<.font[^><]*>', 'g');
        var bodyF     = ('' + body).replace(/(\r\n|\n|\r|<b>|<\/b>)/gm, '');
            bodyF     = bodyF.replace(regexClr, '');

        // Parse
        var hpParser = new htmlParser.Parser(hpHandler);
        hpParser.parseComplete(bodyF);

      } else {
        returnErr = {
          "type": "fatal",
          "code": "amzsel-005",
          "source": "sellerInfo",
          "message": (err) ? ('' + err) : 'HTTP status code: ' + ('' + res.statusCode)
        };
      }

      if(callback && typeof callback === 'function') {
        return callback(returnErr, returnData);
      } else {
        return {"error": returnErr, "data": returnData};
      }
    });
  };

  // Return
  return {
    sellerInfo: sellerInfo
  };
}();