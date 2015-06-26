# speechvillage-logger
A simple logging system built on top of Winston

Installation
------
Just run:
```
$ npm install speechvillage-logger
```
Then create a *logs* directory in the root folder where application starts.

The Loggers
------
There are 2 kinds of loggers you can choose from:

+ `defaultLogger` - a *Winston* based logger that logs on console and on *logs/application.date.log* based on Winston daily rotation file transport;
+ `nullLogger` - a null logger that send all your logs to `dev/null`, useful to disable logs during the tests.

Moreover, you can access the underlying winston logger by accessing the `logger` field of the default logger.

Examples
--------

```
var defaultLogger = require('speechvillage-logger').defaultLogger;
var nullLogger = require('speechvillage-logger').nullLogger;

nullLogger.info('this will not log anything');
defaultLogger.info('this will logs both on console and on file');

// You can access the underlying winston logger
defaultLogger.logger.warn('hello, this is Winston!');
```
