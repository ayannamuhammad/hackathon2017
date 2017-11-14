'use strict';

const events = require('events');
const util   = require('util');

const DocumentDBClient = require('documentdb').DocumentClient;
const DocumentBase = require('documentdb').DocumentBase;

// This utility class contains functions for invoking Azure CosmosDB/DocumentDB.
// The db-accessing methods are asynchronous in nature, and emit events upon
// completion.
// Chris Joakim, Microsoft, 2017/11/14

class CosmosDocDbUtil extends events.EventEmitter {

    constructor(override_pref_locs) {
        super();
        this.dbname = process.env.AZURE_COSMOSDB_DOCDB_DBNAME;
        var uri     = process.env.AZURE_COSMOSDB_DOCDB_URI;
        var key     = process.env.AZURE_COSMOSDB_DOCDB_KEY;
        console.log('CosmosDocDbUtil constructor; dbname: ' + this.dbname);
        console.log('CosmosDocDbUtil constructor; uri:    ' + uri);
        console.log('CosmosDocDbUtil constructor; key:    ' + key);
        this.client = new DocumentDBClient(uri, { masterKey: key });
    }

    db_link(dbname) {
        return 'dbs/' + dbname;
    }

    coll_link(dbname, cname) {
        return 'dbs/' + dbname + '/colls/' + cname;
    }

    get_database_account() {
        this.client.getDatabaseAccount((err, db_acct, headers) => {
            var evt_obj = {};
            evt_obj['type']    = 'CosmosDocDbUtil:get_database_account';
            evt_obj['err']     = err;
            evt_obj['db_acct'] = db_acct;
            evt_obj['headers'] = headers;
            this.emit('done', evt_obj);
        });
    }

    list_databases() {
        this.client.readDatabases().toArray((err, dbs) => {
            var evt_obj = {};
            evt_obj['type'] = 'CosmosDocDbUtil:list_databases';
            evt_obj['err']  = err;
            evt_obj['dbs']  = dbs;
            this.emit('done', evt_obj);
        });
    }

    create_collection(dbname, cname) {
        var dblink = 'dbs/' + dbname;
        var collspec = { id: cname };
        this.client.createCollection(dblink, collspec, (err, created) => {
            var evt_obj = {};
            evt_obj['type']    = 'CosmosDocDbUtil:create_collection';
            evt_obj['dbname']  = dbname;
            evt_obj['cname']   = cname;
            evt_obj['created'] = created;
            evt_obj['error']   = err;
            this.emit('done', evt_obj);
        });
    }

    delete_collection(dbname, cname) {
        var colllink = 'dbs/' + dbname + '/colls/' + cname;
        this.client.deleteCollection(colllink, (err) => {
            var evt_obj = {};
            evt_obj['type']    = 'CosmosDocDbUtil:delete_collection';
            evt_obj['dbname']  = dbname;
            evt_obj['cname']   = cname;
            evt_obj['error']   = err;
            this.emit('done', evt_obj);
        });
    }

    list_collections(dbname) {
        var dblink = 'dbs/' + dbname;
        this.client.readCollections(dblink).toArray((err, collections) => {
            var evt_obj = {};
            evt_obj['type'] = 'CosmosDocDbUtil:list_collections';
            evt_obj['err']  = err;
            evt_obj['dbname'] = dbname;
            evt_obj['collections']  = collections;
            this.emit('done', evt_obj);
        });
    }

    create_document(dbname, cname, doc) {
        var colllink = 'dbs/' + dbname + '/colls/' + cname;
        this.client.createDocument(colllink, doc, (err, new_doc) => {
            var evt_obj = {};
            evt_obj['type']   = 'CosmosDocDbUtil:create_document';
            evt_obj['dbname'] = dbname;
            evt_obj['cname']  = cname;
            evt_obj['doc']    = new_doc;
            evt_obj['error']  = err;
            this.emit('done', evt_obj);
        });
    }

    asynch_echo(dbname, cname, doc) {
        // Just a method, with the same signature as 'create_document'
        // that emits an event object but does no DB actions.
        // Used for development purposes only.
        var colllink = 'dbs/' + dbname + '/colls/' + cname;
        var evt_obj = {};
        evt_obj['type']   = 'CosmosDocDbUtil:asynch_echo';
        evt_obj['dbname'] = dbname;
        evt_obj['cname']  = cname;
        evt_obj['colllink']  = colllink;
        evt_obj['doc']    = doc;
        this.emit('done', evt_obj);
    }

    query_documents(coll_link, query_spec) {
        console.log('CosmosDocDbUtil#query_documents; cl: ' + coll_link + '  qs:' + query_spec);

        this.client.queryDocuments(coll_link, query_spec).toArray((err, results) => {
            var evt_obj = {};
            evt_obj['type'] = 'CosmosDocDbUtil:query_documents';
            evt_obj['coll_link'] = coll_link;
            evt_obj['query_spec'] = query_spec;
            evt_obj['err']     = err;
            evt_obj['results'] = results;
            this.emit('done', evt_obj);
        });
    }

    delete_document(dbname, cname, doc_id, options) {
        var doclink = 'dbs/' + dbname + '/colls/' + cname + '/docs/' + doc_id;
        this.client.deleteDocument(doclink, options, (err) => {
            var evt_obj = {};
            evt_obj['type']    = 'CosmosDocDbUtil:delete_document';
            evt_obj['dbname']  = dbname;
            evt_obj['cname']   = cname;
            evt_obj['doc_id']  = doc_id;
            evt_obj['doclink'] = doclink;
            evt_obj['error']   = err;
            this.emit('done', evt_obj);
        });
    }

}

module.exports.CosmosDocDbUtil = CosmosDocDbUtil;
