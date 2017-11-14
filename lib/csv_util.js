'use strict';

const events = require('events');
const fs     = require('fs');
const os     = require('os');
const util   = require('util');

// Utility class for CSV file processing.
// Chris Joakim, Microsoft, 2017/11/11

class CsvUtil extends events.EventEmitter {

    constructor() {
        super();
    }

    read_lines(filename) {
        return fs.readFileSync(filename).toString().split(os.EOL);
    }

    convert_to_objects(filename) {
        var list = [];
        console.log('CsvUtil#convert_to_objects: ' + filename);
            var csv_data    = fs.readFileSync(filename).toString();
            var csv_lines   = csv_data.split(os.EOL);
            var line_count  = csv_lines.length;
            var header_line = null;
            var headers     = null;

            console.log('filename:   ' + filename);
            console.log('line_count: ' + line_count);

            for (var i = 0; i < line_count; i++) {
                if (i == 0) {
                    headers = csv_lines[i].split(',');
                    for (var h = 0; h < headers.length; h++) {
                        headers[h] = headers[h].trim().toLowerCase().replace(' ', '');
                    }
                    console.log(JSON.stringify(headers));
                }
                else {
                    var values = csv_lines[i].split(',');
                    if (values.length == headers.length) {
                        var row = {};
                        for (var a = 0; a < headers.length; a++) {
                            var attr  = headers[a];
                            var value = values[a];

                            // Convert some attributes from Strings to Numbers
                            if (attr.includes('_qty')) {
                                value = Number(values[a]);
                            }
                            row[attr] = value;
                        }
                        list.push(row);
                    }
                }
            }

        return list;
    }

}

module.exports.CsvUtil = CsvUtil;
