'use strict';

const debug = require('debug')('hello');

const fs = require('fs');
const parse = require('csv-parse');
const helper = require('./helper');

// 0. Naïve

function naive() {
    fs.readFile(__dirname + '/sample.csv', function thenParse(err, loadedCsv) {

        parse(loadedCsv, function transformEachLine(err, parsed) {

            for (let index in parsed) {

                if (index > 0) {
                    let line = helper.transformLineToUseFullName(parsed[index]);
                    debug(`sending data index: ${index - 1}`);

                    helper.sendSms(line, function afterSending(err, sendingStatus) {
                        if (err) {
                            debug(err.message);
                        }

                        let lineToLog = {
                            sendingStatus,
                            line,
                        };
                        helper.logToS3(lineToLog, function afterLogging(err, loggingStatus) {
                            if (err) {
                                debug(err.message);
                            }
                        });
                    });
                }
            }
        });
    });
}

naive();
