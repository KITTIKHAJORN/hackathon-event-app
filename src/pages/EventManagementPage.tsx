import { OTPInput } from "@/components/common/OTPInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

import LayoutEditor from "@/components/layout/LayoutEditor";
import LayoutToolbar from "@/components/layout/LayoutToolbar";
import { EventData, eventService, LayoutConfig } from "@/services/eventService";
import { Calendar, CheckCircle, ChevronLeft, ChevronRight, Clock, DollarSign, Edit, Layout, Lock, Mail, MapPin, Plus, RefreshCw, Save, Search, Send, Shield, Ticket, Trash2 } from "lucide-react";


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
        title: t("incompleteData"),
        description: t("enterEventIdEmail"),
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
          title: t("eventNotFound"),
          description: t("eventNotFoundDesc"),
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
          title: t("otpRequested"),
          description: `${t("otpSentTo")} ${email}. ${t("checkEmailOTP")}.`,
        });
      } else {
        toast({
          title: t("otpRequestFailed"),
          description: t("otpRequestFailedDesc"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('OTP request error:', error);
      toast({
        title: t("error"),
        description: t("otpRequestError"),
        variant: "destructive",
      });
    } finally {
      setRequestLoading(false);
    }
  };

  // Verify OTP and load event
  const handleOTPVerification = async (inputOtp: string) => {
    if (!eventId || !email) {
      setVerificationError(t("enterEventIdEmail"));
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
            title: t("verificationSuccess"),
            description: t("manageEventAccess"),
          });
        } else {
          setVerificationError(t("eventNotFound"));
        }
      } else {
        setVerificationError(t("invalidOTP"));
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setVerificationError(t("verificationFailed"));
    } finally {
      setVerificationLoading(false);
    }
  };

  // Delete event
  const handleDeleteEvent = async () => {
    if (!currentEvent || !eventId || !email) return;

    const confirmed = window.confirm(t("confirmDelete"));
    if (!confirmed) return;

    try {
      const success = await eventService.deleteEvent(eventId, "", email);
      if (success) {
        toast({
          title: t("eventDeleted"),
          description: t("eventDeletedDesc"),
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
          title: t("deleteFailed"),
          description: t("failedToDelete"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: t("error"),
        description: t("deleteError"),
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

  const handleTimeIconClick = (inputId: string) => {
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (input) {
      input.focus();
      input.click();
      // For better browser support
      if (input.showPicker) {
        input.showPicker();
      } else {
        // Fallback for browsers that don't support showPicker
        input.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      }
    }
  };

  // Convert 24-hour time to 12-hour AM/PM format
  const formatTime12Hour = (time24: string) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour24 = parseInt(hours, 10);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Convert 12-hour AM/PM format to 24-hour format
  const formatTime24Hour = (time12: string) => {
    if (!time12) return '';
    const timeRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
    const match = time12.match(timeRegex);
    if (!match) return time12; // Return as-is if format doesn't match
    
    let [, hours, minutes, ampm] = match;
    let hour24 = parseInt(hours, 10);
    
    if (ampm.toUpperCase() === 'AM') {
      if (hour24 === 12) hour24 = 0;
    } else {
      if (hour24 !== 12) hour24 += 12;
    }
    
    return `${hour24.toString().padStart(2, '0')}:${minutes}`;
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
          title: t("eventUpdated"),
          description: t("eventUpdatedDesc"),
        });
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      console.error('❌ Save error:', error);
      toast({
        title: t("error"),
        description: t("failedToUpdate"),
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
    t("basicInformation"),
    t("schedule"),
    t("location"),
    t("capacityAndPricing")
  ];

  // Render step content for editing
  const renderEditStep = () => {
    if (!editedEvent) return null;

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">{t("eventTitle")}</Label>
              <Input
                id="title"
                value={editedEvent.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="description">{t("description")}</Label>
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
                <Label htmlFor="category">{t("category")}</Label>
                <Input
                  id="category"
                  value={editedEvent.category || ''}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="organizer">{t("organizer")}</Label>
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
                <Label htmlFor="startDate">{t("startDate")}</Label>
                <div className="relative mt-1">
                  <Input
                    id="startDate"
                    type="date"
                    value={editedEvent.schedule.startDate || ''}
                    onChange={(e) => handleNestedChange('schedule', 'startDate', e.target.value)}
                    onClick={() => handleTimeIconClick('startDate')}
                    className="w-full cursor-pointer pr-12 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-clear-button]:hidden"
                    style={{ colorScheme: 'light' }}
                  />
                  <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => handleTimeIconClick('startDate')}
                  >
                    <Calendar className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="startTime">{t("startTime")}</Label>
                <div className="relative mt-1">
                  <Input
                    id="startTime"
                    type="text"
                    placeholder="h:mm AM/PM"
                    value={formatTime12Hour(editedEvent.schedule.startTime || '')}
                    onChange={(e) => {
                      const time24 = formatTime24Hour(e.target.value);
                      handleNestedChange('schedule', 'startTime', time24);
                    }}
                    onClick={() => {
                      const picker = document.getElementById('startTimePicker') as HTMLInputElement;
                      if (picker) {
                        picker.focus();
                        picker.click();
                        if (picker.showPicker) {
                          picker.showPicker();
                        }
                      }
                    }}
                    className="w-full pr-12 cursor-pointer"
                  />
                  {/* Hidden time input for picker */}
                  <input
                    id="startTimePicker"
                    type="time"
                    value={editedEvent.schedule.startTime || ''}
                    onChange={(e) => {
                      handleNestedChange('schedule', 'startTime', e.target.value);
                    }}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    style={{ zIndex: 10 }}
                  />
                  <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => {
                      const picker = document.getElementById('startTimePicker') as HTMLInputElement;
                      if (picker) {
                        picker.focus();
                        picker.click();
                        if (picker.showPicker) {
                          picker.showPicker();
                        }
                      }
                    }}
                  >
                    <Clock className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="endDate">{t("endDate")}</Label>
                <div className="relative mt-1">
                  <Input
                    id="endDate"
                    type="date"
                    value={editedEvent.schedule.endDate || ''}
                    onChange={(e) => handleNestedChange('schedule', 'endDate', e.target.value)}
                    onClick={() => handleTimeIconClick('endDate')}
                    className="w-full cursor-pointer pr-12 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-clear-button]:hidden"
                    style={{ colorScheme: 'light' }}
                  />
                  <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => handleTimeIconClick('endDate')}
                  >
                    <Calendar className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="endTime">{t("endTime")}</Label>
                <div className="relative mt-1">
                  <Input
                    id="endTime"
                    type="text"
                    placeholder="h:mm AM/PM"
                    value={formatTime12Hour(editedEvent.schedule.endTime || '')}
                    onChange={(e) => {
                      const time24 = formatTime24Hour(e.target.value);
                      handleNestedChange('schedule', 'endTime', time24);
                    }}
                    onClick={() => {
                      const picker = document.getElementById('endTimePicker') as HTMLInputElement;
                      if (picker) {
                        picker.focus();
                        picker.click();
                        if (picker.showPicker) {
                          picker.showPicker();
                        }
                      }
                    }}
                    className="w-full pr-12 cursor-pointer"
                  />
                  {/* Hidden time input for picker */}
                  <input
                    id="endTimePicker"
                    type="time"
                    value={editedEvent.schedule.endTime || ''}
                    onChange={(e) => {
                      handleNestedChange('schedule', 'endTime', e.target.value);
                    }}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    style={{ zIndex: 10 }}
                  />
                  <div
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => {
                      const picker = document.getElementById('endTimePicker') as HTMLInputElement;
                      if (picker) {
                        picker.focus();
                        picker.click();
                        if (picker.showPicker) {
                          picker.showPicker();
                        }
                      }
                    }}
                  >
                    <Clock className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="locationType">{t("locationType")}</Label>
              <Select
                value={editedEvent.location.type || ''}
                onValueChange={(value) => handleNestedChange('location', 'type', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={t("selectLocationType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onsite">{t("onsite")}</SelectItem>
                  <SelectItem value="online">{t("online")}</SelectItem>
                  <SelectItem value="hybrid">{t("hybrid")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {editedEvent.location.type !== 'online' && (
              <div>
                <Label htmlFor="venue">{t("venue")}</Label>
                <Input
                  id="venue"
                  value={editedEvent.location.venue || ''}
                  onChange={(e) => handleNestedChange('location', 'venue', e.target.value)}
                  className="mt-1"
                  placeholder={t("enterVenueName")}
                />
              </div>
            )}
            
            {editedEvent.location.type !== 'online' && (
              <div>
                <Label htmlFor="address">{t("address")}</Label>
                <Textarea
                  id="address"
                  value={editedEvent.location.address || ''}
                  onChange={(e) => handleNestedChange('location', 'address', e.target.value)}
                  className="w-full min-h-[80px] mt-1"
                  rows={2}
                  placeholder={t("enterFullAddress")}
                />
              </div>
            )}
            
            {editedEvent.location.type !== 'onsite' && (
              <div>
                <Label htmlFor="onlineLink">{t("onlineLink")}</Label>
                <Input
                  id="onlineLink"
                  value={editedEvent.location.onlineLink || ''}
                  onChange={(e) => handleNestedChange('location', 'onlineLink', e.target.value)}
                  className="mt-1"
                  placeholder={t("enterOnlineLink")}
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
                <Label htmlFor="maxCapacity">{t("maxCapacity")}</Label>
                <Input
                  id="maxCapacity"
                  type="number"
                  value={editedEvent.capacity.max || 0}
                  onChange={(e) => handleNestedChange('capacity', 'max', parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="registered">{t("registered")}</Label>
                <Input
                  id="registered"
                  type="number"
                  value={editedEvent.capacity.registered || 0}
                  onChange={(e) => handleNestedChange('capacity', 'registered', parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="available">{t("available")}</Label>
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
              <Label htmlFor="currency">{t("currency")}</Label>
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
                <Label className="text-lg font-semibold">{t("ticketTypes")}</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={addTicket}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    {t("addTicketType")}
                  </Button>
                  {tickets.length > 0 && (
                    <>
                      <Button
                        type="button"
                        onClick={resetPricing}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                        title={t("resetToOriginal")}
                      >
                        <RefreshCw className="h-4 w-4" />
                        {t("reset")}
                      </Button>
                      <Button
                        type="button"
                        onClick={clearAllTickets}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 text-destructive hover:text-destructive"
                        title={t("clearAllTickets")}
                      >
                        <Trash2 className="h-4 w-4" />
                        {t("clear")}
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {tickets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Ticket className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{t("noTicketsFound")}</p>
                  <p className="text-sm">{t("addTicketTypeToSet")}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tickets.map((ticket, index) => (
                    <Card key={ticket.type} className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="font-medium">{t("ticket")} #{index + 1}</h4>
                        <div className="flex gap-1">
                          <Button
                            type="button"
                            onClick={() => duplicateTicket(index)}
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700"
                            title={t("copy")}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            onClick={() => removeTicket(index)}
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            title={t("delete")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`ticketName-${index}`}>{t("ticketName")} *</Label>
                          <Input
                            id={`ticketName-${index}`}
                            placeholder={t("egEarlyBird")}
                            value={ticket.name}
                            onChange={(e) => updateTicket(index, 'name', e.target.value)}
                            className="mt-2"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`ticketPrice-${index}`}>{t("price")} ({editedEvent.pricing.currency}) *</Label>
                          <Input
                            id={`ticketPrice-${index}`}
                            type="number"
                            placeholder={t("forFree")}
                            value={ticket.price}
                            onChange={(e) => updateTicket(index, 'price', parseFloat(e.target.value) || 0)}
                            className="mt-2"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Label htmlFor={`ticketDescription-${index}`}>{t("description")} ({t("optional")})</Label>
                        <Textarea
                          id={`ticketDescription-${index}`}
                          placeholder={t("explainWhatsIncluded")}
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
          <h3 className="text-lg font-semibold">{t("basicInfo")}</h3>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <Label className="text-sm font-medium">{t("name")}</Label>
              <p className="text-sm">{currentEvent.title}</p>
            </div>

            <div>
              <Label className="text-sm font-medium">{t("description")}</Label>
              <p className="text-sm text-muted-foreground">{currentEvent.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium">{t("category")}</Label>
                <p className="text-sm">{currentEvent.category}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">{t("organizer")}</Label>
                <p className="text-sm">{currentEvent.organizer.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">{t("schedule")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-medium">{t("start")}</Label>
              <p className="text-sm">{currentEvent.schedule.startDate} {t("at")} {currentEvent.schedule.startTime}</p>
            </div>

            <div>
              <Label className="text-sm font-medium">{t("end")}</Label>
              <p className="text-sm">{currentEvent.schedule.endDate} {t("at")} {currentEvent.schedule.endTime}</p>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">{t("location")}</h3>
          <div className="space-y-2">
            <div>
              <Label className="text-sm font-medium">{t("type")}</Label>
              <p className="text-sm capitalize">{currentEvent.location.type}</p>
            </div>

            {currentEvent.location.venue && (
              <div>
                <Label className="text-sm font-medium">{t("venue")}</Label>
                <p className="text-sm">{currentEvent.location.venue}</p>
              </div>
            )}

            {currentEvent.location.address && (
              <div>
                <Label className="text-sm font-medium">{t("address")}</Label>
                <p className="text-sm text-muted-foreground">{currentEvent.location.address}</p>
              </div>
            )}

            {currentEvent.location.onlineLink && (
              <div>
                <Label className="text-sm font-medium">{t("onlineLink")}</Label>
                <p className="text-sm text-muted-foreground">{currentEvent.location.onlineLink}</p>
              </div>
            )}
          </div>
        </div>

        {/* Capacity & Pricing */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">{t("capacityAndPricing")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label className="text-sm font-medium">{t("maxCapacity")}</Label>
              <p className="text-sm">{currentEvent.capacity.max}</p>
            </div>

            <div>
              <Label className="text-sm font-medium">{t("registered")}</Label>
              <p className="text-sm">{currentEvent.capacity.registered}</p>
            </div>

            <div>
              <Label className="text-sm font-medium">{t("available")}</Label>
              <p className="text-sm">{currentEvent.capacity.available}</p>
            </div>
          </div>

          <div className="pt-2">
            <Label className="text-sm font-medium">{t("price")}</Label>
            <div className="grid grid-cols-1 gap-2 mt-1">
              <div className="flex justify-between">
                <span className="text-sm">{t("currency")}</span>
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
                  <p>{t("noPricingInfo")}</p>
                  <p className="text-xs">{t("addTicketTypeToSet")}</p>
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
          {t("editEvent")}
        </Button>
      </div>
    );
  };

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{t("eventManagement")}</h1>
            <p className="text-muted-foreground">
              {t("enterEventDetails")}
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="request">{t("requestOTP")}</TabsTrigger>
              <TabsTrigger value="verify" disabled={!otpRequested}>{t("enterOTP")}</TabsTrigger>
            </TabsList>

            <TabsContent value="request" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    {t("requestAccess")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="eventId">{t("enterEventId")} *</Label>
                    <div className="relative mt-2">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="eventId"
                        placeholder={t("enterYourEventId")}
                        value={eventId}
                        onChange={(e) => setEventId(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">{t("enterCreatorEmail")} *</Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder={t("enterEmailUsed")}
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
                    {requestLoading ? t("sending") : t("requestOTP")}
                    <Send className="h-4 w-4" />
                  </Button>

                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">
                      <strong>{t("howItWorks")}</strong> {t("afterSubmitting")}
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
                    {t("verifyYourAccess")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">
                      {t("otpSentTo")} <strong>{email}</strong>.
                      {t("checkYourEmail")}
                    </p>
                  </div>

                  <div className="pt-4">
                    <OTPInput
                      onComplete={handleOTPVerification}
                      loading={verificationLoading}
                      error={verificationError}
                      title={t("enterYourOTP")}
                      description={t("enter6DigitOTP")}
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
          <h1 className="text-3xl font-bold mb-4 text-primary">{t("manageEventTitle")}</h1>
          <p className="text-muted-foreground">
            {t("managing")}: <strong>{currentEvent?.title}</strong>
          </p>
        </div>

        {isEditing ? (
          // Edit mode with step-by-step form
          <div className="space-y-6">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">
                  {t("step")} {currentStep} {t("of")} {totalSteps}
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round((currentStep / totalSteps) * 100)}% {t("completed")}
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
                    {t("previous")}
                  </Button>
                  
                  {currentStep === totalSteps ? (
                    <Button
                      onClick={handleSaveEvent}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {t("saveChanges")}
                    </Button>
                  ) : (
                    <Button
                      onClick={nextStep}
                      className="flex items-center gap-2"
                    >
                      {t("next")}
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
                {t("cancel")}
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
            {t("exitManagementMode")}
          </Button>
        </div>
      </div>
    </div>
  );
}