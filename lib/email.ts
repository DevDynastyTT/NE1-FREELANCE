import nodemailer from "nodemailer";

const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.NODEMAILER_API_SERVICE_TYPE,
    auth: {
      user: process.env.NODEMAILER_API_SERVER_EMAIL,
      pass: process.env.NODEMAILER_API_SERVER_EMAIL_PASSWORD,
    },
  });
};

export async function sendContactEmail(
  name: string,
  userEmail: string,
  message: string
): Promise<void> {
  const serverEmail = process.env.NODEMAILER_API_SERVER_EMAIL!;
  const transporter = createTransporter();

  const currentDate = new Date();
  const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear().toString().substr(-2)}`;

  const htmlTemplate = (_isUserCopy: boolean) => `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.5; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; background-color: #ffffff; }
        h1 { font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #333333; }
        p { font-size: 16px; margin-bottom: 10px; color: #555555; }
        .message { margin-bottom: 30px; }
        .highlight { font-weight: bold; color: #007bff; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Contact Form Submission</h1>
        <p><span class="highlight">Subject:</span> Contact Us Form Submission</p>
        <p><span class="highlight">Purpose:</span> Inquiry/Message</p>
        <p><span class="highlight">Date:</span> ${formattedDate}</p>
        <div class="message">
          <p><span class="highlight">Name:</span> ${name}</p>
          <p><span class="highlight">Email:</span> ${userEmail}</p>
          <p><span class="highlight">Message:</span></p>
          <p>${message}</p>
        </div>
      </div>
    </body>
  </html>`;

  await transporter.sendMail({
    from: serverEmail,
    to: serverEmail,
    subject: "Message From Contact Form",
    html: htmlTemplate(false),
  });

  await transporter.sendMail({
    from: serverEmail,
    to: userEmail,
    subject: "Your Contact Form",
    html: htmlTemplate(true),
  });

  console.log("Contact emails sent successfully");
}

export async function sendMessageNotification(
  receiverEmail: string,
  senderUsername: string,
  senderEmail: string,
  message: string
): Promise<void> {
  const serverEmail = process.env.NODEMAILER_API_SERVER_EMAIL!;
  const transporter = createTransporter();

  const currentDate = new Date();
  const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear().toString().substr(-2)}`;

  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.5; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; background-color: #ffffff; }
        h1 { font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #333333; }
        p { font-size: 16px; margin-bottom: 10px; color: #555555; }
        .message { margin-bottom: 30px; }
        .highlight { font-weight: bold; color: #007bff; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>NE1-FREELANCE Message Notification</h1>
        <p><span class="highlight">Date:</span> ${formattedDate}</p>
        <div class="message">
          <p><span class="highlight">From:</span> ${senderUsername}</p>
          <p><span class="highlight">Email:</span> ${senderEmail}</p>
          <p><span class="highlight">Message:</span></p>
          <p>${message}</p>
          <button style="background-color: #4285f4; color: #ffffff; padding: 10px 20px; border-radius: 4px; text-decoration: none; display: inline-block;">
            <a href="https://ne1freelance.vercel.app/inbox" style="color: #ffffff; text-decoration: none;">Click here to view message</a>
          </button>
        </div>
      </div>
    </body>
  </html>`;

  await transporter.sendMail({
    from: serverEmail,
    to: receiverEmail,
    subject: `${senderUsername} sent you a message`,
    html,
  });

  console.log("Message notification sent successfully");
}

export async function sendPasswordResetEmail(
  userEmail: string,
  resetLink: string
): Promise<void> {
  const serverEmail = process.env.NODEMAILER_API_SERVER_EMAIL!;
  const transporter = createTransporter();

  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.5; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; background-color: #ffffff; }
        h1 { font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #333333; }
        p { font-size: 16px; margin-bottom: 10px; color: #555555; }
        .btn { display: inline-block; background-color: #fd8700; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin: 16px 0; }
        .note { font-size: 13px; color: #999999; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Reset Your Password</h1>
        <p>We received a request to reset the password for your NE1 Freelance account.</p>
        <p>Click the button below to set a new password. This link expires in <strong>1 hour</strong>.</p>
        <a href="${resetLink}" class="btn">Reset Password</a>
        <p class="note">If you didn't request a password reset, you can safely ignore this email. Your password won't change.</p>
        <p class="note">Or paste this link in your browser: ${resetLink}</p>
      </div>
    </body>
  </html>`;

  await transporter.sendMail({
    from: serverEmail,
    to: userEmail,
    subject: 'NE1 Freelance — Reset your password',
    html,
  });
}

export async function sendInvoiceEmail(
  userEmail: string,
  username: string,
  jobFee: number,
  serviceFee: number,
  transactionId: string,
  totalFee: number
): Promise<void> {
  const serverEmail = process.env.NODEMAILER_API_SERVER_EMAIL!;
  const transporter = createTransporter();
  const template = (await import("./invoiceTemplate")).default;
  const html = template(username, jobFee, serviceFee, transactionId, totalFee);

  await transporter.sendMail({
    from: serverEmail,
    to: userEmail,
    subject: "NE1-FREELANCE Payment Invoice",
    html,
  });

  console.log("Invoice email sent successfully");
}
