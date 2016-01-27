var app = (function () {
  // public members
  var user = null,
      collections = [];

  function init() {
    routemediator.init();

    var user = JSON.parse(localStorage.getItem('[TESTORNO] User'));

    if (!user) {
      // create new user
      showIntroScreen();
    } else {
      // get existing user
      app.user = new User(user.name);
      app.user.avatar = user.avatar;
      app.user.level = user.level;
      app.user.totalScore = user.totalScore;
      app.user.completedTests = user.completedTests;
      app.user.render();

      showHomeScreen();
    }
  };

  function showIntroScreen() {
    routemediator.setLocation('/login');

    document.querySelector('#home').classList.add('hidden');
    document.querySelector('#intro').classList.remove('hidden');

    var avatarContainer = document.querySelector('.in-face');
    var slider = new Slider(avatarContainer, 6);
    slider.init();

    document.querySelector('.in-submit').addEventListener('click', function(e) {
      var name = document.querySelector('.in-name').value,
          avatar = document.querySelector('.in-face').dataset.face;

      if (name) {
        app.user = new User(name, avatar);
        app.user.render();

        localStorage.setItem('[TESTORNO] User', JSON.stringify(app.user));

        showHomeScreen();
      } else {
        document.querySelector('.in-name').classList.add('error');

        setTimeout(function(){
          document.querySelector('.in-name').classList.remove('error');
        }, 2000);
      }
    });
  };

  function showHomeScreen() {
    document.querySelector('#intro').classList.add('hidden');
    document.querySelector('#home').classList.remove('hidden');

    routemediator.setLocation('/');

    // create collections
    app.collections = new CollectionList();
    app.collections.init();

    // logout
    document.querySelector('.log-out').addEventListener('click', function(e) {
      localStorage.removeItem('[TESTORNO] User');
      showIntroScreen();
    });
  };

  window.onload = function() {
    app.init();
  };

  return {
    init: init,
    user: user,
    collections: collections
  };
})();
