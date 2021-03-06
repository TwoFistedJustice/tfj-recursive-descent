var parseJson = function (json) {
  var a = {                     //RegEx Libary x.match(a.thing)
    null: /(?<!")(null)/,
    number: /[0-9]/,
    pair: /("(.*)":)/,
  }
  
  var index = 0;
  var jsonLength = json.length;
  
  /*
  never call parseJson once it is run
*/
  
  var parseObject = function () {
    var returnVal = {};
    var jsonString = '{';
    let key = undefined;
    let val = undefined;
  
    while (index < jsonLength){
      let data = parseValue();
      jsonString += data;
     // if there is a following colon
      // set a key
      // otherwise set a value
      if( json[index + 2] === ':' ){
        key = data;
      } else {
        val = data;
      }
      returnVal[key] = val;
     }
    console.log(jsonString)
    return returnVal;
  }

  var trackIndex = function (number) {
    index += number;
  }
  
  var parseValue = function () {
    if (json[index] === '{') {
      
      trackIndex(1);
      return parseObject();
    }
    // else if ( currentIndex === '['){ return parseArray()''}
    else if (json[index] === '\"') {
      // console.log(json[index])
      return parseString();
    }
    else if (json[index].match (a.number) || json[index] === '-') {
      return numify ();
    }
    else if (json[index] === 't') {
      return truthify ();
    }
    else if (json[index] === 'f') {
      return falsify ();
    }
    else if (json[index] === 'n') {
      return nullify ();
    }
    // ENDING DELIMITERS
    else if (json[index] === '}') {
      trackIndex(1);
      return '}';
    }
    else if (json[index] === ':') {
      trackIndex(1);
      return ':';
    }
    else if (json[index] === ' ') {
      trackIndex(1);
      return ' ';
    } else {
      trackIndex(1);
      return json[index]
    }
    // else if ( currentIndex === ''){}
    // trackIndex(arg)
  }
  
  var parseString = function () {
    let beginSearchAt = index + 1;
    let endSearchAt = json.indexOf('"', beginSearchAt);
  
    let str = json.slice(beginSearchAt, endSearchAt);
    // console.log(str)
    // console.log(str.length)
    trackIndex(str.length + 2);
    return str;
  }
  
  var numify = function () {
    // it should search here for phone numbers
    let commaIndex = json.indexOf (',', index);
    let value = json.slice (index, commaIndex);
    trackIndex(value.length);
    return Number(value);
  };
  
  var truthify = function () {
    trackIndex (3);
    return true;
  };

  var falsify = function () {
    trackIndex (4);
    return false;
  };

  var nullify = function () {
    trackIndex (3);
    return null;
  };
  
  return parseValue (json)
}


// ***************** ASSERTIONS **************************** //
var testStrings = [
  '{"x": "y"}',
  // '{"foo": "bar"}',
  // '{"foo": true}',
  // '{"foo": 5}',
  // '{"foo": -5}',
  // '{"foo": -5.000009}',
  // '{"a": "b", "c": "d"}',
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
};