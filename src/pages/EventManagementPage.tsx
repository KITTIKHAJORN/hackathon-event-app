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
import { eventService, EventData, LayoutConfig } from "@/services/eventService";
import { Lock, Edit, Trash2, Search, Shield, Mail, Send, CheckCircle, Calendar, MapPin, Users, DollarSign, Save, ChevronLeft, ChevronRight, Plus, Ticket, RefreshCw, Layout } from "lucide-react";
import LayoutEditor from "@/components/layout/LayoutEditor";
import LayoutToolbar from "@/components/layout/LayoutToolbar";

// EventData is imported from eventService

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
  const [otp, setOtp] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState<EventData | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [tickets, setTickets] = useState<Array<{
    type: string;
    name: string;
    price: number;
    description?: string;
  }>>([]);
  const [layoutConfig, setLayoutConfig] = useState<LayoutConfig | null>(null);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  
  // Wrapper function to handle both direct values and functions
  const handleSetFieldValues = (values: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => {
    if (typeof values === 'function') {
      setFieldValues(values);
    } else {
      setFieldValues(values);
    }
  };

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
        // Store OTP for later use in update
        setOtp(inputOtp);
        
        const event = await eventService.getEventById(eventId);
        if (event) {
          setCurrentEvent(event);
          setEditedEvent({ ...event }); // Create a copy for editing
          setIsVerified(true);
          setActiveTab("manage");
          
          // Initialize tickets from pricing
          initializeTicketsFromPricing(event);
          
          // Initialize layout config
          setLayoutConfig(event.layoutConfig || null);
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
          ...(prev[parent as keyof EventData] as any),
          [field]: value
        }
      };
    });
  };

  // Ticket management functions
  const addTicket = () => {
    const newTicket = {
      type: `ticket_${Date.now()}`,
      name: "",
      price: 0,
      description: ""
    };
    setTickets(prev => [...prev, newTicket]);
  };

  const updateTicket = (index: number, field: string, value: string | number) => {
    setTickets(prev => 
      prev.map((ticket, i) => 
        i === index ? { ...ticket, [field]: value } : ticket
      )
    );
  };

  const removeTicket = (index: number) => {
    setTickets(prev => prev.filter((_, i) => i !== index));
  };

  // Clear all tickets (useful for resetting pricing)
  const clearAllTickets = () => {
    setTickets([]);
  };

  // Format pricing field name for display
  const formatPricingFieldName = (key: string): string => {
    return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
  };

  // Get pricing fields that have values
  const getPricingFields = (pricing: any) => {
    return Object.entries(pricing)
      .filter(([key, value]) => key !== 'currency' && value !== undefined && value !== 0)
      .map(([key, value]) => ({
        name: formatPricingFieldName(key),
        value: value,
        key: key
      }));
  };

  // Reset pricing to original state
  const resetPricing = () => {
    if (currentEvent) {
      initializeTicketsFromPricing(currentEvent);
    }
  };

  // Duplicate a ticket
  const duplicateTicket = (index: number) => {
    const ticketToDuplicate = tickets[index];
    const newTicket = {
      ...ticketToDuplicate,
      type: `ticket_${Date.now()}`,
      name: `${ticketToDuplicate.name} (Copy)`,
      price: ticketToDuplicate.price
    };
    setTickets(prev => [...prev, newTicket]);
  };

  // Initialize tickets from event pricing when editing starts
  const initializeTicketsFromPricing = (event: EventData) => {
    const ticketTypes = [];
    const pricing = event.pricing as any;
    
    // Convert ALL pricing fields to tickets (including 0 values for editing)
    Object.keys(pricing).forEach(key => {
      if (key !== 'currency' && pricing[key] !== undefined) {
        ticketTypes.push({
          type: key,
          name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
          price: pricing[key],
          description: ''
        });
      }
    });
    
    // If no pricing fields found, add a default empty ticket for editing
    if (ticketTypes.length === 0) {
      ticketTypes.push({
        type: 'ticket',
        name: 'Ticket',
        price: 0,
        description: ''
      });
    }
    
    setTickets(ticketTypes);
  };

  // Save edited event
  const handleSaveEvent = async () => {
    if (!editedEvent || !currentEvent) return;
    
    try {
      console.log('🔄 Starting to save event changes...');
      console.log('📝 Event ID:', currentEvent.id);
      console.log('📝 Edited data:', editedEvent);
      
      // Convert tickets to pricing format - only include tickets with names and prices
      const pricingFromTickets = tickets.reduce((acc, ticket) => {
        if (ticket.name && ticket.name.trim() !== '' && ticket.price !== undefined) {
          acc[ticket.name.toLowerCase().replace(/\s+/g, '')] = ticket.price;
        }
        return acc;
      }, { 
        currency: editedEvent.pricing.currency
      });
      
      console.log('🎫 Tickets to pricing conversion:', {
        tickets: tickets,
        pricingFromTickets: pricingFromTickets,
        originalPricing: editedEvent.pricing
      });

      // Convert editedEvent to the format expected by updateEvent
      const updateData = {
        title: editedEvent.title,
        description: editedEvent.description,
        category: editedEvent.category,
        type: editedEvent.category, // Use category as type if not specified
        status: editedEvent.status,
        featured: editedEvent.featured,
        organizer: {
          name: editedEvent.organizer.name,
          contact: editedEvent.organizer.contact,
          phone: editedEvent.organizer.phone || ''
        },
        schedule: {
          startDate: editedEvent.schedule.startDate,
          endDate: editedEvent.schedule.endDate,
          startTime: editedEvent.schedule.startTime,
          endTime: editedEvent.schedule.endTime,
          timezone: 'Asia/Bangkok'
        },
        location: {
          type: editedEvent.location.type,
          venue: editedEvent.location.venue,
          address: editedEvent.location.address,
          onlineLink: editedEvent.location.onlineLink
        },
        pricing: pricingFromTickets,
        capacity: {
          max: editedEvent.capacity.max,
          registered: editedEvent.capacity.registered,
          available: editedEvent.capacity.available
        }
      };
      
      console.log('📤 Sending update data:', updateData);
      
      // Call the actual API update function
      const success = await eventService.updateEvent(
        currentEvent.id,
        updateData,
        otp, // You need to get the OTP from somewhere
        email
      );
      
      if (success) {
        console.log('✅ Event updated successfully');
        setCurrentEvent(editedEvent);
        setIsEditing(false);
        setCurrentStep(1);
        toast({
          title: "Event Updated",
          description: "Your event has been successfully updated",
        });
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      console.error('❌ Save error:', error);
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
          <div className="space-y-6">
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

            {/* Dynamic Ticket Types */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Ticket Types</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={addTicket}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Ticket Type
                  </Button>
                  {tickets.length > 0 && (
                    <>
                      <Button
                        type="button"
                        onClick={resetPricing}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                        title="Reset to original pricing"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Reset
                      </Button>
                      <Button
                        type="button"
                        onClick={clearAllTickets}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 text-destructive hover:text-destructive"
                        title="Clear all tickets"
                      >
                        <Trash2 className="h-4 w-4" />
                        Clear All
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {tickets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Ticket className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No ticket types added yet</p>
                  <p className="text-sm">Click "Add Ticket Type" to create your first ticket</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tickets.map((ticket, index) => (
                    <Card key={ticket.type} className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="font-medium">Ticket #{index + 1}</h4>
                        <div className="flex gap-1">
                          <Button
                            type="button"
                            onClick={() => duplicateTicket(index)}
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700"
                            title="Duplicate ticket"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            onClick={() => removeTicket(index)}
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            title="Remove ticket"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`ticketName-${index}`}>Ticket Name *</Label>
                          <Input
                            id={`ticketName-${index}`}
                            placeholder="e.g., Early Bird, VIP, Student"
                            value={ticket.name}
                            onChange={(e) => updateTicket(index, 'name', e.target.value)}
                            className="mt-2"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`ticketPrice-${index}`}>Price ({editedEvent.pricing.currency}) *</Label>
                          <Input
                            id={`ticketPrice-${index}`}
                            type="number"
                            placeholder="0 for free"
                            value={ticket.price}
                            onChange={(e) => updateTicket(index, 'price', parseFloat(e.target.value) || 0)}
                            className="mt-2"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Label htmlFor={`ticketDescription-${index}`}>Description (Optional)</Label>
                        <Textarea
                          id={`ticketDescription-${index}`}
                          placeholder="Describe what's included in this ticket type"
                          value={ticket.description || ''}
                          onChange={(e) => updateTicket(index, 'description', e.target.value)}
                          className="mt-2"
                          rows={2}
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              )}
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
                <span className="text-sm font-medium">{currentEvent.pricing.currency}</span>
              </div>
              {getPricingFields(currentEvent.pricing).map((field) => (
                <div key={field.key} className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{field.name}</span>
                  <span className="text-sm font-medium text-primary">
                    {field.value.toLocaleString()} {currentEvent.pricing.currency}
                  </span>
                </div>
              ))}
              {getPricingFields(currentEvent.pricing).length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">
                  <DollarSign className="h-6 w-6 mx-auto mb-2 opacity-50" />
                  <p>No pricing information available</p>
                  <p className="text-xs">Add ticket types to set pricing</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <Button
          onClick={() => {
            if (currentEvent) {
              initializeTicketsFromPricing(currentEvent);
              setIsEditing(true);
            }
          }}
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
          // View mode with tabs
          <Tabs defaultValue="details" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Event Details</TabsTrigger>
              <TabsTrigger value="layout">Layout Editor</TabsTrigger>
              <TabsTrigger value="actions">Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
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

                {/* Event Information */}
                <div>
                  <Card>
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
            </TabsContent>

            <TabsContent value="layout" className="h-[calc(100vh-200px)] -mx-24">
              <div className="h-full flex">
                {/* Left Toolbar */}
                <LayoutToolbar
                  onSave={async () => {
                    console.log('💾 Save layout clicked');
                    
                    if (currentEvent) {
                      try {
                        // Get all custom heading fields from fieldValues and merge them into the event
                        const customHeadingFields = Object.keys(fieldValues).filter(key => 
                          key.startsWith('customheading_') && !key.endsWith('_name')
                        );
                        
                        let updatedEvent = { ...currentEvent };
                        
                        // First, remove all existing custom heading fields from the event
                        // We need to check both old ID-based fields and new name-based fields
                        Object.keys(updatedEvent).forEach(key => {
                          if (key.startsWith('customheading_') || 
                              (typeof updatedEvent[key] === 'object' && Array.isArray(updatedEvent[key]) && 
                               !['tags', 'requirements', 'speakers', 'tracks', 'activities'].includes(key))) {
                            delete updatedEvent[key];
                            console.log(`🗑️ Removed existing custom heading field: ${key}`);
                          }
                        });
                        
                        // Then, add only the fields that exist in fieldValues
                        customHeadingFields.forEach(fieldName => {
                          const fieldValue = fieldValues[fieldName];
                          const fieldNameValue = fieldValues[`${fieldName}_name`] || 'Custom Heading';
                          
                          if (fieldValue !== undefined && fieldValue.trim() !== '') {
                            // Convert string to array format
                            const arrayValue = fieldValue.split('\n').filter(item => item.trim() !== '');
                            
                            // Use the user-defined field name as the key instead of the ID
                            const cleanFieldName = fieldNameValue.toLowerCase().replace(/[^a-z0-9]/g, '');
                            updatedEvent = {
                              ...updatedEvent,
                              [cleanFieldName]: arrayValue
                            };
                            console.log(`📝 Added custom heading field: ${cleanFieldName} (${fieldNameValue}) = ${JSON.stringify(arrayValue)}`);
                          }
                        });
                        
                        // Clean up fieldValues to remove deleted custom heading fields
                        const cleanedFieldValues = { ...fieldValues };
                        Object.keys(cleanedFieldValues).forEach(key => {
                          if (key.startsWith('customheading_') && !customHeadingFields.includes(key) && !key.endsWith('_name')) {
                            delete cleanedFieldValues[key];
                            delete cleanedFieldValues[`${key}_name`];
                            console.log(`🧹 Cleaned up deleted field from fieldValues: ${key}`);
                          }
                        });
                        setFieldValues(cleanedFieldValues);
                        
                        // Update the event in the API
                        await eventService.updateEventInAPI(currentEvent.id, updatedEvent);
                        setCurrentEvent(updatedEvent);
                        
                        // Show success message
                        alert('Layout saved successfully!');
                        console.log('✅ Layout saved to API');
                      } catch (error) {
                        console.error('❌ Error saving layout:', error);
                        alert('Error saving layout. Please try again.');
                      }
                    }
                  }}
                  onReset={() => {
                    console.log('Reset layout');
                  }}
                  onAddHeading={async () => {
                    console.log('🔍 onAddHeading clicked');
                    console.log('currentEvent:', currentEvent);
                    
                    if (currentEvent) {
                      try {
                        // Generate unique ID for the custom textfield
                        const fieldId = `customheading_${Date.now()}`;
                        const fieldName = 'Custom Heading';
                        const cleanFieldName = fieldName.toLowerCase().replace(/[^a-z0-9]/g, '');
                        
                        // Add to currentEvent as an array field with clean name
                        const updatedEvent = {
                          ...currentEvent,
                          [cleanFieldName]: [''] // Start with empty array
                        };
                        
                        // Update the event in the API immediately
                        await eventService.updateEventInAPI(currentEvent.id, updatedEvent);
                        setCurrentEvent(updatedEvent);
                        
                        // Add to fieldValues for editing
                        setFieldValues(prev => ({
                          ...prev,
                          [fieldId]: '',
                          [`${fieldId}_name`]: fieldName
                        }));
                        
                        console.log('✅ Added new heading field to API:', cleanFieldName);
                      } catch (error) {
                        console.error('❌ Error adding heading field:', error);
                        alert('Error adding heading field. Please try again.');
                      }
                    } else {
                      console.log('❌ Missing currentEvent');
                    }
                  }}
                  onAddTags={() => {
                    console.log('🔍 onAddTags clicked');
                    if (currentEvent) {
                      // Check if tags field exists in event object
                      const hasTagsField = 'tags' in currentEvent;
                      
                      if (hasTagsField) {
                        // Update existing tags in event object
                        const updatedEvent = Object.assign({}, currentEvent!, {
                          tags: [...(currentEvent.tags || []), 'new tag']
                        });
                        
                        // Update the event in the current state
                        setCurrentEvent(updatedEvent);
                        console.log('✅ Updated existing tags field in event object');
                      } else {
                        // Add new tags field to event object
                        const updatedEvent = Object.assign({}, currentEvent!, {
                          tags: ['tag1', 'tag2', 'tag3']
                        });
                        
                        setCurrentEvent(updatedEvent);
                        console.log('✅ Added new tags field to event object');
                      }
                    }
                  }}
                  onAddRequirements={() => {
                    console.log('🔍 onAddRequirements clicked');
                    if (currentEvent) {
                      // Check if requirements field exists in event object
                      const hasRequirementsField = 'requirements' in currentEvent;
                      
                      if (hasRequirementsField) {
                        // Update existing requirements in event object
                        const updatedEvent = Object.assign({}, currentEvent!, {
                          requirements: [...(currentEvent.requirements || []), 'new requirement']
                        });
                        
                        setCurrentEvent(updatedEvent);
                        console.log('✅ Updated existing requirements field in event object');
                      } else {
                        // Add new requirements field to event object
                        const updatedEvent = Object.assign({}, currentEvent!, {
                          requirements: ['requirement1', 'requirement2', 'requirement3']
                        });
                        
                        setCurrentEvent(updatedEvent);
                        console.log('✅ Added new requirements field to event object');
                      }
                    }
                  }}
                  onAddSpeakers={() => {
                    console.log('🔍 onAddSpeakers clicked');
                    if (currentEvent) {
                      // Check if speakers field exists in event object
                      const hasSpeakersField = 'speakers' in currentEvent;
                      
                      if (hasSpeakersField) {
                        // Update existing speakers in event object
                        const updatedEvent = Object.assign({}, currentEvent!, {
                          speakers: [...(currentEvent.speakers || []), {
                            name: 'Speaker Name',
                            title: 'Speaker Title',
                            company: 'Company Name',
                            bio: 'Speaker bio information',
                            image: ''
                          }]
                        });
                        
                        setCurrentEvent(updatedEvent);
                        console.log('✅ Updated existing speakers field in event object');
                      } else {
                        // Add new speakers field to event object
                        const updatedEvent = Object.assign({}, currentEvent!, {
                          speakers: [{
                            name: 'Speaker Name',
                            title: 'Speaker Title',
                            company: 'Company Name',
                            bio: 'Speaker bio information',
                            image: ''
                          }]
                        });
                        
                        setCurrentEvent(updatedEvent);
                        console.log('✅ Added new speakers field to event object');
                      }
                    }
                  }}
                  onAddTracks={() => {
                    console.log('🔍 onAddTracks clicked');
                    if (currentEvent) {
                      // Check if tracks field exists in event object
                      const hasTracksField = 'tracks' in currentEvent;
                      
                      if (hasTracksField) {
                        // Update existing tracks in event object
                        const updatedEvent = Object.assign({}, currentEvent!, {
                          tracks: [...(currentEvent.tracks || []), 'new track']
                        });
                        
                        setCurrentEvent(updatedEvent);
                        console.log('✅ Updated existing tracks field in event object');
                      } else {
                        // Add new tracks field to event object
                        const updatedEvent = Object.assign({}, currentEvent!, {
                          tracks: ['track1', 'track2', 'track3']
                        });
                        
                        setCurrentEvent(updatedEvent);
                        console.log('✅ Added new tracks field to event object');
                      }
                    }
                  }}
                  onAddActivities={() => {
                    console.log('🔍 onAddActivities clicked');
                    if (currentEvent) {
                      // Check if activities field exists in event object
                      const hasActivitiesField = 'activities' in currentEvent;
                      
                      if (hasActivitiesField) {
                        // Update existing activities in event object
                        const updatedEvent = Object.assign({}, currentEvent!, {
                          activities: [...(currentEvent.activities || []), 'new activity']
                        });
                        
                        setCurrentEvent(updatedEvent);
                        console.log('✅ Updated existing activities field in event object');
                      } else {
                        // Add new activities field to event object
                        const updatedEvent = Object.assign({}, currentEvent!, {
                          activities: ['activity1', 'activity2', 'activity3']
                        });
                        
                        setCurrentEvent(updatedEvent);
                        console.log('✅ Added new activities field to event object');
                      }
                    }
                  }}
                />
                
                {/* Main Content */}
                <Card className="h-full flex-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layout className="h-5 w-5" />
                      Layout Editor
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-full p-0 overflow-y-auto">
                    <LayoutEditor
                      eventId={eventId}
                      currentEvent={currentEvent || undefined}
                      currentLayout={layoutConfig || undefined}
                      fieldValues={fieldValues}
                      setFieldValues={handleSetFieldValues}
                      onLayoutChange={(layout) => {
                        setLayoutConfig(layout);
                      }}
                      onUpdateEvent={async (updatedEvent) => {
                        setCurrentEvent(updatedEvent);
                        
                        // Update the event in the API immediately for custom heading fields
                        try {
                          await eventService.updateEventInAPI(eventId, updatedEvent);
                          console.log('✅ Event updated in API:', updatedEvent);
                        } catch (error) {
                          console.error('❌ Failed to update event in API:', error);
                        }
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="actions">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Management Actions */}
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
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-4 w-4" />
                      Edit Event
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
                        <li>• Event changes are saved via API</li>
                        <li>• Deleting an event cannot be undone</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Event Information */}
                <Card>
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
                      <p><strong>Layout Config:</strong> {layoutConfig ? 'Enabled' : 'Default'}</p>
                      <p><strong>Custom Fields:</strong> {layoutConfig?.customFields?.length || 0}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
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