# Hackathon Event Email Service

This is a simple backend service for sending emails in the Hackathon Event App.

## Setup

1. Create a `.env` file based on `.env.example`:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Send Event ID Email
```
POST /send-event-id
Content-Type: application/json

{
  "eventId": "event_12345",
  "email": "user@example.com",
  "eventName": "My Hackathon Event",
  "eventDate": "2025-12-25",
  "eventLocation": "Bangkok"
}
```

## Email Configuration

For Gmail:
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password as `EMAIL_PASS`

For other providers, update `SMTP_HOST` and `SMTP_PORT` accordingly.