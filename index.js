var express = require('express');
var app = express();
var cheerio = require('cheerio');
var request = require('request');
var parseString = require('xml2js').parseString;

function buildCampUrl(state, res) {
  var campURL = "http://api.amp.active.com/camping/campgrounds?pstate=" +
    state.toUpperCase() +
    "&api_key=tevg8efq2e83yy8hzhhp99ns";
  campAPI(campURL, res);
};

function xmlParser(rawXml, res) {
  parseString(rawXml, function(err, result) {
    var latsAndLongs = result.resultset.result.map(function(obj) {
      return {
        'lat': obj['$'].longitude,
        'long': obj['$'].latitude
      }
    });
    res.send(latsAndLongs);
  });
}

function campAPI(campURL, res) {
  var str = '';
  request
    .get(campURL)
    .on('data', function(response) {
      str = str + response;
    }).on('end', function() {
      xmlParser(str, res);
    });
}

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/states/:state', function(req, res) {
  buildCampUrl(req.params.state, res);
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
