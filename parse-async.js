'use strict';

const debug = require('debug')('hello');

const fs = require('fs');
const parse = require('csv-parse');
const helper = require('./helper');
const async = require('async');

function asyncApproach() {
    fs.readFile(__dirname + '/sample.csv', function thenParse(err, loadedCsv) {

        parse(loadedCsv, function transformEachLine(err, parsed) {

            for (let index in parsed) {
                let line = helper.transformLineToUseFullName(parsed[index]);
                debug(`sending data index: ${index - 1}`);
                if (index > 0) {
                    async.waterfall([
                        function(callback) {
                            helper.sendSms(line, callback);
                        },
                        function(sendingStatus, callback) {
                            let lineToLog = {
                                sendingStatus,
                                line,
                            };
                            helper.logToS3(lineToLog, callback);
                        }
                    ], function (err, result) {
                        if (err) {
                            debug(err.message);
                        }
                    });
                }
            }
        });
    });
}

asyncApproach();
