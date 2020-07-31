/*
This file is the UserModel which describes the structure of the User to save data in database.
 */

const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

/*
Here when we pass a object as a second argument to the model function, behind the scenes Mongoose
converts it into a schema in order to take advantage of the middleware functionality.
Then we should create this schema first and pass that in.
So, we move that second argument from the model function to first parameter of Schema function.
By do this manually allows us to take advantage of middleware.
*/
const userSchema = new mongoose.Schema
(
    {
        /*
        This object defines all of the properties for the schema.
         */

        name :
            {
                type : String,
                required : true,
                trim : true
            },

        age :
            {
                type : Number,

                validate(value)
                {
                    if (value < 0)
                    {
                        throw new Error("Provide a positive age");
                    }
                },
                default : 0
            },

        email :
            {
                type : String,
                required: true,

                validate(value)
                {
                    if (!validator.isEmail(value))
                    {
                        throw new Error("Entered email is invalid");
                    }
                },

                trim : true,
                lowercase : true,
                unique : true
                /*
                By this it's going to create an index in out Mongo DB to guarantee uniqueness
                for this field.
                Means this field should have unique values.
                 */
            },

        password :
            {
                type : String,
                required : true,
                minlength : 7,
                trim : true,

                validate(value)
                {
                    if (value.toLowerCase().includes("password"))
                    {
                        throw new Error("Entered password is invalid.")
                    }
                }
            },

        tokens : // This is to track the generated tokens for every user.
            [
                {
                    token :
                        {
                            type : String,
                            required : true
                        }
                }
            ],

        avatar : //This is used to store user profile pic (binary data).
            {
                type : Buffer
                /*
                This will allow us to store the buffer with our binary image data in the DB
                alongside with the user who the image belongs to.
                Here we don't need any validations because already multer performs them in router.
                 */
            }
    },
    {
        /*
        This is the schema options.
         */
        timestamps : true
        /*
         Used to enable using timestamps, where we could use this timestamps
         to record when user is created and when user profile is last updated.
         This will be automatically added to data they are createdAt and updatedAt.

         With this date we could perform operations like sorting or filtering or etc... .
         */
    }
);

/*
Here tasks live in a separate collection, so to relate them we have to setup a virtual property.
A virtual property is not a actual data stored in the DB, it is a relationship between two
entities that is in this case User and Task.
We setup that on userSchema with virtual attribute.
 */
userSchema.virtual  //This is only to tell mongoose how Task and user are related.
(
    'tasks', //Virtual name can be anything.
    {
        /*
        This object is used to configure individual field.
         */
        ref : 'TaskModel',
        localField : '_id', //Where the local data is stored.
        foreignField : 'creator' //Name of the field on other model that is creator in the task model.

        /*
        So, by local field the user's _id is a relationship between the user _id and the
        task creator field which also a user _id field.
         */
    }
)

userSchema.statics.findByCredentials = async (email,password)=>
{
    const user = await UserModel.findOne
    (
        {
            email
        }
    );

    if (!user)
    {
        throw new Error("Provided email not registered");
    }

    const isMatch = await bcrypt.compare(password,user.password);

    if (!isMatch)
    {
        throw new Error("Invalid password"); // In general don't provide more information.
    }

    return user;
};

const jwt = require("jsonwebtoken");

userSchema.methods.generateAuthenticationToken = async function()
{
    /*
    Here we used methods because "statics" is used to access the static methods on the model also called model methods.
    And "methods" accessible on the instances called instance methods.

    Here we are calling this on a specific user and we get access to that user via "this".
     */
    const user = this;

    const token = jwt.sign
    (
        {
            _id : user._id.toString()
        },
        //'thisIsTheSecretKey' // Commented after introducing environment variables.
        process.env.JWT_SECRET_KEY
    );

    user.tokens = user.tokens.concat
    (
        {
            token
        }
    );

    await user.save();

    /*
    When user is saved in the database, the tokens are saved with _id that is it has its own
    ObjectId this is known as a sub document like regular documents also have an ObjectID
    automatically generated.
     */

    return token;
}

/*
userSchema.methods.getPublicProfile = function ()
{
    /!*
    This method is used to get user data which is only required, means user data without password,
    all sessions tokens.
     *!/
    const user = this;
    /!*
    Here we have to get back a raw object with our user data attached.
    So, that is we have to remove all of the stuff that mongoose has on there to perform
    things like save operation.
    So, we want back an object with just our user data.
    That is done by toObject().
     *!/
    const userObject = user.toObject();

    delete userObject.password; //These delete operator will remove specified properties from the object.
    delete userObject.tokens;

    return userObject;
}
*/ // Commented because this is manual but we could automate that :

userSchema.methods.toJSON = function ()
{
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
}

/*
We use method pre(before an event)/post(after an event) on userSchema to set middleware.
 */
userSchema.pre
(
    'save', // Name of the event
    async function(next) // Function to run before the specified event. This should be a normal function, because arrow functions don't bind "this".
    {
        /*
        Here "this" gives us access to the individual user that's about to be saved.
         */
        const user = this;

        console.log("This is before saving");

        /*
        Here we have to make sure the password is actually being changed, if the password is
        already hashed we don't have to hash that again.
        We only want to hash the password if it's been modified by the user and Mongoose
        gives us a easy way to achieve that. That is isModified.
         */
        if (user.isModified('password'))
        {
            /*
            This above will be true when user is first created and if the user is being updated
            and password was one of the things changed.
             */
            user.password = await bcrypt.hash(user.password,8); //Here taking plain text password and hashing it.
        }
        /*
        next is to notify that our process here is over without that the process will hang.
         */
        next();
    }
);

const Task = require('./task');
/* This is the middleware which is used to delete user tasks when user is removed. */
userSchema.pre
(
    'remove',
    async function(next)
    {
        const user = this;

        /*
        This is where we delete multiple tasks using the creator field of the tasks.
         */
        await Task.deleteMany
        (
            {
                creator : user._id
            }
        );

        next();
    }
)

const UserModel = mongoose.model('UserModel',userSchema);

module.exports = UserModel