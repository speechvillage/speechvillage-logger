'use strict';

var chai = require('chai'),
    should = chai.should(),
    expect = chai.expect,
    winston = require('winston');

describe('null logger', function () {
    var logger = require('../lib/null-logger');

    it('should be a singleton', function() {
        var slogger = require('../lib/null-logger');
        logger.should.be.equal(slogger);
    });
    it('should exist the standard log level methods', function () {
        Object.keys(winston.levels).forEach(function (value) {
            expect(logger[value]).to.not.be.undefined;
            expect(logger[value]).to.be.a('function');
        });
    });
    it('should exists the method log', function () {
    	expect(logger.log).to.be.not.undefined;
    	logger.log.should.be.a('function');
    });
});
