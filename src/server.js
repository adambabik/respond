var express = require('express'),
	http = require('http'),
	Debug = require('./debug');

function Server(port) {
	// express

	this.app = express();
	this._configApp(this.app);

	// HTTP server

	this._httpServer = http.createServer(this.app);
	this._httpServer.listen(port);

	Debug.debug() && console.log('Server listens on %d', port);
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
	}
};

module.exports = Server;