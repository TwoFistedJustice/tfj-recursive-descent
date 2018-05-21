
/*
Building an object
Determine whether array or object
  An array is looking for Elements => Element() => Value
  An object is looking or members => Members() => Pair() => {Key() && Value(){}}


*/

var parseString = function(input) {
  // you definitely want this instantiated to undefined. As it's a value type JSON doesn't use.
  // var output = undefined;  // moving from top scope to inner function scope

  // the char or set of chars currently under inspection
  var currentToken = '';

  // the index of input currently being added to currentToken
  var currentIndex = 0;

   //when a pair is found use this
   var pairing = {
     active: false,
     key: undefined
   }
  // sets a limit to prevent infinite loops during development
  // this would be completey removed for production
  var limit = 80;

  //RegEx Library x.match(a.thing)
  var a = {
    string: /"(.*)"/,
    pair: /("(.*)":)/,
    // key: /("(.*)")/,
    bool: /(?<!")(false|true)/, // will match 'true' but not '"true"'
    knull: /(?<!")(null)/,  // because 'null' is a reserved word
  }

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
  function lexer(){
    // without the trim, whitespace will terminate recursion
    currentToken = currentToken.trim();
    if(currentToken === '{' || currentToken === '}') {
      objectCase();
    } else if(currentToken.match(a.pair)){
       pairCase();
    } else if(currentToken.match(a.bool)) {
      // booleanCase();
    } else if(currentToken.match(a.knull)){
      // nullCase()
    } else if(currentToken === ','){
      separatorCase()
    }
    getNextToken();
  }

  // ****** CASES ************
  // parses array opening and closing brace
  // creates the array which will be returned
  /*
    For Monday:
    I think that the scope of object case can do the whole prop set for the object
    fire off getNewToken from here. Return it to here. Then go back to normal sequencing.

    in objectCase:
       Set a let  to store the key
       Set a let  to store the value
    Fire off getNewToken from here and
    return it to the value let
    Then add that whole thing as a prop
    to output
    Then go back to our regular programming :-)


  */
  function objectCase(){

      truncateInput();
    if(currentToken === '{'){
      output = {};
        resetToken();
    } else if(currentToken === '}'){
      resetToken();
      // We're at the end of the string, close up shop and go home
      return;
    } else{
      throw('arrayCase() error');
    }
  }

  function pairCase(){
// set key to undefined
    //set bool to indicate a value is needed (set it back when done)
    truncateInput();
    if(currentToken.match(a.pair)){
      let key = setKey(currentToken);
      pairing.active = true;
      pairing.key = key;
      output[key] = undefined;
      resetToken();
      console.log('if I call getNextToken from here, would it cascade back to here? I think so....');


    }else{
      throw('pairCase: token is not a pair');
    }
  }

  // parses commas
  // separators mean 'the string value is at an end'
  // because they always FOLLOW the value.
  function separatorCase(){}

  // ************** HELPER FUNCTIONS ****************

  function resetToken(){
    currentToken = '';
  }

  // call this after something is found in the input
  var truncateInput = function(){
    if( input.length > 0) {
      // let old = input;
      input = input.slice(currentIndex, input.length);
      currentIndex = 0;
      // console.log('input truncated from ' + old + ' to ' + input);
    } else {
      throw('truncateInput() error: input string has been reduced to zero length');
    }
  };

  return getNextToken();
} // END ParseString()


// it retrieves whatever is between quotes
function setKey(str){
  return str.replace(/"([^"]+(?="))"/g, '$1');
}


// ***************** ASSERTIONS **************************** //


var testStrings = [
  '{}',
  '{"foo": "bar"}',
  '{"a": "b", "c": "d"}',
  '{"foo": true, "bar": false, "baz": null}',
  '{"boolean, true": true, "boolean, false": false, "null": null }',
];



assertObjectsEqual(parseString(testStrings[0]), JSON.parse(testStrings[0])); //
assertObjectsEqual(parseString(testStrings[1]), JSON.parse(testStrings[1])); //
assertObjectsEqual(parseString(testStrings[2]), JSON.parse(testStrings[2]));
assertObjectsEqual(parseString(testStrings[3]), JSON.parse(testStrings[3]));
assertObjectsEqual(parseString(testStrings[4]), JSON.parse(testStrings[4]));


function assertObjectsEqual(actual, expected){
  actual = JSON.stringify(actual);
  expected = JSON.stringify(expected);
  if(actual === expected){
    console.log('PASS: expected \"' + expected + '\", and got \"' + actual + '\"' );
  } else {
    console.log('FAIL: expected \"' + expected + '\", but got \"' + actual + '\"' );
  }
}


