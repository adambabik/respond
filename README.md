# Respond

JavaScript library to communicate with a web page front-end.

## Features

* evaluating arbitrary code on a web page font-end
* dedicated commands to refresh a web application or only CSS files
* communicate with a web page front-end using CLI (Command Line Interface) or your own node.js application with respond library

## Installation

Install via npm package manager:

```
$ npm install -g respond
```

You may need to write `sudo` before the command in order to install it globally. Or just install it locally, but CLI interface might not work out of a box.

## CLI (Command Line Interface)

Respond has a command line interface to interact with it without any other applications.

### Usage

If you installed repsond globally, put down in Terminal:

```
$ respond
```

You should see the prompt: `respond> `. Now, you can start write commands. Probably the best on the beggining is `:help`. To quit the CLI write `:quit` or push on a keyboard `ctrl + c`.

### Options

You can run CLI with several otpions. Here are the most useful:

* `-p, --port PORT` - specfies port on which the built-in server is about to listen,
* `-w, --watch file[, file ...]` - watches listed files, wildcards available,
* `-a, --action ext=actionName` - assigns actions to fire after file change, for instance `js=refresh` tells that after changing a file with `js` extension the `refresh` action will be send. Available actions: _refresh_, _rereshCSS_, _alert('Changed')_,
* `-e, --exclude file[, file ...]` - excludes files from being observed,
* `-d, --debug` - prints debug logs to STDOUT.

## Using Respond in node.js applications

Respond can be used in node.js applications. All you need to do is to install respond from NPM (see Instalation) and require module in you app. 

### Module components

Respond module has several components:

* **Server**, runs server or attach to existing http serer. There must exists a server to communicate between the backend application and front-end.Server component uses [publish/subscribe messaging system](http://faye.jcoglan.com/) to achieve it,
* **Watcher**, is responsible for managing waching list, add/remove thme, trigger events after changes etc. Inherits from node's EventEmitter,
* **Manager**, manages connected clients as many clients can attach to one server.

## Web interface

Apart from CLI, there is a Web interface for respond. On [its dashboard](http://localhost:PORT/dashboard) you can see clients connected to the respond instance, logs, waching files and others. There is also a Web Command Line Interface, similar to Developer Tools in modern web browser.