const matchWithoutSuffix = (string1, string2) => {
  let smallString = string1;
  let largeString = string2;

  if (string1.length < 3) {
    return false;
  }

  if (string1.length === string2.length) {
    return false;
  }

  if (string1.length > string2.length) {
    largeString = string1;
    smallString = string2;
  }

  let i = 0;
  let search = true;
  while (search && i < smallString.length) {
    if (smallString[i] !== largeString[i]) {
      //console.log('search stopped');
      search = false;
    } else i++;
  }
  let percentage = (i / largeString.length) * 100;
  //console.log(percentage);
  if (percentage > 50) {
    //console.log('they are same');
    return true;
  } else {
    //console.log('they arent same');
    return false;
  }
};

module.exports = { matchWithoutSuffix };
