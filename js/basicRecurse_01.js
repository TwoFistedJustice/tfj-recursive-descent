
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
  // you definitely want this instantiated to undefined. As it's a value type JSON doesn't use.
  var output = undefined;

  // the char or set of chars currently under inspection
  var currentToken = '';

  // the index of input currently being added to currentToken
  var currentIndex = 0;

  //RegEx Libary x.match(a.thing)
  // string literals will also work
  var a = {
    bool: /(?<!")(false|true)/, // will match 'true' but not '"true"'
    knull: /(?<!")(null)/,
  }


  // sets a limit to prevent infinite loops during development
  // this would be completey removed for production
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
    // gets passed back and back and back
    return output;
  }

// LEXER DETERMINES WHICH CASE TO CALL
  // you can use literals or RegEx!
  function lexer(){
    // without the trim, whitespace will terminate recursion
    currentToken = currentToken.trim();
    if(currentToken === '[' || currentToken === ']'){
      arrayCase();
    // } else if(currentToken === 'true' || currentToken === 'false') {
    } else if(currentToken.match(a.bool)) {
      booleanCase();
    // } else if(currentToken === 'null'){
    } else if(currentToken.match(a.knull)){
      nullCase()
    } else if(currentToken === ','){
      separatorCase()
    }
    getNextToken();
  }

  // ****** CASES ************
  // parses array opening and closing brace
  // creates the array which will be returned
  function arrayCase(){
      truncateInput();
    if(currentToken === '['){
      output = [];
        resetToken();
    } else if(currentToken === ']'){
      resetToken();
      // We're at the end of the string, close up shop and go home
      return;
    } else{
      throw('arrayCase() error');
    }
  }

  // parses commas
  // separators mean 'the string value is at an end'
  // because they always FOLLOW the value.
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


// ***************** ASSERTIONS **************************** //


var testStrings = [
  '[]',
  '[false]',
  '[true, false, false]',
  '[true, false, null, false]',
];


testStrings.forEach(str => assertObjectsEqual(parseString(str), JSON.parse(str)));

// assertObjectsEqual(parseString(testStrings[0]), JSON.parse(testStrings[0])); // pass
// assertObjectsEqual(parseString(testStrings[1]), [false]); //pass
// assertObjectsEqual(parseString(testStrings[1]), JSON.parse(testStrings[1])); // pass
// assertObjectsEqual(parseString(testStrings[2]), JSON.parse(testStrings[2])); // pass
// assertObjectsEqual(parseString(testStrings[3]), JSON.parse(testStrings[3])); // pass


function assertObjectsEqual(actual, expected){
  actual = JSON.stringify(actual);
  expected = JSON.stringify(expected);
  if(actual === expected){
    console.log('PASS: expected \"' + expected + '\", and got \"' + actual + '\"' );
  } else {
    console.log('FAIL: expected \"' + expected + '\", but got \"' + actual + '\"' );
  }
}

