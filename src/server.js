var express = require('express'),
	http = require('http'),
	debug = require('./debug')('server');

function Server(port) {
	// express

	this.app = express();
	this._configApp(this.app);

	// HTTP server

	this._httpServer = http.createServer(this.app);
	this._httpServer.listen(port);

	debug() && console.log('[LOG]'.grey, 'Server listens on ' + port);
}

Server.prototype = {
	constructor: Server,

	getHttpServer: function getHttpServer() {
		return this._httpServer;
	},

	_configApp: function _configApp(app) {
		// Config

		app.engine('html', require('ejs').__express);
		app.set('views', __dirname + '/views');
		app.set('view engine', 'html');

		// Middleware

		app.use(express.bodyParser());
		app.use(express.methodOverride());

		// Routes

		app.get('/respond.js', function (req, res) {
			res.status(200).sendfile('/browser/respond.js', { root: __dirname });
		});
	},

	close: function close(callback) {
		this._httpServer.close(callback);
	}
};

module.exports = Server;