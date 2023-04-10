
require('dotenv').config();

const nodemailer = require('nodemailer');


let sendEmail = {
    register :async (email,username,password) => {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user:  'colon007march@gmail.com', // TODO: your gmail account
                pass:  '0891631619za' // TODO: your gmail password
            }
        });

// Step 2
        let mailOptions = {
            from: 'colon007march@gmail.com', // TODO: email sender
            to: email, // TODO: email receiver
            subject: 'Subscription from Koi-fish',
            text: 'Your username is:' + username + '\n' + 'Your password is:' + password
        };

// Step 3
        transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                console.log('Error occurs');
            }
        });
    }
}

export default sendEmail