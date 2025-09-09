# Hackathon Event App

A modern event management application built with React, TypeScript, and Vite.

## Features
- Create and manage events
- Event registration system
- OTP-based event management security
- Responsive design with Tailwind CSS
- Dark mode support

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application
1. Start the development server:
   ```bash
   npm run dev
   ```

### Setting up Email Service
This application requires a backend email service to send Event IDs and OTPs.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example` and configure your email settings:
   ```bash
   cp .env.example .env
   # Edit .env with your email configuration
   ```

4. Start the email service:
   ```bash
   npm start
   ```

### Email Configuration
For Gmail:
1. Enable 2-factor authentication on your Google account
2. Generate an App Password in your Google account settings
3. Use the App Password as `EMAIL_PASS` in your `.env` file

For other email providers, update the `SMTP_HOST` and `SMTP_PORT` accordingly.

## Project Structure
- `src/` - Main source code
  - `components/` - React components
  - `pages/` - Page components
  - `services/` - API services
  - `contexts/` - React contexts
  - `hooks/` - Custom hooks
- `backend/` - Email service backend

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Technologies Used
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- React Router
- TanStack Query

## License
MIT