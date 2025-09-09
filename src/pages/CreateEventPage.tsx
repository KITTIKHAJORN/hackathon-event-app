import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Calendar, MapPin, Users, DollarSign, ChevronLeft, ChevronRight, Upload, Mail, Lock, CheckCircle } from "lucide-react";
import { eventService, CreateEventRequest } from "@/services/eventService";
import { useNavigate } from "react-router-dom";

export function CreateEventPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [eventCreated, setEventCreated] = useState(false);
  const [eventId, setEventId] = useState("");
  const totalSteps = 4; // Reduced from 5 to 4

  const [formData, setFormData] = useState({
    // Step 1: Creator Information
    creatorEmail: "",
    
    // Step 2: Basic Information
    title: "",
    description: "",
    category: "",
    
    // Step 3: Date & Location
    date: "",
    time: "",
    endTime: "",
    location: "",
    address: "",
    isOnline: false,
    
    // Step 4: Pricing & Capacity
    tickets: [{ type: "General", price: 0, description: "" }],
    maxAttendees: "",
    
    // Optional fields (no longer in separate step)
    image: null,
    tags: [],
    newTag: "",
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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

  const progress = (currentStep / totalSteps) * 100;

  const stepTitles = [
    "Creator Information",
    "Basic Information",
    "Date & Location",
    "Pricing & Capacity"
  ];

  // Category options
  const categories = [
    { value: "conference", label: "Conference" },
    { value: "workshop", label: "Workshop" },
    { value: "networking", label: "Networking" },
    { value: "entertainment", label: "Entertainment" },
    { value: "sports", label: "Sports & Fitness" },
    { value: "cultural", label: "Cultural Event" },
    { value: "other", label: "Other" }
  ];

  // Get location suggestions based on selected category
  const locationSuggestions = useMemo(() => {
    if (formData.category) {
      return eventService.getLocationSuggestionsByCategory(formData.category);
    }
    return [];
  }, [formData.category]);

  const addTag = () => {
    if (formData.newTag.trim() && !formData.tags.includes(formData.newTag.trim())) {
      updateFormData("tags", [...formData.tags, formData.newTag.trim()]);
      updateFormData("newTag", "");
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateFormData("tags", formData.tags.filter(tag => tag !== tagToRemove));
  };

  const addTicket = () => {
    updateFormData("tickets", [...formData.tickets, { type: "", price: 0, description: "" }]);
  };

  const removeTicket = (index: number) => {
    if (formData.tickets.length > 1) {
      const newTickets = formData.tickets.filter((_, i) => i !== index);
      updateFormData("tickets", newTickets);
    }
  };

  const updateTicket = (index: number, field: string, value: any) => {
    const newTickets = formData.tickets.map((ticket, i) => 
      i === index ? { ...ticket, [field]: value } : ticket
    );
    updateFormData("tickets", newTickets);
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return formData.creatorEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.creatorEmail);
      case 2:
        return formData.title && formData.description && formData.category;
      case 3:
        return formData.date && formData.time && formData.location;
      case 4:
        return formData.maxAttendees && parseInt(formData.maxAttendees) > 0;
      default:
        return false;
    }
  };

  const handleCreateEvent = async () => {
    if (!validateCurrentStep()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const eventData: CreateEventRequest = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        date: formData.date,
        time: formData.time,
        endTime: formData.endTime,
        location: formData.location,
        address: formData.address,
        isOnline: formData.isOnline,
        maxAttendees: parseInt(formData.maxAttendees),
        tickets: formData.tickets,
        tags: formData.tags,
        image: formData.image,
        creatorEmail: formData.creatorEmail
      };

      const response = await eventService.createEvent(eventData);
      
      if (response.success) {
        setEventId(response.eventId);
        setEventCreated(true);
        toast({
          title: "Event Created Successfully!",
          description: `Event ID has been sent to ${formData.creatorEmail}.`,
        });
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="creatorEmail">Your Email *</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="creatorEmail"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.creatorEmail}
                  onChange={(e) => updateFormData("creatorEmail", e.target.value)}
                  className="pl-10"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                This email will receive your event ID for management
              </p>
            </div>
            
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-primary mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-medium text-primary">Secure Event Management</h4>
                  <p className="text-sm text-muted-foreground">
                    After creating your event, you'll receive an Event ID at this email address.
                    When you want to manage your event, you'll need to:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Enter your Event ID and email</li>
                    <li>• Request an OTP for verification</li>
                    <li>• Enter the OTP to access event management</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                placeholder="Enter your event title"
                value={formData.title}
                onChange={(e) => updateFormData("title", e.target.value)}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your event"
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
                className="mt-2"
                rows={4}
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => updateFormData("category", value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select a category" />
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
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Event Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => updateFormData("date", e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="time">Start Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => updateFormData("time", e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="endTime">End Time (Optional)</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => updateFormData("endTime", e.target.value)}
                className="mt-2"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isOnline"
                checked={formData.isOnline}
                onChange={(e) => updateFormData("isOnline", e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="isOnline">This is an online event</Label>
            </div>
            
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder={formData.isOnline ? "Platform (e.g., Zoom, Google Meet)" : "Venue name"}
                value={formData.location}
                onChange={(e) => updateFormData("location", e.target.value)}
                className="mt-2"
              />
              
              {/* Location suggestions based on category */}
              {!formData.isOnline && locationSuggestions.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground mb-2">Suggested locations for {categories.find(c => c.value === formData.category)?.label || "this category"}:</p>
                  <div className="flex flex-wrap gap-2">
                    {locationSuggestions.map((location, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => updateFormData("location", location)}
                        className="text-xs bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary px-2 py-1 rounded cursor-pointer transition-colors"
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Click on a location to select it</p>
                </div>
              )}
            </div>
            
            {!formData.isOnline && (
              <div>
                <Label htmlFor="address">Full Address</Label>
                <Textarea
                  id="address"
                  placeholder="Complete address with directions"
                  value={formData.address}
                  onChange={(e) => updateFormData("address", e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="maxAttendees">Maximum Attendees *</Label>
              <Input
                id="maxAttendees"
                type="number"
                placeholder="Enter maximum number of attendees"
                value={formData.maxAttendees}
                onChange={(e) => updateFormData("maxAttendees", e.target.value)}
                className="mt-2"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <Label>Ticket Types</Label>
                <Button type="button" variant="outline" size="sm" onClick={addTicket}>
                  Add Ticket Type
                </Button>
              </div>
              
              <div className="space-y-4">
                {formData.tickets.map((ticket, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Ticket {index + 1}</h4>
                      {formData.tickets.length > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeTicket(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Ticket Type *</Label>
                        <Input
                          placeholder="e.g., General, VIP, Early Bird"
                          value={ticket.type}
                          onChange={(e) => updateTicket(index, "type", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Price (THB) *</Label>
                        <Input
                          type="number"
                          placeholder="0 for free"
                          value={ticket.price}
                          onChange={(e) => updateTicket(index, "price", parseFloat(e.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Description (Optional)</Label>
                      <Textarea
                        placeholder="What's included in this ticket?"
                        value={ticket.description}
                        onChange={(e) => updateTicket(index, "description", e.target.value)}
                        className="mt-1"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (eventCreated) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4 text-primary">Event Created Successfully!</h1>
            <p className="text-muted-foreground">
              Your event has been created and the Event ID has been sent to {formData.creatorEmail}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Your Event ID</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-primary/5 border-2 border-dashed border-primary rounded-xl p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">Event ID</p>
                  <p className="text-3xl font-bold tracking-wider text-primary">{eventId}</p>
                  <p className="text-xs text-muted-foreground mt-2">Save this ID for event management</p>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Event Details:</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p><strong>Event Title:</strong> {formData.title}</p>
                    <p><strong>Event Date:</strong> {formData.date} at {formData.time}</p>
                    <p><strong>Location:</strong> {formData.location}</p>
                  </div>
                </div>
                
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 text-primary">To Manage Your Event</h3>
                  <ol className="text-sm text-muted-foreground space-y-2 ml-4 list-decimal">
                    <li>Navigate to the Event Management page</li>
                    <li>Enter your Event ID and email address</li>
                    <li>Request an OTP for verification</li>
                    <li>Check your email for the OTP</li>
                    <li>Enter the OTP to access event management</li>
                  </ol>
                </div>
              </div>
              
              <div className="flex gap-4 mt-6">
                <Button onClick={() => navigate('/events')} className="flex-1">
                  View All Events
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEventCreated(false);
                    setEventId("");
                    setCurrentStep(1);
                    setFormData({
                      creatorEmail: "",
                      title: "",
                      description: "",
                      category: "",
                      date: "",
                      time: "",
                      endTime: "",
                      location: "",
                      address: "",
                      isOnline: false,
                      tickets: [{ type: "General", price: 0, description: "" }],
                      maxAttendees: "",
                      image: null,
                      tags: [],
                      newTag: "",
                    });
                  }}
                  className="flex-1"
                >
                  Create Another Event
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{t("createEvent")}</h1>
          <p className="text-muted-foreground">
            Create your event in a few simple steps
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentStep === 1 && <Mail className="h-5 w-5" />}
              {currentStep === 2 && <Calendar className="h-5 w-5" />}
              {currentStep === 3 && <MapPin className="h-5 w-5" />}
              {currentStep === 4 && <DollarSign className="h-5 w-5" />}
              {stepTitles[currentStep - 1]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStep()}

            <div className="flex justify-between pt-6 mt-6 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1 || loading}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              {currentStep === totalSteps ? (
                <Button 
                  onClick={handleCreateEvent}
                  disabled={!validateCurrentStep() || loading}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                >
                  {loading ? "Creating..." : "Create Event"}
                  <Upload className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  disabled={!validateCurrentStep() || loading}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}