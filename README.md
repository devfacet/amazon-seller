## Amazon Seller

[amazon-seller](http://github.com/cmfatih/amazon-seller) is a [node.js](http://nodejs.org) module for retrieving Amazon seller information.  

amazon-seller on [npm registry](http://npmjs.org/package/amazon-seller)  
[![NPM](https://nodei.co/npm/amazon-seller.png?compact=true)](https://nodei.co/npm/amazon-seller/)

### Installation

For latest release
```
npm install amazon-seller
```

For HEAD
```
git clone https://github.com/cmfatih/amazon-seller.git
```

### Usage

#### Test
```
npm test
```

#### Examples
```javascript
var amzSel = require('amazon-seller');

amzSel.sellerInfo({sellerId: "A3TYU8WJN37NYT", marketplace: "US"}, function(err, data) {
  if(!err) {
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.log(err);
  }
});

// Output
/*
{
  "id": "A3TYU8WJN37NYT",
  "name": "YoYo.com (Quidsi Retail, an Amazon company)",
  "url": {
    "mobile": "http://www.amazon.com/gp/aw/sp.html/?s=A3TYU8WJN37NYT",
    "full": "http://www.amazon.com/gp/aag/details/?seller=A3TYU8WJN37NYT"
  },
  "feedback": {
    "star": 4.8,
    "rating": 29228,
    "history": {
      "d30": {
        "positive": "90%",
        "neutral": "3%",
        "negative": "7%",
        "rating": 658
      },
      "d90": {
        "positive": "94%",
        "neutral": "3%",
        "negative": "4%",
        "rating": 3289
      },
      "d365": {
        "positive": "95%",
        "neutral": "2%",
        "negative": "3%",
        "rating": 11793
      },
      "lifetime": {
        "positive": "96%",
        "neutral": "2%",
        "negative": "2%",
        "rating": 29228
      }
    }
  },
  "marketplace": {
    "id": "ATVPDKIKX0DER",
    "name": "US",
    "url": "www.amazon.com",
    "country": {
      "code": "US",
      "name": "United States"
    }
  }
}
*/
```

### Changelog

For all notable changes see [CHANGELOG.md](https://github.com/cmfatih/amazon-seller/blob/master/CHANGELOG.md)

### License

Copyright (c) 2014 Fatih Cetinkaya (http://github.com/cmfatih/amazon-seller)  
Licensed under The MIT License (MIT)  
For the full copyright and license information, please view the LICENSE.txt file.