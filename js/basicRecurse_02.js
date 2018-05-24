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
          pushAndProceed(false);
        }else if(currentToken === '['){
          resetToken();
          getNextToken();
          output.push(arrayCase());
        } else if(currentToken.match(a.bool)){
          pushAndProceed(true);
        }else if(currentToken.match(a.knull)){
          pushAndProceed(true);
        }else if(currentToken.match(a.knumber) &&
          (input[currentIndex + 1] === ',' || input[currentIndex + 1] === ']')){
          pushAndProceed(true);
        }else if(currentToken.match(a.string)){
          pushAndProceed(true);
        }else {
          getNextToken();
          parseArray();
        }
      }else if(currentIndex === input.length){
        return;
      }
      function pushAndProceed(push){
        if(push === true){
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
    }else if(currentToken.match(a.string)){
      return currentToken.match(a.string)[1];
    }else{
      throw('valueCase() error');
    }
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


