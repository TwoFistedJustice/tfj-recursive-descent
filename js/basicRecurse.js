

var parseString = function(input) {
  // you definitely want this instantiated to undefined. As it's a value type JSON doesn't use.
  var output = undefined;
  // currentValue will get added to output, which will be an object or array
  var currentValue = undefined;
  // the char or set of chars currently under inspection
  var currentToken = '';
  // the index of input currently being added to currentToken
  var currentIndex = 0;
  //counts how many times getNextToken recurses
  var count = 0;
  // sets a limit to prevent infinite loops during development
  var limit = 80;


  var getNextToken = function(){
    if(limit > 0) {
      limit--;
      let length = input.length;

      if (length > 0) {
        currentToken += input[currentIndex];
        currentIndex++;
        // console.log('token: ' + currentToken + ' index: ' + currentIndex);
        lexer();
      }

    } // end limit
    count++;
    // console.log('bottom- output, count, length', output, count, length);
    // gets passed back and back and back
    return output;
  }

// LEXER DETERMINES WHICH CASE TO CALL
  function lexer(){
    // console.log('lexer', currentToken)
    currentToken = currentToken.trim();
    if(currentToken === '[' || currentToken === ']'){
      arrayCase();
    } else if(currentToken === 'true' || currentToken === 'false') {
      booleanCase();
    } else if(currentToken === 'null'){
      nullCase()
    } else if(currentToken === ','){
      separatorCase()
    }
    getNextToken();
  }

  // CASES - in this instance there is only one case
  // parses array opening and closing brace
  function arrayCase(){
    // if(input.length > 0){
      truncateInput();
    // }

    if(currentToken === '['){
      output = [];
        resetToken();
    } else if(currentToken === ']'){
      resetToken();
      // close up shop and go home
      return;
    } else{
      throw('arrayCase() error');
    }
  }

  // parses commas, quotes, colons
  // separators mean 'the string is at an end'
  // they always FOLLOW the string.
  // opening quote doesn't matter, throw it out -- only a CLOSING quote matter!
  function separatorCase(){
    if(currentToken === ','){
       truncateInput();
       resetToken();
    }
  }

  function booleanCase() {
    truncateInput();
    if(output.constructor === Array){
      // console.log('push', currentToken)
      if (currentToken === 'true') {
        output.push(true);

      } else if (currentToken === 'false') {
        output.push(false);
      }
    } else{
      throw('booleanCase() error');
    }
    resetToken();
  }


  function nullCase(){
    truncateInput();
    if(output.constructor === Array){
      if(currentToken === 'null'){
        output.push(null);
      }
    } else{
      throw('null case, output is not an array')
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

  return getNextToken();
} // END ParseString()

// ***************** Tests **************************** //

// CASES TO IMPLEMENT

function nullCase(){}




var testStrings = [
  '[]',
  '[false]]',
  '[true, false, false]',
  '[true, false, null, false]',
  '[1, 0, -1]',
  '[1, 0, -1, -0.4, 0.4, 1234.56, 1122334, 0.00011999999999999999]',
];



assertObjectsEqual(parseString(testStrings[0]), JSON.parse(testStrings[0])); // pass
assertObjectsEqual(parseString(testStrings[1]), [false]); //pass
assertObjectsEqual(parseString(testStrings[2]), [true, false, false]);
assertObjectsEqual(parseString(testStrings[3]), [true, false, null, false]);
// assertObjectsEqual(parseString(testString4), undefined);

function assertEqual(actual, expected){
  if(actual === expected){
    console.log('PASS: expected \"' + expected + '\", and got \"' + actual + '\"' );
  } else {
    console.log('FAIL: expected \"' + expected + '\", but got \"' + actual + '\"' );
  }
}

function assertObjectsEqual(actual, expected){
  actual = JSON.stringify(actual);
  expected = JSON.stringify(expected);
  if(actual === expected){
    console.log('PASS: expected \"' + expected + '\", and got \"' + actual + '\"' );
  } else {
    console.log('FAIL: expected \"' + expected + '\", but got \"' + actual + '\"' );
  }
}



/*
For this example we have two Classes: Containers and Values
Containers are always of Type: Array
Values can be of Type: Boolean or Null

chars can be '[', ']', ',', or a letter a-z
  all chars symbolize either a Type or a Separator
    A brace indicates a Container
    A letter indicates a Value
    A comma indicates a Separator. It indicates a break between Values and is not processed.

The first nextChar in the string is a square brace
  this tells us it is a Container of Type array
  so I call the Container-Array case

  Array()
  Arrays are comma separated
  So I search to the next comma
  fetch everything between the two commas, ignoring whitespace - this the Value
  Determine what Type 'Value' is
    if 'true' or 'false' it is a boolean - call Boolean() case
    if 'null' call Null() case

  get the nextChar()

There are two ways to do this:
  Pure recursion, which always gets the next char and compares it until it gets to one that tells it to return.
    In this case fetch 't', 'r', 'u', and 'e' where it then finds a comma. Concat those chars into a string 'true'.
    Then determine that it represents a True-boolean. Process it as such.

  Or parse out chunks of the string. Find the next comma, return everything in between. Do the rest as above.

*/
