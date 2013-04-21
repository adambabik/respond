var util = require('util'),
	faye = require('faye'),
	_ = require('underscore'),
	express = require('express'),
	EventEmitter = require('events').EventEmitter,
	Debug = require('./debug');

function PubSub(port) {
	EventEmitter.call(this);
	this._server = null;
	this.app = null;
	this._initialize(port);
}

util.inherits(PubSub, EventEmitter);

_.extend(PubSub.prototype, {

	_initialize: function _initialize(port) {
		var server = this._server = new faye.NodeAdapter({ mount: '/pub', timeout: 5 });

		server.bind('handshake', function (clientId) {
			Debug.debug() && console.log('New client connected', clientId);
		});

		server.bind('subscribe', function (clientId, channel) {
			Debug.debug() && console.log('New subscription to channel', channel, '[', clientId, ']');
		});

		server.bind('publish', function (clientId, channel, data) {
			Debug.debug() && console.log('Client', clientId, 'published to channel', channel, 'with data', data);
		});

		server.bind('disconnect', function (clientId) {
			Debug.debug() && console.log('Client disconnected', clientId);
		});

		server.listen(port);

		return this;
	},

	publish: function publish(channel, data) {
		this._server.getClient().publish(channel, data);
	},

	subscribe: function subscribe(channel, callback) {
		this._server.getClient().subscribe(channel, callback);
	},

	stop: function stop() {
		this._server.stop();
	},

	getClient: function getClient() {
		return this._server.getClient();
	},

	getApp: function getApp() {


		this.app = express();
	}

	// @TODO: what about unsubscribe method?
	// subscribe objects should be saved and then closed by cancel() method
});

module.exports = PubSub;