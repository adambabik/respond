var PubSub = require('./src/pubsub'),
	Watcher = require('./src/watcher'),
	Server = require('./src/server'),
	_ = require('underscore'),
	debug = require('./src/debug')('index', true);

var defaults = {
	port: 8000,
	watcher: true,
	files: [],
	exclude: [],
	actions: {
		'refresh': ['js', 'html'],
		'refreshCSS': ['css']
	}
};

function Respond(options) {
	var opts = this.options = _.extend({}, defaults, options);

	this.server = new Server(opts.port);
	this.pubsub = new PubSub(this.server.getHttpServer());

	if (opts.files.length) {
		this.watch(opts.files, opts.exclude);
	}
}

Respond.CALL_CHANNEL = '/call';
Respond.RESULT_CHANNEL = '/call/result';

Respond.prototype = {
	constructor: Respond,

	watch: function watch(files, exclude) {
		var self = this;

		if (this.watcher) {
			this.watcher.add(files);

			if (exclude) {
				this.watcher.remove(exclude);
			}
		} else {
			this.watcher = new Watcher(files, exclude);

			this.watcher.on('changed', function (event) {
				var actions = self.options.actions;
				Object.keys(actions).forEach(function (action, idx) {
					if (~actions[action].indexOf(event.ext)) {
						self.command(action, {});
					}
				});
			});
		}
	},

	command: function command(cmd, data) {
		this.pubsub.publish(Respond.CALL_CHANNEL, { cmd: cmd, data: data });
	},

	execute: function execute(data) {
		this.pubsub.publish(Respond.CALL_CHANNEL, { cmd: 'eval', data: data });
	},

	addFileAction: function addFileAction(ext, action) {
		(this.options.actions[ext] || (this.options.actions[ext] = [])).push(action);
	},

	removeFileAction: function addFileAction(ext) {
		var keys = Object.keys(this.options.actions),
			extensions,
			idx;

		for (var i = 0, len = keys.length; i < len; i++) {
			extensions = this.options.actions[keys[i]];
			idx = extensions.indexOf(ext);
			~idx && extensions.splice(idx, 1);
		}
	}
};

module.exports = Respond;