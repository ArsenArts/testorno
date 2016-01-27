var Test = function(data) {
  this.id = data.id;
  this.title = data.title;
  this.totalScore = data.totalScore;
  this.questions = [];
  this.currentIndex = -1;
  this.answers = [];
};

Test.prototype = function() {
  var init = function(questions) {
    setClickHandlers.call(this);
    addQuestions.call(this, questions);
    setTotalQuestionAmount.call(this, questions.length);
    runNextQuestion.call(this);
  },

  setClickHandlers = function() {
    var inner = '';

    inner +=
      '<button class="prev-btn btn btn-dir"><i class="icon-arrow-left"></i> prev</button>' +
      '<button class="next-btn btn btn-dir">next <i class="icon-arrow-right"></i></button>' +
      '<button class="send-result btn btn-dir hidden">submit</button>';

    document.querySelector('.ts-controls').innerHTML = inner;

    var nextBtn = document.querySelector('.next-btn'),
        backBtn = document.querySelector('.prev-btn'),
        sendResult = document.querySelector('.send-result'),
        that = this;

    nextBtn.addEventListener('click', function(e) {
      e.preventDefault();
      runNextQuestion.call(that);
    });

    backBtn.addEventListener('click', function(e) {
      e.preventDefault();
      runPrevQuestion.call(that);
    });

    sendResult.addEventListener('click', function(e) {
      e.preventDefault();
      completeTest.call(that);
    });
  },

  addQuestions = function(questions) {
    for (var i = 0, len = questions.length; i < len; i++) {
      var question = new Question(questions[i]);
      this.questions.push(question);
      question.init(i);
    }
  },

  setTotalQuestionAmount = function(amount) {
    document.querySelector('.ts-progress .total').innerHTML = amount;
  },

  runNextQuestion = function() {
    runNewQuestion.call(this, 'next');
  },

  runPrevQuestion = function() {
    runNewQuestion.call(this, 'prev');
  },

  runNewQuestion = function(direction) {
    var currentQuestion, questionScreens;

    switch(direction) {
      case 'next':
        this.currentIndex++;
        break;
      case 'prev':
        this.currentIndex--;
        break;
    }

    questionScreens = document.querySelectorAll('.ts-question');

    // hide questions
    [].slice.call(questionScreens).forEach(function(q, i) {
      q.classList.add('hidden');
    });

    // show prev/next
    currentQuestion = this.questions[this.currentIndex].el;
    currentQuestion.classList.remove('hidden');

    // handle button controls
    if (this.currentIndex == 0) {
      document.querySelector('.prev-btn').classList.add('btn-disabled');
    } else {
      document.querySelector('.prev-btn').classList.remove('btn-disabled');
    }

    if (this.currentIndex == this.questions.length-1) {
      document.querySelector('.next-btn').classList.add('hidden')
      document.querySelector('.send-result').classList.remove('hidden');
    } else {
      document.querySelector('.next-btn').classList.remove('hidden');
      document.querySelector('.send-result').classList.add('hidden');
    }

    document.querySelector('.ts-progress .count').innerHTML = this.currentIndex+1;

    routemediator.setLocation('/tests/' + this.id + '/' + (this.currentIndex+1));
  },

  completeTest = function() {
    serializeTestData.call(this);

    var that = this,
        reqData = {
          id: this.id,
          answers: this.answers
        };

    datacontext.submitTest(reqData, function (data) {
      validateAnswers.call(that, data);
    });
  },

  serializeTestData = function() {
    var questionScreens = document.querySelectorAll('.ts-question');

    for (var q = 0, qlen = questionScreens.length; q < qlen; q++) {
      var inputs = questionScreens[q].querySelectorAll('input');

      var answer = {};

      for (var i = 0, ilen = inputs.length; i < ilen; i++) {
        var input = inputs[i];

        if (input.type == 'text') {
          answer[i] = input.value;
        } else {
          if (input.checked) {
            answer[i] = true;
          } else {
            answer[i] = false;
          }
        }
      }

      this.answers.push(answer);
    }
  },

  validateAnswers = function(results) {
    var userAnswers = this.answers,
        correctAnswers = results[0],
        userScore = 0,
        inner = '';

    inner +=
      '<h2 class="ts-title">Results for "' + this.title + '"</h2>';

    console.log('%c\n# Compare the answers\n ', 'font-size: large');

    // select a question
    for (var q = 0; q < userAnswers.length; q++) {
      inner +=
        '<h3 class="rs-title">' + (q + 1) + '. '+ this.questions[q].title + '</h3>' +
        '<div class="rs-answers">';

      var question = userAnswers[q],
          answer = correctAnswers[q];

      if (typeof answer[0] === 'string') {
        question[0] = question[0].toLowerCase();
        answer[0] = answer[0].toLowerCase();

        if (question[0] === answer[0]) {
          userScore += this.questions[q].score;
        }
      } else {
        if (JSON.stringify(question) === JSON.stringify(answer)) {
          userScore += this.questions[q].score;
        }
      }

      console.log(userScore, question, '||', answer);

      // select an option
      for (var o in question) {
        var option = question[o],
            correctAnswer = correctAnswers[q][o],
            highlight = '',
            score = 0;

        // compare answers
        if (option === correctAnswer) {
          if (option !== false) {
            // correct, else missed
            highlight = 'correct approved';
          }
        } else {
          if (this.questions[q].type == 'custom') {
            // wrong custom
            inner += '<span class="rs-option wrong">' + option + '</span>';
            highlight = 'correct disapproved';
          } else {
            if (correctAnswer === true) {
              // otherwise match correct
              highlight = 'correct disapproved';
            } else {
              // wrong single/multiple
              highlight = 'wrong';
            }
          }
        }

        inner +=
          '<span class="rs-option ' + highlight + '">' +
          (this.questions[q].options && this.questions[q].options[o] || answer[0]) +
          '</span>';
      }

      inner += '</div>';
    }

    inner +=
      '<p class="rs-subtitle">Your score is</p>' +
      '<p class="rs-score"><span class="user-score"></span> / <span class="total-score"></span></p>';

    document.querySelector('.result-inner').innerHTML = inner;
    document.querySelector('.rs-score > .user-score').innerHTML = Math.floor(userScore*100)/100;
    document.querySelector('.rs-score > .total-score').innerHTML = this.totalScore;
    document.querySelector('.test-inner').classList.add('hidden');
    document.querySelector('.result-inner').classList.remove('hidden');

    // update user total score
    app.user.updateScore(userScore);
  };

  return {
    init: init
  };
}();
