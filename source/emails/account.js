const sendGrid = require('@sendgrid/mail');

// const API_KEY = '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'; // Commented after introducing environment variables.

/*
Before sending email we have to let send grid module know that we work with above API_KEY.
 */

//sendGrid.setApiKey(API_KEY); // Commented after introducing environment variables.
sendGrid.setApiKey(process.env.SENDGRID_API_KEY);

/*sendGrid.send // This allows us to send an individual email.
    (
        {
            to: 'andriodmactemporary@gmail.com',
            from: 'andriodmactemporary@gmail.com',
            subject: 'First sendgrid test mail',
            text: 'Hi this is the first sendgrid test mai l'
        }
    ).then
(
    (data) =>
    {
        console.log(data);
    }
).catch
(
    (error)=>
    {
        console.log(error.response.body.errors)
    }
);*/
/*
 Commented because this is only for testing, we want to integrate emails in task-manager
 that is in users.
 So, we define below functions.
 */

const sendWelcomeEmail = (email,name)=>
{
    sendGrid.send
    (
        {
            from : 'andriodmactemporary@gmail.com',
            to : email,
            subject : 'Welcome to task manager',
            text : `Welcome ${name}, to the task manager app.`
            /*
            Here we could also send HTML pages also with property "html".
             */
        }
    )
};

/*
This send method is a asynchronous task, it returns a promise.
BUt here we won't handle that, because we won't need NOde to actually wait for the send grid
server to send a response back. We just send that off to them and the user will get the email
in a minute or two. There's no need to make sure that send completes before they get their
status code back. So, we won't wait for that task for completion then continue our task here.
 */

const sendCancelEmail = (email,name)=>
{
    sendGrid.send
    (
        {
            from : 'andriodmactemporary@gmail.com',
            to : email,
            subject : 'Task manager account cancellation',
            text : `User ${name} you have removed your account in task manager application, can we know the reason from your account deletion`
        }
    );
}

module.exports =
    {
        sendWelcomeEmail,
        sendCancelEmail
    }
