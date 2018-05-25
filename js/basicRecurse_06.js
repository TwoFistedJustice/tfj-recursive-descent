var parseJson = function (json) {
  var a = {                     //RegEx Libary x.match(a.thing)
    knull: /(?<!")(null)/,
    knumber: /[0-9]/,
    pair: /("(.*)":)/,
  }
  
  var currentIndex = 0;
  var jsonLength = json.length;
  
  /*
  never call parseJson once it is run
*/
  
  var parseObject = function () {
    var returnVal = {};
    //use a for loop here or a while loop
    return returnVal;
  }
  // track where we are in the string
  // increase the index the number received
  // the number is the length -1 of the value processed
  var trackIndex = function (number) {
    //could check current location and if it is a separator char, just increment index
    currentIndex += number;
  }
  
  var parseValue = function () {
    // looks at char stored at currentIndex
    // decides what to call next
    if (currentIndex === '"') {
      return parseString ();
    }
    else if (json[currentIndex].match (a.knumber) || json[currentIndex] === '-') {
      return numify ();
    }
    else if (currentIndex === '{') {
      return parseObject ();
    }
    // else if ( currentIndex === '['){ return parseArray()''}
    else if (currentIndex === 't') {
      return truthify ();
    }
    else if (currentIndex === 'f') {
      return falsify ();
    }
    else if (currentIndex === 'n') {
      return knullify ();
    }
    // ENDING DELIMITERS
    else if (currentIndex === '}') {
      return;
    }
    else if (currentIndex === ':') {
      return;
    }
    else if (currentIndex === ' ') {
      return;
    }
    // else if ( currentIndex === ''){}
    // trackIndex(arg)
  }
  
  var parseString = function () {
    // handles string values
  }
  
  var numify = function () {
    // it can search here for phone numbers
    let commaIndex = json.indexOf (',', 0);
    let value = json.slice (0, commaIndex);
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
  
  var knullify = function () {
    trackIndex (3);
    return null;
  };
  
  
  return parseValue (json)
}


// ***************** ASSERTIONS **************************** //
var testStrings = [
  '{"x": "y"}',
  '{"foo": "bar"}',
  '{"foo": true}',
  '{"foo": 5}',
  '{"foo": -5}',
  '{"foo": -5.000009}',
  '{"a": "b", "c": "d"}',
  // '{"foo": true, "bar": false}',
  // '{"foo": true, "bar": false, "baz": null}',
  '{"boolean, true": true, "boolean, false": false, "null": null }',

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


