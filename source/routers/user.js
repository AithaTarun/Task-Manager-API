/*
This files contains all the routes related to the users.
 */
const express = require('express');

const router = new express.Router();

const multer = require('multer');

const User = require('../models/user');

const authentication = require('../middleware/authentication');

const sharp = require('sharp');

const email = require('../emails/account');

router.post //So, this is for creating resources endpoint.
    (
        '/users',
        async (request,response)=> // Async added afterwards.
        {
            // This runs when someone visits the above route.

            console.log('Body which is sent to this endpoint :',request.body);
            /*
             This prints the request body we sent to the endpoint while requesting.
             Now we have the name, email ans password which was send through the request to this endpoint.
             So now we grabbed the incoming body data and we can use it to actually create a new user.
             To do that we should connect mongoose connects to the database and we need to get access to
             the user model from inside here.
             */
            const user = new User(  // Creating a new user with the data provided by the request.
                request.body
            );

            /*user.save().then
            (
                /!*
                So, when things went well we send the request user with all of the additional fields
                like age has been set to default and _id that has been generated for us.
                 *!/
                ()=>
                {
                    response.send(user);
                    /!*
                    So by this the mew user will be saved in the database.
                     *!/
                }
            ).catch
            (
                (error)=>
                {
                    response.status(400).send(error); // Bad request.

                    /!*
                    When this error is sent back to the requester we send the status code of 200.
                    But this is misleading.
                    But when we work with rest APIs we want to provide the most accurate status
                    codes.

                    For our REST API we use 200 status codes when things go well.
                    And we use 400 status codes for when things go wrong because of something
                    the client did.
                    And we use 500 status codes when something goes wrong because of an error on the server.
                     *!/
                }
            );*/ // Commented after introducing async await.

            /*Here we can handle individual errors from individual promises using a standard
            try catch statement.
             */
            try
            {
                await user.save();

                email.sendWelcomeEmail(user.email,user.name); //This is sending welcome email to the user.
                /*
                From below this await, will only run if the promise is fulfilled.
                 */

                const token = await user.generateAuthenticationToken();
                /*
                This is the authentication token that the new user can now use to do authenticated
                things.
                 */

                response.status(201).send
                (
                    {
                        user,
                        token
                    }
                );
            }
            catch (error)
            {
                response.status(400).send(error);
            }

        }
        /*
        In postman we test this with HTTP method = POST and URL = localhost:3000/users.
        And we have to send certain data to the endpoint to create a user like name,email and password.
        And we know that we send data to endpoint with a JSON.
        We send JSON with request in postman with "Body" tab and set (none to raw) and (Test to JSON)
        and provide that data in the below text-area like :
        {
        "name" : "Aitha Tarun",
        "email" : "test@gmail.com",
        "password" : "!@#$%^&*()_+"
        }.

         */
    );
/*
 This is for GET request. That would allow to access the given route using the GET HTTP method.
 But here we use POST for resource creation.
 So here express provides us with methods for all of the HTTP methods we are going to use.
 */

/*router.get //So, this is for reading resources endpoint.
    (
        /!*
        This if for fetching multiple documents at a time.
         *!/
        '/users',
        authentication, // This is the authentication middleware.
        async (request,response)=> // Async added afterwards.
        {
            /!*User.find // This find is for finding multiple documents.
            (
                {
                    /!*
                    This object is for refining our search criteria.
                    Without specifying anything it will fetch all users stored in the database.
                     *!/
                }
            ).then
            (
                (users)=>
                {
                    // So here fetching is done. So then we send back data to the requester.
                    response.send(users);
                }
            ).catch
            (
                (error)=>
                {
                    response.status(500).send(error); // 500 = internal server error.
                }
            );*!/ // Commented after using async await.

            try
            {
                const users = await User.find({});
                response.send(users);
            }
            catch (error)
            {
                response.status(500).send(error);
            }

            /!*
            So in the postman to est this endpoint we create a new request with HTTP method
            GET and URL = localhost:3000/users.
             *!/
        }
    );*/ //This route is not useful because every user can get details of all other users.

router.get
(
    '/users/myProfile', // This route is used to send the logged in user details.
    authentication,
    (request,response)=>
    {
        response.send(request.user);
        /*
        Here when user is authenticated it added the authenticated user to the request,
        that is stored in request.user which we send back to the requester(user).
        */
    }
);

/*router.get // This endpoint is used to allow us to fetch an individual user by ID.
    (
        '/users/:id',
        /!*
        So here :id is dynamic which will get replaced by the value provided through request.
        These are the route parameters, these are parts of the URL that are used to capture dynamic values.
         *!/
        async (request,response)=> // Async added afterwards.
        {
            const _id = request.params.id;
            /!*
            This Contains all of the route parameters we have provided.
            In this case it is an object with a single property id and the value for id is
            whatever was put inside of the URL.
            *!/

            /!*User.findById
            (
                _id // Here we won't convert string Ids to ObjectID because mongoose do that for us.
            ).then
            (
                (user)=>
                {
                    if (!user)
                    {
                        return response.status(404).send();
                    }

                    response.send(user);
                }
            ).catch
            (
                (error)=>
                {
                    response.status(500).send(error)
                }
            );*!/ // Commented after using async await.

            try
            {
                const user = await User.findById
                (
                    _id
                );

                if (!user)
                {
                    return response.status(404).send();
                }

                response.send(user);
            }
            catch (error)
            {
                response.status(500).send(error);
            }
        }
    );*/ // Commented because we should not fetch other user with their id. We should only fetch our details which is done by /myProfile.

/*router.patch //This patch is will use PATCH HTTP methods which is used for updating an existing resource.
    (
        '/users/:id',
        async (request,response)=>
        {
            /!*
            Here when we try to update a property that's not something is allowed or properties
            which won't exist.
            So for that :
            First is figure out what some should be allowed to update.
            Second we have to figure out what is being to be updated with this operation.
            Then next thing is we have to determine if all "updates" are present in "allowedUpdates".
             *!/
            const allowedUpdates = ['name','email','password','age']; // Properties which are not in this array are not allowed to update.
            const updates = Object.keys(request.body);
            /!*
            keys function on Object is used to get the keys in the specified object to array.
            Here by that we know that what things user is wanting to update.
             *!/
            const isUpdationValid = updates.every
            (
                (update)=> // This callback runs for every item in updates.
                {
                    /!*
                    Here if we always get true as the return value then "every"(function above)
                    will return true.
                    If we don't always get true back "every" will return false.
                     *!/
                    return allowedUpdates.includes(update);
                }
            );
            if (!isUpdationValid)
            {
                return response.status(400).send({error : "Invalid property to update"});
            }

            try
            {
                /!*const user = await User.findByIdAndUpdate
                (
                    request.params.id,

                    /!*
                    Unlike with mongo db native driver there's no need to use anything like
                    $set operator.
                    Mongoose handles all of that for us.
                    Here all we have to do is provide the object with the various fields we
                    want to update.
                    Here we can't use the static data, so for that we can get the object from the
                    request body.
                     *!/
                    request.body,
                    /!*
                    If request.body have properties which user document won't have, then anything won't
                    be updated and that document will be returned means that properties were completely
                    ignored. To change that behaviour we can write our custom code to handle that.
                     *!/

                    { // This is the options object to set up some options to get things working the way we want.
                        new : true, // By this it will return the new user as opposed to the existing one that was found before the update.
                        runValidators : true // This will make sure that we do run validation for the update.
                    }
                );*!/

                /!*
                 Commented after using middleware.
                 Because findByIdAndUpdate bypasses mongoose so middleware won't be executed.
                 It performs a direct operation on the database.
                 So, we have to set a special option for running the validators.
                 *!/
                const user = await User.findById(request.params.id);

                updates.forEach
                (
                    (updateField)=>
                    {
                        user[updateField] = request.body[updateField]; // [] are used to access dynamic values.
                    }
                );
                await user.save();

                    /!*
                    Here 3 things can happen :
                    One the update went well.
                    Two the update went poorly.
                    And three there was no user to update with that ID.
                     *!/

                if (!user) //This is 3rd case.
                {
                    return response.status(404).send({error : "User with specified ID not found or Validation error."});
                }

                response.send(user); //This 1st case.
            }
            catch(error)
            {
                //This is 2nd case.
                //This can be caused by server or validation while updating.
                response.status(400).send(error); //Validation error.
            }
        }
    );*/ // Commented after using authentication

router.patch
(
    '/users/my',
    authentication,
    async (request,response)=>
    {
        const allowedUpdates = ['name','email','password','age'];
        const updates = Object.keys(request.body);

        const isUpdationValid = updates.every
        (
            (update)=>
            {
                return allowedUpdates.includes(update);
            }
        );
        if (!isUpdationValid)
        {
            return response.status(400).send({error : "Invalid property to update"});
        }

        try
        {
            const user = request.user;

            updates.forEach
            (
                (updateField)=>
                {
                    user[updateField] = request.body[updateField];
                }
            );
            await user.save();

            response.send(user);
        }
        catch(error)
        {
            response.status(400).send(error);
        }
    }
)

router.delete // This delete method is used to setup an HTTP endpoint that uses to delete DELETE method.
    (
        // '/users/:id', // Here when we are authenticated user does n't need to provide their ID again to delete their profile.
        '/users/my',
        authentication,
        async (request,response)=>
        {
            try
            {
                /*
                const user = await User.findByIdAndDelete
                (
                    //request.params.id,
                    /!*
                     Don't need because user doesn't provide ID, instead they only
                     authenticate once and they could perform anything with their profile
                     without specifying their ID again.
                     *!/
                    request.user._id
                );

                /!*if(!user)
                {
                    return response.status(404).send({error : "User with specified ID not found."})
                }*!/ // This is for when user is not found but while authenticating we fetch them from DB.
                */ // Commented we could perform these is other way :

                // So, we could use remove method on mongoose document.
                await request.user.remove();

                email.sendCancelEmail(request.user.email,request.user.name);
                /*response.send(user);*/ // Commented after using using .remove().
                response.send(request.user);
            }
            catch(error)
            {
                response.status(500).send(error);
            }
        }
    );

/*
Here we can provide users with a endpoint that will allow them to log in with their existing
account, so they can provide their credentials like their email and password and it will be the
job of that route to verify that there is a user with those credentials.
 */

/*
Also in user model we setup a reusable function for finding a user by their credentials.
 */

router.post
(
    '/users/login',
    async (request,response)=>
    {
        /*
        This function job is to find a user by the provided credentials.
         */
        try
        {
            const user = await User.findByCredentials(request.body.email,request.body.password);

            /*
            This findByCredentials is the custom function created in user model.
            This creating custom function is only possible when we create a separate schema
            and then pass that into the model.
             */

            /*response.send(user);*/ //Commented after sending jwt to the requester.

            const token = await user.generateAuthenticationToken();
            /*
            Because the token works on the individual token. So, it is specified on the user.
             */
            response.send
            (
                {
                    //user : user.getPublicProfile(),
                    /*
                    Here we are manually filtering the properties we send as the response.
                    Manual because we have to call our function for every single time we are
                    sending the user back.

                    Also we can automate this by defining a function on user with toJSON().
                     */
                    user,
                    token
                }
            );

            /*
            Upto now we are not keeping tack of the generated tokens, any where on the server.
            The server simply generates it with the correct secret key and send it back.
            Here users can't truly logout means the generated token as long as it exists means
            the user is logged in. So, the token is hacked then a user has no way to log out
            and invalidate a given token. We can fix this by tracking tokens that we generated for
            the users. This will allow a user to login from multiple devices and able to logout
            of one device while still being logged in the other device.
            Means we store all the tokens we generated for the user as a user document.
             */
        }
        catch (error)
        {
            response.status(400).send(error);
        }
    }
);

router.post
(
    '/users/logout', // This route is used to logout the logged in user. Only from one session (like one device)
    authentication, // User has to be authenticated in order to logout.
    async (request,response)=>
    {
        /*
        Here we must have access to the particular token that user used when authenticating.
         */

        try
        {
            request.user.tokens = request.user.tokens.filter
            (
                (token)=>
                {
                    return token.token!==request.token;
                }
            );
            await request.user.save();

            response.send();
        }
        catch (error)
        {
            response.status(500).send();
        }
    }
);

router.post
(
    '/users/logoutAll', // This is used to logout of all sessions at once (like all devices).
    authentication,
    async (request,response)=>
    {
        try
        {
            request.user.tokens=[];
            await request.user.save();

            response.send();
        }
        catch (error)
        {
            response.status(500).send();
        }
    }
);

const userPic = multer
(
    {
        //dest : 'avatars', //Commented after passing the data of the function below in the post route.
        limits :
            {
                fileSize : 1000000
            },
        fileFilter(request,file,callback)
            {
                if (!file.originalname.match(/\.(jpg|jpge|png)$/))
                {
                    return callback(new Error("Uploaded file type is not supported"));
                }
                callback(undefined,true);
            }
    }
);

router.post // This is the end point to upload user pic/avatar.
(
    '/users/my/avatar',
    authentication, //This is a middleware
    userPic.single('avatar'), //This is also a middleware
    async (request,response)=>
    {
        /*
        We also need to store the user images, we can't store it on the file system because
        almost all deployment platforms require us to take our code and push it up to the
        repository on their servers like heroku.
        So, the file system actually gets wiped every time we deploy, which means that we would
        loose data when we deploy that is we also lose those user images.

        So, instead of storing them on the file system we have to add a field onto the UserModel
        to store the image of binary data. That is add avatar field to the user model.
         */

        /*
        Here we have to access the binary data.
        But here this function does not get access to the file data that was uploaded,
        because multer runs first and it processes the image saving, the image to the avatars
        directory.

        So, multer gives us a way to access the data inside this function by removing dest
        property from the userPic options.
        By this multer library no longer going to save images to the avatars directory.
        Instead it simply pass that data through to this function so we could use that.
        That data is accessible on request.file .
        This is the property which contains all of those properties of the file.
        On that we use .buffer which contains a buffer of all of the binary data for that file.
         */

        /*
        With sharp npm module we could resize the images, we could convert the images formats
        that is like for example jpg to png.
         */

        //request.user.avatar = request.file.buffer; // Store file in the avatar field of authenticated user. // Commented after using sharp.
        const buffer = await sharp
        (
            request.file.buffer
        ).resize
        (
            {
                width : 256,
                height : 256
            }
        ).png().toBuffer();
        /*
        This property store the buffer of the modified image file. Which will be saved to the database.
        Here png() function covert the image to png format.
        With resize() function we could resize the image.
         */

        request.user.avatar = buffer;

        await request.user.save(); // Save user data to database.

        /*
        We could view image in HTML with
        <img src="data:image/jpg;base64,{binaryData}">
         */

        response.send();
    },
    (error,request,response,next)=> //To handle any uncaught errors.
    {
        response.status(400).send
        (
            {
                error : error.message
            }
        )
    }
);

router.delete // This route is used to delete the already saved avatar for user form DB.
(
    '/users/my/avatar',
    authentication,
    async (request,response)=>
    {
        request.user.avatar = undefined;

        await request.user.save();

        response.send();
    }
);

router.get //This route is used to view the user avatar in the webpage. So this route returns a HTML page has the response.
(
    '/users/:id/avatar',
    async (request,response)=>
    {
        try
        {
            const user = await User.findById(request.params.id);

            if (!user || !user.avatar) //If their is no user with specified ID or user doesn't have the avatar.
            {
                throw new Error("User not found or avatar for the specified user is not found");
            }

            /*
            Here we send back the requester user avatar data.
            But we have to tell the requester what type of data they are getting back.
            In this case that could be jpeg or jpg or png.
            We get done that by setting a response header.
            We could set up the response header by using the set method on the response property.

            Here we set Content-Type, up to now express automatically sets the Content-Type
            header equal to "application/json" when we are send the JSON.
            But here we are sending the image so, we are specifying the Content-Type.
             */
            response.set
            (
                'Content-Type', //Name of the header
                'image/png' //Value of that header
                /*
                'multipart/form-data' is for multiple types of files.
                'image/jpg' is only for sending jpg files.
                 */
            );

            response.send(user.avatar);
        }
        catch (error)
        {
            response.status(404).send();
        }
        /*
        Try catch because we might don't have the image the user is looking for.
         */
    }
);

module.exports = router;