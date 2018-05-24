/* Converting this to only parse objects with non-array members*/

var parseString = function (input) {
  var currentToken = '';
  var currentIndex = 0;
  var a = {                     //RegEx Libary x.match(a.thing)
    bool: /(?!")(?<!")(false|true)/, // will match 'true' but not '"true"'
    knull: /(?<!")(null)/,
    knumber: /[0-9]/,
    pair: /("(.*)":)/,
    string: /"(.*)"/,
  }
  let key = undefined;
  let output = {};

  var objectCase = function () {


    var parseObject = function () {

      if (currentIndex === 0) {
        getNextToken();
        objectCase()
      } else if (currentIndex > 0 && currentIndex < input.length) {
        if(currentToken === ','){
          proceedObj();

        }
        else if (currentToken.match(a.pair)) {
          key = currentToken.match(a.pair)[2];
          console.log(currentToken)
          proceedObj();

        }
        else if (currentToken.match(a.bool)){
          output[key] = valueCase();
          proceedObj();
        }
        else if (currentToken.match(a.knull)){
          output[key]= null;
          proceedObj();
        }
        else if (currentToken.match(a.knumber)){
          output[key]= Number(currentToken);
          proceedObj();
        }
        else if (currentToken.match(a.string) && input[currentIndex  + 1] !== ":"){
          output[key]= currentToken.match(a.string)[1];
          proceedObj();
        }


        else {
          getNextToken();
          objectCase()
        }
      }
    };  /*  END parseObject()*/

    parseObject();
    // return output
  } /* ********** END OBJECT CASE ******* */

  /* *********** HELPERS ********************/
  function resetToken() {
    currentToken = '';
  }

  function proceedObj(){
    resetToken();
    getNextToken();
    objectCase();
  }


  function valueCase() {
    console.log(currentToken);
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
      // return;
      throw('valueCase() error');
    }
  }

  function getNextToken() {
    // console.log(output)
    currentIndex++;
    currentToken += input[currentIndex];
    currentToken = currentToken.trim();
  }


  objectCase()
  return output;
  // return objectCase();
}


// ***************** ASSERTIONS **************************** //
var testStrings = [
  '{"foo": "bar"}',
  '{"foo": true}',
  '{"a": "b", "c": "d"}',
  '{"foo": true, "bar": false}',
  '{"foo": true, "bar": false, "baz": null}',
  // '{"boolean, true": true, "boolean, false": false, "null": null }',

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


