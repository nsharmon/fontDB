"use strict";

var http_port = process.env.HTTP_PORT || 3000,
    https_port = process.env.HTTPS_PORT || 3443;

var debug = require('debug')('app:' + process.pid);
var path = require("path");
var fs = require("fs");
var jwt = require("express-jwt");
var onFinished = require('on-finished');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var NotFoundError = require(path.join(__dirname, "errors", "NotFoundError.js"));
var utils = require(path.join(__dirname, "utils.js"));
var unless = require('express-unless');

var mongoose = require('mongoose');
mongoose.set('debug', !!process.env.npm_config_debug);

function init() {
	connect(function() {
		debug("Mongoose connected to the database");
		require('./models/Font');
		
		setupExpress();
		
		console.log('Server ready.');
	});
}

function connect(callback) {
	var connectionString = 'mongodb://' + process.env.npm_config_mdbUser + ':' + process.env.npm_config_mdbPassword + '@' + process.env.npm_config_mdbHost + '/' + process.env.npm_config_mdbDatabase;	
	var connectionStringCensored = 'mongodb://' + process.env.npm_config_mdbUser + ':******@' + process.env.npm_config_mdbHost + '/' + process.env.npm_config_mdbDatabase;		
	console.log('Attempting connection using: ' + connectionStringCensored);
	mongoose.connect(connectionString);
	mongoose.connection.on('error', function () {
		debug('Mongoose connection error');
	});	
	mongoose.connection.once('open', callback);
}

function setupExpress() {
	console.log('Preparing express and server listeners...');
	
	var routes = require('./routes/index');
	var users = require('./routes/users');
	
	var app = express();

	// view engine setup
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'ejs');

	// uncomment after placing your favicon in /public
	//app.use(favicon(__dirname + '/public/favicon.ico'));
	app.use(logger('dev'));
	
	var bodyParser = require('body-parser');
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(require('compression')());
	app.use(require('response-time')());
	app.use(cookieParser());
	app.use(express.static(path.join(__dirname, 'public')));

	app.use('/', routes);
	app.use('/users', users);

	app.use(function(req, res, next) {
		onFinished(res, function (err) {
			debug("[%s] finished request", req.connection.remoteAddress);
		});
		next();
	});
	
	var jwtCheck = jwt({
		secret: process.env.npm_config_secret
	});
	jwtCheck.unless = unless;
	
	app.use(jwtCheck.unless({path: '/api/login' }));
	app.use(utils.middleware().unless({path: '/api/login' }));

	app.use("/api", require(path.join(__dirname, "routes", "default.js"))());
	
	// all other requests redirect to 404
	app.all("*", function (req, res, next) {
		next(new NotFoundError("404"));
	});
	
	// error handler for all the applications
	app.use(function (err, req, res, next) {

		var errorType = typeof err,
			code = 500,
			msg = { message: "Internal Server Error" };

		switch (err.name) {
			case "UnauthorizedError":
				code = err.status;
				msg = undefined;
				break;
			case "BadRequestError":
			case "UnauthorizedAccessError":
			case "NotFoundError":
				code = err.status;
				msg = err.inner;
				break;
			default:
				break;
		}

		return res.status(code).json(msg);
	});
	
	debug("Creating HTTP server on port: %s", http_port);
	require('http').createServer(app).listen(http_port, function () {
		debug("HTTP Server listening on port: %s, in %s mode", http_port, app.get('env'));
	});

	debug("Creating HTTPS server on port: %s", https_port);
	require('https').createServer({
		key: fs.readFileSync(path.join(__dirname, "keys", "fontDB.key")),
		cert: fs.readFileSync(path.join(__dirname, "keys", "fontDB.crt")),
		//ca: fs.readFileSync(path.join(__dirname, "keys", "ca.crt")),
		requestCert: true,
		rejectUnauthorized: false
	}, app).listen(https_port, function () {
		debug("HTTPS Server listening on port: %s, in %s mode", https_port, app.get('env'));
	});
	
	return app;
}

init();
