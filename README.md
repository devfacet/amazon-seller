## Amazon Seller

  [amazon-seller](http://github.com/cmfatih/amazon-seller) is a [node.js](http://nodejs.org) module for retrieving Amazon seller information.  

  amazon-seller on [npm registry](http://npmjs.org/package/amazon-seller)

### Installation

For latest published version
```
npm install amazon-seller
```

or for HEAD version
```
git clone https://github.com/cmfatih/amazon-seller.git
```

### Usage

#### Test
```
npm test
```

#### Example
```javascript
var mAmzSel = require('amazon-seller');

mAmzSel.sellerInfo({sellerId: "A3TYU8WJN37NYT", marketplace: "US"}, function(err, data) {
  if(!err) {
    console.log(JSON.stringify(data, null, 2));
  }
  else {
    console.log("ERROR!:" + JSON.stringify(err, null, 2));
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
    "rating": 25771,
    "history": {
      "d30": {
        "positive": "93%",
        "neutral": "2%",
        "negative": "5%",
        "rating": 1389
      },
      "d90": {
        "positive": "94%",
        "neutral": "2%",
        "negative": "3%",
        "rating": 5366
      },
      "d365": {
        "positive": "95%",
        "neutral": "2%",
        "negative": "3%",
        "rating": 10868
      },
      "lifetime": {
        "positive": "96%",
        "neutral": "2%",
        "negative": "2%",
        "rating": 25771
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
