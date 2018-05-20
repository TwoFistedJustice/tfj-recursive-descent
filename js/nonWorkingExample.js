// this is adapted from a thread on StackOverflow
// it was originally written in C#. I converted it to JavaScripsh (sic)
// It doesn't actually work. But it gives the general idea.

/*

S -> if E then S | if E then S else S | begin S L | print E

L -> end | ; S L

E -> i
*/

// is this the lexer?
function getNextToken() {
  // get the next character in the string
};

var currentToken = 'The next variable in the input string. ';

// this is actually C#
function S() {
  // if ('if')
  //  call E()
  // then check for 'then' or 'else'
  if (currentToken === "if") {
    getNextToken();
    E();

    if (currentToken === "then") {
      getNextToken();
      S();

      if (currentToken === "else") {
        getNextToken();
        S();
        return;
      }
    } else {
      throw ("Procedure S() expected a 'then' token " + "but received: " + currentToken);
    }
  } else if (currentToken === "begin") {
    getNextToken();
    S();
    L();
    return;
  } else if (currentToken === "print") {
    getNextToken();
    E();
    return;
  } else {
    throw ("Procedure S() expected an 'if' or 'then' or else or begin or print  token " + "but received: " + currentToken);
  }
}
}


function L() {
  if (currentToken === "end") {
    getNextToken();
    return;
  } else if (currentToken === ";") {
    getNextToken();
    S();
    L();
    return;
  } else {
    throw ("Procedure L() expected an 'end' or ';' token " + "but received: " + currentToken);
  }
}


function E() {
  if (currentToken === "i") {
    getNextToken();
    return;
  } else {
    throw ("Procedure E() expected an 'i' token " + "but received: " + currentToken);
  }
}