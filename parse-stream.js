'use strict';

const debug = require('debug')('hello');
const parse = require('csv-parse');
const helper = require('./helper');
const readline = require('readline');
const fs = require('fs');
const parser = parse();

parser.on('error', function (err) {
    if (err) {
        debug(err.message);
    }
});

const rl = readline.createInterface({
    input: fs.createReadStream(__dirname + '/sample.csv'),
});

var first = true;
rl.on('line', function (line) {
    if (first) {
        first = false;
        return;
    }

    let transformedLine = helper.transformLineToUseFullName(line.split(','));
    debug(`sending data : ${transformedLine}`);

    helper.sendSms(transformedLine, function afterSending(err, sendingStatus) {
        if (err) {
            debug(err.message);
        }

        let lineToLog = {
            sendingStatus,
            transformedLine,
        };
        helper.logToS3(lineToLog, function afterLogging(err, loggingStatus) {
            if (err) {
                debug(err.message);
            }
        });
    });
}).on('close', function () {
    parser.end();
});
