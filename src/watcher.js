var util = require('util'),
	path = require('path'),
	Gaze = require('gaze').Gaze,
	_ = require('underscore'),
	Debug = require('./debug'),
	EventEmitter = require('events').EventEmitter;

function Watcher(files, exclude) {
	EventEmitter.call(this);
	this._watcher = null;
	this._watch(files, exclude);
}

util.inherits(Watcher, EventEmitter);

_.extend(Watcher.prototype, {
	getWatcher: function getWatcher() {
		return this._watcher;
	},

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

			Debug.debug() && console.log('[ watcher ] started watching files:', this.relative());

			this.on('error', function (err) {
				console.error('[ watcher ] error while watching files' + err);
				self.emit('error', err);
			});

			this.on('end', function () {
				self.emit('end');
			});

			this.on('all', function (event, filepath) {
				Debug.debug() && console.log('[ watcher ]', filepath + ' was ' + event);

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
	}
});

module.exports = Watcher;