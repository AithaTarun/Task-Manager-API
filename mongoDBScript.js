/*
This script file is used to perform operations with Mongo database.
 */

/*
CRUD : Create, Read, Update and Delete.
 */

/*const mongoDB = require('mongodb');*/ // Commented after using destructuring below for client adn etc...

/*
By above require we a object, on that object we have to initialize the connection.
Which is known as the mongo client.

Below MongoClient will give us access to the function necessary to connect it to the database
so we can perform our basic CRUD operations.

Also we have to define the connection URL in the database we are trying to connect to.
 */
/*const MongoClient = mongoDB.MongoClient;

const ObjectID = mongoDB.ObjectID; // Used to generate our own GUIDs.*/ // Commented after using destructuring

const {MongoClient,ObjectID} = require('mongodb');

const id = new ObjectID(); // This the function which creates a new ID for us.
console.log("Generated GUID :",id);
/*
This id contains a few pieces of information inside of it. This is a 12-byte ObjectID value
in which first 4-bytes represent the number of seconds since the Unix epoch(Midnight January 1st 1970).
And after that next 5-bytes is a random value
and last 3-bytes are a counter starting with a random value.
 */
/*
Also this ObjectID will have a method getTimestamp which is used to get the timestamp that is
stored inside of the first four bytes of the generated GUID.
 */
console.log("Timestamp in GUID : ",id.getTimestamp());

const connectionURL = 'mongodb://127.0.0.1:27017';
/*
Here we want to connect to that local host server that's up and running in the mongo terminal.
Here we use local host IP (127.0.0.1) instead of localhost because localhost causes some
strange issues where it slows down our application.
*/

const databaseName = 'task-manager-database';
/*
This the database name, which we can pick whatever we want for this.
 */

/*
Now we have all the information required to connect to our database.
 */
MongoClient.connect
(
    connectionURL,
    {
        useNewUrlParser : true,
        /*
        This is useNewURLParser option to parse the URL correctly so we can connect to
        the server.
         */
        useUnifiedTopology: true
    },
    (error,client)=>
    {
        /*
        This callback function is get called when we are actually connected to the database.
        Connecting to the database is not a synchronous operation.
        It is a asynchronous it's going to take a bit of time to get that connection set up
        and the callback function will run when the connect operation is complete.

        Here if the first argument to this callback exists then some error occurred while connecting
        or if the second argument exists means things went well and we are connected to the server and
        we can start to manipulate our databases.
         */
        if (error)
        {
            return console.log("Error occurred while connecting to mongo database :",error);
        }

        console.log("Connected to mongo database successfully");

        /*
         Below we insert a document.
         For that we need to get a reference to the specific database we want to manipulate.
         In this case that is "task-manager-database".
         With mongo db there's no need to create this database using any Mongo DB or any GUI,
         simply by picking a name and accessing it will Mongo DB will automatically create
         it for us.

         Below client.db with database name parameter will give the database reference which can be used
         to manipulate that database.
         */
        const databaseReference=client.db(databaseName);

        /*
        Now we know that with NoSQL database like Mongo DB we don't have tables, we have collections.

        So, before we insert a document we have to figure out which collection we are trying
        to insert the document into.
        We can use collections to track all of the distinct things in our application.
        Like we could have a collection for users, a collection for tasks and a collection
        for anything else we might need to track.

        Now here we insert a single document into a users collection.
         */
        /*databaseReference.collection
        (
            'users',
        ).insertOne
        (
            /!*
             This method is used to insert a document to above specified collection.
             This expects an object as that first argument and this should contain all
             of the data we are trying to insert.
             *!/
            {
                name : 'Aitha Tarun',
                age : 19
            },
            (error,result)=>
            {
                /!*
                This callback will be called when the operation is complete.
                Here error or result not both will be passed to this callback.
                The result will contain data and the unique ID that was assigned to the document.
                 *!/
                if (error)
                {
                    return console.log("Error occurred while inserting document :",error);
                }

                /!*
                Now result has a property which contains all the documents that were inserted.
                 *!/
                console.log("Inserted document :",result.ops);
                /!*
                Also this result will have properties like insertedCount(Total amount of documents inserted),
                insertedId(ID of the document we inserted).
                 *!/
            }
        );*/ // Commented after using bulk insertion.
        /*
        By this we insert a document into that users collection.
        This allows us to insert a single document into a collection.
         */
        /*
        After this if we want to verify that our data is updated or not by using IDEs or GUIs.

        We can see that by refreshing the database in the database tab in intellij.
        Here we get new database "task-manager-database".
        There we can watch the data in users document which contains 3 fields _id, name and age.
        Here _id is a unique identifier for that particular document.
         */
        /*
        Above insertOne is a asynchronous, here we have not registered any callback because it
        is not necessary for the data to get inserted  if we want to handle errors or confirm
        that our operation worked as expected.
         */

        /*databaseReference.collection('users').insertMany
        (
            /!*
            This insertMany is used to insert more than one document at a time.
             *!/
            [
                {
                    name : 'Name 1',
                    age : 5
                },
                {
                    name : 'Name 2',
                    age : 10
                }
            ],
            (error,result)=>
            {
                if (error)
                {
                    return console.log("Error occurred while inserting documents :",error);
                }
                console.log("Inserted documents :",result.ops);
            }
        ); */ // Commented because we don't want to insert same multiple documents when we run the script.

        /* Challenge */
        /*databaseReference.collection('tasks').insertMany
        (
            [
                {
                    description : 'Download material',
                    completed : false,
                },
                {
                    description : 'Complete tutorials',
                    completed : false,
                },
                {
                    description : 'Complete Angular 8',
                    completed : true,
                }
            ],
            (error,result)=>
            {
                if (error)
                {
                    return console.log("Error occurred while inserting documents :",error);
                }
                console.log("Inserted documents :",result.ops);
            }
        );*/ // Commented to don't insert this data again.

        /*
        ObjectID : In traditional SQL database server generated the ID for new records
        and it follows the auto incrementing integer pattern where the first record has ID
        of one and increases.
        But by mongoDB the ideas are known as GUID which stands for globally unique identifiers,
        They are designed to be unique using an algorithm without needing the server to determine
        what the next ID value is.

        Switching from auto incrementing integers over to globally unique identifiers allowed
        Mongo DB to achieve the ability to scale well in a distributed system.
        So we have multiple databases servers running instead of just one allowing us to
        handle heavy traffic where we have a lot of queries coming in .
        With Mongo DB and GUIDs there's no chance of an ID collision across those database servers.
        With an auto incrementing integers it will definitely possible that we could have a user
        with an ID of one in one database server and a user with an ID of one in another database
        server which could run into issue where those IDs conflicts with Mongo DB.

        Also another great advantage is that we can actually generate the IDs for our documents
        before we ever insert them into the database.
        So our server does not need to be the one who generates the ID, we can actually use that Mongo DB
        library to generate object IDs of our own.
         */

        /*databaseReference.collection
        (
            'users',
        ).insertOne
        (
            {
                _id : id, //This id is generated by us with ObjectID. But this can be automatically generated by Mongo DB.
                name : 'GUID Test Document',
                age : 99
            },
            (error,result)=>
            {
                if (error)
                {
                    return console.log("Error occurred while inserting document :",error);
                }

                console.log("Inserted document :",result.ops);
            }
            );*/ // Commented because this is only for showing that we can provide our own _id.
        /*
        Here we should know about how our _id is stored, when we see the ids in the database
        we see that each id will be a parameter to the function ObjectId, like
        ObjectId("5f103b190542cb33e8dd630b").
        Because that is a visualization making it easier to see the ObjectID value
        because ID are indeed a binary data, they are using binary data over string has to do
        with size of each. By using binary instead of a string they are able to cut the size of an
        ObjectID in half. Also here on property 'id" which will also have a property "id" which
        contains the raw binary information.
         */
        console.log("ID binary data :",id.id);
        console.log("ID length :",id.id.length); // Already know that it's length is 12
        console.log("ID string length :",id.toString().length); // To string value, length will double. Here also we could use method toHexString()

        /*
        In database we see that id is wrapped in ObjectId function because it's giving us the
        representation as a string but it's wrapping it in this ObjectId call to let us know that
        it's not actually a string, it's what come back from that function call which would
        be binary data, to save us from long lines in our data all of that is abstracted away
        from us the end user of Mongo DB.
         */

        /*
        Now we can also fetch the document(s) limiting them to a specific subset like users whose
        age is 20 or tasks that have yet to be completed.
        Now for fetching data we can use two methods : find and findOne.
        find will allow us to fetch multiple documents and findOne will allows us to fetch
        an individual document.
         */
        databaseReference.collection('users').findOne
        (
            {
                /*
                This object is used to specify our search criteria like if we want to search
                for a use by their name we specify a name field with value of that name.
                 */
                name : 'Aitha Tarun'
            },
            (error,document)=>
            {
                /*
                Callback is called when operation is completed.
                 */
                if (error)
                {
                    return console.log("Error while reading database :",error);
                }
                console.log("Fetched document :",document);

                /*
                If we search for a document which is not present in the database we would
                be returned null.
                This findOne only returns one document it it find multiple documents but it only
                grabs first document from them.
                 */
            }
        );

        databaseReference.collection('users').findOne
        (
            {
                _id : new ObjectID('5f103b190542cb33e8dd630b') // ObjectID because id is not a string.
            },
            (error,document)=>
            {
                if (error)
                {
                    return console.log("Error while reading database :",error);
                }
                console.log("Fetched document :",document);
            }
        );

        databaseReference.collection('users').find
        (
            {
                name : 'Aitha Tarun'
            }
            /*
            This find won't take a callback this will return a cursor which is not the cursor
            for data it is the pointer to that data in the database.
            Reason for getting a cursor is Mango DB is not going to assume that every time
            we use find we always want to get back an arry of all those documents. Means
            there are other we might to do like get just first five documents or do something
             like just get the number of matching documents.

             That returned array contains many methods which we can use as per our requirement.
             One of which is toArray which allows us to get back an array of documents.
             */
        ).toArray
        (
            (error,documents)=>
            {
                if (error)
                {
                    return console.log("Error while reading database :",error);
                }
                console.log("Fetched documents :",documents);
            }
        );

        databaseReference.collection('users').find
        (
            {
                name : 'Aitha Tarun'
            }
        ).count
        (
            (error,documentsCount)=>
            {
                if (error)
                {
                    return console.log("Error while reading database :",error);
                }
                console.log("Number of documents fetched :",documentsCount);
            }
        );

        databaseReference.collection('tasks').findOne // For fetching the last document.
        (
            {

            },
            {
                sort :
                    {
                        _id : -1
                    }
            },
            (error,document)=>
            {
                if (error)
                {
                    return console.log("Error while reading database :",error);
                }
                console.log("Fetched last document :",document);
            }
        );

        databaseReference.collection('tasks').find
            (
                {
                    completed : false
                }
            ).toArray
        (
            (error,documents)=>
            {
                if (error)
                {
                    return console.log("Error while reading database :",error);
                }
                console.log("Task documents which are not completed :",documents);
            }
        );

        /*
        Just like for findOne and find this update will also have to updateOne and updateMany.

        For updating one record we use updateOne and for updating many records at a time we
        use updateMany.
         */
        /*const updatePromise = databaseReference.collection('users').updateOne
        (
            {
                _id : new ObjectID('5f0ff35a2875882344442b3c')
            },
            {
                /!*
                This where we give to be updated data.
                Here we use update operators to define the behavior we want to perform.

                Here $set operator allows us to set new values for the fields in our document.

                 *!/
                /!*$set :
                    {
                        name : 'Updated name'
                        /!*
                        This only change the value of name but not changes any other data.
                         *!/
                    }*!/ // Commented because we only update only once.

                    /!*
                    Here if we use a callback pattern we would provide a third argument
                    here which would be a function and we would get access to either the
                    error or the result.

                    But when we are using the promises we don't provide that function.
                    Instead what updateOne returns is indeed the promise.
                     *!/

                /!*
                Also we have another set of operators like $unset which is used to remove a specific
                field from the document.
                And $rename operator to rename a specific field in the document.
                And $inc operator is used to increment a number in a particular document. Like increment the age.
                 *!/
                $inc :
                    {
                        /!*
                        Here we use this to increment the use of specific user.
                         *!/
                        age : 1 // Increment by 1.
                    }
            }
        ); // Here without storing the promise we can also chain that then and catch here to this.

        updatePromise.then
        ( // Went things went well
            (result)=>
            {
                console.log("Updated document and the result is :",result);

                /!*
                Here result also contains modifiedCount which will be 1 or 0.
                And matchedCount which will be 1 or 0, 1 if a document was modified
                and 0 if no document was modified.
                 *!/
            }
        ).catch
        (// Went things went wrong
            (error)=>
            {
                console.log("Error while updating document :",error)
            }
        );*/ // Commented because we don't update always.

        /*databaseReference.collection('tasks').updateMany
        (
            { // This filter is used to filter out some documents with some conditions
                completed :
                    {
                        $eq: false
                    }
            },
            {
                $set :
                    {
                        completed : true
                    }
            }
        ).then
        (
            (result)=>
            {
                console.log("Updated documents :",result)
            }
        ).catch
        (
            (error)=>
            {
                console.log("Error occurred while updating documents :",error)
            }
        );*/ // Commented because we don't update always.

        /*
        Deleting : Just like for find and update here we can delete one document at a time
        or multiple documents at a time.
         */
        /*databaseReference.collection('users').deleteMany
        (
            /!*
            Here if we want ro delete the documents which users have age between 10 and 20.
            Like 10 <= age <= 20
             *!/
            {
                $and :
                [
                    {
                        age :
                            {
                                $gte: 10
                            }
                    },

                    {
                        age:
                            {
                                $lte : 20
                            }
                    }
                ]
            }
        ).then
        (
            (result)=>
        {
            console.log("Deleted documents :",result)
        }
        ).catch
        (
            (error)=>
            {
                console.log("Error occurred while deleting documents :",error)
            }
        );*/ // Commented because we only delete once.

        databaseReference.collection('tasks').deleteOne
        ( // Deleting document with description "Download material".
            {
                description :
                    {
                        $eq : "Download material"
                    }
            }
        ).then
        (
            (result)=>
            {
                console.log("Deleted documents :",result)
            }
        ).catch
        (
            (error)=>
            {
                console.log("Error occurred while deleting documents :",error)
            }
        );
    }
);







