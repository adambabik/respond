var http = require('http'),
	express = require('express'),
	_ = require('underscore'),
	Debug = require('./debug');

// Utility methods

function noop() {}

// Server module variables

var server = null;

// Server

function Server() {}

Server.prototype = {
	constructor: Server,

	get httpServer() {
		return server;
	},

	listen: function listen(port) {
		if (server) {
			console.warn('Server already exists');
			return;
		}

		if (typeof port !== 'number') {
			throw new Error('port must be a number');
		}

		server = http.createServer(this._requestHandler);
		server.listen(port);

		Debug.debug() && console.log('Listen on port %d', port);
	},

	attach: function attach(aServer) {
		if (server) {
			console.warn('Server already exists.');
			return;
		}

		server = aServer;
		server.on('request', this._requestHandler);
	},

	close: function close(callback) {
		server.close(function () {
			server = null;
			_.isFunction(callback) && callback();

			Debug.debug() && console.log('Closed server');
		});
	},

	_requestHandler: function _requestHandler(req, res) {
		if (req.url === '/respond') {
			res.writeHead(200, {
				'Content-Length': 0,
				'Content-Type': 'text/plain'
			});
			res.end();
		}
	}
};

module.exports = Server;