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
      currentToken = currentToken.trim();
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
  // '[]',
  // '[false]',
  // '[true, false, false]',
  // '[true, false, null, false]',
  '[true, false,[ null, false]]',
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


