import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ticket, Search, User } from "lucide-react";
import { eventService, TicketData } from "@/services/eventService";
import { useToast } from "@/hooks/use-toast";

export function ViewTicketsPage() {
  const [userName, setUserName] = useState("");
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userName.trim()) {
      toast({
        title: t("usernameRequired"),
        description: t("pleaseEnterUsername"),
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
      
      if (userTickets.length === 0) {
        toast({
          title: t("noTicketsFound"),
          description: `${t("noTicketsFoundDesc")} "${userName}". ${t("pleaseCheckUsername")}`,
          variant: "default",
        });
      } else {
        toast({
          title: t("ticketsFound"),
          description: `${t("foundTickets")} ${userTickets.length} ${t("ticketsFor")} "${userName}".`,
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

  const getStatusText = (status: string) => {
    const statusKey = (status || 'pending') as keyof typeof translations.en;
    return t(statusKey);
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
                    {t("searching")}
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    {t("searchTickets")}
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
                {tickets.length > 0 ? `${t("yourTickets")} (${tickets.length})` : t("noTicketsFound")}
              </h2>
              {userName && (
                <p className="text-muted-foreground">
                  {t("showingResultsFor")}: <span className="font-medium">{userName}</span>
                </p>
              )}
            </div>

            {tickets.length > 0 ? (
              <div className="grid gap-4">
                {tickets.map((ticket) => (
                  <Card key={ticket.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">
                            {t("ticketNumber")}{ticket.id?.slice(-8) || 'N/A'}
                          </h3>
                          <p className="text-muted-foreground">
                            {t("eventId")}: {ticket.eventId || 'N/A'}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status || 'pending')}`}>
                          {getStatusText(ticket.status || 'pending')}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div>
                            <span className="font-medium">{t("name")}:</span> {ticket.userName || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">{t("email")}:</span> {ticket.userEmail || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">{t("phone")}:</span> {ticket.userPhone || 'N/A'}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <span className="font-medium">{t("ticketType")}:</span> {ticket.ticketType || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">{t("quantity")}:</span> {ticket.quantity || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">{t("totalAmount")}:</span> {ticket.totalAmount || 0} {ticket.currency || 'THB'}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">{t("purchaseDate")}:</span> {ticket.purchaseDate ? new Date(ticket.purchaseDate).toLocaleDateString('en-US', {
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
                            {t("showQRCode")}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : hasSearched && (
              <Card>
                <CardContent className="text-center py-12">
                  <Ticket className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{t("noTicketsFound")}</h3>
                  <p className="text-muted-foreground mb-4">
                    {t("noTicketsAssociated")} "{userName}".
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t("checkUsernameEmail")}
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