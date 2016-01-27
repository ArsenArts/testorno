var User = function(name, avatar) {
  this.name = name;
  this.avatar = avatar;
  this.level = 0;
  this.totalScore = 0;
  this.completedTests = 0;
};

User.prototype = function() {
  var render = function() {
    document.querySelector('.user-name > strong').innerHTML = this.name;
    document.querySelector('.user-avatar').style.backgroundImage = 'url(assets/img/avatars/face_' + this.avatar + '.png)';
    document.querySelector('.user-level').innerHTML = this.level;
  },

  updateScore = function(score) {
    this.totalScore += score;
    updateLevel.call(this);
  },

  updateLevel = function() {
    var previousLevel = this.level;
    this.level = Math.floor(this.totalScore / 100);

    // level-up
    if (previousLevel != this.level) {
      document.querySelector('.user-level').classList.add('level-up');
      setTimeout(function(){
        document.querySelector('.user-level').classList.remove('level-up');
      }, 350);
    }

    document.querySelector('.user-level').innerHTML = this.level;
    localStorage.setItem('[TESTORNO] User', JSON.stringify(app.user));
  };

  return {
    render: render,
    updateScore: updateScore
  };
}();
