import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, MapPin, Users, Clock, Star, Share2, Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import techConference from "@/assets/tech-conference.jpg";
import musicFestival from "@/assets/music-festival.jpg";
import workshop from "@/assets/workshop.jpg";

const EventDetailPage = () => {
  const { id } = useParams();
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Mock event data - in real app would fetch from API
  const event = {
    id: "1",
    title: "Tech Conference Bangkok 2024",
    description: "การประชุมเทคโนโลยีที่ใหญ่ที่สุดในเอเชียตะวันออกเฉียงใต้ มาร่วมเรียนรู้เทรนด์เทคโนโลยีล่าสุดจากผู้เชี่ยวชาญระดับโลก พบกับเซสชันที่หลากหลาย ตั้งแต่ AI, Machine Learning, Cloud Computing, Cybersecurity และอีกมากมาย",
    fullDescription: "งานประชุมเทคโนโลยีที่ยิ่งใหญ่ที่สุดในภูมิภาคเอเชียตะวันออกเฉียงใต้ กลับมาอีกครั้งในปี 2024 ด้วยเนื้อหาที่อัดแน่นไปด้วยความรู้และนวัตกรรมล่าสุด\n\nในงานนี้จะมีผู้เชี่ยวชาญกว่า 50 ท่านจากบริษัทชั้นนำทั่วโลก มาแบ่งปันประสบการณ์และความรู้ในด้านต่างๆ ได้แก่:\n\n• Artificial Intelligence & Machine Learning\n• Cloud Computing & DevOps\n• Cybersecurity & Privacy\n• Blockchain & Web3\n• Mobile Development\n• Data Science & Analytics\n\nนอกจากเซสชันการบรรยายแล้ว ยังมีกิจกรรมเสริมอื่นๆ เช่น Workshop แบบ hands-on, Exhibition Zone สำหรับบริษัทเทคโนโลยี และ Networking Session สำหรับการสร้างเครือข่าย",
    images: [techConference, musicFestival, workshop],
    date: "15 มีนาคม 2024",
    time: "09:00 - 17:00",
    location: "Impact Muang Thong Thani",
    address: "99 หมู่ 1 ตำบลบางพูด อำเภอปากเกร็ด นนทบุรี 11120",
    category: "การประชุม",
    organizer: "Tech Events Thailand",
    attendees: 850,
    maxAttendees: 1000,
    rating: 4.8,
    reviewCount: 245,
    isOnline: false,
    tags: ["Technology", "AI", "Machine Learning", "Cloud", "Networking"],
    tickets: [
      { type: "Early Bird", price: 1990, originalPrice: 2500, available: 0, description: "ราคาพิเศษสำหรับผู้จองก่อน 1 มีนาคม" },
      { type: "Regular", price: 2500, available: 150, description: "ตั๋วมาตรฐาน รวมอาหารเที่ยงและเครื่องดื่ม" },
      { type: "VIP", price: 4500, available: 25, description: "รวม VIP Lounge, Premium Lunch และ Networking Dinner" }
    ],
    schedule: [
      { time: "09:00 - 09:30", title: "ลงทะเบียนและรับของที่ระลึก" },
      { time: "09:30 - 10:30", title: "Keynote: The Future of AI" },
      { time: "10:45 - 11:45", title: "Cloud Computing Best Practices" },
      { time: "13:00 - 14:00", title: "อาหารเที่ยงและ Networking" },
      { time: "14:00 - 15:00", title: "Machine Learning in Production" },
      { time: "15:15 - 16:15", title: "Cybersecurity Trends 2024" },
      { time: "16:15 - 17:00", title: "Panel Discussion & Q&A" }
    ]
  };

  const progressPercent = (event.attendees / event.maxAttendees) * 100;
  const availableTickets = event.tickets.reduce((sum, ticket) => sum + ticket.available, 0);

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Back Button */}
        <div className="container mx-auto px-4 pt-4">
          <Link to="/events" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>กลับไปหน้าอีเวนต์</span>
          </Link>
        </div>

        {/* Hero Image */}
        <div className="relative h-[400px] overflow-hidden">
          <img 
            src={event.images[0]} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-8 left-0 right-0">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  {event.category}
                </span>
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-white text-sm">{event.rating} ({event.reviewCount} รีวิว)</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{event.title}</h1>
              <p className="text-white/90 text-lg">{event.organizer}</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Event Info */}
              <div className="bg-card rounded-2xl p-6 shadow-card">
                <h2 className="text-2xl font-bold text-foreground mb-4">รายละเอียดอีเวนต์</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium text-foreground">{event.date}</p>
                      <p className="text-muted-foreground">{event.time}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium text-foreground">{event.location}</p>
                      <p className="text-muted-foreground">{event.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">{event.attendees}/{event.maxAttendees} คน</p>
                      <div className="w-48 bg-muted rounded-full h-2 mt-1">
                        <div 
                          className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-card rounded-2xl p-6 shadow-card">
                <h2 className="text-2xl font-bold text-foreground mb-4">เกี่ยวกับอีเวนต์นี้</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                    {event.fullDescription}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-6">
                  {event.tags.map((tag) => (
                    <span key={tag} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Schedule */}
              <div className="bg-card rounded-2xl p-6 shadow-card">
                <h2 className="text-2xl font-bold text-foreground mb-4">กำหนดการ</h2>
                <div className="space-y-4">
                  {event.schedule.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-muted/30 rounded-xl">
                      <div className="flex items-center gap-2 text-primary font-medium min-w-fit">
                        <Clock className="w-4 h-4" />
                        {item.time}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{item.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image Gallery */}
              <div className="bg-card rounded-2xl p-6 shadow-card">
                <h2 className="text-2xl font-bold text-foreground mb-4">ภาพประกอบ</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {event.images.map((image, index) => (
                    <img 
                      key={index}
                      src={image} 
                      alt={`${event.title} ${index + 1}`}
                      className="w-full h-40 object-cover rounded-xl hover:scale-105 transition-transform duration-300 cursor-pointer"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Action Buttons */}
              <div className="bg-card rounded-2xl p-6 shadow-card">
                <div className="flex items-center gap-3 mb-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={isBookmarked ? "text-red-500" : "text-muted-foreground"}
                  >
                    <Heart className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-muted-foreground text-sm">เหลือที่นั่ง</p>
                    <p className="text-2xl font-bold text-primary">{availableTickets} ที่นั่ง</p>
                  </div>
                  
                  {availableTickets > 0 ? (
                    <Button className="w-full" size="lg">
                      ลงทะเบียนเข้าร่วม
                    </Button>
                  ) : (
                    <Button disabled className="w-full" size="lg">
                      เต็มแล้ว
                    </Button>
                  )}
                </div>
              </div>

              {/* Ticket Options */}
              <div className="bg-card rounded-2xl p-6 shadow-card">
                <h3 className="text-xl font-bold text-foreground mb-4">ตัวเลือกตั๋ว</h3>
                <div className="space-y-4">
                  {event.tickets.map((ticket, index) => (
                    <div key={index} className="border border-border rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-foreground">{ticket.type}</h4>
                        <div className="text-right">
                          {ticket.originalPrice && (
                            <p className="text-muted-foreground text-sm line-through">
                              ฿{ticket.originalPrice.toLocaleString()}
                            </p>
                          )}
                          <p className="text-lg font-bold text-primary">
                            ฿{ticket.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">{ticket.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {ticket.available > 0 ? `เหลือ ${ticket.available} ใบ` : "หมดแล้ว"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Organizer Info */}
              <div className="bg-card rounded-2xl p-6 shadow-card">
                <h3 className="text-xl font-bold text-foreground mb-4">ผู้จัดงาน</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-bold">TE</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{event.organizer}</p>
                    <p className="text-muted-foreground text-sm">ผู้จัดงานมืออาชีพ</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  ดูโปรไฟล์ผู้จัดงาน
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetailPage;