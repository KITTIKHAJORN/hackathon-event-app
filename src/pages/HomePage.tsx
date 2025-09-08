import { Search, Calendar, MapPin, Users, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import EventCard from "@/components/event/EventCard";
import SearchBar from "@/components/common/SearchBar";
import heroBanner from "@/assets/hero-banner.jpg";
import techConference from "@/assets/tech-conference.jpg";
import musicFestival from "@/assets/music-festival.jpg";
import workshop from "@/assets/workshop.jpg";

const HomePage = () => {
  // Mock data for featured events
  const featuredEvents = [
    {
      id: "1",
      title: "Tech Conference Bangkok 2024",
      description: "การประชุมเทคโนโลยีที่ใหญ่ที่สุดในเอเชียตะวันออกเฉียงใต้ มาร่วมเรียนรู้เทรนด์เทคโนโลยีล่าสุด",
      image: techConference,
      date: "15 มีนาคม 2024",
      time: "09:00 - 17:00",
      location: "Impact Muang Thong Thani",
      category: "การประชุม",
      price: 2500,
      attendees: 850,
      maxAttendees: 1000,
      isOnline: false
    },
    {
      id: "2",
      title: "Green Festival 2024",
      description: "เทศกาลดนตรีเพื่อสิ่งแวดล้อม ร่วมสร้างสำนึกรักษ์โลกไปพร้อมกับดนตรีสุดมันส์",
      image: musicFestival,
      date: "22 มีนาคม 2024",
      time: "16:00 - 23:00",
      location: "Lumpini Park",
      category: "คอนเสิร์ต",
      price: 1200,
      attendees: 2500,
      maxAttendees: 3000,
      isOnline: false
    },
    {
      id: "3",
      title: "Digital Marketing Workshop",
      description: "อบรมเชิงปฏิบัติการด้านการตลาดดิจิทัล เรียนรู้เทคนิคล่าสุดจากผู้เชี่ยวชาญ",
      image: workshop,
      date: "28 มีนาคม 2024",
      time: "13:00 - 17:00",
      location: "Online Workshop",
      category: "อบรม",
      price: 0,
      attendees: 180,
      maxAttendees: 200,
      isOnline: true
    }
  ];

  const categories = [
    { name: "การประชุม", icon: Users, count: 45, color: "bg-blue-500" },
    { name: "อบรม", icon: Calendar, count: 32, color: "bg-purple-500" },
    { name: "คอนเสิร์ต", icon: Sparkles, count: 18, color: "bg-pink-500" },
    { name: "นิทรรศการ", icon: MapPin, count: 12, color: "bg-orange-500" }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Hero Background */}
        <div className="absolute inset-0">
          <img 
            src={heroBanner} 
            alt="Event Management Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-hero opacity-70" />
        </div>

        {/* Hero Content */}
        <div className="relative container mx-auto px-4 py-20 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            ค้นพบอีเวนต์
            <span className="text-primary block">ที่คุณรักได้ที่นี่</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
            แพลตฟอร์มจัดการอีเวนต์ที่ครบครัน เชื่อมต่อผู้จัดงานและผู้เข้าร่วม
            พร้อมประสบการณ์ที่ไม่เหมือนใคร
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar showFilter={false} />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">1,234</div>
              <div className="text-gray-300">อีเวนต์ทั้งหมด</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">25,678</div>
              <div className="text-gray-300">ผู้เข้าร่วม</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">890</div>
              <div className="text-gray-300">ผู้จัดงาน</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">4.8</div>
              <div className="text-gray-300">คะแนนเฉลี่ย</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              หมวดหมู่อีเวนต์ยอดนิยม
            </h2>
            <p className="text-muted-foreground text-lg">
              เลือกหมวดหมู่ที่คุณสนใจและค้นพบอีเวนต์ที่ตรงใจ
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link 
                key={index} 
                to={`/events?category=${encodeURIComponent(category.name)}`}
                className="group"
              >
                <div className="bg-card rounded-2xl p-6 shadow-card hover:shadow-glow transition-all duration-300 hover:-translate-y-1 text-center">
                  <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {category.count} อีเวนต์
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                อีเวนต์แนะนำ
              </h2>
              <p className="text-muted-foreground text-lg">
                อีเวนต์คุณภาพสูงที่คัดสรรมาเป็นพิเศษ
              </p>
            </div>
            <Link to="/events">
              <Button variant="outline" className="gap-2">
                ดูทั้งหมด
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            พร้อมจัดอีเวนต์ของคุณแล้วหรือยัง?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            เริ่มต้นสร้างอีเวนต์ที่น่าจดจำด้วยเครื่องมือที่ครบครันและใช้งานง่าย
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/create-event">
              <Button variant="hero" size="lg" className="gap-2">
                <Calendar className="w-5 h-5" />
                สร้างอีเวนต์
              </Button>
            </Link>
            <Link to="/events">
              <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                เริ่มเข้าร่วมอีเวนต์
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;