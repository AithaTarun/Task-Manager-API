/*
Here with this file we use mongoose for practice and we build the task-manager app required
mongoose here.
 */
/*const validator = require('validator');*/ // Commented after taking models to separate file.

const mongoose = require('mongoose');

mongoose.connect
(
    /*
    This used to connect to the database. This same as native driver connect method.
    Mongoose uses Mongo DB module behind the scenes so everything we do in mongoose is
    using the abilities of this library(mongodb native driver).
     */
    //"mongodb://127.0.0.1:27017/task-manager-api", // Commented after using environment variables.
    process.env.MONGODB_URL,
    /*
    Here task-manager-api is a database.
     */
    {
        useNewUrlParser : true,
        useCreateIndex : true,
        /*
        This useCreateIndex make sures that when mongoose works with mongo DB our indexes
        are created allowing us to quickly access the data we need to access.
         */
        useUnifiedTopology: true,
        useFindAndModify : false // To hide the deprecation warning.
    }
);

/*const UserModel = mongoose.model('UserModel', // This is the name of the model.
    {
        /!*
        This is the definition where we define all of the fields we want.
         *!/
        name : // This two property values will be objects.
            {
                /!*
                Here we configure out things about the field.
                Like we can configure validation, set up custom validation.
                Or just type for the fields we are working with.
                 *!/
                type : String, // Defining the value type.
                /!*
                Mongoose also supports many other types like boolean, binary data etc...
                 *!/

                required : true,
                /!*
                 This is a validation, to check that user should provide the name while saving.
                 Also mongoose don't provide many validations but it provides a way to setup
                 custom validation which is going to allow us to validate literally anything we
                 need.
                 *!/

                trim : true, // This one of the data sanitization, removing spaces front and back.
            },

        age :
            {
                type : Number,

                validate(value)
                {
                    /!*
                    This is a custom validation.
                    This gets a parameter of value we are validating.
                    Now let the validation be that users can't enter -ve values for the age.
                    So we throw an error if there is a problem with the value.
                     *!/
                    if (value < 0)
                    {
                        throw new Error("Provide a positive age");
                    }
                },
                /!*
                Also for some validators easily we could use a npm package : validator.
                That module could perform validations like email, credit card, currency,
                hex colors, hashes, ISP addresses and many other validators.

                Install with : "npm install validator"
                 *!/
                default : 0 // Used to set a default value if we haven't provided.
            },

        email :
            {
                /!*
                This field is introduced to see about npm validator module.
                 *!/
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
                lowercase : true // This another kind of data trimming.
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
            }
    });*/ // Commented after defining this model in separate file.

/*
Now with the models are set we can create instances of that model to add documents to the database.
 */

/*const firstUserModelInstance = new UserModel(
    {
        // Here we pass all of the data for this particular user.
        name : 'Aitha Tarun',
        age : 19
    }
);*/ // Commented because we won't create again.

/*
Now to save data in the database we could use methods on our instances.
Those also includes CRUD operations in order to save the model instance.
 */
/*const responsePromise = firstUserModelInstance.save();*/ // Commented because we won't save again.
/*
This won't take any arguments, it's simply save the data that we have stored and this returns
a promise.
 */
/*responsePromise.then
(
    (result)=>
    {
        console.log("Saved data with Mongoose :",result);
        /!*
        Here result will be the model instance with _id and __v.
        __v which is the version of the document.
         *!/
    }
).catch
(
    (error)=>
    {
        console.log("Error occurred while saving data with Mongoose :",error);
        /!*
        When we use mongoose we also get a base level of validation from the start and we can
        customize that as we progressed.
        For example we could say that user need to be an adult so his/her age needs to be
        greater than or equal to 18.
        Or we could validate emails.
         *!/
    }
);*/ // Commented because we won't save again.

/*const requiredValidationUserInstance = new UserModel(
    {
        name : 'Required validation name',
        /!*
        Here we haven't provided age because it is optional. But name is required by the required validation.
         *!/
        age : -5 // Introduced when custom validation for blocking -ve age is used.
    }
).save().then
(
    (result)=>
    {
        console.log("Saved data with Mongoose :",result);
    }
).catch
(
    (error)=>
    {
        console.log("Error occurred while saving data with Mongoose :",error);
    }
);*/ // Commented after completing this task.

/*const emailValidator = new UserModel(
    {
        name : '  Email Validation ',
        email : ' TEST@gmail.com'
    }
).save().then
(
    (result)=>
    {
        console.log("Saved data with Mongoose :",result);
    }
).catch
(
    (error)=>
    {
        console.log("Error occurred while saving data with Mongoose :",error);
    }
);*/ // Commented after completing this task.

/*const passwordValidator = new UserModel(
    {
        name : "Password validation",
        email : "passwordValidation@gmail.com",
        age : 1,
        password : '    pass   '
    }
).save().then
(
    (result)=>
    {
        console.log("Saved data with Mongoose :",result);
    }
).catch
(
    (error)=>
    {
        console.log("Error occurred while saving data with Mongoose :",error);
    }
);*/ // Commented after completing this task.

/*const TaskModel = mongoose.model('TaskModel',
    {
        description :
            {
                type : String,
                trim : true,
                required : true
            },
        completed :
            {
                type : Boolean,
                default : false
            }
    });*/ // Commented after defining this model in separate file

/*const firstTaskModelInstance = new TaskModel(
    {
        description : 'Gather project details',
        completed: false
    });

firstTaskModelInstance.save().then
(
    (result)=>
    {
        console.log("Saved new task to database :",result);
    }
).catch
(
    (error)=>
    {
     console.log("Error while saving new task in database :",error);
    }
);*/ // Commented because we won't save more than once.

/*const validationTask = new TaskModel(
    {
        description: 'Get groceries'
    }
).save().then
(
    (result)=>
    {
        console.log("Saved new task to database :",result);
    }
).catch
(
    (error)=>
    {
        console.log("Error while saving new task in database :",error);
    }
);*/ // Commented because we won't insert same data more than once.

/*
Here we could see in database for UserModel we find usermodels and for TaskModel we see taskmodels
because it takes our model name and lowercase it and pluralize it, then uses that as the collection
name.
 */

/*
Also, with data validation we can enforce that the data conforms to some rules.
For example we could say that the users age needs to be greater than or equal to 18.

Where as data sanitization allows us to alter the data before saving it.
For example, to remove empty spaces around the user's name.
 */

/*
Some of the validations are :
required : With which we can enforce that certain fields have to be provided while others could be optional.
 */



