# EventHub - ระบบจัดการอีเวนต์  

แพลตฟอร์มจัดการอีเวนต์แบบครบวงจร ทันสมัย พัฒนาโดยใช้ React และ TypeScript ถูกออกแบบมาเพื่อเชื่อมโยงผู้จัดงานเข้ากับผู้เข้าร่วมงาน ผ่านเว็บแอปพลิเคชันที่ใช้งานง่ายและอัดแน่นด้วยฟีเจอร์  

## 🚀 ฟีเจอร์

### สำหรับผู้เข้าร่วมงาน
- **การค้นหาอีเวนต์**: ค้นหาและเรียกดูอีเวนต์ตามหมวดหมู่ สถานที่ และวันเวลา  
- **ตัวกรองขั้นสูง**: กรองอีเวนต์ตามช่วงราคา ประเภทงาน และจำนวนที่นั่งว่าง  
- **รายละเอียดอีเวนต์**: ดูข้อมูลครบถ้วน เช่น ตารางเวลา วิทยากร และราคา  
- **การลงทะเบียนที่ง่ายดาย**: กระบวนการลงทะเบียนหลายขั้นตอนพร้อมเลือกประเภทบัตร  
- **การจัดการบัตรเข้างาน**: ดูและจัดการบัตรที่ซื้อ พร้อม QR Code  
- **การอัปเดตแบบเรียลไทม์**: รับการแจ้งเตือนเมื่อมีการเปลี่ยนแปลงอีเวนต์  

### สำหรับผู้จัดงาน
- **การสร้างอีเวนต์**: ระบบช่วยสร้างอีเวนต์แบบหลายขั้นตอน ใช้งานง่าย  
- **การจัดการอีเวนต์**: จัดการ CRUD ครบถ้วน พร้อมระบบยืนยันความปลอดภัยด้วย OTP  
- **แดชบอร์ดวิเคราะห์**: แสดงสถิติและกราฟข้อมูลอย่างละเอียด  
- **การจัดการผู้เข้าร่วม**: ติดตามการลงทะเบียนและจัดการข้อมูลผู้เข้าร่วม  
- **การเชื่อมต่ออีเมล**: แจ้งเตือนอัตโนมัติผ่านอีเมลสำหรับรหัสอีเวนต์และการยืนยัน OTP  

### ฟีเจอร์ของแพลตฟอร์ม
- **รองรับหลายภาษา**: ภาษาไทยและภาษาอังกฤษครบถ้วน  
- **การออกแบบ Responsive**: รองรับการใช้งานทั้ง Desktop, Tablet และ Mobile  
- **โหมดสว่าง/มืด**: ปรับธีมตามความชอบของผู้ใช้  
- **การค้นหาแบบเรียลไทม์**: ค้นหาทันทีพร้อมแนะนำผลลัพธ์อัตโนมัติ  
- **การยืนยันตัวตนที่ปลอดภัย**: ใช้ OTP สำหรับการจัดการอีเวนต์  
- **การแสดงผลข้อมูล**: กราฟเชิงโต้ตอบและแดชบอร์ดสถิติ  

## 🛠️ เทคโนโลยีที่ใช้

### Frontend
- **React 18** - ใช้ฟีเจอร์ใหม่ของ React (Hooks และ Concurrent)  
- **TypeScript** - เพิ่มความปลอดภัยของโค้ด  
- **Vite** - เครื่องมือ build และ dev server ที่รวดเร็ว  
- **Tailwind CSS** - CSS แบบ Utility-first  
- **shadcn/ui** - ไลบรารี UI component ทันสมัย  
- **React Router** - Routing ฝั่ง client  
- **TanStack Query** - การดึงและแคชข้อมูลอย่างมีประสิทธิภาพ  
- **Recharts** - ไลบรารีแสดงผลข้อมูลเป็นกราฟ  
- **Lucide React** - ไอคอนสวยงาม  

### Backend
- **Node.js** - Runtime ของ JavaScript  
- **Express.js** - Framework สำหรับเว็บแอป  
- **Nodemailer** - การส่งอีเมล  
- **CORS** - การแชร์ทรัพยากรข้ามโดเมน  

### เครื่องมือพัฒนา
- **ESLint** - ตรวจสอบคุณภาพโค้ด  
- **PostCSS** - ประมวลผล CSS  
- **Autoprefixer** - ใส่ vendor prefix ให้ CSS  

## 📁 โครงสร้างโปรเจกต์



# EventHub - Event Management System

A comprehensive, modern event management platform built with React and TypeScript, designed to connect event organizers with attendees through an intuitive and feature-rich web application.

## 🚀 Features

### For Event Attendees
- **Event Discovery**: Browse and search events by category, location, and date
- **Advanced Filtering**: Filter events by price range, event type, and availability
- **Event Details**: View comprehensive event information including schedules, speakers, and pricing
- **Easy Registration**: Multi-step registration process with ticket selection
- **Ticket Management**: View and manage purchased tickets with QR codes
- **Real-time Updates**: Get notifications about event changes and updates

### For Event Organizers
- **Event Creation**: Intuitive multi-step event creation wizard
- **Event Management**: Full CRUD operations with OTP-based security verification
- **Analytics Dashboard**: Comprehensive statistics and data visualization
- **Attendee Management**: Track registrations and manage attendee information
- **Email Integration**: Automated email notifications for event IDs and OTP verification

### Platform Features
- **Multi-language Support**: Full Thai and English language support
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme**: User preference-based theme switching
- **Real-time Search**: Instant search with autocomplete suggestions
- **Secure Authentication**: OTP-based verification for event management
- **Data Visualization**: Interactive charts and analytics dashboard

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **React Router** - Client-side routing
- **TanStack Query** - Powerful data fetching and caching
- **Recharts** - Data visualization library
- **Lucide React** - Beautiful icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Nodemailer** - Email sending functionality
- **CORS** - Cross-origin resource sharing

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📁 Project Structure

```
hackathon-event-app/
├── src/
│   ├── components/
│   │   ├── common/           # Reusable UI components
│   │   │   ├── OTPInput.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── WorkflowGuide.tsx
│   │   ├── event/            # Event-specific components
│   │   │   ├── EventCard.tsx
│   │   │   ├── EventForm.tsx
│   │   │   ├── EventSearch.tsx
│   │   │   └── EventCard.tsx
│   │   ├── layout/           # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Layout.tsx
│   │   └── ui/               # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── ...
│   ├── contexts/             # React contexts
│   │   ├── LanguageContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks/                # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/                  # Utilities
│   │   └── utils.ts
│   ├── pages/                # Main application pages
│   │   ├── HomePage.tsx
│   │   ├── EventsPage.tsx
│   │   ├── EventDetailPage.tsx
│   │   ├── CreateEventPage.tsx
│   │   ├── EventManagementPage.tsx
│   │   ├── EventRegistrationPage.tsx
│   │   ├── ViewTicketsPage.tsx
│   │   └── NotFound.tsx
│   ├── services/             # API services
│   │   ├── eventService.ts
│   │   └── otpService.ts
│   ├── assets/               # Static assets
│   ├── App.tsx               # Main application component
│   ├── main.tsx              # Application entry point
│   └── index.css             # Global styles
├── backend/                  # Email service backend
│   ├── server.js
│   ├── package.json
│   └── README.md
├── public/                   # Public assets
├── scripts/                  # Utility scripts
├── package.json
├── vite.config.js
├── tailwind.config.ts
├── tsconfig.json
├── eslint.config.js
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/hackathon-event-app.git
   cd hackathon-event-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   ```bash
   # Create environment file
   cp .env.example .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The application will be available at `http://localhost:5173`

### Backend Setup (Email Service)

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Configure email settings**
   ```bash
   # Create environment file
   cp .env.example .env
   ```

   Edit `.env` with your email configuration:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   PORT=3001
   ```

4. **Start email service**
   ```bash
   npm start
   ```

### Email Configuration

#### For Gmail:
1. Enable 2-factor authentication on your Google account
2. Generate an App Password in your Google account settings
3. Use the App Password as `EMAIL_PASS` in your `.env` file

#### For other email providers:
Update the SMTP configuration in `backend/server.js`:
```javascript
const transporter = nodemailer.createTransporter({
  service: 'your-email-service',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

## 📖 Usage Instructions

### For Event Attendees

1. **Browse Events**
   - Visit the homepage to see featured events
   - Use the search bar for instant event discovery
   - Filter events by category, location, and date

2. **View Event Details**
   - Click on any event card to see detailed information
   - Review event schedule, pricing, and organizer details
   - Check availability and registration requirements

3. **Register for Events**
   - Click "Register" on an event page
   - Fill in personal information and select tickets
   - Complete payment if required
   - Receive confirmation email with ticket details

4. **Manage Tickets**
   - Access "View Your Tickets" from the navigation
   - Search tickets by name or email
   - View QR codes for event entry

### For Event Organizers

1. **Create an Event**
   - Click "Create Event" in the navigation
   - Follow the 6-step wizard:
     - Organizer information
     - Basic event details
     - Schedule setup
     - Location configuration
     - Pricing and capacity
     - Additional information

2. **Manage Your Events**
   - Go to "Manage Event" page
   - Enter your Event ID and email
   - Request OTP verification
   - Access full event management features

3. **Event Management Features**
   - Edit event details
   - View registration statistics
   - Manage attendee information
   - Update pricing and capacity

### Platform Features

1. **Language Switching**
   - Click the globe icon in the header
   - Choose between English and Thai

2. **Theme Switching**
   - Click the sun/moon icon in the header
   - Toggle between light and dark themes

3. **Dashboard Analytics**
   - View platform statistics on the homepage
   - See event distribution by category
   - Track registration trends

## 🤝 Contribution Guidelines

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add TypeScript types for new features
   - Update documentation as needed

4. **Test your changes**
   ```bash
   npm run build
   npm run preview
   ```

5. **Commit your changes**
   ```bash
   git commit -m "Add: Brief description of your changes"
   ```

6. **Push to your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Provide a clear description of your changes
   - Reference any related issues

### Code Standards

- **TypeScript**: Use strict type checking
- **ESLint**: Follow the configured linting rules
- **Component Structure**: Use functional components with hooks
- **Styling**: Use Tailwind CSS classes and shadcn/ui components
- **Naming**: Use descriptive, camelCase naming conventions

### Testing

- Test components on different screen sizes
- Verify functionality in both light and dark themes
- Test multi-language support
- Ensure email services work correctly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact Information

**Project Maintainers:**
- **Developer**: [Your Name]
- **Email**: your-email@example.com
- **GitHub**: [https://github.com/your-username](https://github.com/your-username)

**Project Links:**
- **Repository**: [https://github.com/your-username/hackathon-event-app](https://github.com/your-username/hackathon-event-app)
- **Issues**: [https://github.com/your-username/hackathon-event-app/issues](https://github.com/your-username/hackathon-event-app/issues)
- **Documentation**: [https://github.com/your-username/hackathon-event-app/wiki](https://github.com/your-username/hackathon-event-app/wiki)

---

**Built with ❤️ using React, TypeScript, and modern web technologies**


*Empowering event organizers and attendees with seamless event management solutions*