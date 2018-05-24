/* Converting this to only parse objects with non-array members*/

var parseString = function (input) {
  var currentToken = '';
  var currentIndex = 0;
  var a = {                     //RegEx Libary x.match(a.thing)
    // bool: /(?!")(?<!")(false|true)/, // will match 'true' but not '"true"'
    knull: /(?<!")(null)/,
    knumber: /[0-9]/,
    pair: /("(.*)":)/,
    string: /"(.*)"/,
  }
  let key = undefined;
  let output = {};
  var doTrim = false;


  var parseObject = function () {

    if (currentIndex === 0) {
      getNextToken();
      parseObject()
    } else if (currentIndex > 0 && currentIndex < input.length) {
      if(currentToken === ','){
        proceedObj();

      }
      else if(input[currentIndex + 1] === '\"'){
        getNextToken();
        parseObject();
      }
      else if (currentToken.match(a.pair)) {
        key = currentToken.match(a.pair)[2];
        doTrim = true;
        proceedObj();

      }
      else if (currentToken === 'true' || currentToken === 'false'){
        output[key] = valueCase();
        doTrim = false;
        proceedObj();
      }
      else if (currentToken.match(a.knull)){
        output[key]= null;
        doTrim = false;
        proceedObj();
      }
      else if (currentToken.match(a.knumber)){
        output[key]= Number(currentToken);
        doTrim = false;
        proceedObj();
      }
      else if (currentToken.match(a.string) && input[currentIndex  + 1] !== ":"){
        output[key]= currentToken.match(a.string)[1];
        doTrim = false;
        proceedObj();
      }


      else {
        getNextToken();
        parseObject()
      }
    }
  };  /*  END parseObject()*/


  /* *********** HELPERS ********************/
  function resetToken() {
    currentToken = '';
  }

  function proceedObj(){
    resetToken();
    getNextToken();
    parseObject();
  }


  function valueCase() {
    // console.log('**************************',currentToken);
    if (currentToken === 'true') {
      return true;
    } else if (currentToken === 'false') {
      return false;
    }else if (currentToken === 'null'){
      return null;
    }else if(currentToken.match(a.knumber)){
      return Number(currentToken);
    }else if(currentToken.match(a.string)){
      return currentToken.match(a.string)[1];
    }else{
      throw('valueCase() error');
    }
  }

  function getNextToken() {
    // console.log(output)
    currentIndex++;
    currentToken += input[currentIndex];
    if(doTrim === true){
      currentToken = currentToken.trim();
    }

  }

  parseObject();

  return output;
  // return parseObject();
}


// ***************** ASSERTIONS **************************** //
var testStrings = [
  '{"foo": "bar"}',
  '{"foo": true}',
  '{"a": "b", "c": "d"}',
  '{"foo": true, "bar": false}',
  '{"foo": true, "bar": false, "baz": null}',
  '{"boolean, true": true, "boolean, false": false, "null": null }',

];


// testStrings.forEach(str => console.log(JSON.stringify(JSON.parse(str))));
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