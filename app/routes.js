global.React = require('react');
global.ReactDOMServer = require('react-dom/server');

global.rootRequire = function(name) {
  return require(__dirname + '/' + name);
}

var api = require('./api');

module.exports = function(app) {

	app.get('/stage/', function(req, res){
	  res.render('stages.ejs');
	});

	// app.get('/stage01', function(req, res){
	// 	var Child = React.createFactory(require('./components/Stage01'));
	//   var mainHtml = ReactDOMServer.renderToString(Child({}));
	//   res.render('stages.ejs', { main: mainHtml });
	// });

	// app.get('/stage02', function(req, res){
	// 	var Child = React.createFactory(require('./components/Stage02'));
	//   var mainHtml = ReactDOMServer.renderToString(Child({}));
	//   res.render('stages.ejs', { main: mainHtml });
	// });

	app.get('/', function(req, res){
	  res.render('landing.ejs');
	});

	app.get('/full', function(req, res){
	  res.render('index.ejs');
	});

	app.get('/stage03', function(req, res){
	  res.render('stage03.ejs');
	});

	app.use('/api', api);

};
