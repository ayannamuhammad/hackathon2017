// Chris Joakim, Microsoft, 2017/11/14

const express = require('express');
const router  = express.Router();
const events  = require('events');
const util    = require('util');
const azu     = require('azu-js');

const CosmosDocDbUtil = require('../lib/cosmos_docdb_util').CosmosDocDbUtil; 

const dbname = process.env.AZURE_COSMOSDB_DOCDB_DBNAME;
const cname  = process.env.AZURE_COSMOSDB_DOCDB_COLLNAME;

console.log('dbname: ' + dbname);
console.log('cname:  ' + cname);

// This endpoint is just used in development to test/verify the POSTed body.
router.post('/echo', function(req, res) {
  console.log('/echo, body: ' + req.body);
  res.json(req.body); 
});

// Endpoint to list the databases in this hackathon CosmosDB.
// NOT recommended for production use; simply for demonstration purposes.
router.post('/dbs', function(req, res) {
  var db_util = new CosmosDocDbUtil();
  db_util.on('done', (evt_obj) => {
      console.log(JSON.stringify(evt_obj, null, 2));
      res.json(evt_obj);
  });
  db_util.list_databases();  
});

// Post a query-spec to CosmosDB, in the form as in the examples in the queries/ directory;
// a query-spec object myst have a 'query' and 'parameters', as shown in the following curl:
// curl --header "Content-Type: application/json" --data '{"query": "SELECT * FROM c", "parameters": []}' http://localhost:3000/query
router.post('/query', function(req, res) {
  console.log('/query, body: ' + req.body);
  var query_spec = req.body;
  console.log(query_spec);

  var db_util = new CosmosDocDbUtil();
  var coll_link = db_util.coll_link(dbname, cname);
  console.log('coll_link: ' + coll_link);
  db_util.on('done', (evt_obj) => {
    evt_obj['query_spec'] = query_spec;
    evt_obj['coll_link'] = coll_link;
    console.log(evt_obj);
    res.json(evt_obj);
  });
  db_util.query_documents(coll_link, query_spec); 
});

module.exports = router;
