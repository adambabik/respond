var PubSub = require('../src/pubsub'),
	faye = require('faye');

const PORT = 8011;

var pubsub;

beforeEach(function () {
	pubsub = new PubSub(PORT);
});

afterEach(function () {
	pubsub.stop();
});

describe('pubsub', function () {
	it("should pass message correctly", function (done) {
		var client = new faye.Client('http://localhost:' + PORT + '/pub', { timeout: 5 });

		var subscription = client.subscribe('/test', function (message) {
			expect(message.test).toBeTruthy();
			pubsub.getClient().disconnect();
			client.disconnect();
			done();
		});

		subscription.callback(function () {
			pubsub.publish('/test', { test: true });
		});
	});
});