import { Search, Calendar, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">EventHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              หน้าหลัก
            </Link>
            <Link to="/events" className="text-foreground hover:text-primary transition-colors">
              อีเวนต์ทั้งหมด
            </Link>
            <Link to="/create-event" className="text-foreground hover:text-primary transition-colors">
              สร้างอีเวนต์
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex items-center bg-muted rounded-xl px-4 py-2 w-80">
            <Search className="w-4 h-4 text-muted-foreground mr-2" />
            <input 
              type="text" 
              placeholder="ค้นหาอีเวนต์..." 
              className="bg-transparent outline-none text-sm flex-1 text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Search Icon - Mobile */}
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Search className="w-5 h-5" />
            </Button>

            {/* Auth Buttons */}
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="outline" size="sm">
                เข้าสู่ระบบ
              </Button>
              <Button variant="default" size="sm">
                ลงทะเบียน
              </Button>
            </div>

            {/* Profile */}
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>

            {/* Mobile Menu Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <Link 
                to="/" 
                className="text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                หน้าหลัก
              </Link>
              <Link 
                to="/events" 
                className="text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                อีเวนต์ทั้งหมด
              </Link>
              <Link 
                to="/create-event" 
                className="text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                สร้างอีเวนต์
              </Link>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  เข้าสู่ระบบ
                </Button>
                <Button variant="default" size="sm" className="flex-1">
                  ลงทะเบียน
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;