var DEBUG = false;

module.exports = {
	debug: function mode(arg) {
		if (typeof arg === 'boolean') {
			DEBUG = arg;
		}
		return DEBUG;
	}
};