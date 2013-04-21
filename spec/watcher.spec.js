var Watcher = require('../src/watcher'),
	fs = require('fs'),
	path = require('path');

var watcherInstance = null,
	directory = 'tmp',
	file = path.join(directory, 'file.js'),
	file2 = path.join(directory, 'file2.html');

// create temp folder and files

function cleanUp() {
	if (fs.existsSync(file)) {
		fs.unlinkSync(file);
	}

	if (fs.existsSync(file2)) {
		fs.unlinkSync(file2);
	}

	if (fs.existsSync(directory)) {
		fs.rmdirSync(directory);
	}
}


cleanUp();

fs.mkdirSync(directory, 0777);
fs.writeFileSync(file, '');
fs.writeFileSync(file2, '');

// test

describe('watcher', function () {

	beforeEach(function () {
		watcherInstance = new Watcher(directory + '/*.*', path.resolve('tmp', 'file2.html'));
	});

	afterEach(function () {
		watcherInstance = null;
	});

	it("watching files list should be defined correctly", function (done) {
		watcherInstance.watcher().on('ready', function () {
			var watched = watcherInstance.watcher().relative('tmp', true);
			expect(watched).toContain('file.js');

			watcherInstance.close();
		});

		watcherInstance.watcher().on('end', function () {
			done();
		});
	});

	it("should emit change event with status changed after file change", function (done) {
		watcherInstance.on('changed', function (data) {
			expect(data.ext).toEqual('js');
			expect(path.basename(data.filepath)).toEqual('file.js');
			expect(data.status).toEqual('changed');

			watcherInstance.close();
		});

		watcherInstance.watcher().on('ready', function (watcher) {
			fs.writeFileSync(file, 'use strict;');
		});

		watcherInstance.watcher().on('end', function () {
			done();
		});
	});

	it("should not emit change event after changing excluded files", function (done) {
		watcherInstance.on('changed', function (data) {
			expect(0).toEqual(1);
		});

		watcherInstance.watcher().on('ready', function (watcher) {
			fs.writeFileSync(file2, '<h1>Test</h1>');
		});

		watcherInstance.watcher().on('end', function () {
			done();
		});

		setTimeout(function () {
			watcherInstance.close();
		}, 1000);
	});
});