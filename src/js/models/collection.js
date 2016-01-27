var Collection = function(tests) {
  this.tests = tests;
  this.preview = null;
};

Collection.prototype = function() {
  var render = function() {
    var inner = '';

    for (var i = 0, len = this.tests.length; i < len; i++) {
      var test = this.tests[i],
          isCompleted = (test.isCompleted) ? '' : ' uncompleted';

      inner +=
        '<li class="tl-item' + isCompleted + '" data-id="' + test.id + '">' +
          '<span class="tl-author">' + (test.author || 'Unknown') + '</span>' +
          '<h3 class="tl-title">' + test.title + '<span class="tl-date">' + test.date + '</span></h3>' +
          '<p class="tl-desc">' + (test.description || 'No description') + '</p>' +
        '</li>';
    }

    document.querySelector('#testlist ul').innerHTML = inner;
    document.querySelector('.nav:first-child b').innerHTML = len;
    document.querySelector('.tl-item').classList.add('active');

    setPreview.call(this, this.tests[0]);
  },

  setClickHandlers = function() {
    var listItems = document.querySelectorAll('.tl-item'),
        that = this;

    [].slice.call(listItems).forEach(function(item, i) {
      item.addEventListener('click', function(e) {
        e.preventDefault();

        // set active class
        [].slice.call(listItems).forEach(function(unactiveItem) {
          unactiveItem.classList.remove('active');
        });
        item.classList.add('active');

        // set preview
        var id = item.dataset.id;

        // choose certain test from test list
        // and get its preview
        for (var i = 0, len = that.tests.length; i < len; i++) {
          var test = that.tests[i];

          if (test.id == id) {
            setPreview.call(that, test);
          }
        }
      });
    });
  },

  setPreview = function(test) {
    var preview = document.querySelector('.preview-inner'),
        inner = '',
        that = this;

    showPreview.call(this);

    var descParagraphs = test.description.replace(/\r\n/g, "\n").split("\n");

    inner +=
      '<h2 class="pv-title">' + test.title + '<span class="pv-date">' + test.date + '</span></h2>' +
      '<span class="pv-author">' + test.author + '</span>' +
      '<div class="pv-cover" style="background-image: url(' + test.cover + ');"></div>';

    descParagraphs.forEach(function(paragraph){
      inner += '<p class="pv-desc">' + paragraph + '</p>';
    });

    inner += '<div class="pv-start"><span>Start the test</span></div>';

    preview.innerHTML = inner;

    this.preview = test.id;

    preview.querySelector('.pv-start').addEventListener('click', function(e) {
      e.preventDefault();
      startTest.call(that, that.preview);
   });
  },

  startTest = function(id) {
    datacontext.getTest(id, function (data) {
      var test = new Test(data);
      test.init(data.questions);
      hidePreview.call(this);
    });
  },

  showPreview = function() {
    document.querySelector('.preview-inner').classList.remove('hidden');
    document.querySelector('.test-inner').classList.add('hidden');
    document.querySelector('.result-inner').classList.add('hidden');
    document.querySelector('.result-inner').innerHTML = '';
    document.querySelector('.test-inner .ts-questions').innerHTML = '';
  },

  hidePreview = function() {
    document.querySelector('.preview-inner').classList.add('hidden');
    document.querySelector('.test-inner').classList.remove('hidden');
  },

  init = function() {
    render.call(this);
    setClickHandlers.call(this);
  };

  return {
    init: init
  };
}();
