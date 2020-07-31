/*
This is the token authentication middleware file.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authorization = async (request,response,next)=>
{
    /*
    To provide a token to the request we setup a request header.
    Which is also a key value pairs which are used to provide additional information to the
    server.
    Headers can be for both requests and response.

    Here "Authorization" header which value starts with Bearer {token}.
    This is known as a bearer token in which the client provided the token with the request
    they are trying to perform.
     */

    try
    {
        const token = request.header('Authorization').replace('Bearer ','');

        const decoded = jwt.verify
        (token,
         //'thisIsTheSecretKey' // Commented after using environment variables
            process.env.JWT_SECRET_KEY
        );

        const user = await User.findOne
        (
            {
                _id : decoded._id,
                'tokens.token' : token
                /*
                 This checks whether the token sent by requester is present in the tokens array.
                 Means when user logs out then that specific token will be removed.
                 */
            }
        );

        if (!user)
        {
            throw new Error();
        }

        /*
        Now as the user is authenticated then we should provide the route handler the user
        that we fetched from the database.
         */
        request.user = user; // This is storing the fetched user from database in request for route handler to use that.
        request.token = token; // Attaching the current token to the request.

        next(); // Means authentication successful and next we could run route handler.
    }
    catch (error)
    {
        response.status(401).send({error : 'Authentication failed'});
    }
}

module.exports = authorization;