db.version(); // Used to check the Mongo DB version.

/*
To start Mongo DB server we simply open mongo terminal it is from : D:\Programming\MongoDatabase\bin>mongo
Which run the server on : http://localhost:27017/ or http://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb
 */

/*
This NoSQL will be mostly like Javascript.
When we are working with Mongo DB and interacting with it via
the Mongo DB shell, we are just using Javascript to manipulate the
database.
 */

/*
We can also connect NodeJS to mongo database, and perform CRUD from there.
To do that we have to use Mongo DB native driver. This is a NPM module which allows us to
interact with our database from node.

To install this NPM module first we have to initialize the node_modules with : npm init -y
And install this native driver with : npm install mongodb

By this we are ready to use the driver to connect to our database and can perform CRUD.

 */

db.getCollection("users").find({}); // USed to fetch the inserted documents.

