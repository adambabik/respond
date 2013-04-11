(function (__global__, Faye) {
	'use strict';

	function Respond(url) {
		if (!(this instanceof Respond)) {
			return new Respond(url);
		}

		this.url = url;
		this.client = null;
	}

	Respond.prototype.setup = function setup() {
		this.client = new Respond.Client(this.url);
		this.client.subscribe('/call', function (message) {
			console.log('[ call ]', message);
		});
	};

	Object.keys(Faye).forEach(function (val, idx, arr) {
		Respond[val] = Faye[val];
	});

	__global__.Respond = Respond;

}(window, window.Faye));