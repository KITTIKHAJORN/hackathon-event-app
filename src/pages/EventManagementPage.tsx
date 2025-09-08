import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OTPInput } from "@/components/common/OTPInput";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { eventService } from "@/services/eventService";
import { otpService } from "@/services/otpService";
import { Lock, Edit, Trash2, Search, Shield } from "lucide-react";

export function EventManagementPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("verify");
  const [eventId, setEventId] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

  // Verify OTP and load event
  const handleOTPVerification = async (inputOtp: string) => {
    if (!eventId || !email) {
      setVerificationError("Please enter Event ID and Email");
      return;
    }

    setVerificationLoading(true);
    setVerificationError("");

    try {
      const isValid = await eventService.verifyEventOTP(eventId, inputOtp, email);
      
      if (isValid) {
        const event = await eventService.getEventById(eventId);
        if (event) {
          setCurrentEvent(event);
          setIsVerified(true);
          setActiveTab("manage");
          toast({
            title: "Verification Successful",
            description: "You can now manage your event",
          });
        } else {
          setVerificationError("Event not found");
        }
      } else {
        setVerificationError("Invalid OTP or unauthorized access");
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setVerificationError("Verification failed. Please try again.");
    } finally {
      setVerificationLoading(false);
    }
  };

  // Delete event
  const handleDeleteEvent = async () => {
    if (!currentEvent || !eventId || !email) return;

    const confirmed = window.confirm("Are you sure you want to delete this event? This action cannot be undone.");
    if (!confirmed) return;

    try {
      const success = await eventService.deleteEvent(eventId, otp, email);
      if (success) {
        toast({
          title: "Event Deleted",
          description: "Your event has been successfully deleted",
        });
        // Reset state
        setIsVerified(false);
        setCurrentEvent(null);
        setEventId("");
        setEmail("");
        setOtp("");
        setActiveTab("verify");
      } else {
        toast({
          title: "Delete Failed",
          description: "Failed to delete event. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the event",
        variant: "destructive",
      });
    }
  };

  // Regenerate OTP
  const handleRegenerateOTP = async () => {
    if (!eventId || !email) {
      toast({
        title: "Missing Information",
        description: "Please enter Event ID and Email",
        variant: "destructive",
      });
      return;
    }

    try {
      const newOTP = await eventService.regenerateEventOTP(eventId, email);
      if (newOTP) {
        toast({
          title: "New OTP Generated",
          description: `Your new OTP is: ${otpService.formatOTP(newOTP)}`,
        });
      } else {
        toast({
          title: "Failed to Generate OTP",
          description: "Unable to generate new OTP. Please check your Event ID and Email.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Regenerate OTP error:', error);
      toast({
        title: "Error",
        description: "An error occurred while generating new OTP",
        variant: "destructive",
      });
    }
  };

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Event Management</h1>
            <p className="text-muted-foreground">
              Enter your event details and OTP to manage your event
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="verify">Verify Access</TabsTrigger>
              <TabsTrigger value="regenerate">Regenerate OTP</TabsTrigger>
            </TabsList>

            <TabsContent value="verify" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Verify Your Access
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="eventId">Event ID</Label>
                    <div className="relative mt-2">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="eventId"
                        placeholder="Enter your event ID"
                        value={eventId}
                        onChange={(e) => setEventId(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Creator Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter the email used when creating the event"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div className="pt-4">
                    <OTPInput
                      onComplete={handleOTPVerification}
                      loading={verificationLoading}
                      error={verificationError}
                      title="Enter Your OTP"
                      description="Enter the 6-digit OTP you received when creating the event"
                      showResend={false}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="regenerate" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Regenerate OTP
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="regenerateEventId">Event ID</Label>
                    <Input
                      id="regenerateEventId"
                      placeholder="Enter your event ID"
                      value={eventId}
                      onChange={(e) => setEventId(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="regenerateEmail">Creator Email</Label>
                    <Input
                      id="regenerateEmail"
                      type="email"
                      placeholder="Enter the email used when creating the event"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <Button 
                    onClick={handleRegenerateOTP}
                    className="w-full"
                    disabled={!eventId || !email}
                  >
                    Generate New OTP
                  </Button>

                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">
                      <strong>Note:</strong> Regenerating OTP will invalidate your previous OTP. 
                      The new OTP will be displayed in a notification and expires in 30 minutes.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 text-primary">Manage Your Event</h1>
          <p className="text-muted-foreground">
            You are now managing: <strong>{currentEvent.title}</strong>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle>Event Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Title</Label>
                <p className="text-sm text-muted-foreground">{currentEvent.title}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-muted-foreground">{currentEvent.description}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Category</Label>
                <p className="text-sm text-muted-foreground">{currentEvent.category}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Date & Time</Label>
                <p className="text-sm text-muted-foreground">
                  {currentEvent.schedule.startDate} at {currentEvent.schedule.startTime}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Location</Label>
                <p className="text-sm text-muted-foreground">
                  {currentEvent.location.venue}
                  {currentEvent.location.address && `, ${currentEvent.location.address}`}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Capacity</Label>
                <p className="text-sm text-muted-foreground">
                  {currentEvent.capacity.registered}/{currentEvent.capacity.max} registered
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Management Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Management Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full flex items-center gap-2" variant="outline">
                <Edit className="h-4 w-4" />
                Edit Event Details
              </Button>
              
              <Button 
                className="w-full flex items-center gap-2" 
                variant="outline"
                onClick={handleRegenerateOTP}
              >
                <Lock className="h-4 w-4" />
                Regenerate OTP
              </Button>
              
              <Button 
                className="w-full flex items-center gap-2" 
                variant="destructive"
                onClick={handleDeleteEvent}
              >
                <Trash2 className="h-4 w-4" />
                Delete Event
              </Button>

              <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Important Notes:</h4>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  <li>• Keep your OTP secure and don't share it</li>
                  <li>• OTP expires 30 minutes after generation</li>
                  <li>• Deleting an event cannot be undone</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Button 
            variant="outline" 
            onClick={() => {
              setIsVerified(false);
              setCurrentEvent(null);
              setEventId("");
              setEmail("");
              setOtp("");
              setActiveTab("verify");
            }}
          >
            Exit Management Mode
          </Button>
        </div>
      </div>
    </div>
  );
}