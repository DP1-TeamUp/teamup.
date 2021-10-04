const { stopwords } = require('./stop_words');

const matchWithoutSuffix = (string1, string2) => {
  let smallString = string1;
  let largeString = string2;

  if (string1.length === string2.length) {
    return false;
  }

  if (string1.length > string2.length) {
    largeString = string1;
    smallString = string2;
  }

  if (smallString.length < 4) {
    return false;
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
  if (percentage > 60) {
    //console.log('they are same');
    return true;
  } else {
    //console.log('they arent same');
    return false;
  }
};

const checkStopWords = (words) => {
  let filteredWords = [];

  words.forEach((word) => {
    let unMatched = true;
    let i = 0;
    while (unMatched && i < stopwords.length) {
      if (stopwords[i] == word) {
        unMatched = false;
      } else if (matchWithoutSuffix(word, stopwords[i])) {
        unMatched = false;
      } else i++;
    }
    if (unMatched) {
      filteredWords.push(word);
    }
  });
  return filteredWords;
};

module.exports = { matchWithoutSuffix, checkStopWords };
