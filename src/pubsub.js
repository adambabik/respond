var util = require('util'),
	faye = require('faye'),
	_ = require('underscore'),
	EventEmitter = require('events').EventEmitter,
	Debug = require('./debug');

function PubSub(server) {
	EventEmitter.call(this);
	this._server = server;
	this._pubsub = null;
	this._initialize(server);
}

util.inherits(PubSub, EventEmitter);

_.extend(PubSub.prototype, {

	_initialize: function _initialize(server) {
		var pubsub = this._pubsub = new faye.NodeAdapter({ mount: '/pub', timeout: 5 });

		pubsub.bind('handshake', function (clientId) {
			Debug.debug() && console.log('New client connected', clientId);
		});

		pubsub.bind('subscribe', function (clientId, channel) {
			Debug.debug() && console.log('New subscription to channel', channel, '[', clientId, ']');
		});

		pubsub.bind('publish', function (clientId, channel, data) {
			Debug.debug() && console.log('Client', clientId, 'published to channel', channel, 'with data', data);
		});

		pubsub.bind('disconnect', function (clientId) {
			Debug.debug() && console.log('Client disconnected', clientId);
		});

		pubsub.attach(server);

		return this;
	},

	publish: function publish(channel, data) {
		this._pubsub.getClient().publish(channel, data);
	},

	subscribe: function subscribe(channel, callback) {
		this._pubsub.getClient().subscribe(channel, callback);
	},

	stop: function stop() {
		this._pubsub.stop();
	},

	getClient: function getClient() {
		return this._pubsub.getClient();
	}

	// @TODO: what about unsubscribe method?
	// subscribe objects should be saved and then closed by cancel() method
});

module.exports = PubSub;