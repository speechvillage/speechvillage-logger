var winston = require('winston');

var NullLogger = function () {

    if (NullLogger.prototype._singletonInstance) {
        return NullLogger.prototype._singletonInstance;
    }
    NullLogger.prototype._singletonInstance = this;
    var self = this;
    /**
     * Override log level to add custom metadata
     */
    Object.keys(winston.levels).forEach(function (level) {
        self[level] = function (msg) {
            return;
        };
    });

    this.log = function (level) {
        return;
    };
}

module.exports = new NullLogger();
