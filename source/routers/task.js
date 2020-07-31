/*
This files contains all the routes related to the users.
 */
const express = require('express');

const router = new express.Router();

const Task = require('../models/task');

const authentication = require('../middleware/authentication');

router.post
(
    '/tasks',
    authentication, // With this, tasks are created and viewed for only themselves(users).
    async (request,response)=> // Async introduced afterwards.
    {
        console.log('Body which is sent to this endpoint :',request.body);

        /*const task = new Task
        (
            request.body
        );*/ // Commented after using authentication.

        const task = new Task
        (
            {
                ...request.body, //This will copy all of the properties from body to this object.
                creator : request.user._id
                /*
                With this creator property we link tasks with users.
                 */
            }
        );

        /*task.save().then
        (
            ()=>
            {
                response.status(201).send(task); // 201 = Something has been created.
            }
        ).catch
        (
            (error)=>
            {
                response.status(400).send(error);
            }
        );*/ // Commented after using async await.

        try
        {
            await task.save();
            response.status(201).send(task);
        }
        catch (error)
        {
            response.status(400).send(error);
        }
    }
);

router.get
(
    '/tasks',
    authentication,
    async (request,response)=> // Async introduced afterwards.
    {
        /*Task.find
            (
                {
                    // Fetch all tasks.
                }
            ).then
        (
            (tasks)=>
            {
                response.send(tasks);
            }
        ).catch
        (
            (error)=>
            {
                response.status(500).send(error);
            }
        );*/ //Commented after using async await.

        const match = //This object is used to filter the tasks. Which is used in populating below.
            {

            };

        /*
        Here when user provide the query parameter completed = true, we then send
        all completed tasks and completed = false for vice versa. And if that parameter is
        not provided then we send all the tasks.
        */
        if (request.query.completed)
        {
            match.completed = request.query.completed === 'true'; //This also converts to boolean.
        }

        /*
        Pagination : THis can be viewed in google search, when we search anything in the google
        mostly it might return millions of results but all those can't be seen at once means
        we could find other results in other pages like page 1, 2, 3 ... .
        It is the idea of creating pages of data that can be requested.So, we are not fetching
        everything all at once. So, if we have 700 tasks then we could show first ten or
        first 50 then fetch more if needed.
        Here by our example google shows page numbers, but this is not only the way to way
        to implement pagination. Means like in some websites we could see a button at the
        bottom like "view more" or "show more" which appends more results right there and
        we could continue to scroll down or also we could implement the infinite scrolling
        application which automatically fetch the next pages of data behind the scenes
        as we are scrolling.

        Regardless of these three approaches the back-end will be same, we need a way for users
        requesting their tasks to specify which page of data they are trying to fetch.

        We do that by adding two new options to this request which are limit and skip.

        Like GET /tasks?limit=number of results.
        This limit allows us to limit the number of results we get back for any given request.

        And GET /tasks?skip=number.
        This skip will allows us to iterate over pages.
        Means when
        limit = 10 and skip = 0, then we get first 10 results.
        limit = 10 and skip = 10, then we get second set of 10 results.

        In google example if limit = 10 and skip = 0, we get first page.
        limit = 10 and skip = 10, then we are skipping that first page and getting the second page on Google.
        So, if limit = 10 and skip = 20, then we get 3rd page and so on.... .

        Here this limit and skip values are provided through query parameters.
         */

        /*
        We can also sort the results based on some conditions with the populate, like
        enable users to sort by when the task was last created or last updated (timestamps).
        Or sort by completed value means putting the completed tasks first or vice versa.
        This can be provided by like :
        GET /tasks?sortBy=createdAt:asc
        This sortBy allows users to specify these sorting criteria.
        There are two pieces to the value the first is the field we are trying to sort by and
        second is the order like ascending(asc) or descending(desc).
        These values can be separated with any special character like "_" or ":" etc... .
         */
        const sort = {};

        if (request.query.sortBy)
        {
            const parts = request.query.sortBy.split(':');

            sort[parts[0]] = parts[1]==='desc' ? -1 : 1;
            /*
            With this it will create :
            sort =
            {
            parts[0]=parts[1]
            }
             */
        }

        try
        {
            //const tasks = await Task.find({}); //Commented after using authentication.

            /*const tasks = await Task.find
            (
                {
                    creator : request.user._id
                }
            );
            response.send(tasks);
            */ //Or

            /*await request.user.populate('tasks').execPopulate();*/

            /*
            Commented after introducing filtering.
            Here we want to filter the tasks based on some criteria.
            Like user only want to view tasks which are completed/not completed.
            Or user want to view last 3 added tasks.

            This type of options like completed or limit will be provided through query string.
            Like ?completed=true.
            This filtering options options can be set through editing populate.
             */

            await request.user.populate
            (
                {
                    path : 'tasks', // This the name of the property we want to populate, just like above commented one.
                    match,
                    /*
                    This match is an object in which we can specify exactly which tasks
                    we are trying to match.
                    */
                    options :
                        {
                            /*
                            This options property can be used for pagination and also can be
                            used to sorting.
                            If any of this options are not provided then mongoose will neglect them.
                             */
                            limit : parseInt(request.query.limit),
                            /*
                            This parseInt is a JS function used to convert a string to integer
                             */
                            skip : parseInt(request.query.skip),
                            /*
                            In postman while providing query parameters :
                            limit=2 and skip=0, gives first two results.
                            limit=2 and skip=2, gives second page of 2 results.
                            limit=2 and skip=4, gives third page of 2 results. Means skip first 4 results (2 per each page).

                            limit=3 and skip=0, gives first page with 3 results.
                            limit=3 and skip=3, gives second page of 3 results. Means skip first 3 results.
                             */

                            /*
                            Below are sorting options.
                             */
                            sort, /*:
                                {
                                    //createdAt : -1 //Ascending = 1 , Descending = -1
                                    //completed : -1 // True = greater , False = lower.
                                }*/ // Commented when declared outside.
                        }
                }
            ).execPopulate();

            response.send(request.user.tasks);
        }
        catch (error)
        {
            response.status(500).send(error);
        }
    }
);

router.get
(
    '/tasks/:id',
    authentication,
    async (request,response)=> // Async introduced afterwards.
    {
        const _id = request.params.id;

        /*Task.findById
        (
            _id
        ).then
        (
            (task)=>
            {
                if (!task)
                {
                    return response.status(404).send();
                }

                response.send(task);
            }
        ).catch
        (
            (error)=>
            {
                response.status(500).send(error);
            }
        );*/ //Commented after using async await.

        try
        {
            /*const task = await Task.findById(_id);*/ // Commented after using authentication.

            const task = await Task.findOne
            (
                {
                    _id,
                    creator : request.user._id
                }
                /*
                 So, by this, this is only return the task with the specified task id
                 and only if the specified task id user is authenticated.
                 Means specified task should be the task of currently authenticated user.
                 */
            );

            if (!task)
            {
                return response.status(404).send();
            }

            response.send(task);
        }
        catch (error)
        {
            response.status(500).send(error);
        }
    }
);


router.patch
(
    '/tasks/:id',
    authentication,
    async (request,response)=>
    {
        const allowedUpdates = ["completed","description"];
        const updates = Object.keys(request.body);

        const isUpdatingValid = updates.every
        (
            (update)=>
            {
                return allowedUpdates.includes(update);
            }
        );

        if (!isUpdatingValid)
        {
            response.status(400).send({error : "Invalid property to update"});
        }

        try
        {
            /*const task = await Task.findByIdAndUpdate
            (
                request.params.id,
                request.body,
                {
                    new : true,
                    runValidators : true
                }
            );*/ // Commented after using middleware

            /*const task = await Task.findById(request.params.id);*/ // Commented after using authentication.

            const task = await Task.findOne
            (
                {
                    _id : request.params.id,
                    creator : request.user._id
                }
            )

            /*
            Below forEach and save code is moved from here to below if after using authentication.
             */

            if (!task)
            {
                return response.status(404).send({error : "Task with specified ID not found or Validation error."});
            }

            updates.forEach
            (
                (update)=>
                {
                    task[update] = request.body[update];
                }
            );
            await task.save();

            response.send(task);
        }
        catch (error)
        {
            response.status(400).send(error);
        }
    }
);

router.delete
(
    '/tasks/:id',
    authentication,
    async (request,response)=>
    {
        try
        {
            /*const task = await Task.findByIdAndDelete
            (
                request.params.id
            );*/ // Commented after using authentication.

            const task = await Task.findOneAndDelete
                /*
                 By this tasks can be deleted who as created it(user) and user should be authenticated to perform that.
                 */
            (
                {
                    _id : request.params.id,
                    creator : request.user._id
                }
            );

            if(!task)
            {
                return response.status(404).send({error : "Task with specified ID not found."})
            }
            response.send(task);
        }
        catch(error)
        {
            response.status(500).send(error);
        }
    }
);

module.exports = router;