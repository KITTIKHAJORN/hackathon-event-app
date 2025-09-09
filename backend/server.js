const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Create transporter for nodemailer
const createTransporter = () => {
  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email credentials not configured. Please set EMAIL_USER and EMAIL_PASS in .env file');
  }
  
  // Use Gmail as default SMTP service
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send Event ID email
app.post('/send-event-id', async (req, res) => {
  try {
    const { eventId, email, eventName, eventDate, eventLocation } = req.body;
    
    if (!eventId || !email || !eventName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if email service is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('📧 Email service not configured. Skipping email send.');
      return res.json({ 
        success: true, 
        message: 'Event created successfully. Email service not configured, so no email was sent.',
        eventId: eventId
      });
    }
    
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Event Has Been Created',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .event-id { 
              font-size: 24px; 
              font-weight: bold; 
              text-align: center; 
              padding: 15px; 
              background-color: #eef2ff; 
              border: 2px dashed #4F46E5; 
              margin: 20px 0; 
              letter-spacing: 2px;
            }
            .instructions { 
              background-color: #fffbeb; 
              border-left: 4px solid #f59e0b; 
              padding: 15px; 
              margin: 20px 0; 
            }
            .footer { 
              text-align: center; 
              padding: 20px; 
              font-size: 12px; 
              color: #666; 
              border-top: 1px solid #eee; 
              margin-top: 20px; 
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Event Created Successfully!</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Your event <strong>"${eventName}"</strong> has been created successfully.</p>
              
              <p><strong>Your Event ID:</strong></p>
              <div class="event-id">${eventId}</div>
              
              <p><strong>Event Details:</strong></p>
              <ul>
                <li>Date: ${eventDate || 'Not specified'}</li>
                <li>Location: ${eventLocation || 'Not specified'}</li>
              </ul>
              
              <div class="instructions">
                <p><strong>How to Manage Your Event:</strong></p>
                <ol>
                  <li>Go to the Event Management page in the app</li>
                  <li>Enter your Event ID and email address</li>
                  <li>Request an OTP for verification</li>
                  <li>Check your email for the OTP</li>
                  <li>Enter the OTP to access event management</li>
                </ol>
              </div>
              
              <p>Please save this Event ID for future reference. You'll need it to manage your event.</p>
            </div>
            <div class="footer">
              <p>This is an automated email from the Hackathon Event App. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Event ID email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    
    // If it's a configuration error, return success but with a warning
    if (error.message.includes('credentials not configured')) {
      return res.json({ 
        success: true, 
        message: 'Event created successfully. Email service not configured, so no email was sent.',
        warning: error.message
      });
    }
    
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
});

// Send OTP email
app.post('/send-otp', async (req, res) => {
  try {
    const { eventId, email, otp, eventName } = req.body;
    
    if (!eventId || !email || !otp) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if email service is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('📧 Email service not configured. Skipping email send.');
      return res.status(400).json({ 
        error: 'Email service not configured',
        message: 'The email service is not configured. Please contact the administrator.'
      });
    }
    
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Event Management OTP',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #10B981; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .otp { 
              font-size: 32px; 
              font-weight: bold; 
              text-align: center; 
              padding: 20px; 
              background-color: #d1fae5; 
              border: 2px solid #10B981; 
              margin: 20px 0; 
              letter-spacing: 5px;
            }
            .warning { 
              background-color: #fffbeb; 
              border-left: 4px solid #f59e0b; 
              padding: 15px; 
              margin: 20px 0; 
            }
            .footer { 
              text-align: center; 
              padding: 20px; 
              font-size: 12px; 
              color: #666; 
              border-top: 1px solid #eee; 
              margin-top: 20px; 
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Event Management OTP</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>You have requested to manage your event <strong>"${eventName || 'Unknown Event'}"</strong>.</p>
              
              <p><strong>Your One-Time Password (OTP):</strong></p>
              <div class="otp">${otp}</div>
              
              <div class="warning">
                <p><strong>Important:</strong></p>
                <ul>
                  <li>This OTP is valid for 30 minutes</li>
                  <li>Do not share this OTP with anyone</li>
                  <li>If you did not request this OTP, please ignore this email</li>
                </ul>
              </div>
              
              <p>Enter this OTP in the application to access your event management features.</p>
            </div>
            <div class="footer">
              <p>This is an automated email from the Hackathon Event App. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
    
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'OTP email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    
    // If it's a configuration error, return a specific error
    if (error.message.includes('credentials not configured')) {
      return res.status(500).json({ 
        error: 'Email service not configured',
        message: error.message
      });
    }
    
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Email service running on port ${PORT}`);
  
  // Check if email is configured and log a warning if not
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('\n⚠️  Email service not configured!');
    console.warn('To enable email functionality:');
    console.warn('1. Create a .env file in the backend directory');
    console.warn('2. Add EMAIL_USER and EMAIL_PASS variables');
    console.warn('3. For Gmail, use an App Password (not your regular password)');
    console.warn('See .env.example for details\n');
  } else {
    console.log('📧 Email service configured and ready');
  }
});