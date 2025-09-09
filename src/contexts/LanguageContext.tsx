import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "th";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    home: "Home",
    events: "Events",
    createEvent: "Create Event",
    manageEvent: "Manage Event",
    
    // Common
    search: "Search",
    filter: "Filter",
    category: "Category",
    date: "Date",
    location: "Location",
    price: "Price",
    free: "Free",
    
    // Homepage
    heroTitle: "Discover Amazing Events",
    heroSubtitle: "Find and join the most exciting hackathons, conferences, and workshops",
    featuredEvents: "Featured Events",
    categories: "Categories",
    
    // Event categories
    technology: "Technology",
    music: "Music",
    workshop: "Workshop",
    conference: "Conference",
    
    // Event details
    eventDetails: "Event Details",
    register: "Register",
    share: "Share",
    
    // Theme toggle
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
  },
  th: {
    // Navigation
    home: "หน้าแรก",
    events: "อีเวนต์",
    createEvent: "สร้างอีเวนต์",
    manageEvent: "จัดการอีเวนต์",
    
    // Common
    search: "ค้นหา",
    filter: "กรอง",
    category: "หมวดหมู่",
    date: "วันที่",
    location: "สถานที่",
    price: "ราคา",
    free: "ฟรี",
    
    // Homepage
    heroTitle: "ค้นพบอีเวนต์ที่น่าสนใจ",
    heroSubtitle: "ค้นหาและเข้าร่วมแฮคคาธอน การประชุม และเวิร์คช็อปที่น่าตื่นเต้นที่สุด",
    featuredEvents: "อีเวนต์แนะนำ",
    categories: "หมวดหมู่",
    
    // Event categories
    technology: "เทคโนโลยี",
    music: "ดนตรี",
    workshop: "เวิร์คช็อป",
    conference: "การประชุม",
    
    // Event details
    eventDetails: "รายละเอียดอีเวนต์",
    register: "ลงทะเบียน",
    share: "แชร์",
    
    // Theme toggle
    lightMode: "โหมดสว่าง",
    darkMode: "โหมดมืด",
  },
};
    
    // Common
    search: "Search",
    filter: "Filter",
    category: "Category",
    date: "Date",
    location: "Location",
    price: "Price",
    free: "Free",
    loading: "Loading",
    error: "Error",
    success: "Success",
    clear: "Clear",
    cancel: "Cancel",
    confirm: "Confirm",
    save: "Save",
    edit: "Edit",
    delete: "Delete",
    next: "Next",
    previous: "Previous",
    submit: "Submit",
    
    // Homepage
    heroTitle: "Discover Amazing Events",
    heroSubtitle: "Find and join the most exciting hackathons, conferences, and workshops",
    featuredEvents: "Featured Events",
    categories: "Categories",
    searchEventsPlaceholder: "Search events by name...",
    searching: "Searching...",
    clearSearch: "Clear Search",
    noEventsFound: "No Events Found",
    searchResultsFor: "Search Results for",
    found: "Found",
    eventsMatching: "event(s) matching",
    exploreEventsByCategory: "Explore events by category",
    viewAllEvents: "View All Events",
    discoverHandpicked: "Discover our handpicked selection of amazing events",
    noFeaturedEvents: "No featured events available at the moment.",
    
    // Event categories
    technology: "Technology",
    music: "Music",
    workshop: "Workshop",
    conference: "Conference",
    
    // Event details
    eventDetails: "Event Details",
    register: "Register",
    share: "Share",
    eventId: "Event ID",
    organizer: "Organizer",
    capacity: "Capacity",
    available: "Available",
    registered: "Registered",
    startDate: "Start Date",
    endDate: "End Date",
    startTime: "Start Time",
    endTime: "End Time",
    venue: "Venue",
    address: "Address",
    online: "Online",
    onsite: "On-site",
    hybrid: "Hybrid",
    
    // View Tickets Page
    viewYourTicketsTitle: "View Your Tickets",
    enterUsernameToView: "Enter your username to view all your event tickets",
    searchForYourTickets: "Search for Your Tickets",
    usernameOrEmail: "Username or Email",
    enterUsernameEmailPlaceholder: "Enter your username or email address",
    searchTickets: "Search Tickets",
    usernameRequired: "Username Required",
    pleaseEnterUsername: "Please enter your username to search for tickets.",
    noTicketsFound: "No Tickets Found",
    noTicketsFoundDesc: "No tickets found for username",
    pleaseCheckUsername: "Please check your username and try again.",
    ticketsFound: "Tickets Found",
    foundTickets: "Found",
    ticketsFor: "ticket(s) for",
    searchError: "Search Error",
    failedToFetchTickets: "Failed to fetch tickets from server. Please try again.",
    yourTickets: "Your Tickets",
    showingResultsFor: "Showing results for",
    ticketNumber: "Ticket #",
    name: "Name",
    email: "Email",
    phone: "Phone",
    ticketType: "Ticket Type",
    quantity: "Quantity",
    totalAmount: "Total Amount",
    purchaseDate: "Purchase Date",
    showQRCode: "Show QR Code",
    confirmed: "Confirmed",
    pending: "Pending",
    cancelled: "Cancelled",
    used: "Used",
    noTicketsAssociated: "We couldn't find any tickets associated with",
    checkUsernameEmail: "Please check your username or email and try again.",
    
    // Search and filters
    searchEvents: "Search Events",
    allCategories: "All Categories",
    allLocations: "All Locations",
    priceRange: "Price Range",
    dateRange: "Date Range",
    applyFilters: "Apply Filters",
    resetFilters: "Reset Filters",
    sortBy: "Sort By",
    sortByDate: "Sort by Date",
    sortByPrice: "Sort by Price",
    sortByPopularity: "Sort by Popularity",
    
    // Event creation
    createEventTitle: "Create New Event",
    basicInformation: "Basic Information",
    eventTitle: "Event Title",
    eventDescription: "Event Description",
    eventCategory: "Event Category",
    dateLocation: "Date & Location",
    eventDate: "Event Date",
    eventTime: "Event Time",
    eventLocation: "Event Location",
    isOnlineEvent: "Is this an online event?",
    pricingCapacity: "Pricing & Capacity",
    maxAttendees: "Maximum Attendees",
    ticketPricing: "Ticket Pricing",
    addTicketType: "Add Ticket Type",
    ticketPrice: "Ticket Price",
    ticketDescription: "Ticket Description",
    additionalInfo: "Additional Information",
    eventImage: "Event Image",
    eventTags: "Event Tags",
    addTag: "Add Tag",
    creatorEmail: "Creator Email",
    stepOf: "Step {current} of {total}",
    
    // Form validation
    required: "Required",
    invalidEmail: "Invalid email format",
    invalidDate: "Invalid date",
    invalidTime: "Invalid time",
    minimumPrice: "Price must be 0 or greater",
    minimumCapacity: "Capacity must be at least 1",
    
    // Notifications
    eventCreatedSuccess: "Event created successfully!",
    eventUpdatedSuccess: "Event updated successfully!",
    eventDeletedSuccess: "Event deleted successfully!",
    registrationSuccess: "Registration successful!",
    registrationFailed: "Registration failed. Please try again.",
    loadingEvents: "Loading events...",
    loadingEventDetails: "Loading event details...",
    failedToLoadEvents: "Failed to load events. Please try again later.",
    failedToLoadEventDetails: "Failed to load event details. Please try again later.",
    
    // Theme toggle
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    
    // Footer
    aboutUs: "About Us",
    contactUs: "Contact Us",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    followUs: "Follow Us",
    
    // Time and date formatting
    today: "Today",
    tomorrow: "Tomorrow",
    yesterday: "Yesterday",
    thisWeek: "This Week",
    nextWeek: "Next Week",
    thisMonth: "This Month",
    nextMonth: "Next Month",
    
    // Event Detail Page
    backToEvents: "Back to Events",
    organizedBy: "Organized by",
    requirements: "Requirements",
    speakers: "Speakers",
    artists: "Artists",
    tracks: "Tracks",
    activities: "Activities",
    includes: "Includes",
    distances: "Distances",
    distance: "Distance",
    startTimeLabel: "Start",
    virtualEvent: "Virtual Event",
    onlineEvent: "Online Event",
    spotsLeft: "spots left",
    soldOut: "Sold Out",
    
    // Events Page
    allEvents: "All Events",
    filterEvents: "Filter Events",
    showFilters: "Show Filters",
    hideFilters: "Hide Filters",
    noEventsFoundMessage: "No events found matching your criteria.",
    tryDifferentFilters: "Try adjusting your filters to see more events.",
    
    // Create Event Page
    creatorInformation: "Creator Information",
    emailAddress: "Email Address",
    enterValidEmail: "Enter a valid email address",
    enterEventTitle: "Enter event title",
    describeYourEvent: "Describe your event",
    selectCategory: "Select category",
    selectDate: "Select date",
    selectTime: "Select time",
    enterLocation: "Enter location",
    enterAddress: "Enter address (optional)",
    maxAttendeesNumber: "Maximum number of attendees",
    addNewTicketType: "Add New Ticket Type",
    removeTicketType: "Remove Ticket Type",
    ticketTypeLabel: "Ticket Type",
    priceInTHB: "Price (THB)",
    freeTicket: "0 for free",
    whatsIncluded: "What's included in this ticket?",
    eventImageOptional: "Event Image (Optional)",
    addTags: "Add Tags",
    enterTag: "Enter a tag",
    createYourEvent: "Create Your Event",
    backButton: "Back",
    nextButton: "Next",
    
    // Event Management
    manageYourEvent: "Manage Your Event",
    verifyAccess: "Verify Access",
    enterEventId: "Enter Event ID",
    enterOTP: "Enter OTP",
    verifyOTP: "Verify OTP",
    eventInformation: "Event Information",
    title: "Title",
    description: "Description",
    dateTime: "Date & Time",
    at: "at",
    capacity: "Capacity",
    registeredSlash: "registered",
    eventActions: "Event Actions",
    editEvent: "Edit Event",
    deleteEvent: "Delete Event",
    regenerateOTP: "Regenerate OTP",
    
    // Footer
    company: "Company",
    
    // Form Validation
    pleaseEnterValidEmail: "Please enter a valid email address",
    pleaseEnterEventTitle: "Please enter an event title",
    pleaseEnterDescription: "Please enter a description",
    pleaseSelectCategory: "Please select a category",
    pleaseSelectDate: "Please select a date",
    pleaseSelectTime: "Please select a time",
    pleaseEnterLocation: "Please enter a location",
    pleaseEnterMaxAttendees: "Please enter maximum attendees",
  },
  th: {
    // Navigation
    home: "หน้าแรก",
    events: "อีเวนต์",
    createEvent: "สร้างอีเวนต์",
    manageEvent: "จัดการอีเวนต์",
    viewYourTickets: "ดูตั๋วของคุณ",
    
    // Common
    search: "ค้นหา",
    filter: "กรอง",
    category: "หมวดหมู่",
    date: "วันที่",
    location: "สถานที่",
    price: "ราคา",
    free: "ฟรี",
    loading: "กำลังโหลด",
    error: "ข้อผิดพลาด",
    success: "สำเร็จ",
    clear: "ล้าง",
    cancel: "ยกเลิก",
    confirm: "ยืนยัน",
    save: "บันทึก",
    edit: "แก้ไข",
    delete: "ลบ",
    next: "ถัดไป",
    previous: "ก่อนหน้า",
    submit: "ส่ง",
    
    // Homepage
    heroTitle: "ค้นพบอีเวนต์ที่น่าสนใจ",
    heroSubtitle: "ค้นหาและเข้าร่วมแฮคคาธอน การประชุม และเวิร์คช็อปที่น่าตื่นเต้นที่สุด",
    featuredEvents: "อีเวนต์แนะนำ",
    categories: "หมวดหมู่",
    searchEventsPlaceholder: "ค้นหาอีเวนต์ตามชื่อ...",
    searching: "กำลังค้นหา...",
    clearSearch: "ล้างการค้นหา",
    noEventsFound: "ไม่พบอีเวนต์",
    searchResultsFor: "ผลการค้นหาสำหรับ",
    found: "พบ",
    eventsMatching: "อีเวนต์ที่ตรงกับ",
    exploreEventsByCategory: "สำรวจอีเวนต์ตามหมวดหมู่",
    viewAllEvents: "ดูอีเวนต์ทั้งหมด",
    discoverHandpicked: "ค้นพบอีเวนต์ที่คัดสรรมาเป็นพิเศษ",
    noFeaturedEvents: "ไม่มีอีเวนต์แนะนำในขณะนี้",
    
    // Event categories
    technology: "เทคโนโลยี",
    music: "ดนตรี",
    workshop: "เวิร์คช็อป",
    conference: "การประชุม",
    
    // Event details
    eventDetails: "รายละเอียดอีเวนต์",
    register: "ลงทะเบียน",
    share: "แชร์",
    eventId: "รหัสอีเวนต์",
    organizer: "ผู้จัดงาน",
    capacity: "ความจุ",
    available: "ที่ว่าง",
    registered: "ลงทะเบียนแล้ว",
    startDate: "วันที่เริ่ม",
    endDate: "วันที่สิ้นสุด",
    startTime: "เวลาเริ่ม",
    endTime: "เวลาสิ้นสุด",
    venue: "สถานที่จัดงาน",
    address: "ที่อยู่",
    online: "ออนไลน์",
    onsite: "ที่สถานที่จัดงาน",
    hybrid: "แบบผสม",
    
    // View Tickets Page
    viewYourTicketsTitle: "ดูตั๋วของคุณ",
    enterUsernameToView: "กรอกชื่อผู้ใช้เพื่อดูตั๋วอีเวนต์ทั้งหมดของคุณ",
    searchForYourTickets: "ค้นหาตั๋วของคุณ",
    usernameOrEmail: "ชื่อผู้ใช้หรืออีเมล",
    enterUsernameEmailPlaceholder: "กรอกชื่อผู้ใช้หรือที่อยู่อีเมลของคุณ",
    searchTickets: "ค้นหาตั๋ว",
    usernameRequired: "ต้องการชื่อผู้ใช้",
    pleaseEnterUsername: "กรุณากรอกชื่อผู้ใช้เพื่อค้นหาตั๋ว",
    noTicketsFound: "ไม่พบตั๋ว",
    noTicketsFoundDesc: "ไม่พบตั๋วสำหรับชื่อผู้ใช้",
    pleaseCheckUsername: "กรุณาตรวจสอบชื่อผู้ใช้และลองใหม่อีกครั้ง",
    ticketsFound: "พบตั๋ว",
    foundTickets: "พบ",
    ticketsFor: "ตั๋วสำหรับ",
    searchError: "ข้อผิดพลาดในการค้นหา",
    failedToFetchTickets: "ไม่สามารถดึงข้อมูลตั๋วจากเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง",
    yourTickets: "ตั๋วของคุณ",
    showingResultsFor: "แสดงผลลัพธ์สำหรับ",
    ticketNumber: "ตั๋วหมายเลข",
    name: "ชื่อ",
    email: "อีเมล",
    phone: "โทรศัพท์",
    ticketType: "ประเภทตั๋ว",
    quantity: "จำนวน",
    totalAmount: "จำนวนเงินรวม",
    purchaseDate: "วันที่ซื้อ",
    showQRCode: "แสดง QR Code",
    confirmed: "ยืนยันแล้ว",
    pending: "รอดำเนินการ",
    cancelled: "ยกเลิก",
    used: "ใช้แล้ว",
    noTicketsAssociated: "เราไม่พบตั๋วที่เกี่ยวข้องกับ",
    checkUsernameEmail: "กรุณาตรวจสอบชื่อผู้ใช้หรืออีเมลและลองใหม่อีกครั้ง",
    
    // Search and filters
    searchEvents: "ค้นหาอีเวนต์",
    allCategories: "หมวดหมู่ทั้งหมด",
    allLocations: "สถานที่ทั้งหมด",
    priceRange: "ช่วงราคา",
    dateRange: "ช่วงวันที่",
    applyFilters: "ใช้ตัวกรอง",
    resetFilters: "รีเซ็ตตัวกรอง",
    sortBy: "เรียงตาม",
    sortByDate: "เรียงตามวันที่",
    sortByPrice: "เรียงตามราคา",
    sortByPopularity: "เรียงตามความนิยม",
    
    // Event creation
    createEventTitle: "สร้างอีเวนต์ใหม่",
    basicInformation: "ข้อมูลพื้นฐาน",
    eventTitle: "ชื่ออีเวนต์",
    eventDescription: "รายละเอียดอีเวนต์",
    eventCategory: "หมวดหมู่อีเวนต์",
    dateLocation: "วันที่และสถานที่",
    eventDate: "วันที่อีเวนต์",
    eventTime: "เวลาอีเวนต์",
    eventLocation: "สถานที่อีเวนต์",
    isOnlineEvent: "นี่เป็นอีเวนต์ออนไลน์หรือไม่?",
    pricingCapacity: "ราคาและความจุ",
    maxAttendees: "ผู้เข้าร่วมสูงสุด",
    ticketPricing: "ราคาตั๋ว",
    addTicketType: "เพิ่มประเภทตั๋ว",
    ticketPrice: "ราคาตั๋ว",
    ticketDescription: "รายละเอียดตั๋ว",
    additionalInfo: "ข้อมูลเพิ่มเติม",
    eventImage: "รูปภาพอีเวนต์",
    eventTags: "แท็กอีเวนต์",
    addTag: "เพิ่มแท็ก",
    creatorEmail: "อีเมลผู้สร้าง",
    stepOf: "ขั้นตอนที่ {current} จาก {total}",
    
    // Form validation
    required: "จำเป็น",
    invalidEmail: "รูปแบบอีเมลไม่ถูกต้อง",
    invalidDate: "วันที่ไม่ถูกต้อง",
    invalidTime: "เวลาไม่ถูกต้อง",
    minimumPrice: "ราคาต้องเป็น 0 หรือมากกว่า",
    minimumCapacity: "ความจุต้องอย่างน้อย 1",
    
    // Notifications
    eventCreatedSuccess: "สร้างอีเวนต์สำเร็จ!",
    eventUpdatedSuccess: "อัปเดตอีเวนต์สำเร็จ!",
    eventDeletedSuccess: "ลบอีเวนต์สำเร็จ!",
    registrationSuccess: "ลงทะเบียนสำเร็จ!",
    registrationFailed: "การลงทะเบียนล้มเหลว กรุณาลองใหม่อีกครั้ง",
    loadingEvents: "กำลังโหลดอีเวนต์...",
    loadingEventDetails: "กำลังโหลดรายละเอียดอีเวนต์...",
    failedToLoadEvents: "ไม่สามารถโหลดอีเวนต์ได้ กรุณาลองใหม่ภายหลัง",
    failedToLoadEventDetails: "ไม่สามารถโหลดรายละเอียดอีเวนต์ได้ กรุณาลองใหม่ภายหลัง",
    
    // Theme toggle
    lightMode: "โหมดสว่าง",
    darkMode: "โหมดมืด",
    
    // Footer
    aboutUs: "เกี่ยวกับเรา",
    contactUs: "ติดต่อเรา",
    privacyPolicy: "นโยบายความเป็นส่วนตัว",
    termsOfService: "ข้อกำหนดการใช้บริการ",
    followUs: "ติดตามเรา",
    
    // Time and date formatting
    today: "วันนี้",
    tomorrow: "พรุ่งนี้",
    yesterday: "เมื่อวาน",
    thisWeek: "สัปดาห์นี้",
    nextWeek: "สัปดาห์หน้า",
    thisMonth: "เดือนนี้",
    nextMonth: "เดือนหน้า",
    
    // Event Detail Page
    backToEvents: "กลับไปยังอีเวนต์",
    organizedBy: "จัดโดย",
    requirements: "ข้อกำหนด",
    speakers: "วิทยากร",
    artists: "ศิลปิน",
    tracks: "ช่วงการแสดง",
    activities: "กิจกรรม",
    includes: "รวม",
    distances: "ระยะทาง",
    distance: "ระยะทาง",
    startTimeLabel: "เริ่ม",
    virtualEvent: "อีเวนต์เสมือนจริง",
    onlineEvent: "อีเวนต์ออนไลน์",
    spotsLeft: "ที่นั่งเหลือ",
    soldOut: "เต็มแล้ว",
    
    // Events Page
    allEvents: "อีเวนต์ทั้งหมด",
    filterEvents: "กรองอีเวนต์",
    showFilters: "แสดงตัวกรอง",
    hideFilters: "ซ่อนตัวกรอง",
    noEventsFoundMessage: "ไม่พบอีเวนต์ที่ตรงกับเกณฑ์ของคุณ",
    tryDifferentFilters: "ลองปรับเปลี่ยนตัวกรองเพื่อดูอีเวนต์เพิ่มเติม",
    
    // Create Event Page
    creatorInformation: "ข้อมูลผู้สร้าง",
    emailAddress: "ที่อยู่อีเมล",
    enterValidEmail: "กรอกที่อยู่อีเมลที่ถูกต้อง",
    enterEventTitle: "กรอกชื่ออีเวนต์",
    describeYourEvent: "บรรยายเกี่ยวกับอีเวนต์ของคุณ",
    selectCategory: "เลือกหมวดหมู่",
    selectDate: "เลือกวันที่",
    selectTime: "เลือกเวลา",
    enterLocation: "กรอกสถานที่",
    enterAddress: "กรอกที่อยู่ (ไม่บังคับ)",
    maxAttendeesNumber: "จำนวนผู้เข้าร่วมสูงสุด",
    addNewTicketType: "เพิ่มประเภทตั๋วใหม่",
    removeTicketType: "ลบประเภทตั๋ว",
    ticketTypeLabel: "ประเภทตั๋ว",
    priceInTHB: "ราคา (บาท)",
    freeTicket: "0 สำหรับฟรี",
    whatsIncluded: "มีอะไรรวมอยู่ในตั๋วนี้?",
    eventImageOptional: "รูปภาพอีเวนต์ (ไม่บังคับ)",
    addTags: "เพิ่มแท็ก",
    enterTag: "กรอกแท็ก",
    createYourEvent: "สร้างอีเวนต์ของคุณ",
    backButton: "ย้อนกลับ",
    nextButton: "ถัดไป",
    
    // Event Management
    manageYourEvent: "จัดการอีเวนต์ของคุณ",
    verifyAccess: "ยืนยันการเข้าถึง",
    enterEventId: "กรอกรหัสอีเวนต์",
    enterOTP: "กรอก OTP",
    verifyOTP: "ยืนยัน OTP",
    eventInformation: "ข้อมูลอีเวนต์",
    title: "หัวข้อ",
    description: "คำอธิบาย",
    dateTime: "วันที่และเวลา",
    at: "เวลา",
    capacity: "ความจุ",
    registeredSlash: "ลงทะเบียนแล้ว",
    eventActions: "การดำเนินการอีเวนต์",
    editEvent: "แก้ไขอีเวนต์",
    deleteEvent: "ลบอีเวนต์",
    regenerateOTP: "สร้าง OTP ใหม่",
    
    // Footer
    company: "บริษัท",
    
    // Form Validation
    pleaseEnterValidEmail: "กรุณากรอกที่อยู่อีเมลที่ถูกต้อง",
    pleaseEnterEventTitle: "กรุณากรอกชื่ออีเวนต์",
    pleaseEnterDescription: "กรุณากรอกคำอธิบาย",
    pleaseSelectCategory: "กรุณาเลือกหมวดหมู่",
    pleaseSelectDate: "กรุณาเลือกวันที่",
    pleaseSelectTime: "กรุณาเลือกเวลา",
    pleaseEnterLocation: "กรุณากรอกสถานที่",
    pleaseEnterMaxAttendees: "กรุณากรอกจำนวนผู้เข้าร่วมสูงสุด",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "th")) {
      setLanguage(savedLanguage);
    }
  }, []);

  const setLanguageAndSave = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: setLanguageAndSave, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}