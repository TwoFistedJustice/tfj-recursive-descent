
/*
For this example we have two Classes: Containers and Values
Containers are always of Type: Array
Values can be of Type: Boolean or Null

chars can be array braces, commas, or letters.
  all chars symbolize either a Type or a Separator
    A brace indicates a Container
    A letter indicates a Value
    A comma indicates a Separator.
        It indicates a break between Values and is thrown out after recognition.

The first char in the string is a square brace
  this tells us it is a Container of Type array
  so we call the Array case

  Arrays:
  Arrays are comma separated
  Everything not a comma is kept.
  We search for string literals.
        (Regex would be more adaptable, but literals are easier to understand)
        Actually we use both. There is some RegEx in the lexer along with literal
        notation commented out for comparison.
  When something is found, we determine what Type of 'Value' it is
    if 'true' or 'false' it is a boolean - we call Boolean() case
    if 'null' -- we call Null() case

  Then get the next char from the input string

  Repeat until we run out of chars
*/

var parseString = function(input) {
  var output = undefined; // moving into a lower scope
  var currentToken = '';
  var currentIndex = 0;
  var a = {                     //RegEx Libary x.match(a.thing)
    bool: /(?<!")(false|true)/, // will match 'true' but not '"true"'
    knull: /(?<!")(null)/,
  }

  var limit = 80;

  var getNextToken = function(){
    if(limit > 0) {
      limit--;
      let length = input.length;

      if (length > 0) {
        currentToken += input[currentIndex];
        currentIndex++;
        lexer();
      }
    } // end limit
    return output;
  }

// LEXER
  function lexer(){

    currentToken = currentToken.trim();
    if(currentToken === '[' || currentToken === ']'){
      arrayCase();
    } else if(currentToken.match(a.bool) || currentToken.match(a.knull)) {
      valueCase();
    } else if(currentToken === ','){
      truncateInput();
      resetToken();
    }
    getNextToken();
  }

  // ****** CASES ************

  function arrayCase(){
    // let output = [];
    truncateInput();
    if(currentToken === '['){
      output = [];
      resetToken();
    } else if(currentToken === ']'){
      resetToken();
      return;
    } else{
      throw('arrayCase() error');
    }

    // return output;
  }


  function valueCase() {
    truncateInput();
    if(output.constructor === Array){
      if (currentToken === 'true') {
        output.push(true);
      } else if (currentToken === 'false') {
        output.push(false);
      }else if (currentToken === 'null'){
        output.push(null);
      }

    } else{
      throw('valueCase() error');
    }
    resetToken();
  }


  // ************** HELPER FUNCTIONS ****************

  function resetToken(){
    currentToken = '';
  }

  // call this after something is found in the input
  var truncateInput = function(){
    if( input.length > 0) {
      let old = input;
      input = input.slice(currentIndex, input.length);
      currentIndex = 0;
      // console.log('input truncated from ' + old + ' to ' + input);
    } else {
      throw('truncateInput() error: input string has been reduced to zero length');
    }
  };

  getNextToken();
  return output;
  // return getNextToken();  //this works too
} // END ParseString()


// ***************** ASSERTIONS **************************** //


var testStrings = [
  '[]',
  '[false]',
  '[true, false, false]',
  '[true, false, null, false]',
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


