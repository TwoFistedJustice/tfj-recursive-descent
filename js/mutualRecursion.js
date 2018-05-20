// adapted from:
//http://www.rosettacode.org/wiki/Mutual_recursion#JavaScript

// MUTUAL RECURSION

// OUTPUT
// 1,1,2,2,3,3,4,5,5,6,6,7,8,8,9,9,10,11,11,12
// 0,0,1,2,2,3,4,4,5,6,6,7,7,8,9,9,10,11,11,12

function caseF(num) {

  if (num === 0){
    console.log('F', num);
    return 1;
  } else {
    return num - caseM(caseF(num - 1));
  }
}

function caseM(num) {
  console.log('M', num);
  if (num === 0){
    return 0;
  } else {
    return num - caseF(caseM(num - 1));
  }
}

function range(m, n) {
  let a = Array.apply(null, Array(n - m + 1)).map(
    function (x, i) { return m + i; }
  );
  console.log('a = ', a);
  return a;
}

var a = range(0, 19);
// var a = range(0, 4);

//return a new array of the results and join with commas to print
// console.log(a.map(function (n) { return caseF(n); }).join(', '));
// console.log(a.map(function (n) { return caseM(n); }).join(', '));

caseF(4);