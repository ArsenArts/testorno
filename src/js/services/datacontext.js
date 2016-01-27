var datacontext = (function(){
  function loadData(url, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState == 4 && httpRequest.status == 200) {
        var response = JSON.parse(httpRequest.responseText);
        callback(response);
      }
    }
    httpRequest.open('GET', url, true);
    httpRequest.send();
  }

  function submitData(url, data, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState == 4 && httpRequest.status == 200) {
        var response = JSON.parse(httpRequest.responseText);
        callback(response);
      }
    }
    httpRequest.open('POST', url, true);
    httpRequest.setRequestHeader("Content-type", "application/json");
    httpRequest.send(JSON.stringify(data));
  }

  function getCollection(callback) {
    loadData('/tests', callback);
  }

  function getTest(id, callback) {
    loadData('/tests/' + id, callback);
  }

  function submitTest(data, callback) {
    submitData('/tests/' + data.id + '/submit', data.result, callback);
  }

  return {
    getCollection: getCollection,
    getTest: getTest,
    submitTest: submitTest
  }
})();
