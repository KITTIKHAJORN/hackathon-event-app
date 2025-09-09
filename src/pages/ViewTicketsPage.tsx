import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ticket, Search, User, Calendar, MapPin, Clock } from "lucide-react";
import { eventService, TicketData, EventData } from "@/services/eventService";
import { useToast } from "@/hooks/use-toast";

export function ViewTicketsPage() {
  const [userName, setUserName] = useState("");
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [events, setEvents] = useState<{[key: string]: EventData}>({});
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userName.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter your username to search for tickets.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setHasSearched(true);
    
    try {
      // Fetch tickets directly from the API endpoint
      const response = await fetch('http://54.169.154.143:3863/event-tickets');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      
      // Handle different response formats
      let allTickets: TicketData[] = [];
      if (Array.isArray(data)) {
        allTickets = data;
      } else if (data.value && Array.isArray(data.value)) {
        allTickets = data.value;
      } else if (data.tickets && Array.isArray(data.tickets)) {
        allTickets = data.tickets;
      }
      
      // Search for tickets by username or email
      const userTickets = allTickets.filter(ticket => 
        ticket.userName?.toLowerCase().includes(userName.toLowerCase()) ||
        ticket.userEmail?.toLowerCase().includes(userName.toLowerCase()) ||
        ticket.userId?.toLowerCase().includes(userName.toLowerCase())
      );
      
      setTickets(userTickets);
      
      // Fetch event details for each ticket
      const eventDetailsMap: {[key: string]: EventData} = {};
      const uniqueEventIds = [...new Set(userTickets.map(ticket => ticket.eventId).filter(Boolean))];
      
      for (const eventId of uniqueEventIds) {
        try {
          const eventData = await eventService.getEventById(eventId);
          if (eventData) {
            eventDetailsMap[eventId] = eventData;
          }
        } catch (error) {
          console.error(`Error fetching event ${eventId}:`, error);
        }
      }
      
      setEvents(eventDetailsMap);
      
      if (userTickets.length === 0) {
        toast({
          title: "No Tickets Found",
          description: `No tickets found for username "${userName}". Please check your username and try again.`,
          variant: "default",
        });
      } else {
        toast({
          title: "Tickets Found",
          description: `Found ${userTickets.length} ticket(s) for "${userName}".`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Error fetching tickets from API:', error);
      toast({
        title: "Search Error",
        description: "Failed to fetch tickets from server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get event image URL
  const getEventImageUrl = (eventData: EventData) => {
    // Special case for evt_001
    if (eventData.id === 'evt_001') {
      return 'https://jama.com.sa/event-management-en';
    }
    
    // Use banner image if available, otherwise thumbnail
    return eventData.images?.banner || eventData.images?.thumbnail || null;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'used':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Ticket className="h-12 w-12 text-primary mr-3" />
            <h1 className="text-4xl font-bold">View Your Tickets</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Enter your username to view all your event tickets
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Search for Your Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username or Email</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username or email address"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="text-lg py-3"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Search className="h-5 w-5 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Search Tickets
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Search Results */}
        {hasSearched && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                {tickets.length > 0 ? `Your Tickets (${tickets.length})` : 'No Tickets Found'}
              </h2>
              {userName && (
                <p className="text-muted-foreground">
                  Showing results for: <span className="font-medium">{userName}</span>
                </p>
              )}
            </div>

            {tickets.length > 0 ? (
              <div className="grid gap-6">
                {tickets.map((ticket) => {
                  const eventData = events[ticket.eventId];
                  return (
                    <Card key={ticket.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-semibold mb-2">
                              Ticket #{ticket.id?.slice(-8) || 'N/A'}
                            </h3>
                            <p className="text-muted-foreground">
                              Event ID: {ticket.eventId || 'N/A'}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status || 'pending')}`}>
                            {(ticket.status || 'pending').charAt(0).toUpperCase() + (ticket.status || 'pending').slice(1)}
                          </span>
                        </div>

                        {/* Event Details Section */}
                        {eventData && (
                          <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                            <h4 className="text-lg font-semibold mb-3 flex items-center">
                              <Calendar className="h-5 w-5 mr-2 text-primary" />
                              Event Details
                            </h4>
                            
                            {/* Event Image */}
                            {getEventImageUrl(eventData) && (
                              <div className="mb-4">
                                <img 
                                  src={getEventImageUrl(eventData)} 
                                  alt={eventData.title}
                                  className="w-full h-48 object-cover rounded-lg shadow-sm"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                  }}
                                />
                              </div>
                            )}
                            
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div>
                                  <span className="font-medium">Event Name:</span> {eventData.title}
                                </div>
                                <div>
                                  <span className="font-medium">Category:</span> {eventData.category}
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                                  <span className="font-medium">Location:</span> {eventData.location.venue || eventData.location.type}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                                  <span className="font-medium">Date:</span> {new Date(eventData.schedule.startDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                                  <span className="font-medium">Time:</span> {eventData.schedule.startTime} - {eventData.schedule.endTime}
                                </div>
                                <div>
                                  <span className="font-medium">Organizer:</span> {eventData.organizer.name}
                                </div>
                              </div>
                            </div>
                            <div className="mt-3">
                              <p className="text-sm text-muted-foreground">
                                <span className="font-medium">Description:</span> {eventData.description}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Ticket Details Section */}
                        <div className="mb-4">
                          <h4 className="text-lg font-semibold mb-3 flex items-center">
                            <Ticket className="h-5 w-5 mr-2 text-primary" />
                            Ticket Information
                          </h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div>
                                <span className="font-medium">Name:</span> {ticket.userName || 'N/A'}
                              </div>
                              <div>
                                <span className="font-medium">Email:</span> {ticket.userEmail || 'N/A'}
                              </div>
                              <div>
                                <span className="font-medium">Phone:</span> {ticket.userPhone || 'N/A'}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div>
                                <span className="font-medium">Ticket Type:</span> {ticket.ticketType || 'N/A'}
                              </div>
                              <div>
                                <span className="font-medium">Quantity:</span> {ticket.quantity || 'N/A'}
                              </div>
                              <div>
                                <span className="font-medium">Total Amount:</span> {ticket.totalAmount || 0} {ticket.currency || 'THB'}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t">
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium">Purchase Date:</span> {ticket.purchaseDate ? new Date(ticket.purchaseDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : 'N/A'}
                          </div>
                        </div>

                        {ticket.qrCode && (
                          <div className="mt-4">
                            <Button variant="outline" className="w-full">
                              <Ticket className="h-4 w-4 mr-2" />
                              Show QR Code
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : hasSearched && (
              <Card>
                <CardContent className="text-center py-12">
                  <Ticket className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Tickets Found</h3>
                  <p className="text-muted-foreground mb-4">
                    No tickets are associated with the username "{userName}".
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Please check your username or email and try again.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}