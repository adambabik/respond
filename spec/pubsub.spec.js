var PubSub = require('../src/pubsub'),
	Server = require('../src/server'),
	faye = require('faye');

const PORT = 8009;

var server, pubsub;

beforeEach(function () {
	server = new Server();
	server.listen(PORT);

	pubsub = new PubSub(server.httpServer);
});

afterEach(function () {
	server.close();
});

describe('pubsub', function () {
	it("should pass message correctly", function (done) {
		var client = new faye.Client('http://localhost:' + PORT + '/pub', { timeout: 4 });
		client.disable('websocket');

		var subscription = client.subscribe('/test', function (message) {
			if (message.test) {
				subscription.cancel();
				client.disconnect();
				pubsub.getClient().disconnect();
				done();
			}
		});

		subscription.callback(function () {
			pubsub.publish('/test', { test: true });
			console.log('>>>>>', client._transport.connectionType);
		});
	});
});