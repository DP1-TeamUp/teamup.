const formula =
  "no. of times it appearead in a doc * (total no of docments/documens it appeared)";

var counts = {};
var keys = [];
var allwords = [];

var txt = [
  [
    "As a site visitor, I can read current news on the home page so that I stay current on agile news.",
    "As a site member, I can subscribe to an RSS feed of news (and events?) so I remain sufficiently and easily informed. ",
  ],
  [
    "As a site member, I can download the latest training material and methodology PDFs so I have them. ",
  ],
  [
    "As a visitor, I can download presentations, PDFs, etc. on Scrum so that I can learn from them or use them. ",
  ],
  [
    "As a site admin, I need to approve each help wanted ad before it gets to the site so that we’re sure of the quality of jobs being listed. ",
  ],
  [
    "As a site visitor, I want to read a new article on the front page about once a week so that I’m up on all the latest happenings. ",
  ],
  [
    "As the site editor, I can add an article to the site so that the site has plenty of content",
  ],
  [
    "As a site visitor, I can post comments about articles so that others can read them. ",
  ],
  [
    "As someone who wants to hire, I can post a help wanted ad so that I can attract candidates. ",
  ],
];

var txt2 = [
  [
    "As a site visitor, I can read FAQs, so I can get quick answers.",
    "As a site editor, I can maintain FAQs section so that support gets fewer easily answered questions.",
    "As a site visitor, I can do a full-text search of the FAQs, so I can find an answer quickly.",
  ],
  [
    "As a site member, I can download the latest training material and methodology PDFs so I have them. ",
  ],
  [
    "As a visitor, I can download presentations, PDFs, etc. on Scrum so that I can learn from them or use them. ",
  ],
  [
    "As a site admin, I need to approve each help wanted ad before it gets to the site so that we’re sure of the quality of jobs being listed. ",
  ],
  [
    "As a site visitor, I want to read a new article on the front page about once a week so that I’m up on all the latest happenings. ",
  ],
  [
    "As the site editor, I can add an article to the site so that the site has plenty of content",
  ],
  [
    "As a site visitor, I can post comments about articles so that others can read them. ",
  ],
  [
    "As someone who wants to hire, I can post a help wanted ad so that I can attract candidates. ",
  ],
];

const preload = () => {
  console.log("Initial Document", txt);
};

const setup = () => {
  for (var i = 0; i < txt.length; i++) {
    allwords[i] = txt[i].join("\n");
  }

  console.log("COMBINE WORDS", allwords);

  var tokens = allwords[0].split(/\W+/);
  console.log("SPLITED WORDS", tokens);

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
    console.log(key + " " + counts[key].tfidf);
  }
};

//console.log('COUNTS', counts);
//console.log('KEYS', keys);

preload();
setup();
