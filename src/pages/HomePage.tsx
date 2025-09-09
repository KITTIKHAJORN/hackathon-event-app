import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventCard } from "@/components/event/EventCard";
import { EventSearch } from "@/components/event/EventSearch";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, ArrowRight, Code, Music, Users, Presentation, X, Calendar, MapPin, User, Ticket } from "lucide-react";
import heroImage from "@/assets/hero-banner.jpg";
import { eventService, EventData } from "@/services/eventService";
import { useToast } from "@/hooks/use-toast";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export function HomePage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredEvents, setFeaturedEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<EventData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalEvents: 0,
  });
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [eventTrendData, setEventTrendData] = useState<any[]>([]);

  // Load featured events and dashboard data from API
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const events = await eventService.getFeaturedEvents();
        setFeaturedEvents(events.slice(0, 3)); // Show only first 3 featured events
        
        // Get real dashboard statistics
        const stats = await eventService.getDashboardStats();
        setDashboardData({
          totalEvents: stats.totalEvents,
        });
        
        // Get real category distribution data
        const categories = await eventService.getCategoryDistribution();
        setCategoryData(categories);
        
        // Get real event trend data
        const trendData = await eventService.getEventTrendData();
        setEventTrendData(trendData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [toast]);

  // Handle search functionality
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await eventService.searchEvents(searchQuery);
      setSearchResults(results);
      setShowSearchResults(true);
      
      if (results.length === 0) {
        toast({
          title: "No Results",
          description: `No events found for "${searchQuery}". Please try a different search term.`,
          variant: "default",
        });
      } else {
        toast({
          title: "Search Results",
          description: `Found ${results.length} event(s) matching "${searchQuery}".`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to search events. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  // Colors for charts - Enhanced beautiful color palette
  const COLORS = ['#4f46e5', '#7c3aed', '#db2777', '#e11d48', '#d97706', '#059669', '#0284c7', '#7c3aed'];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-dark">
          <img 
            src={heroImage}
            alt="Hero background"
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
          
          {/* Event Search */}
          <div className="max-w-2xl mx-auto mb-8 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search events by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                autoComplete="off"
                role="combobox"
                aria-expanded={searchQuery ? "true" : "false"}
                aria-haspopup="listbox"
                aria-autocomplete="list"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {searchQuery && (
              <EventSearch
                searchQuery={searchQuery}
                onSelect={(event) => {
                  setSearchQuery("");
                  navigate(`/events/${event.id}`);
                }}
                onClose={() => setSearchQuery("")}
              />
            )}
          </div>
          

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3">
              <Link to="/events" className="flex items-center">
                {t("events")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-3">
              <Link to="/view-tickets">
                View Your Tickets
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

      {/* Dashboard Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Event
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get insights into our event platform and explore categories
            </p>
          </div>
          
          {/* Main Stats and Categories Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Combined Total Events and Event Categories card */}
            <Card className="lg:col-span-1 hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platform Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Events</p>
                      <h3 className="text-2xl font-bold text-primary">{dashboardData.totalEvents}</h3>
                    </div>
                    <div className="p-2 rounded-full bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Categories</p>
                      <h3 className="text-2xl font-bold text-primary">{categoryData.length}</h3>
                    </div>
                    <div className="p-2 rounded-full bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Event Categories Distribution Chart */}
            <Card className="lg:col-span-2 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Categories Distribution</CardTitle>
                <p className="text-sm text-muted-foreground">Distribution of events by category</p>
              </CardHeader>
              <CardContent className="flex items-center justify-center pb-0" style={{ height: '300px' }}>
                <ChartContainer
                  config={categoryData.reduce((acc, category, index) => {
                    acc[category.name] = {
                      label: category.name,
                      color: COLORS[index % COLORS.length],
                    };
                    return acc;
                  }, {} as Record<string, { label: string; color: string }>)}
                  className="h-full w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                            stroke="#ffffff"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <ChartTooltip 
                        content={<ChartTooltipContent />} 
                        formatter={(value) => [value, 'Events']}
                      />
                      <Legend 
                        layout="vertical" 
                        verticalAlign="middle" 
                        align="right"
                        wrapperStyle={{ paddingRight: '20px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
          
          {/* Event Categories Section - Similar to Categories Section */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl text-primary">Event Categories</CardTitle>
              <p className="text-sm text-muted-foreground">Explore events by category</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categoryData.map((category, index) => (
                  <div 
                    key={category.name} 
                    className="p-4 rounded-lg bg-primary/10 hover:from-primary/20 hover:to-secondary/20 transition-all duration-300 hover:scale-105 text-center"
                  >
                    <div className="mx-auto mb-2 p-2 rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-primary text-sm">{category.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{category.value} events</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">{t("featuredEvents")}</h2>
              <p className="text-muted-foreground">
                Discover our handpicked selection of amazing events
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/events">
                View All Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted rounded-lg h-48 mb-4"></div>
                  <div className="bg-muted rounded h-4 mb-2"></div>
                  <div className="bg-muted rounded h-4 w-3/4"></div>
                </div>
              ))}
            </div>
          ) : featuredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No featured events available at the moment.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}