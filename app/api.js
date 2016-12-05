var express = require('express');
var router = express.Router();

var config = require('./config');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});
// define the home page route
router.get('/:sections', function(req, res) {
	var response = {};
	var sections = req.params.sections.split(',');
	for (var i in sections) { const k = sections[i];
		response[k] = config[k];
	}
  res.send(JSON.stringify(response));
});
// define the about route
router.get('/', function(req, res) {
  res.send(JSON.stringify(config));
});

module.exports = router;

