const nodemailer = require('nodemailer');
const subscription = require('../models/subscriptions')

const subscriptionTemplate = (userEmail) => `  
                              <!DOCTYPE html>
                                <html>
                                  <head>
                                    <style>
                                      body {
                                        font-family: Arial, sans-serif;
                                        line-height: 1.5;
                                        background-color: #f4f4f4;
                                      }

                                      .container {
                                        max-width: 600px;
                                        margin: 0 auto;
                                        padding: 20px;
                                        border: 1px solid #e1e1e1;
                                        background-color: #ffffff;
                                      }

                                      h1 {
                                        font-size: 24px;
                                        font-weight: bold;
                                        margin-bottom: 20px;
                                        color: #333333;
                                      }

                                      p {
                                        font-size: 16px;
                                        margin-bottom: 10px;
                                        color: #555555;
                                      }

                                      .message {
                                        margin-bottom: 30px;
                                      }

                                      .highlight {
                                        font-weight: bold;
                                        color: #007bff;
                                      }
                                    </style>
                                  </head>
                                  <body>
                                    <div class="container">
                                      <h1>Someone has just subscribed to your newsletters</h1>
                                      <div class="message">
                                        <p><span class="highlight">Email:</span> ${userEmail}</p>
                                      </div>
                                    </div>

                                  
                                  </body>
                                </html>
                            `


module.exports.subscribe = async (request, response) => {
  try {
    const { userEmail } = request.body;

    if (!userEmail) {
      return response.status(400).json({error: 'Email is required to become a subscriber'});
    }

    const existingSubscriber = await subscription.findOne({ email: userEmail });

    if (existingSubscriber) {
      return response.status(400).json({error: 'You have already subscribed to our newsletter'});
    }

    const newSubscriber = await subscription.create({ email: userEmail });

    if (!newSubscriber) {
      return response.status(400).json({error: 'Failed to create subscription'});
    }

    const serverEmail = process.env.NODEMAILER_API_SERVER_EMAIL;
    const serverEmailPassword = process.env.NODEMAILER_API_SERVER_EMAIL_PASSWORD;
    const nodemailerServiceType = process.env.NODEMAILER_API_SERVICE_TYPE;

    const transporter = nodemailer.createTransport({
      service: nodemailerServiceType,
      auth: {
        user: serverEmail,
        pass: serverEmailPassword,
      },
    });

    const currentDate = new Date();

    const emailOptions = {
      from: serverEmail,
      to: serverEmail,
      subject: 'New Subscriber',
      html: subscriptionTemplate(userEmail),
    };

    await transporter.sendMail(emailOptions);

    return response.status(200).json({ message: 'Thank you for subscribing to our newsletter :)' });
  } catch (error) {
    console.error('Error sending email:', error);
    return response.status(400).json({ error: 'Internal Server Error' });
  }
};
