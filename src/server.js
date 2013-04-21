var express = require('express');

var Server = {
	server: null,
	app: null,

	init: function init(httpServer) {
		this.server = httpServer;
		this.app = express();
	},

	_handleStatic: function _handleStatic() {
		var app = this.app;

		// Config

		// @TODO: it goes to dashboard

		// app.engine('html', require('ejs').__express);
		// app.set('views', __dirname + '/views');
		// app.set('view engine', 'html');

		// Middleware

		app.use(express.bodyParser());
		app.use(express.methodOverride());
		app.use(express.static(__dirname + '/../public'));
	}

};

module.exports = Server;