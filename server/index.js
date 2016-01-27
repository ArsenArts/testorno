var express = require('express');
var bodyParser = require('body-parser')
var path = require('path');
var fs = require('fs');

var app = express();

app.listen(process.env.PORT || 5000);

// set work public directory
app.use(express.static(path.join(__dirname, '../public')));

// to support JSON-encoded bodies for POST method
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
}));

// return index.html on root request
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// get test list
app.get('/tests', function(req, res) {
  res.sendFile(path.join(__dirname, 'data', 'testlist.json'));
});

// get test by id
app.get('/tests/:id', function(req, res) {
  var id = req.params.id;

  try {
    res.sendFile(path.join(__dirname, 'data', 'test_' + id + '.json'));
  } catch (err) {
    console.log('File not found. Request ID: ' + id);
  }
});

// get answer response by test id
app.post('/tests/:id/submit', function(req, res) {
  var id = req.params.id,
      userAnswers = req.body,
      correctAnswers;

  fs.readFile(path.join(__dirname, 'data/answers', 'test_' + id + '_answers.json'), 'utf8', function (err, data) {
    if (err) throw err;

    correctAnswers = JSON.parse(data);
    compareAnswers(userAnswers, correctAnswers);

    res.json(correctAnswers);
  });
});

function compareAnswers(userAnswers, correctAnswers) {

}
