var winston = require('winston'),
    path = require('path'),
    _ = require('lodash');

var DefaultLogger = function () {

    if (DefaultLogger.prototype._singletonInstance) {
        return DefaultLogger.prototype._singletonInstance;
    }
    DefaultLogger.prototype._singletonInstance = this;
    var self = this;
    this.logger = winston;

    /**
     * Override log level to add custom metadata
     */
    Object.keys(self.logger.levels).forEach(function (level) {
        self[level] = function (msg) {
            // build argument list (level, msg, ... [string interpolate], [{metadata}], [callback])
            var args = [level].concat(Array.prototype.slice.call(arguments));
            self.log.apply(self, args);
        };
    });

    var mapDate = function (value) {
        return _.isDate(value) ? value.toJSON() : undefined;
    };

    this.log = function (level) {
        var args = Array.prototype.slice.call(arguments, 1);

        while(args[args.length - 1] === null) {
            args.pop();
        }

        var callback = typeof args[args.length - 1] === 'function' ? args.pop() : null,
            meta1 = typeof args[args.length - 1] === 'object' ? _.cloneDeep(args.pop(), mapDate) : {},
            meta2 = typeof args[args.length - 1] === 'object' ? _.cloneDeep(args.pop(), mapDate) : {},
            msg = args;
        /**
         * merge all the metadata fields to one obejct
         */
        var metadata = _.merge(meta1, meta2);
        self.logger.log.apply(self.logger, [level].concat(msg, metadata, callback));
    };

    this.logError = function (err, msg) {
        if (err) {
            msg = msg ? msg + ' - ' : '';
            msg += err.name + ': ' + err.message;
        }
        if (msg) {
            self.logger.error(msg);
        }
    };

    this.removeTransports = function () {
        self.logger.clear();
    };

    /**
     * Transports definition
     */
    this.initTransports = function () {
        self.logger.clear();

        self.logger.add(self.logger.transports.Console, { 
            level: 'silly',
            timestamp: true
        });
        self.logger.add(self.logger.transports.DailyRotateFile, {
            name: 'file',
            datePattern: '.yyyy-MM-dd-HH.log',
            filename: path.join('./', 'logs', 'application'),
            level: 'silly',
            timestamp: true
        });
    }

    self.initTransports();
}

module.exports = new DefaultLogger();
