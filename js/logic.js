// ALL FUNCTIONS REGARDING LOGIC OF THE RESULTS SHOULD BE HERE
$(document).ready(function() {

  var dictionary = dictionary || [];
  var vowels = ['a','e','i','o','u'];
  var consonants = ['b','c','d','f','g','h','j','k','l','m','n','p','q','r','s','t','v','w','x','y','z'];
  var game;

function WordGame(args) {
  this.dictionary = args.dictionary;
  this.vowels = args.vowels;
  this.consonants = args.consonants;
  this.generatedLetters = null;
  this.input = null;
}

  var loadDict = function(dictionaries) {
    dictionaries.forEach(function(dict) {
      $.get(dict, function(data) {
        var lines = data.split('\r\n');
        dictionary = dictionary.concat(lines);
      });
    });
  };

  (function() {
    loadDict(['dictionary.txt','dictionary2.txt']);
    game = new WordGame({dictionary: dictionary, vowels: vowels, consonants: consonants})
  }())

  // EVENT TRIGGERS

  $('#clicky').click(function() {
    game.downcaseAnswer($('#user-input').val());
    game.checkResult();
    game.updateScore();
  });

  $('#start').click(function() {
    game.generateRandomLetters($('#numVowels').val());
    game.updateGeneratedLetters();
  });

  // GAME CLASS

  WordGame.prototype.findWordFromDictionary = function() {
    for (var i = 0; i < dictionary.length; i++) {
      if(dictionary[i].toLowerCase() === this.input) {
        return true
      }
    }
    return false
  }

  WordGame.prototype.checkResult = function() {
    var el = document.getElementById('result-text');
    var msg;

    if(this.isValidAnswer()) {
      msg = 'Success!  We found <strong>' + this.input + '</strong></br>';
    } else {
      msg = 'Failed!  We did not find <strong>\'' + this.input + "\'</strong></br>";
    }
    el.innerHTML = msg;
  }

  WordGame.prototype.generateRandomLetters = function(numVowels) {
    this.generatedLetters = [];
    for (var i = 0; i < numVowels; i++) {
      this.generatedLetters.push(vowels[Math.floor(Math.random() * vowels.length)]);
    }
    for (var i = 0; i < (9 - numVowels); i++) {
      this.generatedLetters.push(consonants[Math.floor(Math.random() * consonants.length)]);
    }
  }

  WordGame.prototype.updateGeneratedLetters = function() {
    var el = document.getElementById('letter-container');
    el.innerHTML = "";

    for (var i = 0; i < this.generatedLetters.length; i++) {
      el.innerHTML += "<span class='label label-default' id='gen-letters'>" + this.generatedLetters[i].toUpperCase() + "</span>  ";
    }
  }

  WordGame.prototype.updateScore = function() {
    this.score = this.input.length;
    var el = document.getElementById('score');
    el.textContent = this.score;
  }

  WordGame.prototype.answerContainsGeneratedLetters = function() {
    var gen = this.generatedLetters;
    var input = this.input.split("");
    for (var i = 0; i < gen.length; i++) {
      var k = input.indexOf(gen[i]);
      if(k != -1) {
        input.splice(k, 1);
      }
    }
    if(input.length === 0) {
      return true
    } else {
      return false
    }
  }

  WordGame.prototype.isValidAnswer = function() {
    return this.answerContainsGeneratedLetters() && this.findWordFromDictionary();
  }

  WordGame.prototype.downcaseAnswer = function(input) {
    var ar = input.split("");
    for (var i = 0; i < ar.length; i++) {
      ar[i] = ar[i].toLowerCase();
    };
    ar = ar.join("");
    this.input = ar;
  }
});