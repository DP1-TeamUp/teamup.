const keyword_extractor = require('keyword-extractor');
const { checkStopWords } = require('./StringMatch');

const formula =
  'no. of times it appearead in a doc * (total no of docments/documens it appeared)';

const setup = (txt) => {
  var counts = {};
  var keys = [];
  var allwords = [];

  for (var i = 0; i < txt.length; i++) {
    allwords[i] = txt[i].join('\n');
  }

  var tokens = allwords[0].split(/\W+/);

  for (var i = 0; i < tokens.length; i++) {
    var word = tokens[i].toLowerCase();

    if (!/\d+/.test(word)) {
      if (counts[word] === undefined) {
        counts[word] = {
          tf: 1,
          df: 1,
        };
        keys.push(word);
      } else {
        counts[word].tf = counts[word].tf + 1;
      }
    }
  }

  var othercounts = [];
  for (var j = 1; j < allwords.length; j++) {
    var tempcounts = {};
    var tokens = allwords[j].split(/\W+/);
    for (var k = 0; k < tokens.length; k++) {
      var w = tokens[k].toLowerCase();
      if (tempcounts[w] === undefined) {
        tempcounts[w] = true;
      }
    }
    othercounts.push(tempcounts);
  }

  for (var i = 0; i < keys.length; i++) {
    var word = keys[i];

    for (var j = 0; j < othercounts.length; j++) {
      var tempcounts = othercounts[j];
      if (tempcounts[word]) {
        counts[word].df++;
      }
    }
  }

  for (var i = 0; i < keys.length; i++) {
    var word = keys[i];

    var wordobj = counts[word];
    wordobj.tfidf = wordobj.tf * Math.log(txt.length / wordobj.df);
  }

  const compare = (a, b) => {
    var countA = counts[a].tfidf;
    var countB = counts[b].tfidf;
    return countB - countA;
  };

  keys.sort(compare);

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    //console.log(key + ' ' + counts[key].tfidf);
  }

  extracted_result = keyword_extractor.extract(allwords[0], {
    languages: 'english',
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: true,
  });

  //console.log('From the new package: ', extracted_result);

  let final_keys = [];
  extracted_result.forEach((x) => {
    keys.forEach((y) => {
      if (x == y) {
        final_keys.push(y);
      }
    });
  });

  final_keys.sort(compare);

  final_tags = [];

  for (var i = 0; i < final_keys.length; i++) {
    var key = final_keys[i];
    if (counts[key].tfidf > 0) {
      final_tags.push({ word: key, score: counts[key].tfidf });
    }
  }

  //stop words filtering
  let toBefilteredByStopWords = [];
  let filteredWords = [];

  final_tags.forEach((tag) => {
    toBefilteredByStopWords.push(tag.word);
  });

  filteredWords = checkStopWords(toBefilteredByStopWords);

  //console.log(filteredWords.length);
  //console.log(final_tags.length);

  let finalTagsWithStopWordFiltration = [];

  final_tags.forEach((tag) => {
    filteredWords.forEach((word) => {
      if (word === tag.word) {
        finalTagsWithStopWordFiltration.push(tag);
      }
    });
  });

  //console.log(finalTagsWithStopWordFiltration);

  return finalTagsWithStopWordFiltration;
};

module.exports = { setup };
