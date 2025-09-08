import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EventCard } from "@/components/event/EventCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, ArrowRight, Code, Music, Users, Presentation } from "lucide-react";
import heroImage from "@/assets/hero-banner.jpg";
import techImage from "@/assets/tech-conference.jpg";
import musicImage from "@/assets/music-festival.jpg";
import workshopImage from "@/assets/workshop.jpg";

export function HomePage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  // Mock featured events data
  const featuredEvents = [
    {
      id: "1",
      title: "Tech Innovation Hackathon 2024",
      description: "Join the biggest tech hackathon of the year with prizes worth $50,000",
      image: techImage,
      date: "2024-12-15",
      location: "Bangkok, Thailand",
      category: "technology",
      price: 0,
      currency: "THB",
      attendees: 342,
      maxAttendees: 500,
    },
    {
      id: "2",
      title: "Electronic Music Festival",
      description: "Experience the best electronic music with world-class DJs",
      image: musicImage,
      date: "2024-12-20",
      location: "Phuket, Thailand",
      category: "music",
      price: 1500,
      currency: "THB",
      attendees: 892,
      maxAttendees: 1000,
    },
    {
      id: "3",
      title: "Web Development Workshop",
      description: "Learn modern web development with React and TypeScript",
      image: workshopImage,
      date: "2024-12-10",
      location: "Chiang Mai, Thailand",
      category: "workshop",
      price: 500,
      currency: "THB",
      attendees: 45,
      maxAttendees: 50,
    },
  ];

  const categories = [
    {
      name: t("technology"),
      icon: Code,
      count: 124,
      href: "/events?category=technology",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      name: t("music"),
      icon: Music,
      count: 87,
      href: "/events?category=music",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      name: t("workshop"),
      icon: Users,
      count: 156,
      href: "/events?category=workshop",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      name: t("conference"),
      icon: Presentation,
      count: 93,
      href: "/events?category=conference",
      gradient: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {t("heroTitle")}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">
            {t("heroSubtitle")}
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder={t("search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3">
              <Link to="/events" className="flex items-center">
                {t("events")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-3">
              <Link to="/create-event">
                {t("createEvent")}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t("categories")}</h2>
            <p className="text-muted-foreground text-lg">
              Explore events by category
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Link key={category.name} to={category.href}>
                  <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${category.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {category.count} events
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">{t("featuredEvents")}</h2>
              <p className="text-muted-foreground text-lg">
                Don't miss these amazing events
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/events">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                variant="featured"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}