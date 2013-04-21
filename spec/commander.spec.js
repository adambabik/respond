var PubSub = require('../src/pubsub'),
	Server = require('../src/server'),
	Commander = require('../src/commander'),
	faye = require('faye');

const PORT = 8009;

var server, pubsub, commander;

beforeEach(function () {
	server = new Server();
	server.listen(PORT);

	pubsub = new PubSub(server.httpServer);

	commander = new Commander(pubsub);
});

afterEach(function () {
	server.close();
});

describe('commander', function () {
	it("should execute command using commander API", function (done) {
		var client = new faye.Client('http://localhost:' + PORT + '/pub');

		var subscription = client.subscribe('/call', function (message) {
			expect(message.cmd).toEqual('refresh');

			subscription.cancel();
			client.disconnect();

			done();
		});

		subscription.callback(function () {
			commander.execute('refresh');
		});
	});
});