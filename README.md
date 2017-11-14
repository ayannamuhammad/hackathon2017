# azure-hackathon-m11

Code for a Hackathon involving on-prem CSV data and CosmosDB.

# Setup

## Azure

- In portal.azure.com:
  - Provision a CosmosDB with DocumentDB.
  - Create a database named 'hackathon' in your CosmosDB.
  - In CosmosDB -> Settings -> Keys, capture the primary key and URI values
  - Create a collection named **test1** in 'hackathon', with no partition key.

## Your Workstation

- Install the **git** source-control program if you don't already have it;
  see https://git-scm.com

- Install a recent (i.e - version 8.x.x) version of Node.js;
  see https://nodejs.org/en/

- Set the following environment variables on your computer from the CosmosDB
  values in your Azure Portal, for example:
  - AZURE_COSMOSDB_DOCDB_DBNAME=hackathon
  - AZURE_COSMOSDB_DOCDB_KEY=your-key-value
  - AZURE_COSMOSDB_DOCDB_URI=https://your-db-name.documents.azure.com:443/
  - AZURE_COSMOSDB_WEBAPP="http://your-web-app.azurewebsites.net"

- Open a PowerShell or Terminal/bash window, and cd to a working directory,
  then run the following commands.

- Clone this code and set of files to your computer

```
git clone https://github.com/cjoakim/azure-hackathon-m11.git
or
git clone git@github.com:cjoakim/azure-hackathon-m11.git
```

- Change to the project root directory.

```
cd azure-hackathon-m11
```

- Install the node.js libraries (as specified in file package.json).

```
npm install
```

- Run the main.js program with Node.js, it should display the help page
  which lists what commands can be executed.

```
node main.js

error:
  error: too few command-line args provided.
example commands:
  node main.js get_cdb_account
  node main.js list_cdb_databases
  node main.js create_cdb_collection hackathon test1
  node main.js delete_cdb_collection hackathon test1
  node main.js list_cdb_collections hackathon
  node main.js create_cdb_document hackathon test1
  node main.js query_cdb hackathon test1 queries/q0.json
  node main.js preprocess_csv_file data/private/your.csv
  node main.js load_cdb_from_csv hackathon test1 data/private/your.csv

```

In the above sample commands **hackathon** is the database name, and **test1** is
a collection name.  **cdb** is an abbreviation for CosmosDB.

# Loading Data into CosmosDB

Copy your csv file to subdirectory data/private/ in this repository.
The csv file should contain a header row, with header names for each column,
with no spaces in the names.

Then execute the following command, where xxx.csv is your csv file:

```
node main.js load_cdb_from_csv hackathon test1 data/private/xxx.csv
```

# Querying CosmosDB

## In Azure Portal

See CosmosDB -> Query Explorer

## With main.js in this repo

See the *.json files in the queries/ subdirectory.  The main.js program
uses these JSON files for a given query.  For example:

```
node main.js query_cdb hackathon test1 queries/q1.json
```

The syntax of these query json files is as required by class **DocumentClient**
in the [documentdb](https://www.npmjs.com/package/documentdb) npm library.

Create and execute your own query json files as you wish!

## From a Node.js Web Application

Refer to the following for example code to read CosmosDB/DocumentDB:

- File lib/cosmos_docdb_util.js in this repository
- npm library [asu-js](https://www.npmjs.com/package/azu-js)
- GitHub repo for [asu-js](https://github.com/cjoakim/azu-js)

## SQL Examples

```
SELECT * FROM c where c.zl_divn_nbr = "71"
```

## Links

- https://github.com/Azure/azure-documentdb-node
- https://docs.microsoft.com/en-us/azure/cosmos-db/import-data 
- https://azure.microsoft.com/en-us/updates/documentdb-data-migration-tool/ 
- https://expressjs.com


