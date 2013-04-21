var _ = require('underscore');

function Commander(pubsub) {
	this.pubsub = pubsub;
}

Commander.prototype = {
	constructor: Commander,

	execute: function execute(cmd, data) {
		if (!_.isString(cmd)) {
			throw new TypeError('The first argument must be a string, the second one object');
		}

		this.pubsub.publish('/call', { data: data || null, cmd: cmd });
	}
};

module.exports = Commander;