var http = require('http'),
	faye = require('faye'),
	express = require('express'),
	_ = require('underscore'),
	app,
	server,
	bayeux;

function initPubSub() {
	bayeux = new faye.NodeAdapter({ mount: '/pub', timeout: 45 });

	bayeux.bind('handshake', function (clientId) {
		console.log('New client connected', clientId);
	});

	bayeux.bind('subscribe', function (clientId, channel) {
		console.log('New subscription to channel', channel, '[', clientId, ']');
	});

	bayeux.bind('publish', function (clientId, channel, data) {
		console.log('Client', clientId, 'published to channel', channel, 'with data', data);
	});

	bayeux.bind('disconnect ', function (clientId) {
		console.log('Client disconnected', clientId);
	});

	bayeux.attach(server);
}

function noop() {}

var Server = {
	get server() {
		return server;
	},

	listen: function listen(port) {
		if (server) {
			return;
		}

		typeof port === 'number' || (port = 3000);

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

		initPubSub();

		server.listen(port);
		console.log('Listen on port %d', port);
	},

	close: function close(callback) {
		if (!server) {
			console.warn('There is no active server.');
		}
		server.close(typeof callback === 'function' ? callback : noop);
	},

	attach: function attach(existingServer) {
		if (server) {
			return;
		}

		server = existingServer;
		initPubSub();
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

module.exports = Server;