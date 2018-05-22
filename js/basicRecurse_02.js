var parseString = function(input) {

  var currentToken = '';
  var currentIndex = 0;
  var a = {                     //RegEx Libary x.match(a.thing)
    bool: /(?<!")(false|true)/, // will match 'true' but not '"true"'
    knull: /(?<!")(null)/,
  }

  var arrayCase = function (){
    let output = [];

    var parseArray = function() {
      if(currentIndex === 0){
        getNextToken();
        parseArray();
      } else if(currentIndex > 0 && currentIndex < input.length){
        // if(currentToken === 'true' || currentToken === 'false'){
        if(currentToken.match(a.bool)){
          output.push(valueCase());
          resetToken();
          return;

        } else {
          getNextToken();
          parseArray();
          return;
        }

      }else if(currentIndex === input.length){
        return;
      }

    }
    parseArray();
    return output;
  }

  /* *********** HELPERS ********************/


  function valueCase() {
      // console.log('valcase', currentToken);
      if (currentToken === 'true') {
        return true;
      } else if (currentToken === 'false') {
        return false;
      }else if (currentToken === 'null'){
        return null;
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
  }

  if(input[0] === '['){
    return arrayCase();
  } else {
    return undefined;
  }
}

// ***************** ASSERTIONS **************************** //
var testStrings = [
  '[]',
  '[false]',
  // '[true, false, false]',
  // '[true, false, null, false]',
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


