const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

sgMail.send({
    to: 'yiyinghahalin@gmail.com',
    from: 'yiyinghahalin@gmail.com',
    subject: 'This is my sg mail test',
    text: 'Hope it works!'
});

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: '...',
        subject: 'Welcome to the App!',
        text: `Nice to meet you, ${name} :]\nLet me know how you get along with this app.`
    });
};

const sendGoodbyeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: '...',
        subject: 'Goodbye! Hope we could see you soon.',
        text: `Hello ${name}! Really sorry to hear that you are going to leave us.\n
               Please kindly take a few minutes to write down you feedback throught this link: ...\n
               We will stop sending emails to you (${email}) in the future.\n
               If you want to get our lastest news, you could always subscribe to ...`
    });
};

module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail
};