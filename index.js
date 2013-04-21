var PubSub = require('./src/pubsub'),
	Watcher = require('./src/watcher'),
	Server = require('./src/server'),
	_ = require('underscore');

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
	this.options = null;
	this.pubsub = null;
	this.watcher = null;

	var opts = this.options = _.extend({}, defaults, options);

	this.pubsub = new PubSub(opts.port);

	Server.init(this.pubsub.getHttpServer());

	if (opts.files.length) {
		this.watch(opts.files, opts.exclude);
	}
}

Respond.prototype = {
	constructor: Respond,

	watch: function watch(files, exclude) {
		var self = this;

		if (this.watcher) {
			this.watcher.getWatcher().add(files);
			exclude && this.watcher.getWatcher().remove(exclude);
		} else {
			this.watcher = new Watcher(this.options.files, this.options.exclude);

			this.watcher.on('changed', function (event) {
				Object.keys(this.options.actions).forEach(function (arr, action) {
					if (~arr.indexOf(event.ext)) {
						self.execute(action);
					}
				});
			});
		}
	},

	execute: function execute(cmd, data) {
		this.pubsub.publish('/call', { cmd: cmd, data: data });
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