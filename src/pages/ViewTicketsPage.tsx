import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ticket, Search, User } from "lucide-react";
import { eventService, TicketData, EventData } from "@/services/eventService";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export function ViewTicketsPage() {
  const { t } = useLanguage();
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
        title: t("usernameRequired"),
        description: t("enterUsernameEmail"),
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
          title: t("noTicketsFound"),
          description: `${t("noTicketsForUser")} "${userName}". ${t("checkUsernameRetry")}.`,
          variant: "default",
        });
      } else {
        toast({
          title: t("ticketsFound"),
          description: `${t("foundTicketsFor")} "${userName}".`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Error fetching tickets from API:', error);
      toast({
        title: t("searchError"),
        description: t("failedToFetchTickets"),
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
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Ticket className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold">View Your Tickets</h1>
          </div>
          <p className="text-muted-foreground">
            Enter your username to view all your event tickets
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              ค้นหาตั๋วของคุณ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-6">
              <div>
                <Label htmlFor="username">ชื่อผู้ใช้หรืออีเมล</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="ป้อนชื่อผู้ใช้หรือที่อยู่อีเมลของคุณ"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="mt-2"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full flex items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Search className="h-4 w-4 animate-spin" />
                    กำลังค้นหา...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    ค้นหาตั๋ว
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Search Results */}
        {hasSearched && (
          <div className="space-y-6 mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {tickets.length > 0 ? `ตั๋วของคุณ (${tickets.length})` : 'ไม่พบตั๋ว'}
              </h2>
              {userName && (
                <p className="text-muted-foreground text-sm">
                  แสดงผลลัพธ์สำหรับ: <span className="font-medium">{userName}</span>
                </p>
              )}
            </div>

            {tickets.length > 0 ? (
              <div className="space-y-6">
                {tickets.map((ticket) => {
                  const eventData = events[ticket.eventId];
                  return (
                    <Card key={ticket.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold mb-1">
                              ตั๋ว #{ticket.id?.slice(-8) || 'N/A'}
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              รหัสกิจกรรม: {ticket.eventId || 'N/A'}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status || 'pending')}`}>
                            {(ticket.status || 'pending').charAt(0).toUpperCase() + (ticket.status || 'pending').slice(1)}
                          </span>
                        </div>

                        {/* Event Details Section */}
                        {eventData && (
                          <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                            <h4 className="font-medium mb-3 flex items-center">
                              <Ticket className="h-4 w-4 mr-2 text-primary" />
                              รายละเอียดกิจกรรม
                            </h4>
                            
                            {/* Event Image */}
                            {getEventImageUrl(eventData) && (
                              <div className="mb-4">
                                <img 
                                  src={getEventImageUrl(eventData)} 
                                  alt={eventData.title}
                                  className="w-full h-32 object-cover rounded-md shadow-sm"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                  }}
                                />
                              </div>
                            )}
                            
                            <div className="grid gap-2">
                              <div className="text-sm">
                                <span className="font-medium">ชื่อกิจกรรม:</span> {eventData.title}
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">หมวดหมู่:</span> {eventData.category}
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">สถานที่:</span> {eventData.location.venue || eventData.location.type}
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">วันที่:</span> {new Date(eventData.schedule.startDate).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">เวลา:</span> {eventData.schedule.startTime} - {eventData.schedule.endTime}
                              </div>
                              <div className="text-sm">
                                <span className="font-medium">ผู้จัดงาน:</span> {eventData.organizer.name}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Ticket Details Section */}
                        <div className="mb-4">
                          <h4 className="font-medium mb-3 flex items-center">
                            <Ticket className="h-4 w-4 mr-2 text-primary" />
                            ข้อมูลตั๋ว
                          </h4>
                          <div className="grid gap-2">
                            <div className="text-sm">
                              <span className="font-medium">ชื่อ:</span> {ticket.userName || 'N/A'}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">อีเมล:</span> {ticket.userEmail || 'N/A'}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">โทรศัพท์:</span> {ticket.userPhone || 'N/A'}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">ประเภทตั๋ว:</span> {ticket.ticketType || 'N/A'}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">จำนวน:</span> {ticket.quantity || 'N/A'}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">จำนวนเงินรวม:</span> {ticket.totalAmount || 0} {ticket.currency || 'THB'}
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t">
                          <div className="text-xs text-muted-foreground">
                            <span className="font-medium">วันที่ซื้อ:</span> {ticket.purchaseDate ? new Date(ticket.purchaseDate).toLocaleDateString('en-US', {
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
                              แสดงรหัส QR
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
                  <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">ไม่พบตั๋ว</h3>
                  <p className="text-muted-foreground mb-4">
                    ไม่มีตั๋วที่เกี่ยวข้องกับชื่อผู้ใช้ "{userName}".
                  </p>
                  <p className="text-sm text-muted-foreground">
                    กรุณาตรวจสอบชื่อผู้ใช้หรืออีเมลและลองใหม่อีกครั้ง.
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