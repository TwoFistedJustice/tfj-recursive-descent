/* Converting this to only parse objects with non-array members*/

var parseJson = function (json) {
  var a = {                     //RegEx Libary x.match(a.thing)
    // bool: /(?!")(?<!")(false|true)/, // will match 'true' but not '"true"'
    knull: /(?<!")(null)/,
    knumber: /[0-9]/,
    pair: /("(.*)":)/,
    // string: /"(.*)"/,
  }

  // var obj = undefined;
  /*
  11:30 PM
  Need to determine what is a key and what is a value
  the second pair is not being recognized....
  a pair  is string followed by a :

  every time parseObject is called, a new object is created... bad!
  ... move the obj dec into main function, maybe down in value setters?

*/
   var parseObject = function (json) {
      let obj = {};
      let key = undefined;
      let keyIndex = json.indexOf('"', 1);
      let colonIndex = json.indexOf(':', 1) + 1;
      let nextJson = json.slice(colonIndex, json.length).trim();
      key = json.slice(1, keyIndex);
      obj[key] = parseJson(nextJson);;
      return obj;
    }

    /* *********** VALUE SETTERS ********************/


    if (json[0] === 't') {
      let nextJson = json.slice(3, json.length);
      parseJson(nextJson);
      return true;
    } else if (json[0] === 'f') {
      let nextJson = json.slice(4, json.length);
      parseJson(nextJson);
      return false;
    } else if (json[0] === 'n') {
      let nextJson = json.slice(3, json.length);
      parseJson(nextJson);
      return null;
    } else if (json[0].match(a.knumber) || json[0] === '-') {
      let lastIndex = json.indexOf(',', 1);
      let value = json.slice(0, lastIndex);
      let nextJson = json.slice(lastIndex, json.length).trim();
      parseJson(nextJson);
      return Number(value);
    } else if (json[0] === '"') {
      let lastIndex = json.indexOf('"', 1);
      let value = json.slice(1, lastIndex);
      let nextJson = json.slice(lastIndex + 1, json.length).trim();
      parseJson(nextJson);
      return value;
    } else if (json[0] === '{'){

      return parseObject(json.slice(1, json.length));
    } else if (json[0] === ',') {
      return parseObject(json.slice(1, json.length).trim());
    }


}


// ***************** ASSERTIONS **************************** //
var testStrings = [
  // '{"foo": "bar"}',
  // '{"foo": true}',
  // '{"foo": 5}',
  // '{"foo": -5}',
  // '{"foo": -5.000009}',
  '{"a": "b", "c": "d"}',
  '{"foo": true, "bar": false}',
  '{"foo": true, "bar": false, "baz": null}',
  '{"boolean, true": true, "boolean, false": false, "null": null }',

];


// testStrings.forEach(str => console.log(JSON.stringify(JSON.parse(str))));
testStrings.forEach(str => assertObjectsEqual(parseJson(str), JSON.parse(str)));

function assertObjectsEqual(actual, expected) {
  actual = JSON.stringify(actual);
  expected = JSON.stringify(expected);
  if (actual === expected) {
    console.log('PASS: expected \"' + expected + '\", and got \"' + actual + '\"');
  } else {
    console.log('FAIL: expected \"' + expected + '\", but got \"' + actual + '\"');
  }
}