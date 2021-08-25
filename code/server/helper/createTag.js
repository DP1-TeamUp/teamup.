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
    console.log(key + ' ' + counts[key].tfidf);
  }
};

module.exports = { setup };

//console.log('COUNTS', counts);
//console.log('KEYS', keys);
