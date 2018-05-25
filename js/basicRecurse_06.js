var parseJson = function (json) {
  var a = {                     //RegEx Libary x.match(a.thing)
    knull: /(?<!")(null)/,
    knumber: /[0-9]/,
    pair: /("(.*)":)/,
  }
  /*
  It can't set the second key due to scope
  maybe pass the object along as an arg?
  try passing the first object along
*/
  var obj = undefined;
  var key = undefined;
  var array = [];
  
  var parseObject = function (json) {
    // var obj = {};
    let keyIndex = json.indexOf ('"', 1);
    let colonIndex = json.indexOf (':', 1) + 1;
    key = json.slice (1, keyIndex);
    json = json.slice (colonIndex - 1, json.length).trim ();
    
    obj[key] = parseValue(json);
    
    // console.log('returned collection', obj )
    return obj;
  }
  /* *********** VALUE SETTERS ********************/
  
  
  var parseValue = function (json) {
    if (json[0] === 't') {
      json = json.slice (3, json.length);
      parseValue(json);
      return true;
    }
    
    else if (json[0] === 'f') {
      json = json.slice (4, json.length);
      parseValue(json);
      return false;
    }
    
    else if (json[0] === 'n') {
      json = json.slice (3, json.length);
      parseValue(json);
      return null;
    }
    
    else if (json[0].match (a.knumber) || json[0] === '-') {
      let lastIndex = json.indexOf (',', 1);
      let value = json.slice (0, lastIndex);
      json = json.slice (lastIndex, json.length).trim ();
      parseValue(json);
      return Number (value);
    }
    
    else if (json[0] === '"') {
      // if (json[0] === '"') {
      let lastIndex = json.indexOf ('"', 1);
      let value = json.slice (1, lastIndex);
      json = json.slice (lastIndex + 1, json.length).trim ();
      parseValue(json);
      return value;
    }
    
    else if (json[0] === '{') {
      obj = {};
      let thing = parseObject (json.slice (1, json.length));
      // return parseObject(json.slice(1, json.length));
      return thing;
    }
    
    else if (json[0] === ':') {
      // sets the value half of 'key:value:
      json = json.slice (1, json.length).trim ();
      return parseValue(json);
    }
    
    else if (json[0] === ',') {
      let thing = parseObject (json.slice (1, json.length).trim ());
      return thing;
    } else {
      return;
    }
  }
  return parseValue(json)
}


// ***************** ASSERTIONS **************************** //
var testStrings = [
  // '{"x": "y"}',
  // '{"foo": "bar"}',
  // '{"foo": true}',
  // '{"foo": 5}',
  // '{"foo": -5}',
  // '{"foo": -5.000009}',
  '{"a": "b", "c": "d"}',
  // '{"foo": true, "bar": false}',
  // '{"foo": true, "bar": false, "baz": null}',
  // '{"boolean, true": true, "boolean, false": false, "null": null }',

];


// testStrings.forEach(str => console.log(JSON.stringify(JSON.parse(str))));
testStrings.forEach (str => assertObjectsEqual (parseJson (str), JSON.parse (str)));

function assertObjectsEqual(actual, expected) {
  actual = JSON.stringify (actual);
  expected = JSON.stringify (expected);
  if (actual === expected) {
    console.log ('PASS: expected \"' + expected + '\", and got \"' + actual + '\"');
  } else {
    console.log ('FAIL: expected \"' + expected + '\", but got \"' + actual + '\"');
  }
}


