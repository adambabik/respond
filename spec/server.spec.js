var http = require('http'),
	Server = require('../src/server');

var server = null, port = 8009;

describe('server', function () {

	beforeEach(function () {
		server = new Server();
	});

	it("should create server and start listening", function (done) {
		server.listen(port);

		http.get('http://127.0.0.1:' + port + '/respond', function (res) {
			expect(res.statusCode).toEqual(200);

			server.close(done);
		}).on('error', function (err) {
			console.log('error', err);
		});
	});

	it("should attach to existing server", function (done) {
		var existingServer = http.createServer();
		existingServer.listen(port);

		server.attach(existingServer);

		http.get('http://127.0.0.1:' + port + '/respond', function (res) {
			expect(res.statusCode).toEqual(200);

			server.close(done);
		}).on('error', function (err) {
			console.log('error', err);
		});
	});
});