'use strict';

// This module is executed from the command-line, as follows.
// node main.js  
// It will display the available ways that main.js can be executed.
//
// Chris Joakim, Microsoft, 2017/11/14

const fs = require('fs');
const os = require('os');
const rp = require('request-promise');
const CosmosDocDbUtil = require('./lib/cosmos_docdb_util').CosmosDocDbUtil; 
const CsvUtil = require('./lib/csv_util').CsvUtil;

class Main {

    constructor() {
        this.csv_objects = [];
        this.curr_index  = 0;
        this.max_index   = 100;
    }

    execute() {
        if (process.argv.length < 3) {
            this.display_help('error: too few command-line args provided.');
            process.exit();
        }
        else {
            var funct = process.argv[2];

            switch (funct) {
                case 'get_cdb_account':
                    this.get_cdb_account();
                    break;
                case 'list_cdb_databases':
                    this.list_cdb_databases();
                    break;
                case 'create_cdb_collection':
                    this.create_cdb_collection();
                    break;
                case 'delete_cdb_collection':
                    this.delete_cdb_collection();
                    break;
                case 'list_cdb_collections':
                    this.list_cdb_collections();
                    break;
                case 'create_cdb_document':
                    this.create_cdb_document();
                    break;
                case 'query_cdb':
                    this.query_cdb();
                    break; 
                case 'preprocess_csv_file':
                    this.preprocess_csv_file();
                    break; 
                case 'load_cdb_from_csv':
                    this.load_cdb_from_csv();
                    break; 
                case 'post_echo':
                    this.post_echo();
                    break;
                case 'post_dbs':
                    this.post_dbs();
                    break;
                case 'post_query':
                    this.post_query();
                    break;
                default:
                    this.display_help('undefined function: ' + funct);
                    break;
            }
        }
    }

    get_cdb_account() {
        var db_util = new CosmosDocDbUtil();
        db_util.on('done', (evt_obj) => {
            console.log(JSON.stringify(evt_obj, null, 2));
        });
        db_util.get_database_account();
    }

    list_cdb_databases() {
        var db_util = new CosmosDocDbUtil();
        db_util.on('done', (evt_obj) => {
            console.log(JSON.stringify(evt_obj, null, 2));
        });
        db_util.list_databases();    
    }

    create_cdb_collection() {
        if (process.argv.length > 3) {
            var dbname = process.argv[3];
            var cname  = process.argv[4];
            var db_util = new CosmosDocDbUtil();
            db_util.on('done', (evt_obj) => {
                console.log(JSON.stringify(evt_obj, null, 2));
            });
            db_util.create_collection(dbname, cname); 
        }
        else {
            this.display_help('invalid command-line args')
        }
    }

    delete_cdb_collection() {
        if (process.argv.length > 3) {
            var dbname = process.argv[3];
            var cname  = process.argv[4];
            var db_util = new CosmosDocDbUtil();
            db_util.on('done', (evt_obj) => {
                console.log(JSON.stringify(evt_obj, null, 2));
            });
            db_util.delete_collection(dbname, cname); 
        }
        else {
            this.display_help('invalid command-line args')
        }
    }

    list_cdb_collections() {
        if (process.argv.length > 2) {
            var dbname = process.argv[3];
            var db_util = new CosmosDocDbUtil();
            db_util.on('done', (evt_obj) => {
                console.log(JSON.stringify(evt_obj, null, 2));
            });
            db_util.list_collections(dbname); 
        }
        else {
            this.display_help('invalid command-line args')
        }
    }

    create_cdb_document() {
        if (process.argv.length > 3) {
            var dbname = process.argv[3];
            var cname  = process.argv[4];
            var db_util = new CosmosDocDbUtil();
            db_util.on('done', (evt_obj) => {
                console.log(JSON.stringify(evt_obj, null, 2));
            });
            var date = new Date();
            var doc = {};
            doc['date']  = date.toString();
            doc['epoch'] = date.getTime();
            doc['user']  = process.env.USER;
            db_util.create_document(dbname, cname, doc); 
        }
        else {
            this.display_help('invalid command-line args')
        }
    }

    query_cdb() {
        // query the database, see the queries/ directory for examples
        if (process.argv.length > 5) {
            var dbname = process.argv[3];
            var cname  = process.argv[4];
            var query_file = process.argv[5];
            var db_util = new CosmosDocDbUtil();
            var coll_link = db_util.coll_link(dbname, cname);

            db_util.on('done', (evt_obj) => {
                console.log(JSON.stringify(evt_obj, null, 2));
            });
            var query_spec = this.load_json_file(query_file);
            console.log(JSON.stringify(query_spec, null, 2));

            db_util.query_documents(coll_link, query_spec); 
        }
        else {
            this.display_help('invalid command-line args')
        }
    }

    preprocess_csv_file() {
        if (process.argv.length > 3) {
            var csv_filename = process.argv[3];
            var util = new CsvUtil();
            var objects = util.convert_to_objects(csv_filename);
            console.log(JSON.stringify(objects, null, 2));
        }
        else {
            this.display_help('invalid command-line args')
        }
    }

    load_cdb_from_csv() {
        if (process.argv.length > 4) {
            var dbname = process.argv[3];
            var cname  = process.argv[4];
            var csv_filename = process.argv[5];
            var db_util  = new CosmosDocDbUtil();
            var csv_util = new CsvUtil();
            this.csv_objects = csv_util.convert_to_objects(csv_filename);
            this.curr_index  = 0;
            this.max_index   = this.csv_objects.length;

            db_util.on('done', (evt_obj) => {
                this.curr_index = this.curr_index + 1;
                console.log('evt_obj: ' + JSON.stringify(evt_obj, null, 2));
                this.load_next_doc(dbname, cname, db_util, this.csv_objects);
            });
            this.load_next_doc(dbname, cname, db_util, this.csv_objects);

        }
        else {
            this.display_help('invalid command-line args');
        }
    }

    load_next_doc(dbname, cname, db_util, docs) {
        if (this.curr_index < this.max_index) {
            var doc = docs[this.curr_index];
            console.log('loading doc - db: ' + dbname + ' coll: ' + cname + ' idx: ' + this.curr_index);
            console.log(doc);
            db_util.create_document(dbname, cname, doc);
        }
        else {
            console.log('end of documents list at index ' + this.curr_index);
        }
    }

    post_echo() {
        if (process.argv.length > 2) {
            var fname = process.argv[3];
            var url = process.env.AZURE_COSMOSDB_WEBAPP;
            if (url == undefined) {
                url = 'http://localhost:3000/data/echo';
            }
            else {
                url = url + '/data/echo';
            }
            console.log('url: ' + url);

            var json_str = fs.readFileSync(fname).toString();
            var post_data = JSON.parse(json_str);
            console.log('posting to url: ' + url + ' data:\n' + JSON.stringify(post_data, null, 2));

            var options = {
                method: 'POST',
                uri: url,
                body: post_data,
                json: true
            };
            rp(options)
                .then(function (parsedBody) {
                    console.log('parsedBody response: ' + JSON.stringify(parsedBody, null, 2));
                })
                .catch(function (err) {
                    console.log('err response: ' + err);
                });
        }
        else {
            this.display_help('invalid args for post function');
        }
    }

    post_dbs() {
        if (process.argv.length > 2) {
            var fname = process.argv[2];
            var url = process.env.AZURE_COSMOSDB_WEBAPP;
            if (url == undefined) {
                url = 'http://localhost:3000/data/dbs';
            }
            else {
                url = url + '/data/dbs';
            }
            console.log('url: ' + url);

            var post_data = {};
            console.log('posting to url: ' + url + ' data:\n' + JSON.stringify(post_data, null, 2));

            var options = {
                method: 'POST',
                uri: url,
                body: post_data,
                json: true
            };
            rp(options)
                .then(function (parsedBody) {
                    console.log('parsedBody response: ' + JSON.stringify(parsedBody, null, 2));
                })
                .catch(function (err) {
                    console.log('err response: ' + err);
                });
        }
        else {
            this.display_help('invalid args for post function');
        }

    }

    post_query() {
        if (process.argv.length > 2) {
            var fname = process.argv[3];
            var url = process.env.AZURE_COSMOSDB_WEBAPP;
            if (url == undefined) {
                url = 'http://localhost:3000/data/query';
            }
            else {
                url = url + '/data/query';
            }
            console.log('url: ' + url);

            var json_str = fs.readFileSync(fname).toString();
            var post_data = JSON.parse(json_str);
            console.log('posting to url: ' + url + ' data:\n' + JSON.stringify(post_data, null, 2));

            var options = {
                method: 'POST',
                uri: url,
                body: post_data,
                json: true
            };
            rp(options)
                .then(function (parsedBody) {
                    console.log('parsedBody response: ' + JSON.stringify(parsedBody, null, 2));
                })
                .catch(function (err) {
                    console.log('err response: ' + err);
                });
        }
        else {
            this.display_help('invalid args for post function');
        }
    }

    load_json_file(filename) {

        var json_string = fs.readFileSync(filename).toString();
        return JSON.parse(json_string);
    }

    display_help(error_msg) {
        if (error_msg) {
            console.log('error:');
            console.log('  ' + error_msg);
        }
        console.log('example commands:');
        console.log('  node main.js get_cdb_account'); 
        console.log('  node main.js list_cdb_databases');
        console.log('  node main.js create_cdb_collection hackathon test1');
        console.log('  node main.js create_cdb_collection hackathon test2');
        console.log('  node main.js delete_cdb_collection hackathon test1');
        console.log('  node main.js list_cdb_collections hackathon');
        console.log('  node main.js create_cdb_document hackathon test1');
        console.log('  node main.js query_cdb hackathon test1 queries/q1.json');
        console.log('  node main.js preprocess_csv_file data/private/HackDataTestFile.csv');
        console.log('  node main.js load_cdb_from_csv hackathon test1 data/private/HackDataTestFile.csv');
        console.log('');
        console.log('  the following do a HTTP POST to the AZURE_COSMOSDB_WEBAPP web app:');
        console.log('  node main.js post_dbs');
        console.log('  node main.js post_echo queries/q0.json');
        console.log('  node main.js post_query queries/q0.json');
        console.log('');
    }
}

new Main().execute();
