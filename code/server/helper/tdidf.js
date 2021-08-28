const keyword_extractor = require('keyword-extractor');

const formula =
  'no. of times it appearead in a doc * (total no of docments/documens it appeared)';

var counts = {};
var keys = [];
var allwords = [];

var txt2 = [
  [
    'As a site visitor, I can read current news on the home page so that I stay current on agile news.',
    'As a site member, I can subscribe to an RSS feed of news (and events?) so I remain sufficiently and easily informed. ',
  ],
  [
    'As a site member, I can download the latest training material and methodology PDFs so I have them. ',
  ],
  [
    'As a visitor, I can download presentations, PDFs, etc. on Scrum so that I can learn from them or use them. ',
  ],
  [
    'As a site admin, I need to approve each help wanted ad before it gets to the site so that we’re sure of the quality of jobs being listed. ',
  ],
  [
    'As a site visitor, I want to read a new article on the front page about once a week so that I’m up on all the latest happenings. ',
  ],
  [
    'As the site editor, I can add an article to the site so that the site has plenty of content',
  ],
  [
    'As a site visitor, I can post comments about articles so that others can read them. ',
  ],
  [
    'As someone who wants to hire, I can post a help wanted ad so that I can attract candidates. ',
  ],
];

var txt = [
  [
    ' As a site visitor, I can read current news on the home page so that I stay current on agile news. As a site visitor, I can access old news that is no longer on the home page, so I can access things I remember from the past or that others mention to me. As a site visitor, I can email news items to the editor, so they can be considered for publication. (Note: this could just be an email link to the editor.) As a site a site editor, I can set the following dates on a news item: Start Publishing Date, Old News Date, Stop Publishing Date so articles are published on and through appropriate dates. These dates refer to the date an item becomes visible on the site (perhaps next Monday), the date it stops appearing on the home page, and the date it is removed from the site (which may be never). As a site member, I can subscribe to an RSS feed of news (and events?) so I remain sufficiently and easily informed. As a site editor, I can assign priority numbers to news items, so I can indicate which articles I want featured most prominently on the site. Note: Items are displayed on the front page based on priority',
  ],
  [
    'As a trainer, I want my profile to list my upcoming classes and include a link to a detailed page about each so that prospective attendees can find my courses. As a site member, I can view the profiles of other members so that I can find others I might want to connect with. As a site member, I can search for profiles based on a few fields (class attended, location, name) so I can find others I might want to connect with. As a site member, I can mark my profile as private in which case only my name will appear so that no one can learn things about me I don’t want shared. As a site member, I can mark my email address as private even if the rest of my profile is not so that no one can contact me. As a site member, I can send an email to any member via a form so that we can connect.',
  ],
  [
    'As a trainer, I can copy one of my courses or events so that I can create a new one. When copying it I am asked for the date(s) of the new course or event. As a site admin, I can delete any course or event, so I can remove things that will no longer occur. As a site editor, I can update any course or event so that I can fix things the original author hasn’t. As a trainer, admin, or editor, I can turn a course into an event or an event into a course, so I can correctly classify anything that was entered incorrectly. As a site visitor, I have an advanced search option that lets me fill in a form of search criteria (country, state, trainer name, date range, word in description, etc.) so I can quickly find what I’m looking for. As a site visitor, when I’m viewing a course I can click on the trainer’s name and be taken to the trainer’s profile, so I can read more about a trainer before registering for a course. As a site visitor, I can subscribe to an RSS feed of upcoming courses and events so that I’m up to day without having to visit the site.',
  ],
  [
    'As a site visitor, I can view lists on the site of all Certified ScrumMasters, Practitioners, Trainers, and Certified Scrum Product Owners. As a CSM, Practitioner, or Certified Scrum Product Owner, I can have my name listed in the registry without becoming a member of the site so that employers or others can verify my certification. (For example, I take a certification class but never register or let my membership lapse.) As a trainer who has finished teaching a Certification class, I can load an Excel file (first name, last name, email) into the site so that those course participants are added to the Scrum Alliance records. I am prompted for the trainer names (I may not have trained alone), certification date, and type of certification (i.e., CSM or CSPO). Courses are marked as “pending” until the trainer pays the certification fees. As a site admin, I can view all classes in a pending state so that I can approve any that need to be approved. As a site admin who has received proof of payment from a trainer, I can move people in his or her class from a pending state to the registry. As a new Certified ScrumMaster or Certified Product Owner, once my name has been loaded to the registry I am sent an email welcoming me to the Scrum Alliance and containing instructions on how to register / activate my membership. As a site editor, I can edit the content of the email automatically sent to new Certified ScrumMasters and Product Owners so that I don’t need to involve a programmer on simple email edits. ',
  ],
];

var sentence =
  'As a trainer, I want my profile to list my upcoming classes and include a link to a detailed page about each so that prospective attendees can find my courses. As a site member, I can view the profiles of other members so that I can find others I might want to connect with. As a site member, I can search for profiles based on a few fields (class attended, location, name) so I can find others I might want to connect with. As a site member, I can mark my profile as private in which case only my name will appear so that no one can learn things about me I don’t want shared. As a site member, I can mark my email address as private even if the rest of my profile is not so that no one can contact me. As a site member, I can send an email to any member via a form so that we can connect.';

var sentence2 =
  ' As a site visitor, I can read current news on the home page so that I stay current on agile news. As a site visitor, I can access old news that is no longer on the home page, so I can access things I remember from the past or that others mention to me. As a site visitor, I can email news items to the editor, so they can be considered for publication. (Note: this could just be an email link to the editor.) As a site a site editor, I can set the following dates on a news item: Start Publishing Date, Old News Date, Stop Publishing Date so articles are published on and through appropriate dates. These dates refer to the date an item becomes visible on the site (perhaps next Monday), the date it stops appearing on the home page, and the date it is removed from the site (which may be never). As a site member, I can subscribe to an RSS feed of news (and events?) so I remain sufficiently and easily informed. As a site editor, I can assign priority numbers to news items, so I can indicate which articles I want featured most prominently on the site. Note: Items are displayed on the front page based on priority';

const preload = () => {
  console.log('Initial Document', txt);
};

const setup = () => {
  for (var i = 0; i < txt.length; i++) {
    allwords[i] = txt[i].join('\n');
  }

  console.log('COMBINE WORDS', allwords);

  var tokens = allwords[0].split(/\W+/);
  console.log('SPLITED WORDS', tokens);

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

  console.log(txt[0][0]);

  extracted_result = keyword_extractor.extract(txt[0][0], {
    languages: 'english',
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: true,
  });

  console.log(extracted_result);

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
  console.log(final_tags);

  //console.log('COUNTS', counts);
  //console.log('KEYS', keys);
};

//preload();
setup();
