# respond

respond is a useful tool which makes web development faster. It allows a user to communicate with a web page through CLI, watching files and automatic reloading.

## Features

* evaluating arbitrary JavaScript code on a web page using CLI or node.js application
* watching files and responding to their changes
* dedicated commands to refresh the whole web page or only CSS files
* handles many web pages connected to one respond instance

## Installation

Install via npm package manager:

```
$ npm install -g respond
```

You may need to write `sudo` before the command in order to install it globally.

## CLI (Command Line Interface)

### Setting up

respond has a command line interface to interact with web pages. To send commands to them you need to put this code in HTML file:

```html
<script type="text/javascript" src="http://localhost:8000/pub/client.js"></script>
<script type="text/javascript" src="http://localhost:8000/respond.js"></script>
<script type="text/javascript">
	var respond = new Respond('http://localhost:8000');
</script>
```

8000 is a default port on which respond works. See [options](https://github.com/dreame4/respond#options) to change it.

**Tip:** If you would like to, for instance, open a web page from your computer on mobile devices all being in the same local network, you can replace localhost with IP of your computer. All web pages will connect to the respond instance and will be sent commands.

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

## Using respond in node.js applications

respond can be used in node.js applications. All you need to do is to install respond from NPM (see Installation) and require module in your app.

For now, you may want to check out source code, especially `bin/respond`, to get an idea how to use it. More details come soon.

## Todos

* possibility to send a command to a specific client (now each command is broadcasted to all clients)
* dashboard to manage clients, logs and other events

## License

BSD