const nodemailer = require('nodemailer');

const { google } = require('googleapis');

const { OAuth2 } = google.auth;

const sendEmail = (mailOptions) =>
  new Promise((resolve, reject) => {
    const senderEmail = process.env.SENDER_EMAIL;
    const oauth2Client = new OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET, // Client Secret
      'https://developers.google.com/oauthplayground' // Redirect URL
    );
    oauth2Client.setCredentials({
      refresh_token: process.env.GMAIL_REFRESH_TOKEN,
    });
    const accessToken = oauth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: senderEmail,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken,
        expires: 3600 * 1000,
      },
    });
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        reject(err);
      } else {
        transporter.close();
        resolve(info);
      }
    });
  });

module.exports = { sendEmail };
