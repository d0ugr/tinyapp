# TinyApp

TinyApp is a full stack web application built with [Node.js](https://nodejs.org) and [Express](https://expressjs.com) that allows users to manage shortened long URLs (much like bit.ly).

It is not suitable for production use and is release to the public domain for demonstration and educational purposes.

## Screenshots

TinyApp is beautiful:

!["Login page"](docs/tinyapp-screenshot-01-login.png)
!["URL index"](docs/tinyapp-screenshot-02-url-index.png)
!["URL details"](docs/tinyapp-screenshot-03-url-details.png)

## Getting Started

Install Node.js from your [package manager](https://nodejs.org/en/download/package-manager/), or [download](https://nodejs.org/en/download/) binaries or source code.

Then clone, setup, and run TinyApp:

```
$ git clone https://github.com/d0ugr/tinyapp
$ cd tinyapp
$ npm install
$ npm start [PORT]
```

The port that TinyApp listens on can be given as the first command line argument.  It otherwise defaults to [port 8080](http://localhost:8080).

## Development Notes

The source code is arranged as follows:

```
./                 Main project directory including JS files
./views            EJS page templates
./views/partials   Partial HTML templates used by views
./test             Unit tests
./docs             Screenshots
```

## Dependencies

- Node.js
- Express
- EJS
- body-parser
- cookie-session
- bcrypt

## Testing

Unit tests can be run with `npm test`.  See the `tests` directory for test scripts.
