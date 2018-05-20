/*
This is a pre-cursor to building a JSON parser.

This the most basic example of a recursive descent parser you are ever likely to see.
It is good for exactly one thing: getting your first meaningful grasp of the concept.

For this example we have a simple string: 'true' or 'false'

The goal is to parse the string one char at a time and extract the
boolean value of true or false.

chars can be only be a letter a-z

This example uses mutual recursion.
We have a function getNextToken() which calls another function lexer(), which calls getNextToken,
which calls lexer(), which calls... this goes on for a while.

In between calling each other, another function is called which chops the front of the input string
off. When the input string is reduce to nothing, the whole regurgitates the finally discovered
value all the way up and spits it out. Basically it eats a string and vomits a bool.

*/


var parseString = function(input) {
  // you definitely want this instantiated to undefined. As it's a value type JSON doesn't use.
  var output = undefined;
  var currentToken = '';
  var currentIndex = 0;
  //counts how many times getNextToken recurses
  var count = 0;
  // if you pass any value except 'true' or 'false' it will run on forever. this limits it.
  var limit = 10;

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
      } else if (length === 0) {
        // this never gets called! output gets caterpillar passed
        // all the way back to the first instantiated instance
        // which returns it to the original caller
        console.log('this never gets called!');
        // You don't even need this block. I left it here to show that you don't need it.
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
    // to keep it extremely simple, there are only two values that are accepted
    // in this simple version, you actually don't need the 'case' function
    // you can se true or false from here just as easily
    // but if you had a more complex data set, you would want to break it out into helpers
    if(currentToken === 'true') {
      booleanCase();
    } else if (currentToken === 'false'){
      booleanCase();
    }else{
     getNextToken();
    }
  }

  // CASES - in this instance there is only one case

  function booleanCase(token) {
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


var testString1 = 'true' ;
var testString2 = 'false';
// Don't run testString3 without the limiter
// var testString3 = '42';


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



