'use strict';

var chai = require('chai'),
    should = chai.should(),
    expect = chai.expect,
    winston = require('winston');

describe('default logger', function () {
    var logger = require('../lib/default-logger');
    var originalLog = logger.logger.log;

    beforeEach(function () {
        logger.logger.log = originalLog;
        logger.logger = winston;
        logger.initTransports();
    });
    it('should be a singleton', function() {
        var slogger = require('../lib/default-logger');
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
    it('should log a simple message', function() {
        var message = 'message to log';
        logger.logger.log = function () {
            var args = Array.prototype.slice.call(arguments, 1);
            args[0].should.be.equal(message);
        };
        logger.debug(message);
    });
    it('should log message with meta data', function() {
        var message = 'message to log';
        var metadata = { text: 'text', value: 'metadata'};
        logger.logger.log = function () {
            var args = Array.prototype.slice.call(arguments, 1);
            args[0].should.be.equal(message);
            args[1].should.be.deep.equal(metadata);
        };
        logger.debug(message, metadata);
    });
    it('should log message with double meta data', function() {
        var message = 'message to log';
        var metadata1 = { text: 'text', value: 'metadata'};
        var metadata2 = { username: 'my username' };
        logger.logger.log = function () {
            var args = Array.prototype.slice.call(arguments, 1);
            args[0].should.be.equal(message);
            var meta = {
                text: metadata1.text,
                value: metadata1.value,
                username: metadata2.username
            };
            args[1].should.be.deep.equal(meta);
            expect(metadata1.username).to.be.undefined;
            metadata1.text.should.be.equal('text');
            metadata1.value.should.be.equal('metadata');

            expect(metadata2.text).to.be.undefined;
            expect(metadata2.value).to.be.undefined;
            metadata2.username.should.be.equal('my username');
        };
        logger.debug(message, metadata1, metadata2);
    });
    it('should log message with double meta data with date', function() {
        var d = new Date(2014,9,8,10,12,57,0); //Wed Oct 08 2014 10:12:57 GMT+0200 (CEST),
        var message = 'message to log';
        var metadata1= { text: 'Trovi tutte le informazioni qui {@http://www.libero.it}',
            sender: 'Emilia', date: d, id: 2 };
        var metadata2 = {sessionUsername: 201};
        var unionMetadata = { text: 'Trovi tutte le informazioni qui {@http://www.libero.it}',
            sender: 'Emilia', date: d.toJSON(), id: 2, sessionUsername: 201 };
        logger.logger.log = function (level, msg, meta) {
            expect(msg, 'message').to.not.be.undefined;
            expect(meta, 'metadata').to.not.be.undefined;
            msg.should.be.equal(message);
            meta.should.be.deep.equal(unionMetadata);
        };
        logger.debug(message, metadata1, metadata2);
    });
    it('should transform Date object to JSON date', function() {
        //Wed Oct 08 2014 10:12:57 GMT+0200 (CEST) - '2014-10-08T08:12:57.000Z'
        var d1 = new Date(2014,9,8,10,12,57,0);
        //Fri Jun 28 2002 10:12:57 GMT+0200 (W. Europe Summer Time) - '2002-06-28T08:12:57.000Z'
        var d2 = new Date(2002,5,28,10,12,57,0);
        //Wed Feb 20 2013 12:05:13 GMT+0100 (W. Europe Standard Time) - '2013-02-20T11:05:13.000Z'
        var d3 = new Date(2013,1,20,12,5,13,0);
        var metadata = {
            level: 1,
            date: d1,
            nest: {
                level: 2,
                date: d2,
                nest: {
                    level: 3,
                    date: d3
                }
            }
        };
        var expected = {
            level: 1,
            date: '2014-10-08T08:12:57.000Z',
            nest: {
                level: 2,
                date: '2002-06-28T08:12:57.000Z',
                nest: {
                    level: 3,
                    date: '2013-02-20T11:05:13.000Z'
                }
            }
        };
        logger.logger.log = function (level, msg, meta) {
            expect(meta, 'metadata').to.not.be.undefined;
            meta.should.be.deep.equal(expected);
        };

        logger.debug('message', metadata);
    });
    it('Should not throw error when removeTransports is called 2 times', function () {
        var broken = false;
        try {
            logger.removeTransports();
            logger.removeTransports();
        } catch(err) {
            broken = true;
        }
        logger.info('ciao');
        broken.should.be.false;
    });
    it('Should not throw error when initTransports is called 2 times', function () {
        var broken = false;
        try {
            logger.initTransports();
            logger.initTransports();
        } catch(err) {
            broken = true;
        }
        broken.should.be.false;
    });
});
