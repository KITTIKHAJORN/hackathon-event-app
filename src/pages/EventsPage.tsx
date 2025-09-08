import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { EventCard } from "@/components/event/EventCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import techImage from "@/assets/tech-conference.jpg";
import musicImage from "@/assets/music-festival.jpg";
import workshopImage from "@/assets/workshop.jpg";

export function EventsPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Mock events data
  const allEvents = [
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
    {
      id: "4",
      title: "AI Conference 2024",
      description: "Explore the future of artificial intelligence with industry experts",
      image: techImage,
      date: "2024-12-25",
      location: "Bangkok, Thailand",
      category: "conference",
      price: 2000,
      currency: "THB",
      attendees: 234,
      maxAttendees: 300,
    },
    {
      id: "5",
      title: "Rock Music Festival",
      description: "The biggest rock festival in Southeast Asia",
      image: musicImage,
      date: "2024-12-30",
      location: "Pattaya, Thailand",
      category: "music",
      price: 1200,
      currency: "THB",
      attendees: 1456,
      maxAttendees: 2000,
    },
    {
      id: "6",
      title: "Design Thinking Workshop",
      description: "Learn design thinking methodologies from UX experts",
      image: workshopImage,
      date: "2024-12-18",
      location: "Bangkok, Thailand",
      category: "workshop",
      price: 800,
      currency: "THB",
      attendees: 32,
      maxAttendees: 40,
    },
  ];

  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
      const matchesLocation = selectedLocation === "all" || 
        event.location.toLowerCase().includes(selectedLocation.toLowerCase());
      
      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [allEvents, searchQuery, selectedCategory, selectedLocation]);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "technology", label: t("technology") },
    { value: "music", label: t("music") },
    { value: "workshop", label: t("workshop") },
    { value: "conference", label: t("conference") },
  ];

  const locations = [
    { value: "all", label: "All Locations" },
    { value: "bangkok", label: "Bangkok" },
    { value: "phuket", label: "Phuket" },
    { value: "chiang mai", label: "Chiang Mai" },
    { value: "pattaya", label: "Pattaya" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4">{t("events")}</h1>
          <p className="text-muted-foreground text-lg">
            Discover amazing events happening around you
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg">{t("filter")}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                <div className={`space-y-6 ${!showFilters && "hidden lg:block"}`}>
                  {/* Search */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t("search")}
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search events..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t("category")}
                    </label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      {t("location")}
                    </label>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location.value} value={location.value}>
                            {location.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Clear Filters */}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                      setSelectedLocation("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Events Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {filteredEvents.length} events found
              </h2>
            </div>

            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-muted-foreground text-lg mb-4">
                  No events found matching your criteria
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setSelectedLocation("all");
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}