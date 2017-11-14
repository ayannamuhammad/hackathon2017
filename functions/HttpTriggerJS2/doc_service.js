// Node.js built-in libs:
const events = require('events');
const util   = require('util');
const fs     = require('fs');

class DocumentService extends events.EventEmitter {

    constructor() {
        super();
    }

    persist_document(csv_line) {
        var evtObj = {};
        evtObj['csv_line'] = csv_line;

        // var zipUtil = new ZipUtil();
        // zipUtil.on('done', (evtObj) => {
        //     console.log('evtObj: ' + JSON.stringify(evtObj, null, 2));
        //     context.done();
        // });
        // zipUtil.process(myBlob);

        this.emit('done', evtObj);
    }

}

module.exports.DocumentService = DocumentService
