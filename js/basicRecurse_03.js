var parseString = function(input) {

  var currentToken = '';
  var currentIndex = 0;
  var a = {                     //RegEx Libary x.match(a.thing)
    bool: /(?<!")(false|true)/, // will match 'true' but not '"true"'
    knull: /(?<!")(null)/,
    knumber: /[0-9]/,
    pair: /("(.*)":)/,
    string: /"(.*)"/,
  }

  var arrayCase = function (){
    let output = [];

    var parseArray = function() {
      if(currentIndex === 0){
        getNextToken();
        parseArray();
      } else if(currentIndex > 0 && currentIndex < input.length){
        if(currentToken === ','){
          proceed();
        }else if(currentToken === '['){
          resetToken();
          getNextToken();
          output.push(arrayCase());
        } else if(currentToken.match(a.bool)){
          output.push(valueCase());
          proceed();
        }else if(currentToken.match(a.knull)){
          output.push(null);
          proceed();
        }else if(currentToken.match(a.knumber) &&
          (input[currentIndex + 1] === ',' || input[currentIndex + 1] === ']')){
          output.push(valueCase());
          proceed();
        }else {
          getNextToken();
          parseArray();
        }
      }else if(currentIndex === input.length){
        return;
      }
      function proceed(){
        resetToken();
        getNextToken();
        parseArray();
      }
    }
    parseArray();
    return output;
  } // END ARRAY CASE



  var objectCase = function(){
    let output = {};

    var parseObject = function(){
      // do stuff with objects

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
    }else if (currentToken === 'null'){
      return null;
    }else if(currentToken.match(a.knumber)){
      return Number(currentToken);

    }else{
      throw('valueCase() error');
    }

    resetToken();
  }

  function resetToken(){
    currentToken = '';
  }

  function getNextToken () {
    currentIndex++;
    currentToken += input[currentIndex];
    currentToken = currentToken.trim();
  }

  if(input[0] === '['){
    return arrayCase();
  } else if(input[0] === '{'){
    return objectCase();
  } else {
    return undefined;
  }
}

// ***************** ASSERTIONS **************************** //
var testStrings = [
  '[]',
  '[false]',
  '[true, false, false]',
  '[true, false, null, false]',
  '[true, false,[ null, false]]',
  '[1, 3, 44, 1]',
  '[1, 3, -1]',
  '[1, 0, -1, -0.3, 0.3, 1343.32, 3345, 0.00011999999999999999]',
  '["one", "two"]',
  // '{"foo": "bar"}',
  // '{"a": "b", "c": "d"}',
  // '{"foo": true, "bar": false, "baz": null}',
  // '{"boolean, true": true, "boolean, false": false, "null": null }',


];


testStrings.forEach(str => assertObjectsEqual(parseString(str), JSON.parse(str)));


function assertObjectsEqual(actual, expected){
  actual = JSON.stringify(actual);
  expected = JSON.stringify(expected);
  if(actual === expected){
    console.log('PASS: expected \"' + expected + '\", and got \"' + actual + '\"' );
  } else {
    console.log('FAIL: expected \"' + expected + '\", but got \"' + actual + '\"' );
  }
}


