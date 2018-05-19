
var parseString = function(input) {

  var currentChar = null;

  // call this after something is found in the input
var truncateString = function(first, last){
  if( input.length > 0) {
    input = input.slice(first, last);
  } else {
    throw('input string has been reduced to zero length');
  }
};

// call this after EVERY operation
var getNextChar = function(){
  if(input.length > 0){
     currentChar = input[0];
  } else {
    throw('input string has been reduced to zero length');
  }
};

// DETERMINES WHICH CASE TO CALL
function lexer(char){
  // checks char using RegEx
  // calls appropriate case
  if(currentChar === '['){
    // do something call the next stuff
  } else if(currentChar === ']'){
    // terminate the array operation
  } else if (currentChar === ','){
    // do something
  } else if (currentChar == 'some Regular expression for a letter'){
    // do something
  } else{
    throw('some error message');
  }

}

// CASES
function arrayCase(){}
function booleanCase(){}
function nullCase(){}



getNextChar();
console.log(currentChar);


} // END ParseString()


function lexer(json){

}


function parser(terminal){

}



var testStrings = [
  '[true, false, null, false]',
];

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


// console.log(parseString(testStrings[0]));
parseString(testStrings[0]);