import { useState } from "react";
import { User, Calendar, MapPin, Settings, Heart, Star, Edit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import EventCard from "@/components/event/EventCard";
import techConference from "@/assets/tech-conference.jpg";
import musicFestival from "@/assets/music-festival.jpg";
import workshop from "@/assets/workshop.jpg";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<'created' | 'joined' | 'favorites'>('created');

  // Mock user data
  const userData = {
    id: "1",
    name: "สมชาย ใจดี",
    email: "somchai@example.com",
    avatar: null,
    joinDate: "มกราคม 2023",
    location: "กรุงเทพมหานคร",
    bio: "ผู้จัดงานมืออาชีพ มีประสบการณ์ในการจัดงานเทคโนโลยีและการอบรมมากว่า 5 ปี",
    eventsCreated: 12,
    eventsJoined: 28,
    totalAttendees: 5240,
    rating: 4.8,
    reviews: 156
  };

  // Mock events data
  const createdEvents = [
    {
      id: "1",
      title: "Tech Conference Bangkok 2024",
      description: "การประชุมเทคโนโลยีที่ใหญ่ที่สุดในเอเชียตะวันออกเฉียงใต้",
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
    }
  ];

  const joinedEvents = [
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

  const favoriteEvents = [
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

  const getActiveEvents = () => {
    switch (activeTab) {
      case 'created': return createdEvents;
      case 'joined': return joinedEvents;
      case 'favorites': return favoriteEvents;
      default: return [];
    }
  };

  const tabs = [
    { key: 'created', label: 'อีเวนต์ที่สร้าง', count: createdEvents.length },
    { key: 'joined', label: 'เข้าร่วมแล้ว', count: joinedEvents.length },
    { key: 'favorites', label: 'รายการโปรด', count: favoriteEvents.length }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-card rounded-2xl p-8 shadow-card mb-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
              {userData.avatar ? (
                <img src={userData.avatar} alt={userData.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-primary-foreground" />
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{userData.name}</h1>
                  <p className="text-muted-foreground mb-2">{userData.email}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>เข้าร่วมเมื่อ {userData.joinDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{userData.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-4 md:mt-0">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    แก้ไขโปรไฟล์
                  </Button>
                  <Button variant="outline" size="icon">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {userData.bio && (
                <p className="text-foreground mb-4">{userData.bio}</p>
              )}

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold text-foreground">{userData.rating}</span>
                  <span className="text-muted-foreground">({userData.reviews} รีวิว)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card rounded-2xl p-6 shadow-card text-center">
            <div className="text-3xl font-bold text-primary mb-2">{userData.eventsCreated}</div>
            <p className="text-muted-foreground">อีเวนต์ที่สร้าง</p>
          </div>
          <div className="bg-card rounded-2xl p-6 shadow-card text-center">
            <div className="text-3xl font-bold text-primary mb-2">{userData.eventsJoined}</div>
            <p className="text-muted-foreground">เข้าร่วมแล้ว</p>
          </div>
          <div className="bg-card rounded-2xl p-6 shadow-card text-center">
            <div className="text-3xl font-bold text-primary mb-2">{userData.totalAttendees.toLocaleString()}</div>
            <p className="text-muted-foreground">ผู้เข้าร่วมรวม</p>
          </div>
          <div className="bg-card rounded-2xl p-6 shadow-card text-center">
            <Link to="/create-event">
              <Button className="w-full" size="lg">
                <Plus className="w-5 h-5 mr-2" />
                สร้างอีเวนต์ใหม่
              </Button>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          <div className="border-b border-border">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex-1 px-6 py-4 text-center font-medium transition-colors relative ${
                    activeTab === tab.key
                      ? 'text-primary bg-primary/5'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                  {activeTab === tab.key && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {getActiveEvents().length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getActiveEvents().map((event) => (
                  <EventCard key={event.id} {...event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  {activeTab === 'created' && <Calendar className="w-10 h-10 text-muted-foreground" />}
                  {activeTab === 'joined' && <User className="w-10 h-10 text-muted-foreground" />}
                  {activeTab === 'favorites' && <Heart className="w-10 h-10 text-muted-foreground" />}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {activeTab === 'created' && 'ยังไม่มีอีเวนต์ที่สร้าง'}
                  {activeTab === 'joined' && 'ยังไม่มีอีเวนต์ที่เข้าร่วม'}
                  {activeTab === 'favorites' && 'ยังไม่มีอีเวนต์ในรายการโปรด'}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {activeTab === 'created' && 'เริ่มสร้างอีเวนต์แรกของคุณเพื่อแบ่งปันกับคนอื่น'}
                  {activeTab === 'joined' && 'เข้าร่วมอีเวนต์ที่น่าสนใจเพื่อเพิ่มประสบการณ์'}
                  {activeTab === 'favorites' && 'เพิ่มอีเวนต์ที่สนใจลงในรายการโปรดของคุณ'}
                </p>
                {activeTab === 'created' && (
                  <Link to="/create-event">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      สร้างอีเวนต์ใหม่
                    </Button>
                  </Link>
                )}
                {activeTab === 'joined' && (
                  <Link to="/events">
                    <Button>
                      ค้นหาอีเวนต์
                    </Button>
                  </Link>
                )}
                {activeTab === 'favorites' && (
                  <Link to="/events">
                    <Button>
                      ค้นหาอีเวนต์ที่น่าสนใจ
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;