var express = require('express'),
		path = require('path'),
		app = express(),
		port = 5000,
		bodyParser = require('body-parser');

require('babel-register')({
   presets: [ 'react' ],
   extensions: ['.js']
});

// Include static assets. Not advised for production
app.use('/node', express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set up Routes for the application
require('./app/routes.js')(app);

//Route not found -- Set 404
app.get('*', function(req, res) {
    res.json({
        'route': 'Sorry this page does not exist!'
    });
});

app.listen(port);
console.log('Server is Up and Running at Port : ' + port)