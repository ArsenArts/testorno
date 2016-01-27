var routemediator = (function(){
  function setLocation(url) {
    if (history.pushState) {
      history.pushState(null, null, '#' + url);
    } else {
      location.hash = '#' + url;
    }
  }

  function setPath(path) {
    var url = location.hash + path;
    if (history.pushState) {
      history.pushState(null, null, url);
    } else {
      location.hash = url;
    }
  }

  function init() {
    setLocation('/');
  }

  return {
    setLocation: setLocation,
    setPath: setPath,
    init: init
  }
})();
