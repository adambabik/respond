# Respond

JavaScript library to communicate with a web page front-end.

## Features

* evaluating arbitrary code on a web page font-end from command line
* dedicated commands to refresh a web application or only CSS files
* communicate with a web page front-end using CLI (Command Line Interface) or your own node.js application with respond library

## Installation

Install via npm package manager:

```
$ npm install -g respond
```

You may need to write `sudo` before the command in order to install it globally.

## CLI (Command Line Interface)

Respond has a command line interface to interact with it without any other applications.

### Usage

If you installed respond globally, put down in Terminal:

```
$ respond
```

You should see the prompt: `respond> `. Now, you can start write commands. Probably the best one at the beginning is `:help`. To quit the CLI write `:quit` or type on a keyboard `ctrl + c`.

### Options

You can run CLI with several options:

* `-p, --port PORT` - specfies port on which the built-in server is about to listen,
* `-w, --watch file[, file ...]` - watches listed files, wildcards available,
* `-a, --action ext=actionName` - assigns actions to fire after file change, for instance `js=refresh` tells that after changing a file with `js` extension the `refresh` action will be send. Available actions: _refresh_, _rereshCSS_, _alert('Changed')_,
* `-e, --exclude file[, file ...]` - excludes files from being observed,
* `-d, --debug` - prints debug logs to STDOUT.

## Using Respond in node.js applications

Respond can be used in node.js applications. All you need to do is to install respond from NPM (see Installation) and require module in you app.

More details will come soon.

## License

BSD