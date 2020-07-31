/*
This is going to be the starting point for our application.
And here we initialize the express server.

This is the API to manage data.
 */
const express = require("express");
require('./database/mongoose'); // This simply runs that file and connects to database.
/*const User = require("./models/user"); // Getting the structure of user by its model.*/ // Commented after taking task related routes from this file to other.

const app = express();

/*const port = process.env.PORT || 3000; //We do this to deploy to heroku or locally.*/ // Commented after defining environment variables.
const port = process.env.PORT;
/*
Here we have to populate the environment variables values from that files to another files.
But setting up that is different for different operating systems.
So, we use a npm module called env-cmd to work with environment variables on cross platforms.

That npm variable will load in the environment variables we defined in the specific .env file
and then it's make sure they are available to our NODEJS application.

Installation " npm install env-cmd --save-dev.
Here we install that only in development because we won't need that in production.

After that module installation in package.json we have to tell env-cmd to load in the
environment variables and provide them to our project when using the dev script not for
start script because that script is going to run on heroku and that has a different configuration.
That is we add "./node_modules/.bin/env-cmd -f ./config/dev.env nodemon ./source/index.js -e js,html,css,env"
in front of that nodemon command.

So, by that when we run the dev command env-cmd will grab all of those environment
variables from that file then it continue to run the node application but it will provide
those environment variables to the app as it's running.

Here once we run the project in a specific port then if we change the port in .env file then
those changes won't be get effected even by nodemon because env-cmd only runs for single time.
So, we have to restart the server.
 */

/*app.use
(
    (request,response,next)=>
        /!*
        This function is for middleware, this function that runs between the request
        coming to the server and the route handler.
       It has access to the same information as the route handler.

       With an extra of "next", which specific to registering middleware.
       Which is used to run the next commands like route handler.
     *!/
    {
        if (request.method==="GET")
        {
            response.send('GET request is disabled');
        }
        else
        {
            next();
        }
    }
);*/ // Commented, used only to explain middleware.

/*app.use
(
    (request,response,next)=>
    {
        response.status(503).send("This site is under maintenance");
    }
);*/ // Commented, used only to explain middleware challenge.


app.use // Used to customize our server.
(
    express.json() // This will automatically parse incoming JSON to an object so we can access it in our request handler.
) ;
/*
This is use configure express to automatically parse the incoming JSON for us.
So, we have it accessible as an object we can easily use.
 */

/*
Here these file contains many express routes, but we can separate them means like user routes in
one file and tasks routes in one file.

So we will set up multiple express routers and then we combine them together to create the
complete application.
For that we create a new router with the existing app.
 */

/*const router = new express.Router();
/!*
This won't take any arguments but we use methods on that to customize.

Also we should register the created routes to use them. By the help of app.use().
 *!/
router.get(
    '/test',
    (request,response)=>
    {
        response.send("Router text");
    }
);
app.use(router); // Registering the router.*/  // Commented because this is a test.

/*
The routes which we have defined in other files should be required here.
 */
const userRouter = require('./routers/user');
app.use(userRouter);

/*
Now we cut all the user and task related routes from this file to separate file.
And here we use app.get or app.post or etc...
But their we use router.get or router.post or etc...
 */

/*const Task = require('./models/task');*/ // Commented after taking task related routes from this file to other.

const taskRouter = require('./routers/task');
app.use(taskRouter);

app.listen(port,()=>
{
    console.log("Server is up and running on port",port);
});

/*
/!**********bcrypt**********!/
const bcrypt = require("bcrypt");

const bcryptFunction = async ()=>
{
    const password = "!@#Aithas123456";

    const hashedPassword = await bcrypt.hash(password,8);
    /!*
    For above hash function second argument is the number of rounds,
    which determines how many times the hashing algorithm is executed.
    Recommended value = 8.

    Also that function returns a promise.
     *!/
    /!*
    Encryption and hashing are different because with encryption we can revert back to get the
    original values but with hashing it's not possible.
    Means they are one way algorithms which means we can't reverse the process.

    So while we want to check the password provided by user is equal to the password in the database,
    for that bcrypt allows us to do that by hash the password provided and we can pair that
    hash with the hash stored in the database.

    For that we use compare method.
     *!/

    console.log(password);
    console.log(hashedPassword);

    const isMatch = await bcrypt.compare("!@#Aithas123456",hashedPassword);
    console.log(isMatch);
}

bcryptFunction();
*/ // This is only to explain bcrypt.

/*const jwt = require("jsonwebtoken");

const jsonWebTokenFunction = async ()=>
{
  const token = jwt.sign
  (
      {
          /!*
          This object contains the data that embedded in the token.
          Like here we we store the unique identifier for the user who is being authenticated.
          That is users ID can be used for that.
           *!/
          _id : '123456789' // This data is public which is available to whom have the token.
      },
      'thisIsTheSecretKey',
      /!*
      And this second argument is the secret used to sign the token, making sure that has not
      been tampered. For this we provided a random series of characters.
       *!/
      {
          /!*
          This object is used to customize the token with some options.
          Like the option expiresIn which allows us to provide amount of time we want the
          token to be valid.
           *!/
          expiresIn : '1 week'
      }
  );
  /!*
  This sign method is used to create a new  authentication JSON web token.

  And what we get back from the sign is given back to the user.

  This token consists of three parts separated by period(.), first one is the base 64
  encoded JSON string which is the header, contains some meta information what type of
  token it is (JWT), and the algorithm that is used to generate it.
  And the second one is the payload or the body which is also a base 64 encoded JSON string
  which contains the data that we have provided.
  And the last piece is the signature which is used to verify the token.

  The whole point of the JWT is to provide that payload(First argument) data that is verified by the
  secretKey(Second argument).

  We can see the data if we decode that second piece of the token.
  For example we could use : "https://www.base64decode.org/", we can get like
  "{"_id":"123456789","iat":1595691585}".
  Where the first value in the object is the data we provided, and second value is the iat
  which is "issued at", this is the timestamp when the token is created.

  When expiresIn is provided when here we get third value exp which is the timestamp of expiring.
   *!/

    console.log("Token :",token);

    /!*
    We can also verify that token with function verify.
    Which takes two arguments, where the first is the token we want to verify and second is the
    secret key to use.

    This verify will return the payload if token is valid.
    Or throw error if it is not valid.
     *!/
    const data = jwt.verify(token,'thisIsTheSecretKey');
    console.log("Verification data :",data);
};

jsonWebTokenFunction();*/ // Commented used only to explain JSON web tokens.

/*
Without middleware : new request -> run route handler
With middleware : new request -> do something -> run route handler.

Here something is a function that runs which contains the code we want to do.
Like we want to log some statistics about their requests so we can keep track of it in our sever
logs or maybe we want to check if there is a valid authentication token.

In middleware we can do a lot of things like next run route handler or to prevent it from
running if the user isn't authenticated.
So express middleware gives us a lot of control over how we can customize our app.
 */

/*const pet =
    {
        name : 'Spark'
    };

pet.toJSON = function()
{
    /!*
    With this we can manipulate what exactly comes back when we stringify the object .

    So, in the app we could see that when response.send() with user object, their it calls
    stringify to convert to JSON internally and send that JSON, but we could modify
    that sending JSON with defining it.
     *!/
    console.log(this);
    return this;
}

console.log(JSON.stringify(pet)); // Convert Object to JSON.*/


/*
const Task = require('./models/task');
const User = require('./models/user');

const main = async ()=>
{
    const task = await Task.findById('5f20151e9f23764010d3b500');

    console.log(task.creator);

    /!*
    Here we get the User ID who created the task, but if we want to get the details of that
    user with that ID we should run other query to find that user document with ID.

    But mongoose provides a way to setup the relationship between the models which provides
    us with some helper functions which make the above query code minimal.

    This is done by defining ref in the task model to 'User'.

    Then below code will take the creator and convert to entire profile.

    populate will allows us to populate data from a relationship.
     *!/
    await task.populate('creator').execPopulate();
    /!*
    This will find the user who is associated to this task and task.creator will contain
    the entire user.
     *!/
    console.log(task.creator);

    /!*
    Now we could also reverse the above process means knowing all the tasks created by
    a specific user.
    For that we have to create a virtual property in the UserModel which relates the user _id
    and the creator field (which is also a user _id) .
     *!/
    const user = await User.findById('5f200a56ae45f32534e3a546');
    await user.populate('tasks').execPopulate(); //Here tasks is the virtual field.
    /!*
    So, by this it will fetch all the tasks which were created specifically by this user.
    And stores that in the user.tasks .
     *!/
    console.log("Tasks:",user.tasks);
}

main();
*/

/*
/!*
File uploads practice : (Images)
 *!/
const multer = require('multer');
/!*
Now we have to configure multer and we might configure multer multiple times for a single application.
Like it is based on file types we accept.
 *!/
const upload = multer
(
    {
        /!*
        This is for the configuring multer.
         *!/
        dest : 'images', //Destination

        //Validating file uploads
        limits :
            {
                /!*
                This is a object because we could set multiple different limits.
                BUt mostly used is the file size.
                 *!/
                fileSize : 1000000,
                /!*
                This allows us to set a limit for the max file size of the file
                being uploaded. This is the number in bytes.
                Here 1000000 = 1 MB
                 *!/
            },

        fileFilter(request,file,callback)
        {
            /!*
            When any goes wrong and we want to throw an error then we pass that
            error to the callback function.

            And if things go well then we won't provide the first argument to callback,
            and we provide a boolean as the second argument that is true if the upload should
            be expected. And false if silently reject the upload.

             callback(new Error('Uploaded file type is not supported'));
             callback(undefined,true);
             callback(undefined,false);
             *!/
            // file.originalname //Used to get the name of the file with extension.
            // Here if we want only PDF files to get uploaded.

            // if (!file.originalname.endsWith('.pdf'))
            if (!file.originalname.match(/\.(doc|docx)$/)) //Used to check whether file is a word document (doc or docx).
            {
                /!*
                So, this codes runs when file being uploaded extension is not PDF.
                Or word document (doc or docx).
                Here we used "\.(doc|docx)$" regex to check the doc or docx file extensions.
                 *!/
                return callback(new Error("Provided file type is not supported"));
            }

            callback(undefined,true); //This is when we accept the upload.
        }
        /!*
        This property allows us to filter out the files that we don't want to have uploaded.
        And this property is a function, which runs when a new file is attempted
        to be uploaded.
        This function will get called internally by multer and it provides us with three
        arguments that are request, file and a callback.
        request contains the request that is being made, file contains the information about
        the file being uploaded and callback is used to tell multer when we are done filtering the file.
         *!/
    }
);

app.post //This the endpoint to upload files
(
    '/upload',
    /!*
    For enabling the file uploading, here we have to use multer middleware.
    *!/
    upload.single('profilePic'),
    (request,response)=>
    {
        response.send();
    },
    (error,request,response,next)=> //This is for handling multer errors or any errors.
    {
        /!*
        By providing all four of these express knows that this function is designed to handle
        ant uncaught errors.
         *!/
        response.status(400).send
        (
            {
                error : error.message
            }
        );
    }

    /!*
    With all this the server is configured to accept and save files that are uploaded to it.
     *!/
);
*/
