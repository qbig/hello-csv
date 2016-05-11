'use strict';

const debug = require('debug')('hello');

const fs = require('fs');

const helper = require('./helper');
const Promise = require('bluebird');
const parse = Promise.promisify(require('csv-parse'));
var sendSms = Promise.promisify(helper.sendSms);
var logToS3 = Promise.promisify(helper.logToS3);
var readFile = Promise.promisify(fs.readFile);

function asyncApproach() {
    readFile(__dirname + '/sample.csv', 'utf8').then(function thenParse(loadedCsv) {
        return parse(loadedCsv);
    }).then(function (parsed) {
        for (let index in parsed) {
            let line = helper.transformLineToUseFullName(parsed[index]);
            debug(`sending data index: ${index - 1}`);
            if (index > 0) {
                Promise.resolve().then(function () {
                    return sendSms(line);
                }).then(function (status) {
                    let lineToLog = {
                        status,
                        line,
                    };
                    return logToS3(lineToLog);
                }).catch(function (err) {
                    if (err) {
                        debug(err.message);
                    }
                });
            }
        }
    });
}

asyncApproach();
