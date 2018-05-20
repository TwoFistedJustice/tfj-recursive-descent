

var parseString = function(input) {
  // you definitely want this instantiated to undefined. As it's a value type JSON doesn't use.
  var output = undefined;
  var currentToken = '';
  var currentIndex = 0;
  //counts how many times getNextToken recurses
  var count = 0;
  // sets a limit to prevent infinite loops during development
  var limit = 20;

  var getNextToken = function(){
    if(limit > 0) {
      limit--;
      let length = input.length;
      console.log('top- output, count, length', output, count, length);

      if (length > 0) {
        currentToken += input[currentIndex];
        currentIndex++;
        // console.log('getNextToken token, index: ', currentToken, currentIndex, output);
        lexer();
      } else {
        throw('getNextToken terminate');
      }
    } // end limit
    count++;
    console.log('bottom- output, count, length', output, count, length);
    // gets passed back and back and back
    return output;
  }

// LEXER DETERMINES WHICH CASE TO CALL
  function lexer(){
    if(currentToken === 'true' || currentToken === 'false') {
      booleanCase();
    } else{
      getNextToken();
    }
  }

  // CASES - in this instance there is only one case

  function booleanCase() {
    truncateInput();
    // console.log('booleanCase: token is a ' + typeof(currentToken) + ' that reads: \"' + currentToken +'\"')
    if (currentToken === 'true') {
      output =  true;
    } else if (currentToken === 'false') {
      output = false;
    } else{
      throw('error in booleanCase function');
    }
  }

  // call this after something is found in the input
  var truncateInput = function(){
    if( input.length > 0) {
      let old = input;
      input = input.slice(currentIndex, input.length);
      currentIndex = 0;
      console.log('input truncated from ' + old + ' to ' + input);
    } else {
      throw('input string has been reduced to zero length');
    }
  };

  return getNextToken();

} // END ParseString()

// ***************** Tests **************************** //

// CASES
function arrayCase(){}
function nullCase(){}




var testStrings = [
  '[true, false, null, false]',
];

assertEqual(parseString(testString1), true);
assertEqual(parseString(testString2), false);
// assertEqual(parseString(testString3), undefined);

function assertEqual(actual, expected){
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
