var Slider = function(el, length) {
  this.el = el;
  this.posX = 0;
  this.index = 0;
  this.length = length;
};

Slider.prototype = function() {
  var init = function() {
    setClickHandlers.call(this);
    setPosition.call(this, 0);
  },

  setPosition = function() {
    this.el.style.backgroundPosition = this.posX + '% 0%';
    this.el.dataset.face = this.index;
  },

  setClickHandlers = function() {
    var leftArrow = document.querySelector('.in-avatar .icon-chevron-left'),
        rightArrow = document.querySelector('.in-avatar .icon-chevron-right'),
        that = this;

    leftArrow.addEventListener('click', function(e) {
      goLeft.call(that);
    });

    rightArrow.addEventListener('click', function(e) {
      goRight.call(that);
    });
  },

  goLeft = function() {
    this.index--;

    if (this.index > -1) {
      this.posX -= 100 / (this.length - 1);
      setPosition.call(this);
    } else {
      this.index = this.length -1;
      this.posX = 100;
      setPosition.call(this);
    }
  },

  goRight = function() {
    this.index++;

    if (this.index != this.length) {
      this.posX += 100 / (this.length - 1);
      setPosition.call(this);
    } else {
      this.index = 0;
      this.posX = 0;
      setPosition.call(this);
    }
  };

  return {
    init: init
  };
}();
