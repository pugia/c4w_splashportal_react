global.React = require('react');
global.ReactDOMServer = require('react-dom/server');

module.exports = function(app) {

	app.get('/', function(req, res){
		// var Child = React.createFactory(require('./components/Showcase'));
	  var mainHtml = ''; //ReactDOMServer.renderToString(Child({}));
	  res.render('stages.ejs', { main: mainHtml, rand: Math.random().toString(36).substring(7) });
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

	app.get('/full', function(req, res){
	  res.render('index.ejs');
	});

	app.get('/stage03', function(req, res){
	  res.render('stage03.ejs');
	});

};
