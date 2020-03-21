# **TinyApp**

TinyApp is a full stack web application built with [Node.js](https://nodejs.org) and [Express](https://expressjs.com) that allows users to manage shortened long URLs (much like bit.ly).  Users can log in to an existing account, or create a new one.  Basic URL visitor statistics are kept and can be viewed, including total visits, and a list of unique visits (tracked by session cookie) which includes the number of visits and the timestamp of the last visit.

TinyApp is not suitable for production use and is release to the public domain for demonstration and educational purposes.

## **Screenshots**

TinyApp is beautiful:

!["Login page"](docs/tinyapp-screenshot-01-login.png)
!["URL index"](docs/tinyapp-screenshot-02-url-index.png)
!["URL details"](docs/tinyapp-screenshot-03-url-details.png)

## **Getting Started**

### **Setup**

Install Node.js from your [package manager](https://nodejs.org/en/download/package-manager/), or [download](https://nodejs.org/en/download/) binaries (for fun) or source code (for maximum fun).

Then clone, setup, and run TinyApp:

```
git clone https://github.com/d0ugr/tinyapp
cd tinyapp
npm install
```

### **Run**

To start on port 8080 with the provided sample data:

```
npm run tinyapp_sample
```

Then open http://localhost:8080 in your browser and log in with one of the following:

| Username          | Password        |
|:------------------|:----------------|
| t@e.st            | 123             |
| user@example.com  | 123             |
| user2@example.com | dishwasher-funk |

To start on port 8080 with empty databases:

```
npm run tinyapp
```

### **Command Line Usage**

The generic command line usage is:

```
node express_server.js [PORT] [USERDB] [URLDB]
```

The port that TinyApp listens on can be given as the first command line argument.  It otherwise defaults to port 8080.

By default, the user and URL database objects are empty, and you will have to register a new account before you can use TinyApp.  Sample user and URL data can be loading from JSON files.  The user data file must be the second command line argument, and the URL data file must be the third.  See the `data` directory for sample data files.

For example, the following starts TinyApp on port 7734 and loads the provided sample data:

```
node express_server.js 7734 data/user_db.json data/url_db.json
```

## **Development**

### **Directory Structure**

The project files are arranged as follows:

```
./                 Main project directory including JS files
./views            EJS page templates
./views/partials   Partial EJS templates used by views
./data             Sample data files
./test             Unit tests
./docs             Screenshots
```

### **Dependencies**

TinyApp requires [Node.js](https://nodejs.org) and the following [NPM](https://www.npmjs.com/) packages are used:

- [express](https://www.npmjs.com/package/express)
- [ejs](https://www.npmjs.com/package/ejs)
- [method-override](https://www.npmjs.com/package/method-override)
- [body-parser](https://www.npmjs.com/package/body-parser)
- [cookie-session](https://www.npmjs.com/package/cookie-session)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [fs](https://www.npmjs.com/package/fs)

### **Development Dependencies**

The following NPM packages are used for development:

- [mocha](https://www.npmjs.com/package/mocha)
- [chai](https://www.npmjs.com/package/chai)
- [nodemon](https://www.npmjs.com/package/nodemon)

### **Run**

While working on TinyApp it is preferable to use nodemon to automatically restart the server when files change:

```
npm start [PORT] [USERDB] [URLDB]
```

or

```
npm run tinyapp_dev [PORT] [USERDB] [URLDB]
```

Run with nodemon on port 8080 with sample data:

```
npm run tinyapp_dev_sample
```

### **Testing**

Unit tests can be run with:

```
npm test
```

See the `test` directory for test scripts.
