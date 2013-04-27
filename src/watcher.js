var util = require('util'),
	path = require('path'),
	Gaze = require('gaze').Gaze,
	_ = require('underscore'),
	EventEmitter = require('events').EventEmitter,
	debug = require('./debug')('watcher');

function Watcher(files, exclude) {
	EventEmitter.call(this);
	this._watcher = null;
	this._watch(files, exclude);
}

util.inherits(Watcher, EventEmitter);

_.extend(Watcher.prototype, {
	_watch: function _watch(files, exclude) {
		var self = this;

		this._watcher = new Gaze(files, function (err, watcher) {
			if (err) {
				console.error('Error while watching', err);
				self.emit('error', err);
				return;
			}

			if (exclude) {
				this.remove(exclude);
			}

			debug() && console.log('[LOG]'.grey, 'Started watching files:', this.relative());

			this.on('error', function (err) {
				console.error('[ERR]'.red, 'while watching files' + err);
				self.emit('error', err);
			});

			this.on('end', function () {
				self.emit('end');
			});

			this.on('all', function (event, filepath) {
				debug() && console.log('[LOG]'.cyan, filepath + ' has been ' + event);

				self.emit('changed', {
					filepath: filepath,
					ext: path.extname(filepath).replace('.', ''),
					status: event
				});
			});
		});
	},

	close: function close() {
		this._watcher.close();
	},

	add: function add(files) {
		this._watcher.add(files);
	},

	remove: function remove(files) {
		this._watcher.remove(files);
	}
});

module.exports = Watcher;