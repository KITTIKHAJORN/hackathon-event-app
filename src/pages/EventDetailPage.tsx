import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Clock, 
  Share2, 
  ArrowLeft,
  Building2,

} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { eventService, EventData } from "@/services/eventService";

export function EventDetailPage() {
  const { id } = useParams();
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);

  // Load event data from API
  useEffect(() => {
    const loadEvent = async () => {
      if (!id) {
        console.log('❌ No event ID provided');
        return;
      }
      
      console.log('🔍 Loading event with ID:', id);
      
      try {
        setLoading(true);
        const eventData = await eventService.getEventById(id);
        console.log('📊 Event data received:', eventData);
        setEvent(eventData);
      } catch (error) {
        console.error('❌ Error loading event:', error);
        toast({
          title: t("error"),
          description: t("failedToLoad"),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold mb-4">{t("loadingEvents")}</h1>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{t("eventNotFound")}</h1>
          <Button asChild>
            <Link to="/events">{t("backToEvents")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const formatPrice = (pricing: EventData['pricing'], type: 'regular' | 'earlyBird' | 'student' | 'vip' | 'adult' = 'regular') => {
    const price = pricing[type] || pricing.regular || pricing.adult || 0;
    if (price === 0 || pricing.free === 0) return t("free");
    return `${price.toLocaleString()} ${pricing.currency}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      technology: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      music: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      workshop: "bg-green-500/10 text-green-500 border-green-500/20",
      conference: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    };
    return colors[category as keyof typeof colors] || colors.technology;
  };



  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={event.images?.banner || event.images?.thumbnail || '/placeholder.svg'}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute top-14 left-4">
          <Button asChild>
            <Link to="/events">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("backToEvents")}
            </Link>
          </Button>
        </div>
        <div className="absolute bottom-8 left-8 text-white">
          <Badge className={`mb-4 ${getCategoryColor(event.category)}`}>
            {event.category}
          </Badge>
          <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
          <p className="text-lg opacity-90">{t("organizer")}: {event.organizer.name}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Info */}
            <Card>
              <CardHeader>
                <CardTitle>{t("eventDetails")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  {event.description}
                </p>

                {event.requirements && event.requirements.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">{t("requirements")}</h4>
                    <ul className="text-muted-foreground list-disc list-inside space-y-1">
                      {event.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>



            {/* Dynamic Event-Specific Content - NoSQL Approach */}
            {(() => {
              // Get all dynamic fields from the event object
              const dynamicFields = Object.keys(event).filter(key => {
                const value = (event as any)[key];
                return !['id', 'title', 'description', 'category', 'type', 'status', 'featured', 
                        'organizer', 'schedule', 'location', 'pricing', 'capacity', 'images', 
                        'tags', 'requirements'].includes(key) && 
                       value && 
                       (Array.isArray(value) ? value.length > 0 : true);
              });
              
              return dynamicFields.map(fieldKey => {
                const fieldValue = (event as any)[fieldKey];
                const fieldTitle = fieldKey.charAt(0).toUpperCase() + fieldKey.slice(1)
                  .replace(/([A-Z])/g, ' $1');
                
                // Handle different data types dynamically
                if (Array.isArray(fieldValue)) {
                  // Check if it's an array of objects (like speakers, artists)
                  if (fieldValue.length > 0 && typeof fieldValue[0] === 'object') {
                    return (
                      <Card key={fieldKey}>
                        <CardHeader>
                          <CardTitle>{fieldTitle}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {fieldValue.map((item: any, index: number) => (
                              <div key={index} className="flex gap-4">
                                {item.image && (
                                  <div className="flex-shrink-0">
                                    <img
                                      src={item.image || '/placeholder.svg'}
                                      alt={item.name || item.title || `${fieldTitle} ${index + 1}`}
                                      className="w-16 h-16 rounded-full object-cover"
                                    />
                                  </div>
                                )}
                                <div className="flex-1">
                                  {item.name && (
                                    <h4 className="font-semibold text-lg">{item.name}</h4>
                                  )}
                                  {item.title && (
                                    <p className="text-primary text-sm font-medium">{item.title}</p>
                                  )}
                                  {item.company && (
                                    <p className="text-muted-foreground text-sm">{item.company}</p>
                                  )}
                                  {item.genre && (
                                    <p className="text-primary text-sm font-medium">{item.genre}</p>
                                  )}
                                  {(item.bio || item.description) && (
                                    <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                                      {item.bio || item.description}
                                    </p>
                                  )}
                                  {item.distance && (
                                    <p className="text-muted-foreground text-sm">
                                      {t("distance")}: {item.distance}
                                      {item.startTime && ` • ${t("startTime")}: ${item.startTime}`}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  }
                  // Handle array of strings
                  else {
                    return (
                      <Card key={fieldKey}>
                        <CardHeader>
                          <CardTitle>{fieldTitle}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {fieldKey === 'distances' ? (
                             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                               {fieldValue.map((item: string, index: number) => (
                                 <div key={index} className="p-4 rounded-lg bg-accent/10 border border-accent/20 text-center">
                                   <h4 className="font-semibold text-lg">{item}</h4>
                                 </div>
                               ))}
                             </div>
                          ) : fieldKey === 'includes' ? (
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {fieldValue.map((item: string, index: number) => (
                                <li key={index} className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {fieldValue.map((item: string, index: number) => (
                                <div key={index} className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                                  <h4 className="font-semibold">{item}</h4>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  }
                }
                return null;
              });
            })()}


          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Info Card */}
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">{formatDate(event.schedule.startDate)}</div>
                    <div className="text-sm text-muted-foreground">
                      {event.schedule.startTime} - {event.schedule.endTime}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">{event.location.venue || t("onlineEvent")}</div>
                    <div className="text-sm text-muted-foreground">
                      {event.location.address || t("virtualEvent")}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">
                      {event.capacity.registered}/{event.capacity.max} {t("attendees")}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {event.capacity.available} {t("seatsAvailable")}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium text-primary text-lg">
                      {formatPrice(event.pricing)}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Organizer Information */}
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium">{t("organizer")}</div>
                    <div className="text-sm font-semibold text-primary">
                      {event.organizer.name}
                    </div>
                    {event.organizer.contact && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {event.organizer.contact}
                      </div>
                    )}
                    {event.organizer.phone && (
                      <div className="text-xs text-muted-foreground">
                        {event.organizer.phone}
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => navigate(`/events/${event.id}/register`)}
                  >
                    {t("register")}
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Share2 className="h-4 w-4 mr-2" />
                    {t("share")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}