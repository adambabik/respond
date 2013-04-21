function Dashboard() {}

Dashboard.prototype = {
	constructor: Dashboard,

	attach: function attach(server, app) {
		// Routes
		app.get('/dashboard', function (req, res) {
			res.render('index');
		});
	}
};

module.exports = Dashboard;