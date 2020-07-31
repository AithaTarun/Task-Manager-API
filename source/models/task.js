const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema
(
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
            },

        creator : //This property stores the user ID who created this task.
            {
                type : mongoose.Schema.Types.ObjectId, //Used to specify the type to ID
                required: true,

                ref : 'UserModel'
                /*
                This ref allows us to create a reference from this field to other model.
                This creates the relationship between User and this Task model.

                With this we can easily fetch the entire user profile whenever we have access to
                individual task.
                 */
            }
    },
    {
        timestamps : true
    }
);

const TaskModel = mongoose.model('TaskModel',taskSchema);

module.exports = TaskModel;