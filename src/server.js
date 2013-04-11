var http = require('http'),
	faye = require('faye'),
	express = require('express'),
	_ = require('underscore'),
	app,
	server,
	bayeux,
	client,
	isSubscribed = false;

function initPubSub() {
	bayeux = new faye.NodeAdapter({ mount: '/pub', timeout: 45 });
	bayeux.attach(server);
}

function noop() {}

module.exports = {
	get server() {
		return server;
	},

	listen: function listen(port) {
		if (server) {
			return;
		}

		typeof port === 'number' || (port = 3000);

		app = express();

		app.get('*', function (req, res) {
			res.end('hello');
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