var parseString = function (input) {

  var currentToken = '';
  var currentIndex = 0;
  var a = {                     //RegEx Libary x.match(a.thing)
    bool: /(?<!")(false|true)/, // will match 'true' but not '"true"'
    knull: /(?<!")(null)/,
    knumber: /[0-9]/,
    pair: /("(.*)":)/,
    string: /"(.*)"/,
  }

  var arrayCase = function () {
    let output = [];

    var parseArray = function () {
      if (currentIndex === 0) {
        getNextToken();
        parseArray();
      } else if (currentIndex > 0 && currentIndex < input.length) {
        if (currentToken === ',') {
          pushAndProceed(false);
        } else if (currentToken === '[') {
          resetToken();
          getNextToken();
          output.push(arrayCase());
        } else if (currentToken.match(a.bool)) {
          pushAndProceed(true);
        } else if (currentToken.match(a.knull)) {
          pushAndProceed(true);
        } else if (currentToken.match(a.knumber) &&
          (input[currentIndex + 1] === ',' || input[currentIndex + 1] === ']')) {
          pushAndProceed(true);
        } else if (currentToken.match(a.string)) {
          pushAndProceed(true);
        } else {
          getNextToken();
          parseArray();
        }
      } else if (currentIndex === input.length) {
        return;
      }

      // Helper for parseArray
      function pushAndProceed(push) {
        if (push === true) {
          output.push(valueCase());
        }
        resetToken();
        getNextToken();
        parseArray();
      }
    }
    parseArray();
    return output;
  } // END ARRAY CASE


  var objectCase = function () {
    let output = {};

    var parseObject = function () {
      if (currentIndex === 0) {
        getNextToken();
        parseObject();
      } else if (currentIndex > 0 && currentIndex < input.length) {

        if (currentToken.match(a.pair)) {
          let key = setKeyAsPair();
          let val = parsePairValue();
          output[key] = val;
        } else {
          getNextToken();
          parseObject();
        }
      } else if (currentIndex === input.length) {
        return;
      }

      function parsePairValue() {
        proceed();
        // if(currentToken.match(a.bool)){/*BOOL*/}
        // else if(currentToken.match(a.knull)){/*KNULL*/}
        // else if(currentToken.match(a.knumber) && (input[currentIndex + 1] === ','){/*KNUMBER*/}
        // else if(currentToken.match(a.string)){/*STRING*/
        if (currentToken.match(a.string)) {/*STRING*/
          return valueCase();

        }
        // else if(){/*OBJECT*/}
        // else if(){/*ARRAY*/}
      }

      function proceed() {
        resetToken();
        getNextToken();
        parseObject();
      }

      // it retrieves whatever is returned by the regex libary
      function setKeyAsPair() {
        // console.log(currentToken.match(a.pair))
        return currentToken.match(a.pair)[2];
      }

    };

    parseObject();
    return output;
  } // END OBJECT CASE

  /* *********** HELPERS ********************/


  function valueCase() {
    // console.log('valcase', currentToken);
    if (currentToken === 'true') {
      return true;
    } else if (currentToken === 'false') {
      return false;
    } else if (currentToken === 'null') {
      return null;
    } else if (currentToken.match(a.knumber)) {
      return Number(currentToken);
    } else if (currentToken.match(a.string)) {
      return currentToken.match(a.string)[1];
    } else {
      throw('valueCase() error');
    }

    resetToken();
  }

  function resetToken() {
    currentToken = '';
  }

  function getNextToken() {
    currentIndex++;
    currentToken += input[currentIndex];
    currentToken = currentToken.trim();
  }

  if (input[0] === '[') {
    return arrayCase();
  } else if (input[0] === '{') {
    return objectCase();
  } else {
    return undefined;
  }
}

// ***************** ASSERTIONS **************************** //
var testStrings = [
  // '[]',
  // '[false]',
  // '[true, false, false]',
  // '[true, false, null, false]',
  // '[true, false,[ null, false]]',
  // '[1, 3, 44, 1]',
  // '[1, 3, -1]',
  // '[1, 0, -1, -0.3, 0.3, 1343.32, 3345, 0.00011999999999999999]',
  // '["one", "two"]',
  // '{"foo": "bar"}',
  // '{"a": "b", "c": "d"}',
  // '{"foo": true, "bar": false, "baz": null}',
  // '{"boolean, true": true, "boolean, false": false, "null": null }',
  // '[]',
  '{}',
  '{"foo": ""}',
  '{"foo": "bar"}',

  // '["one", "two"]',
  // '{"a": "b", "c": "d"}',
  // '[null,false,true]',
  // '{"foo": true, "bar": false, "baz": null}',
  //
  // '[1, 0, -1, -0.3, 0.3, 1343.32, 3345, 0.00011999999999999999]',
  //
  '{"boolean, true": true, "boolean, false": false, "null": null }',
  //
  // // basic nesting
  // '{"a":{"b":"c"}}',
  // '{"a":["b", "c"]}',
  // '[{"a":"b"}, {"c":"d"}]',
  '{"a":[],"c": {}, "b": true}',
  // '[[[["foo"]]]]',

];


testStrings.forEach(str => assertObjectsEqual(parseString(str), JSON.parse(str)));


function assertObjectsEqual(actual, expected) {
  actual = JSON.stringify(actual);
  expected = JSON.stringify(expected);
  if (actual === expected) {
    console.log('PASS: expected \"' + expected + '\", and got \"' + actual + '\"');
  } else {
    console.log('FAIL: expected \"' + expected + '\", but got \"' + actual + '\"');
  }
}


