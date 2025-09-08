import { useState } from "react";
import { Filter, Grid, List, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import EventCard from "@/components/event/EventCard";
import SearchBar from "@/components/common/SearchBar";
import techConference from "@/assets/tech-conference.jpg";
import musicFestival from "@/assets/music-festival.jpg";
import workshop from "@/assets/workshop.jpg";

const EventsPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock events data
  const events = [
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
    },
    // Duplicate for more content
    {
      id: "4",
      title: "AI & Machine Learning Summit",
      description: "งานประชุมเรื่อง AI และ Machine Learning สำหรับนักพัฒนาและนักธุรกิจ",
      image: techConference,
      date: "5 เมษายน 2024",
      time: "09:00 - 16:00",
      location: "Siam Paragon",
      category: "การประชุม",
      price: 3500,
      attendees: 450,
      maxAttendees: 500,
      isOnline: false
    },
    {
      id: "5",
      title: "Indie Music Night",
      description: "คืนดนตรี Indie ที่รวมศิลปินคุณภาพจากทั่วประเทศ",
      image: musicFestival,
      date: "12 เมษายน 2024",
      time: "19:00 - 24:00",
      location: "RCA",
      category: "คอนเสิร์ต",
      price: 800,
      attendees: 280,
      maxAttendees: 400,
      isOnline: false
    },
    {
      id: "6",
      title: "Photography Masterclass",
      description: "เรียนรู้เทคนิคการถ่ายภาพจากมือโปรระดับนานาชาติ",
      image: workshop,
      date: "18 เมษายน 2024",
      time: "10:00 - 16:00",
      location: "Creative Space",
      category: "อบรม",
      price: 1500,
      attendees: 35,
      maxAttendees: 40,
      isOnline: false
    }
  ];

  const categories = [
    "ทั้งหมด",
    "การประชุม",
    "อบรม",
    "คอนเสิร์ต",
    "นิทรรศการ",
    "กีฬา"
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            อีเวนต์ทั้งหมด
          </h1>
          <p className="text-muted-foreground text-lg">
            ค้นพบอีเวนต์ที่น่าสนใจและเหมาะกับคุณ
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar 
            onFilterToggle={() => setShowFilters(!showFilters)}
            showFilter={true}
          />
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-card rounded-2xl p-6 shadow-card mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  หมวดหมู่
                </label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        className="w-4 h-4 text-primary border-border focus:ring-primary"
                      />
                      <span className="text-sm text-foreground">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  ราคา
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 text-primary border-border focus:ring-primary" />
                    <span className="text-sm text-foreground">ฟรี</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 text-primary border-border focus:ring-primary" />
                    <span className="text-sm text-foreground">0 - 1,000 บาท</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 text-primary border-border focus:ring-primary" />
                    <span className="text-sm text-foreground">1,000 - 5,000 บาท</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 text-primary border-border focus:ring-primary" />
                    <span className="text-sm text-foreground">5,000+ บาท</span>
                  </label>
                </div>
              </div>

              {/* Location Type */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  รูปแบบ
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 text-primary border-border focus:ring-primary" />
                    <span className="text-sm text-foreground">ออนไลน์</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 text-primary border-border focus:ring-primary" />
                    <span className="text-sm text-foreground">ออนไซต์</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 text-primary border-border focus:ring-primary" />
                    <span className="text-sm text-foreground">ไฮบริด</span>
                  </label>
                </div>
              </div>

              {/* Date Filter */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  วันที่
                </label>
                <div className="space-y-3">
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button variant="outline" size="sm" className="w-full">
                    ล้างตัวกรอง
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">
              พบ {events.length} อีเวนต์
            </span>
            <select className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
              <option>เรียงตามวันที่</option>
              <option>เรียงตามราคา</option>
              <option>เรียงตามความนิยม</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Events Grid */}
        <div className={`grid gap-8 ${viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
        }`}>
          {events.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              ก่อนหน้า
            </Button>
            <Button variant="default" size="sm">1</Button>
            <Button variant="ghost" size="sm">2</Button>
            <Button variant="ghost" size="sm">3</Button>
            <Button variant="outline" size="sm">
              ถัดไป
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventsPage;