var http = require('http'),
	faye = require('faye'),
	express = require('express'),
	_ = require('underscore'),
	debug = require('./debug');

// Utility methods

function noop() {}

// Server module variables

var app, server, bayeux;

// Server

function Server() {}

Server.prototype = {
	constructor: Server,

	get server() {
		return server;
	},

	listen: function listen(port) {
		if (server) {
			return;
		}

		if (typeof port !== 'number') {
			throw new Error('port must be a number');
		}

		app = express();

		// Config
		app.engine('html', require('ejs').__express);
		app.set('views', __dirname + '/views');
		app.set('view engine', 'html');

		// Middleware
		app.use(express.bodyParser());
		app.use(express.methodOverride());
		app.use(express.static(__dirname + '/../public'));

		// Routes
		app.get('/test', function (req, res) {
			res.render('index');
		});

		server = http.createServer(app);

		this._initPubSub();

		// Listen
		server.listen(port);
		debug.debug() && console.log('Listen on port %d', port);
	},

	_initPubSub: function _initPubSub() {
		bayeux = new faye.NodeAdapter({ mount: '/pub', timeout: 45 });

		bayeux.bind('handshake', function (clientId) {
			debug.debug() && console.log('New client connected', clientId);
		});

		bayeux.bind('subscribe', function (clientId, channel) {
			debug.debug() && console.log('New subscription to channel', channel, '[', clientId, ']');
		});

		bayeux.bind('publish', function (clientId, channel, data) {
			debug.debug() && console.log('Client', clientId, 'published to channel', channel, 'with data', data);
		});

		bayeux.bind('disconnect', function (clientId) {
			debug.debug() && console.log('Client disconnected', clientId);
		});

		bayeux.attach(server);
	},

	close: function close(callback) {
		if (!server) {
			console.warn('There is no active server.');
		}

		server.close(_.isFunction(callback) ? callback : noop);
	},

	attach: function attach(existingServer) {
		if (server) {
			console.warn('Server already exists.');
			return;
		}

		server = existingServer;
		this._initPubSub();
	},

	command: function command(cmd, data) {
		if (!_.isString(cmd) || !_.isObject(data)) {
			throw new TypeError('The first argument must be a string, the second one object');
		}

		bayeux.getClient().publish('/call', _.extend(data, { cmd: cmd }));
	},

	subscribe: function subscribe(callback) {
		bayeux.getClient().subscribe('/call/result', callback);
	}
};

module.exports = new Server();