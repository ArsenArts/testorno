var Question = function(data) {
  this.el = null;
  this.title = data.title;
  this.tip = data.tip;
  this.index = data.index;
  this.type = data.type;
  this.options = data.options;
  this.score = data.score;
  this.required = data.required;
};

Question.prototype = function() {
  var render = function(q) {
    var element = document.createElement('div'),
        optionBox = parseOptions.call(this, q),
        inner = '';

    inner +=
      '<h3 class="ts-title">' + this.index + '. ' + this.title + '</h3>' +
      '<p class="ts-tip">' + (this.tip || '') + '</p>' +
      '<div class="ts-options">' + optionBox + '</div>';

    element.classList.add('ts-question', 'hidden');
    element.innerHTML = inner;
    this.el = element;

    document.querySelector('.test-inner .ts-questions').appendChild(element);
  },

  parseOptions = function(q) {
    var inner = '';

    switch(this.type) {
      case 'single':
        var checked = '';
        this.options.forEach(function(option, index) {
          inner += '<div class="ts-option">' +
            '<input type="radio" id="option-' + q + index + '" name="opation-' + q + '">' +
            '<label for="option-' + q + index + '">' + option + '</label>' +
            '</div>';
        });
        return inner;
      case 'multiple':
        this.options.forEach(function(option, index) {
          inner += '<div class="ts-option">' +
            '<input type="checkbox" id="option-' + q + index + '">' +
            '<label for="option-' + q + index + '">' + option + '</label>' +
            '</div>';
        });
        return inner;
      case 'custom':
        inner += '<input type="text" class="ts-textfield" autocomplete="off">';
        return inner;
    }
  },

  init = function(q) {
    render.call(this, q);
  };

  return {
    render: render,
    init: init
  };
}();
