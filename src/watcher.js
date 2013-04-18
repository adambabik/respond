var util = require('util'),
	gaze = require('gaze'),
	_ = require('underscore'),
	server = require('./server'),
	debug = require('./debug'),
	EventEmitter = require('events').EventEmitter;

function Watcher() {
	EventEmitter.call(this);
	this.watcher = null;
}

util.inherits(Watcher, EventEmitter);

_.extend(Watcher.prototype, {
	watch: function watch(files, exclude, action) {
		var self = this;

		gaze(files, function (err, watcher) {
			if (err) {
				console.error('Error while watching', err);
				return;
			}

			self.watcher = watcher;
			self.exclude();
			
			this.on('changed', function (filepath) {
				var match = filepath.match(/\.(\w+)$/i),
					ext = match && match.length > 1 ? match[1] : null;
				
				debug.debug() && console.log('\n', filepath + ' was changed with extension', ext);

				if (!match) {
					return;
				}

				server.command(action[ext], {});
			});
		});
	},

	exclude: function exclude(files) {
		var self = this;

		if (!_.isArray(files)) {
			files = [files];
		}

		files.forEach(function (file) {
			self.watcher.remove(file);
		});
	}
});

module.exports = new Watcher();