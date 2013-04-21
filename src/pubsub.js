var util = require('util'),
	faye = require('faye'),
	_ = require('underscore'),
	EventEmitter = require('events').EventEmitter,
	Debug = require('./debug');

// Module variables

var bayeux = null;

// Module definition

function PubSub(server) {
	EventEmitter.call(this);
	this.server = server;

	this._init();
}

util.inherits(PubSub, EventEmitter);

_.extend(PubSub.prototype, {
	_init: function init() {
		bayeux = new faye.NodeAdapter({ mount: '/pub', timeout: 45 });

		bayeux.bind('handshake', function (clientId) {
			Debug.debug() && console.log('New client connected', clientId);
		});

		bayeux.bind('subscribe', function (clientId, channel) {
			Debug.debug() && console.log('New subscription to channel', channel, '[', clientId, ']');
		});

		bayeux.bind('publish', function (clientId, channel, data) {
			Debug.debug() && console.log('Client', clientId, 'published to channel', channel, 'with data', data);
		});

		bayeux.bind('disconnect', function (clientId) {
			Debug.debug() && console.log('Client disconnected', clientId);
		});

		bayeux.attach(this.server);

		return this;
	},

	publish: function publish(channel, data) {
		bayeux.getClient().publish(channel, data);
	},

	subscribe: function subscribe(channel, callback) {
		bayeux.getClient().subscribe(channel, callback);
	},

	stop: function stop() {
		bayeux.stop();
	},

	getClient: function getClient() {
		return bayeux.getClient();
	}

	// @TODO: what about unsubscribe method?
	// subscribe objects should be saved and then closed by cancel() method
});

module.exports = PubSub;