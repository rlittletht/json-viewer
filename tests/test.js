
var unwrapQuotedJsonInPlace = require('../extension/src/json-viewer/unwrapQuotedJson.js');
var util = require('util');

var sQuotedJson = JSON.stringify({test: 2, test2: "3"});

var sQuotedJsonArray = JSON.stringify([{ test: 2, test2: 3 }, { test: 3, test2: 4 }]);

var objInner = {
    InnerTest: 21,
    InnerTest2: 12,
//    BrokenJson: "{\" but not json",
    InnerString: "String",
    InnerJson: sQuotedJson
};

var obj = {
    "Test": 1,
    "Test2": 2,
    "Wrapped": "foo",
    SubObject: objInner,
    SubArray: sQuotedJsonArray
};

console.log("Before: " + 
    util.inspect(obj, {
    depth: null,
    colors: true
}));
var results = { fFoundJson: false};

obj = unwrapQuotedJsonInPlace(obj, results);
console.log("return: " + results.fFoundJson);

console.log("After:  " + 
util.inspect(obj, {
    depth: null,
    colors: true
}));