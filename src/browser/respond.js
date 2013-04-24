;(function (__global__, Faye) {
	'use strict';

	var slice = Array.prototype.slice;

	var urlUtils = {
		isAbsolute: function (url) {
			return (/^http(s)?\:\/{2,}|\/{2,}/i).test(url);
		},
		hasQueryParam: function (url, param) {
			return ~url.indexOf(param);
		}
	};

	function safeStringify(o) {
		var cache = [];
		return JSON.stringify(o, function (key, value) {
			if (typeof value === 'object' && value !== null) {
				if (cache.indexOf(value) !== -1) {
					// Circular reference found, discard key
					return;
				}
				// Store value in our collection
				cache.push(value);
			}
			return value;
		});
	}

	function Respond(url) {
		if (!(this instanceof Respond)) {
			return new Respond(url);
		}

		this.url = url + Respond.PATH;
		this.client = null;

		this._setup();
	}

	Respond.PATH = '/pub';

	Respond.prototype._setup = function _setup() {
		var self = this;
		this.client = new Respond.Client(this.url);
		this.client.subscribe('/call', function (message) {
			console.log('[ call ]', message);

			switch (message.cmd) {
			case 'refresh':
				self.refresh();
				break;
			case 'refreshCSS':
				self.refreshCSS();
				break;
			case 'eval':
				try {
					self.client.publish('/call/result', { status: 0, result: safeStringify(eval(message.data)) });
				} catch (e) {
					self.client.publish('/call/result', { status: 1, result: 'Cannot eval `' + message.data + '`' });
				}
				break;
			}
		});
	};

	Respond.prototype.refresh = function refresh() {
		window.location.reload();
	};

	Respond.prototype.refreshCSS = function refreshCSS() {
		var styles = document.querySelectorAll('link[rel="stylesheet"]');
		if (!styles) {
			return;
		}
		slice.call(styles).forEach(function (style) {
			var href = style.getAttribute('href'),
				timestampQueryParam = 'timestamp=' + Date.now();

			if (urlUtils.isAbsolute(href)) {
				return;
			}

			style.setAttribute('href', urlUtils.hasQueryParam(href, 'timestamp') ?
				href.replace(/timestamp\=\d+/i, timestampQueryParam) :
				href + '?' + timestampQueryParam
			);
		});
	};

	Object.keys(Faye).forEach(function (val, idx, arr) {
		Respond[val] = Faye[val];
	});

	__global__.Respond = Respond;

}(window, window.Faye));