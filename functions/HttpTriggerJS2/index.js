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

        var tokens = ('' + csv_line).split(',');
        evtObj['tokens'] = tokens;

        // var zipUtil = new ZipUtil();
        // zipUtil.on('done', (evtObj) => {
        //     console.log('evtObj: ' + JSON.stringify(evtObj, null, 2));
        //     context.done();
        // });
        // zipUtil.process(myBlob);

        this.emit('done', evtObj);
    }

}

module.exports = function (context, req) {

    if (req.body) {
        var body = req.body;
        context.log('POST body: ' + JSON.stringify(body));

        if (body.data) {
            var csv_line = body.data;
            console.log(csv_line);
            var svc = new DocumentService(context);
            svc.on('done', (evtObj) => {
                console.log('evtObj: ' + JSON.stringify(evtObj, null, 2));
                context.res = { body: JSON.stringify(evtObj) };
            });
            svc.persist_document(csv_line);
        }
        else {
            context.res = {
                status: 400,
                body: "No body.data provided"
            }; 
        }
    }
    else {
        context.res = {
            status: 400,
            body: "Only POST requests are accepted"
        }; 
    }

    context.done();
};
