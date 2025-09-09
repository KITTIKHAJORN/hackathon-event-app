import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OTPInput } from "@/components/common/OTPInput";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { eventService } from "@/services/eventService";
import { Lock, Edit, Trash2, Search, Shield, Mail, Send, CheckCircle, Calendar, MapPin, Users, DollarSign, Save, ChevronLeft, ChevronRight } from "lucide-react";

// Define types for our event data
interface EventData {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  featured: boolean;
  organizer: {
    name: string;
    email: string;
  };
  schedule: {
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
  };
  location: {
    type: string;
    venue?: string;
    address?: string;
    onlineLink?: string;
  };
  capacity: {
    max: number;
    registered: number;
    available: number;
  };
  pricing: {
    currency: string;
    [key: string]: string | number;
  };
}

export function EventManagementPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("request");
  const [eventId, setEventId] = useState("");
  const [email, setEmail] = useState("");
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<EventData | null>(null);
  const [otpRequested, setOtpRequested] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState<EventData | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Request OTP for event management
  const handleRequestOTP = async () => {
    if (!eventId || !email) {
      toast({
        title: "Missing Information",
        description: "Please enter Event ID and Email",
        variant: "destructive",
      });
      return;
    }

    setRequestLoading(true);

    try {
      // Check if event exists and email matches creator
      const event = await eventService.getEventById(eventId);
      if (!event) {
        toast({
          title: "Event Not Found",
          description: "No event found with this ID",
          variant: "destructive",
        });
        setRequestLoading(false);
        return;
      }

      // In a real application, you would send an email with the OTP here
      // For now, we'll simulate this by generating and storing the OTP
      const otpInfo = await eventService.requestEventOTP(eventId, email);
      
      if (otpInfo) {
        setOtpRequested(true);
        setActiveTab("verify");
        toast({
          title: "OTP Requested",
          description: `OTP has been sent to ${email}. Please check your email.`,
        });
      } else {
        toast({
          title: "OTP Request Failed",
          description: "Unable to generate OTP. Please check your Event ID and Email.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('OTP request error:', error);
      toast({
        title: "Error",
        description: "An error occurred while requesting OTP",
        variant: "destructive",
      });
    } finally {
      setRequestLoading(false);
    }
  };

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
          setEditedEvent({ ...event }); // Create a copy for editing
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
      const success = await eventService.deleteEvent(eventId, "", email);
      if (success) {
        toast({
          title: "Event Deleted",
          description: "Your event has been successfully deleted",
        });
        // Reset state
        setIsVerified(false);
        setCurrentEvent(null);
        setEditedEvent(null);
        setEventId("");
        setEmail("");
        setActiveTab("request");
        setOtpRequested(false);
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

  // Handle input changes when editing
  const handleInputChange = (field: string, value: string | number) => {
    if (!editedEvent) return;
    
    setEditedEvent(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value
      };
    });
  };

  // Handle nested object changes
  const handleNestedChange = (parent: string, field: string, value: string | number) => {
    if (!editedEvent) return;
    
    setEditedEvent(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [parent]: {
          ...prev[parent as keyof EventData],
          [field]: value
        }
      };
    });
  };

  // Save edited event
  const handleSaveEvent = async () => {
    if (!editedEvent) return;
    
    try {
      // In a real implementation, you would call an API to save the changes
      // For now, we'll just update the local state
      setCurrentEvent(editedEvent);
      setIsEditing(false);
      setCurrentStep(1); // Reset step when saving
      toast({
        title: "Event Updated",
        description: "Your event has been successfully updated",
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: "Failed to save event changes",
        variant: "destructive",
      });
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    if (currentEvent) {
      setEditedEvent({ ...currentEvent }); // Reset to original values
    }
    setIsEditing(false);
    setCurrentStep(1); // Reset step when canceling
  };

  // Navigation functions for steps
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Step titles
  const stepTitles = [
    "Basic Information",
    "Schedule",
    "Location",
    "Capacity & Pricing"
  ];

  // Render step content for editing
  const renderEditStep = () => {
    if (!editedEvent) return null;

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                value={editedEvent.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editedEvent.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full min-h-[100px] mt-1"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={editedEvent.category || ''}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="organizer">Organizer</Label>
                <Input
                  id="organizer"
                  value={editedEvent.organizer.name || ''}
                  onChange={(e) => handleNestedChange('organizer', 'name', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={editedEvent.schedule.startDate || ''}
                  onChange={(e) => handleNestedChange('schedule', 'startDate', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={editedEvent.schedule.startTime || ''}
                  onChange={(e) => handleNestedChange('schedule', 'startTime', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={editedEvent.schedule.endDate || ''}
                  onChange={(e) => handleNestedChange('schedule', 'endDate', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={editedEvent.schedule.endTime || ''}
                  onChange={(e) => handleNestedChange('schedule', 'endTime', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="locationType">Location Type</Label>
              <Select 
                value={editedEvent.location.type || ''} 
                onValueChange={(value) => handleNestedChange('location', 'type', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select location type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onsite">Onsite</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {editedEvent.location.type !== 'online' && (
              <div>
                <Label htmlFor="venue">Venue</Label>
                <Input
                  id="venue"
                  value={editedEvent.location.venue || ''}
                  onChange={(e) => handleNestedChange('location', 'venue', e.target.value)}
                  className="mt-1"
                />
              </div>
            )}
            
            {editedEvent.location.type !== 'online' && (
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={editedEvent.location.address || ''}
                  onChange={(e) => handleNestedChange('location', 'address', e.target.value)}
                  className="w-full min-h-[80px] mt-1"
                  rows={2}
                />
              </div>
            )}
            
            {editedEvent.location.type !== 'onsite' && (
              <div>
                <Label htmlFor="onlineLink">Online Link</Label>
                <Input
                  id="onlineLink"
                  value={editedEvent.location.onlineLink || ''}
                  onChange={(e) => handleNestedChange('location', 'onlineLink', e.target.value)}
                  className="mt-1"
                />
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="maxCapacity">Max Capacity</Label>
                <Input
                  id="maxCapacity"
                  type="number"
                  value={editedEvent.capacity.max || 0}
                  onChange={(e) => handleNestedChange('capacity', 'max', parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="registered">Registered</Label>
                <Input
                  id="registered"
                  type="number"
                  value={editedEvent.capacity.registered || 0}
                  onChange={(e) => handleNestedChange('capacity', 'registered', parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="available">Available</Label>
                <Input
                  id="available"
                  type="number"
                  value={editedEvent.capacity.available || 0}
                  onChange={(e) => handleNestedChange('capacity', 'available', parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                value={editedEvent.pricing.currency || ''}
                onChange={(e) => handleNestedChange('pricing', 'currency', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              {Object.entries(editedEvent.pricing)
                .filter(([key]) => key !== 'currency')
                .map(([key, value]) => (
                  <div key={key} className="mb-3">
                    <Label>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                    <Input
                      value={value?.toString() || ''}
                      onChange={(e) => handleNestedChange('pricing', key, e.target.value)}
                      className="mt-1"
                    />
                  </div>
                ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Render view mode content in a more compact way
  const renderViewMode = () => {
    if (!currentEvent) return null;

    return (
      <div className="space-y-5">
        {/* Basic Information */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Basic Information</h3>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <Label className="text-sm font-medium">Title</Label>
              <p className="text-sm">{currentEvent.title}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Description</Label>
              <p className="text-sm text-muted-foreground">{currentEvent.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium">Category</Label>
                <p className="text-sm">{currentEvent.category}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Organizer</Label>
                <p className="text-sm">{currentEvent.organizer.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Schedule</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-medium">Start</Label>
              <p className="text-sm">{currentEvent.schedule.startDate} at {currentEvent.schedule.startTime}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium">End</Label>
              <p className="text-sm">{currentEvent.schedule.endDate} at {currentEvent.schedule.endTime}</p>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Location</h3>
          <div className="space-y-2">
            <div>
              <Label className="text-sm font-medium">Type</Label>
              <p className="text-sm capitalize">{currentEvent.location.type}</p>
            </div>
            
            {currentEvent.location.venue && (
              <div>
                <Label className="text-sm font-medium">Venue</Label>
                <p className="text-sm">{currentEvent.location.venue}</p>
              </div>
            )}
            
            {currentEvent.location.address && (
              <div>
                <Label className="text-sm font-medium">Address</Label>
                <p className="text-sm text-muted-foreground">{currentEvent.location.address}</p>
              </div>
            )}
            
            {currentEvent.location.onlineLink && (
              <div>
                <Label className="text-sm font-medium">Online Link</Label>
                <p className="text-sm text-muted-foreground">{currentEvent.location.onlineLink}</p>
              </div>
            )}
          </div>
        </div>

        {/* Capacity & Pricing */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Capacity & Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label className="text-sm font-medium">Max Capacity</Label>
              <p className="text-sm">{currentEvent.capacity.max}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Registered</Label>
              <p className="text-sm">{currentEvent.capacity.registered}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Available</Label>
              <p className="text-sm">{currentEvent.capacity.available}</p>
            </div>
          </div>
          
          <div className="pt-2">
            <Label className="text-sm font-medium">Pricing</Label>
            <div className="grid grid-cols-1 gap-2 mt-1">
              <div className="flex justify-between">
                <span className="text-sm">Currency</span>
                <span className="text-sm">{currentEvent.pricing.currency}</span>
              </div>
              {Object.entries(currentEvent.pricing)
                .filter(([key]) => key !== 'currency')
                .map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-sm capitalize">{key}</span>
                    <span className="text-sm">{value}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <Button
          onClick={() => setIsEditing(true)}
          className="w-full mt-4"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Event Details
        </Button>
      </div>
    );
  };

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Event Management</h1>
            <p className="text-muted-foreground">
              Enter your event details to manage your event
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="request">Request OTP</TabsTrigger>
              <TabsTrigger value="verify" disabled={!otpRequested}>Enter OTP</TabsTrigger>
            </TabsList>

            <TabsContent value="request" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Request Management Access
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="eventId">Event ID *</Label>
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
                    <Label htmlFor="email">Creator Email *</Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter the email used when creating the event"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={handleRequestOTP}
                    className="w-full flex items-center gap-2"
                    disabled={!eventId || !email || requestLoading}
                  >
                    {requestLoading ? "Sending OTP..." : "Request OTP"}
                    <Send className="h-4 w-4" />
                  </Button>

                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">
                      <strong>How it works:</strong> After submitting your Event ID and email, 
                      we'll send a 6-digit OTP to your email address. 
                      Enter that OTP in the next step to access event management.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="verify" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Verify Your Access
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">
                      OTP has been sent to <strong>{email}</strong>. 
                      Please check your email and enter the 6-digit code below.
                    </p>
                  </div>

                  <div className="pt-4">
                    <OTPInput
                      onComplete={handleOTPVerification}
                      loading={verificationLoading}
                      error={verificationError}
                      title="Enter Your OTP"
                      description="Enter the 6-digit OTP sent to your email"
                      showResend={false}
                    />
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-primary">Manage Your Event</h1>
          <p className="text-muted-foreground">
            You are now managing: <strong>{currentEvent?.title}</strong>
          </p>
        </div>

        {isEditing ? (
          // Edit mode with step-by-step form
          <div className="space-y-6">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">
                  Step {currentStep} of {totalSteps}
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round((currentStep / totalSteps) * 100)}% complete
                </span>
              </div>
              <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {currentStep === 1 && <Edit className="h-5 w-5" />}
                  {currentStep === 2 && <Calendar className="h-5 w-5" />}
                  {currentStep === 3 && <MapPin className="h-5 w-5" />}
                  {currentStep === 4 && <DollarSign className="h-5 w-5" />}
                  {stepTitles[currentStep - 1]}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderEditStep()}

                <div className="flex justify-between pt-6 mt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  {currentStep === totalSteps ? (
                    <Button 
                      onClick={handleSaveEvent}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                  ) : (
                    <Button
                      onClick={nextStep}
                      className="flex items-center gap-2"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          // View mode
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Event Details */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit className="h-5 w-5" />
                    Event Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderViewMode()}
                </CardContent>
              </Card>
            </div>

            {/* Management Actions */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Management Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                      <li>• Event changes are saved locally in this demo</li>
                      <li>• Deleting an event cannot be undone</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Event Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>ID:</strong> {currentEvent?.id}</p>
                    <p><strong>Status:</strong> {currentEvent?.status}</p>
                    <p><strong>Featured:</strong> {currentEvent?.featured ? 'Yes' : 'No'}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Button 
            variant="outline" 
            onClick={() => {
              setIsVerified(false);
              setCurrentEvent(null);
              setEditedEvent(null);
              setEventId("");
              setEmail("");
              setActiveTab("request");
              setOtpRequested(false);
              setIsEditing(false);
              setCurrentStep(1);
            }}
          >
            Exit Management Mode
          </Button>
        </div>
      </div>
    </div>
  );
}