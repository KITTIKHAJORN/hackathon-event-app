import { Calendar, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-hero text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">EventHub</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              แพลตฟอร์มจัดการอีเวนต์ที่ครบครันและใช้งานง่าย 
              สำหรับผู้จัดงานและผู้เข้าร่วมอีเวนต์
            </p>
            <div className="flex gap-4">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-primary cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-primary cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">ลิงก์ด่วน</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-primary transition-colors">หน้าหลัก</Link></li>
              <li><Link to="/events" className="text-gray-300 hover:text-primary transition-colors">อีเวนต์ทั้งหมด</Link></li>
              <li><Link to="/create-event" className="text-gray-300 hover:text-primary transition-colors">สร้างอีเวนต์</Link></li>
              <li><Link to="/profile" className="text-gray-300 hover:text-primary transition-colors">โปรไฟล์</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">หมวดหมู่</h3>
            <ul className="space-y-2">
              <li><Link to="/events?category=conference" className="text-gray-300 hover:text-primary transition-colors">การประชุม</Link></li>
              <li><Link to="/events?category=workshop" className="text-gray-300 hover:text-primary transition-colors">อบรม/ฝึกอบรม</Link></li>
              <li><Link to="/events?category=concert" className="text-gray-300 hover:text-primary transition-colors">คอนเสิร์ต</Link></li>
              <li><Link to="/events?category=exhibition" className="text-gray-300 hover:text-primary transition-colors">นิทรรศการ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">ติดต่อเรา</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-gray-300 text-sm">info@eventhub.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-gray-300 text-sm">02-xxx-xxxx</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-gray-300 text-sm">กรุงเทพมหานคร, ประเทศไทย</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2024 EventHub. สงวนลิขสิทธิ์ทั้งหมด
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="text-gray-400 hover:text-primary transition-colors">นโยบายความเป็นส่วนตัว</Link>
            <Link to="/terms" className="text-gray-400 hover:text-primary transition-colors">ข้อกำหนดการใช้งาน</Link>
            <Link to="/help" className="text-gray-400 hover:text-primary transition-colors">ช่วยเหลือ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;