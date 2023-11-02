import nodemailer from "nodemailer";

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: "dschakub@hotmail.de",
    pass: "imperialismus1!", // Use environment variables for security
  },
});

// Define an async function to send an email
async function sendEmail() {
  const mailOptions = {
    from: "your_email@gmail.com",
    to: "dschakub@hotmail.de",
    subject: "Hello from TypeScript Node.js",
    text: "This is a test email sent from a TypeScript Node.js script.",
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

// Call the sendEmail function to send the email
sendEmail();
