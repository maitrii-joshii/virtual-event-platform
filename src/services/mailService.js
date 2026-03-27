const mailtrapClient = require('../config/mailtrapClient');

const sender = {
    email: process.env.SENDER_EMAIL,
    name: process.env.SENDER_NAME
};

const sendRegistrationConfirmationEmail = async(userEmail, userName, eventTitle) => {
    try {
        const recipients = [{
            email: userEmail
        }];
        await mailtrapClient
            .send({
                from: sender,
                to: recipients,
                subject: `Registration Confirmation for ${eventTitle}`,
                text: `Hello ${userName},\n\nYou have successfully registered for the event "${eventTitle}".\n\nThank you for using our platform!\n\nBest regards,\nAirtribe Virtual Event Team`
            });
    } catch(err) {
        console.error('Error sending registration confirmation email:', err);
    }
};


module.exports = { sendRegistrationConfirmationEmail };