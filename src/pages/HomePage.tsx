import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EventCard } from "@/components/event/EventCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, ArrowRight, Code, Music, Users, Presentation, X } from "lucide-react";
import heroImage from "@/assets/hero-banner.jpg";
import { eventService, EventData } from "@/services/eventService";
import { useToast } from "@/hooks/use-toast";

export function HomePage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredEvents, setFeaturedEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<EventData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Load featured events from API
  useEffect(() => {
    const loadFeaturedEvents = async () => {
      try {
        setLoading(true);
        const events = await eventService.getFeaturedEvents();
        setFeaturedEvents(events.slice(0, 3)); // Show only first 3 featured events
      } catch (error) {
        console.error('Error loading featured events:', error);
        toast({
          title: "Error",
          description: "Failed to load featured events. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedEvents();
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

  // Event categories for homepage
  const categories = [
    {
      name: t("technology"),
      icon: Code,
      count: 24,
      gradient: "from-blue-500 to-purple-600",
      href: "/events?category=technology"
    },
    {
      name: t("music"),
      icon: Music,
      count: 18,
      gradient: "from-pink-500 to-red-500",
      href: "/events?category=music"
    },
    {
      name: t("workshop"),
      icon: Users,
      count: 32,
      gradient: "from-green-500 to-teal-500",
      href: "/events?category=workshop"
    },
    {
      name: t("conference"),
      icon: Presentation,
      count: 15,
      gradient: "from-orange-500 to-yellow-500",
      href: "/events?category=conference"
    }
  ];

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
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <form onSubmit={handleSearch} className="relative">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search events by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={isSearching}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-4 h-auto rounded-full"
                >
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </div>
            </form>
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

      {/* Search Results Section */}
      {showSearchResults && (
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-4">
                  {t("searchResultsFor")} "{searchQuery}"
                </h2>
                <p className="text-muted-foreground">
                  {t("found")} {searchResults.length} {t("eventsMatching")}
                </p>
              </div>
              <Button variant="outline" onClick={clearSearch}>
                {t("clearSearch")}
                <X className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{t("noEventsFound")}</h3>
                  <p className="text-muted-foreground mb-4">
                    We couldn't find any events matching "{searchQuery}". Try searching with different keywords.
                  </p>
                  <Button variant="outline" onClick={clearSearch}>
                    {t("clearSearch")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Featured Events Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">{t("featuredEvents")}</h2>
              <p className="text-muted-foreground">
                {t("discoverHandpicked")}
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/events">
                {t("viewAllEvents")}
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
                {t("noFeaturedEvents")}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}