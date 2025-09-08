import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Clock, 
  Share2, 
  ArrowLeft,
  CreditCard,
  User,
  Mail,
  Phone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import techImage from "@/assets/tech-conference.jpg";
import musicImage from "@/assets/music-festival.jpg";
import workshopImage from "@/assets/workshop.jpg";

export function EventDetailPage() {
  const { id } = useParams();
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    dietary: "",
    notes: "",
    ticketType: "standard"
  });

  // Mock event data
  const mockEvents = {
    "1": {
      id: "1",
      title: "Tech Innovation Hackathon 2024",
      description: "Join the biggest tech hackathon of the year with prizes worth $50,000. This is an incredible opportunity to showcase your skills, network with industry professionals, and compete for amazing prizes. The event will feature workshops, mentorship sessions, and exciting challenges across various tech domains including AI, blockchain, mobile development, and web technologies.",
      image: techImage,
      date: "2024-12-15",
      time: "09:00",
      endDate: "2024-12-17",
      endTime: "18:00",
      location: "BITEC Bangna",
      address: "88 Bangna-Trad Rd, Bang Na, Bangkok 10260, Thailand",
      category: "technology",
      price: 0,
      currency: "THB",
      attendees: 342,
      maxAttendees: 500,
      organizer: "Tech Innovation Thailand",
      requirements: "Laptop required, programming experience preferred",
      schedule: [
        { time: "09:00-10:00", activity: "Registration & Welcome" },
        { time: "10:00-12:00", activity: "Opening Ceremony & Team Formation" },
        { time: "12:00-13:00", activity: "Lunch Break" },
        { time: "13:00-18:00", activity: "Hacking Session Day 1" }
      ]
    },
    "2": {
      id: "2",
      title: "Electronic Music Festival",
      description: "Experience the best electronic music with world-class DJs from around the globe. Get ready for an unforgettable night of dancing, music, and amazing vibes under the stars. The festival features multiple stages, food trucks, art installations, and VIP areas.",
      image: musicImage,
      date: "2024-12-20",
      time: "18:00",
      endDate: "2024-12-21",
      endTime: "02:00",
      location: "Phuket Beach Arena",
      address: "Patong Beach, Kathu District, Phuket 83150, Thailand",
      category: "music",
      price: 1500,
      currency: "THB",
      attendees: 892,
      maxAttendees: 1000,
      organizer: "Phuket Music Events",
      requirements: "Age 18+ only, ID required",
      schedule: [
        { time: "18:00-19:00", activity: "Gates Open & Entry" },
        { time: "19:00-21:00", activity: "Opening Acts" },
        { time: "21:00-00:00", activity: "Main Stage Performances" },
        { time: "00:00-02:00", activity: "After Party" }
      ]
    },
    "3": {
      id: "3",
      title: "Web Development Workshop",
      description: "Learn modern web development with React and TypeScript from industry experts. This hands-on workshop covers everything from basic concepts to advanced patterns, including state management, testing, and deployment strategies.",
      image: workshopImage,
      date: "2024-12-10",
      time: "10:00",
      endDate: "2024-12-10",
      endTime: "17:00",
      location: "Chiang Mai Tech Hub",
      address: "123 Nimman Road, Suthep, Mueang Chiang Mai, Chiang Mai 50200, Thailand",
      category: "workshop",
      price: 500,
      currency: "THB",
      attendees: 45,
      maxAttendees: 50,
      organizer: "Chiang Mai Developers",
      requirements: "Basic JavaScript knowledge required",
      schedule: [
        { time: "10:00-12:00", activity: "React Fundamentals" },
        { time: "12:00-13:00", activity: "Lunch Break" },
        { time: "13:00-15:00", activity: "TypeScript Integration" },
        { time: "15:00-17:00", activity: "Project Building" }
      ]
    }
  };

  const event = mockEvents[id as keyof typeof mockEvents];

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <Button asChild>
            <Link to="/events">Back to Events</Link>
          </Button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return t("free");
    return `${price.toLocaleString()} ${currency}`;
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

  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Registration Successful!",
      description: "You have been registered for this event. Check your email for confirmation.",
    });
    setShowRegistration(false);
    // Here you would typically send the data to your backend
    console.log("Registration data:", registrationData);
  };

  const ticketTypes = [
    { value: "standard", label: "Standard Ticket", price: event.price },
    { value: "vip", label: "VIP Ticket", price: event.price * 2 },
    { value: "student", label: "Student Ticket", price: event.price * 0.5 },
  ];

  const selectedTicket = ticketTypes.find(t => t.value === registrationData.ticketType);

  if (showRegistration) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => setShowRegistration(false)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Event Details
            </Button>
            <h1 className="text-2xl font-bold">Register for {event.title}</h1>
          </div>

          <form onSubmit={handleRegistration} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      required
                      value={registrationData.firstName}
                      onChange={(e) => setRegistrationData(prev => ({ ...prev, firstName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      required
                      value={registrationData.lastName}
                      onChange={(e) => setRegistrationData(prev => ({ ...prev, lastName: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={registrationData.email}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={registrationData.phone}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="company">Company/Organization</Label>
                  <Input
                    id="company"
                    value={registrationData.company}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, company: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Ticket Selection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="ticketType">Ticket Type</Label>
                  <Select
                    value={registrationData.ticketType}
                    onValueChange={(value) => setRegistrationData(prev => ({ ...prev, ticketType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ticketTypes.map((ticket) => (
                        <SelectItem key={ticket.value} value={ticket.value}>
                          {ticket.label} - {formatPrice(ticket.price, event.currency)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Amount:</span>
                    <span className="text-xl font-bold text-primary">
                      {formatPrice(selectedTicket?.price || 0, event.currency)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="dietary">Dietary Requirements</Label>
                  <Input
                    id="dietary"
                    placeholder="Any dietary restrictions or preferences"
                    value={registrationData.dietary}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, dietary: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special requests or questions"
                    value={registrationData.notes}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowRegistration(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Complete Registration
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute top-4 left-4">
          <Button variant="secondary" asChild>
            <Link to="/events">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Link>
          </Button>
        </div>
        <div className="absolute bottom-8 left-8 text-white">
          <Badge className={`mb-4 ${getCategoryColor(event.category)}`}>
            {t(event.category)}
          </Badge>
          <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
          <p className="text-lg opacity-90">Organized by {event.organizer}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Info */}
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
                
                {event.requirements && (
                  <div>
                    <h4 className="font-semibold mb-2">Requirements</h4>
                    <p className="text-muted-foreground">{event.requirements}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {event.schedule.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-24 text-sm font-medium text-primary">
                        {item.time}
                      </div>
                      <div className="text-sm">{item.activity}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Info Card */}
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">{formatDate(event.date)}</div>
                    <div className="text-sm text-muted-foreground">
                      {event.time} - {event.endTime}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">{event.location}</div>
                    <div className="text-sm text-muted-foreground">
                      {event.address}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">
                      {event.attendees}/{event.maxAttendees} Attendees
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {event.maxAttendees - event.attendees} spots left
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium text-primary text-lg">
                      {formatPrice(event.price, event.currency)}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => setShowRegistration(true)}
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