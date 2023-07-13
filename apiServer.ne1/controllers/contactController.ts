import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
import Users from '../models/userModel';
import mongoose from 'mongoose';
dotenv.config();

async function sendEmail (request, response) {
  try {
    const {name, userEmail, message} = request.body;
    const serverEmail = process.env.NODEMAILER_API_SERVER_EMAIL;
    const serverEmailPassword = process.env.NODEMAILER_API_SERVER_EMAIL_PASSWORD;
    const nodemailerServiceType = process.env.NODEMAILER_API_SERVICE_TYPE;
    console.log("Sending email to", serverEmail, ' password:', serverEmailPassword, 'service type:', nodemailerServiceType);

    // Create a transporter using your email provider's configuration
    const transporter = nodemailer.createTransport({
      // Replace with your email provider's configuration
      service: nodemailerServiceType,
      auth: {
        user: serverEmail,
        pass: serverEmailPassword,
      },
    });

     // Get current date
     var currentDate = new Date();
      
     // Format date as MM/DD/YY
     var formattedDate = (currentDate.getMonth() + 1) + '/' + currentDate.getDate() + '/' + currentDate.getFullYear().toString().substr(-2);

    const emailOptions = {
      from: serverEmail,
      to: serverEmail,
      subject: 'Message From Contact Form',
      html: `
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
            <h1>Contact Form Submission</h1>
      
            <p><span class="highlight">Subject:</span> Contact Us Form Submission</p>
            <p><span class="highlight">Purpose:</span> Inquiry/Message</p>
            <p><span class="highlight">Date:</span> <span id="currentDate">${formattedDate}</span></p>
      
            <div class="message">
              <p><span class="highlight">Name:</span> ${name}</p>
              <p><span class="highlight">Email:</span> ${userEmail}</p>
              <p><span class="highlight">Message:</span></p>
              <p>${message}</p>
            </div>
          </div>
      
        
        </body>
      </html>
      
      `,
    };
    const emailOptions2 = {
      from: serverEmail,
      to: userEmail,
      subject: 'Your Contact Form',
      html: `
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
            <h1>Contact Form Submission</h1>
      
            <p><span class="highlight">Subject:</span> Contact Us Form Submission</p>
            <p><span class="highlight">Purpose:</span> Inquiry/Message</p>
            <p><span class="highlight">Date:</span> <span id="currentDate">${formattedDate}</span></p>
      
            <div class="message">
              <p><span class="highlight">Name:</span> ${name}</p>
              <p><span class="highlight">Email:</span> ${userEmail}</p>
              <p><span class="highlight">Message:</span></p>
              <p>${message}</p>
            </div>
          </div>
      
        </body>
      </html>
      `,
    };
    // Send email
    await transporter.sendMail(emailOptions);
    await transporter.sendMail(emailOptions2);

    console.log("Email sent successfully: ");

    return response.status(200).json({ message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Error sending email:', error);
    return response
      .status(400)
      .json({ error: 'There was an error while processing your transaction' });
  }
};

async function notifyUser(request, response){
  const { receiverID, senderID, message } = request.body
  try {
    const serverEmail = process.env.NODEMAILER_API_SERVER_EMAIL;
    const serverEmailPassword = process.env.NODEMAILER_API_SERVER_EMAIL_PASSWORD;
    const nodemailerServiceType = process.env.NODEMAILER_API_SERVICE_TYPE;

    const sender = await Users.findById({ _id: new mongoose.Types.ObjectId(senderID)});
    const receiver = await Users.findById({ _id: new mongoose.Types.ObjectId(receiverID)});

    if(!sender){
      console.log("Sender not found")
      return response.status(400).json({ error: 'Sender not authorized' });
    }

    if(!receiver){
      console.log("Receiver not found")
      return response.status(400).json({ error: 'Receiver not authorized' });
    }

    // Create a transporter using your email provider's configuration
    const transporter = nodemailer.createTransport({
      // Replace with your email provider's configuration
      service: nodemailerServiceType,
      auth: {
        user: serverEmail,
        pass: serverEmailPassword,
      },
    });

     // Get current date
     var currentDate = new Date();
      
     // Format date as MM/DD/YY
     var formattedDate = (currentDate.getMonth() + 1) + '/' + currentDate.getDate() + '/' + currentDate.getFullYear().toString().substr(-2);

    const emailOptions = {
      from: serverEmail,
      to: receiver.email,
      subject: `${sender.username} sent you a message`,
      html: `
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
            <h1>NE1-FREELANCE Message Notification</h1>
      
            <p><span class="highlight">Date:</span> <span id="currentDate">${formattedDate}</span></p>
      
            <div class="message">
              <p><span class="highlight">From: </span> ${sender.username}</p>
              <p><span class="highlight">Email:</span> ${sender.email}</p>
              <p><span class="highlight">Message:</span></p>
              <p>${message}</p>

              <button style="background-color: #4285f4; color: #ffffff; padding: 10px 20px; border-radius: 4px; text-decoration: none; display: inline-block;">
                <a 
                  href="https://ne1freelance.vercel.app/auth/messages" 
                  style="color: #ffffff; 
                  text-decoration: none;"
                >Click here to view message
                </a>
              </button>
            </div>
          </div>
      
        
        </body>
      </html>
      
      `,
    };
  
    // Send email
    await transporter.sendMail(emailOptions);

    console.log("Notification sent successfully: ");

    return response.status(200).json({ message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Error sending email:', error);
    return response
      .status(400)
      .json({ error: 'There was an error while processing your transaction' });
  }
}

export {
  sendEmail, notifyUser
}
