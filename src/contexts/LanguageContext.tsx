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