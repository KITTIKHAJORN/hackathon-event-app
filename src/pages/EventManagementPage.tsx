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
import { eventService, EventData } from "@/services/eventService";
import { Lock, Edit, Trash2, Search, Shield, Mail, Send, CheckCircle, Calendar, MapPin, Users, DollarSign, Save, ChevronLeft, ChevronRight, Plus, Ticket, RefreshCw, Clock } from "lucide-react";

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
    "ข้อมูลพื้นฐาน",
    "กำหนดการ",
    "สถานที่",
    "ความจุและราคา"
  ];

  // Render step content for editing
  const renderEditStep = () => {
    if (!editedEvent) return null;

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">ชื่อกิจกรรม</Label>
              <Input
                id="title"
                value={editedEvent.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="description">คำอธิบาย</Label>
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
                <Label htmlFor="category">หมวดหมู่</Label>
                <Input
                  id="category"
                  value={editedEvent.category || ''}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="organizer">ผู้จัดงาน</Label>
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
                <Label htmlFor="startDate">วันที่เริ่มต้น</Label>
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
                <Label htmlFor="startTime">เวลาเริ่มต้น</Label>
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
                <Label htmlFor="endDate">วันที่สิ้นสุด</Label>
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
                <Label htmlFor="endTime">เวลาสิ้นสุด</Label>
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
              <Label htmlFor="locationType">ประเภทสถานที่</Label>
              <Select
                value={editedEvent.location.type || ''}
                onValueChange={(value) => handleNestedChange('location', 'type', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="เลือกประเภทสถานที่" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onsite">ในสถานที่</SelectItem>
                  <SelectItem value="online">ออนไลน์</SelectItem>
                  <SelectItem value="hybrid">ผสม</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {editedEvent.location.type !== 'online' && (
              <div>
                <Label htmlFor="venue">สถานที่</Label>
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
                <Label htmlFor="address">ที่อยู่</Label>
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
                <Label htmlFor="onlineLink">ลิงก์ออนไลน์</Label>
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
                <Label htmlFor="maxCapacity">ความจุสูงสุด</Label>
                <Input
                  id="maxCapacity"
                  type="number"
                  value={editedEvent.capacity.max || 0}
                  onChange={(e) => handleNestedChange('capacity', 'max', parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="registered">ลงทะเบียนแล้ว</Label>
                <Input
                  id="registered"
                  type="number"
                  value={editedEvent.capacity.registered || 0}
                  onChange={(e) => handleNestedChange('capacity', 'registered', parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="available">ว่าง</Label>
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
              <Label htmlFor="currency">สกุลเงิน</Label>
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
                <Label className="text-lg font-semibold">ประเภทตั๋ว</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={addTicket}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    เพิ่มประเภทตั๋ว
                  </Button>
                  {tickets.length > 0 && (
                    <>
                      <Button
                        type="button"
                        onClick={resetPricing}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                        title="รีเซ็ตเป็นราคาเดิม"
                      >
                        <RefreshCw className="h-4 w-4" />
                        รีเซ็ต
                      </Button>
                      <Button
                        type="button"
                        onClick={clearAllTickets}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 text-destructive hover:text-destructive"
                        title="ล้างตั๋วทั้งหมด"
                      >
                        <Trash2 className="h-4 w-4" />
                        ล้างทั้งหมด
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
                        <h4 className="font-medium">ตั๋ว #{index + 1}</h4>
                        <div className="flex gap-1">
                          <Button
                            type="button"
                            onClick={() => duplicateTicket(index)}
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700"
                            title="ทำซ้ำตั๋ว"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            onClick={() => removeTicket(index)}
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            title="ลบตั๋ว"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`ticketName-${index}`}>ชื่อตั๋ว *</Label>
                          <Input
                            id={`ticketName-${index}`}
                            placeholder="เช่น Early Bird, VIP, Student"
                            value={ticket.name}
                            onChange={(e) => updateTicket(index, 'name', e.target.value)}
                            className="mt-2"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`ticketPrice-${index}`}>ราคา ({editedEvent.pricing.currency}) *</Label>
                          <Input
                            id={`ticketPrice-${index}`}
                            type="number"
                            placeholder="0 สำหรับฟรี"
                            value={ticket.price}
                            onChange={(e) => updateTicket(index, 'price', parseFloat(e.target.value) || 0)}
                            className="mt-2"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Label htmlFor={`ticketDescription-${index}`}>คำอธิบาย (ไม่บังคับ)</Label>
                        <Textarea
                          id={`ticketDescription-${index}`}
                          placeholder="อธิบายสิ่งที่รวมอยู่ในประเภทตั๋วนี้"
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
          <h3 className="text-lg font-semibold">ข้อมูลพื้นฐาน</h3>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <Label className="text-sm font-medium">ชื่อ</Label>
              <p className="text-sm">{currentEvent.title}</p>
            </div>

            <div>
              <Label className="text-sm font-medium">คำอธิบาย</Label>
              <p className="text-sm text-muted-foreground">{currentEvent.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium">หมวดหมู่</Label>
                <p className="text-sm">{currentEvent.category}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">ผู้จัดงาน</Label>
                <p className="text-sm">{currentEvent.organizer.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">กำหนดการ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label className="text-sm font-medium">เริ่ม</Label>
              <p className="text-sm">{currentEvent.schedule.startDate} เวลา {currentEvent.schedule.startTime}</p>
            </div>

            <div>
              <Label className="text-sm font-medium">สิ้นสุด</Label>
              <p className="text-sm">{currentEvent.schedule.endDate} เวลา {currentEvent.schedule.endTime}</p>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">สถานที่</h3>
          <div className="space-y-2">
            <div>
              <Label className="text-sm font-medium">ประเภท</Label>
              <p className="text-sm capitalize">{currentEvent.location.type}</p>
            </div>

            {currentEvent.location.venue && (
              <div>
                <Label className="text-sm font-medium">สถานที่</Label>
                <p className="text-sm">{currentEvent.location.venue}</p>
              </div>
            )}

            {currentEvent.location.address && (
              <div>
                <Label className="text-sm font-medium">ที่อยู่</Label>
                <p className="text-sm text-muted-foreground">{currentEvent.location.address}</p>
              </div>
            )}

            {currentEvent.location.onlineLink && (
              <div>
                <Label className="text-sm font-medium">ลิงก์ออนไลน์</Label>
                <p className="text-sm text-muted-foreground">{currentEvent.location.onlineLink}</p>
              </div>
            )}
          </div>
        </div>

        {/* Capacity & Pricing */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">ความจุและราคา</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label className="text-sm font-medium">ความจุสูงสุด</Label>
              <p className="text-sm">{currentEvent.capacity.max}</p>
            </div>

            <div>
              <Label className="text-sm font-medium">ลงทะเบียนแล้ว</Label>
              <p className="text-sm">{currentEvent.capacity.registered}</p>
            </div>

            <div>
              <Label className="text-sm font-medium">ว่าง</Label>
              <p className="text-sm">{currentEvent.capacity.available}</p>
            </div>
          </div>

          <div className="pt-2">
            <Label className="text-sm font-medium">ราคา</Label>
            <div className="grid grid-cols-1 gap-2 mt-1">
              <div className="flex justify-between">
                <span className="text-sm">สกุลเงิน</span>
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
                  <p>ไม่มีข้อมูลราคา</p>
                  <p className="text-xs">เพิ่มประเภทตั๋วเพื่อกำหนดราคา</p>
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
          แก้ไขรายละเอียดกิจกรรม
        </Button>
      </div>
    );
  };

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">การจัดการกิจกรรม</h1>
            <p className="text-muted-foreground">
              ป้อนรายละเอียดกิจกรรมของคุณเพื่อจัดการกิจกรรม
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="request">ขอ OTP</TabsTrigger>
              <TabsTrigger value="verify" disabled={!otpRequested}>ป้อน OTP</TabsTrigger>
            </TabsList>

            <TabsContent value="request" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    ขอสิทธิ์การจัดการ
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="eventId">รหัสกิจกรรม *</Label>
                    <div className="relative mt-2">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="eventId"
                        placeholder="ป้อนรหัสกิจกรรมของคุณ"
                        value={eventId}
                        onChange={(e) => setEventId(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">อีเมลผู้สร้าง *</Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="ป้อนอีเมลที่ใช้ในการสร้างกิจกรรม"
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
                    {requestLoading ? "กำลังส่ง OTP..." : "ขอ OTP"}
                    <Send className="h-4 w-4" />
                  </Button>

                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">
                      <strong>วิธีการทำงาน:</strong> หลังจากส่งรหัสกิจกรรมและอีเมลของคุณแล้ว
                      เราจะส่ง OTP 6 หลักไปยังที่อยู่อีเมลของคุณ
                      ป้อน OTP นั้นในขั้นตอนต่อไปเพื่อเข้าถึงการจัดการกิจกรรม
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
                    ยืนยันการเข้าถึงของคุณ
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">
                      OTP ถูกส่งไปยัง <strong>{email}</strong>.
                      กรุณาตรวจสอบอีเมลของคุณและป้อนรหัส 6 หลักด้านล่าง
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
          <h1 className="text-3xl font-bold mb-4 text-primary">จัดการกิจกรรมของคุณ</h1>
          <p className="text-muted-foreground">
            คุณกำลังจัดการ: <strong>{currentEvent?.title}</strong>
          </p>
        </div>

        {isEditing ? (
          // Edit mode with step-by-step form
          <div className="space-y-6">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">
                  ขั้นตอน {currentStep} จาก {totalSteps}
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round((currentStep / totalSteps) * 100)}% เสร็จสิ้น
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
                    ก่อนหน้า
                  </Button>
                  
                  {currentStep === totalSteps ? (
                    <Button
                      onClick={handleSaveEvent}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      บันทึกการเปลี่ยนแปลง
                    </Button>
                  ) : (
                    <Button
                      onClick={nextStep}
                      className="flex items-center gap-2"
                    >
                      ถัดไป
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
                ยกเลิก
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
                    รายละเอียดกิจกรรม
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
                    การดำเนินการจัดการ
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y4">
                  <Button
                    className="w-full flex items-center gap-2"
                    variant="destructive"
                    onClick={handleDeleteEvent}
                  >
                    <Trash2 className="h-4 w-4" />
                    ลบกิจกรรม
                  </Button>

                  <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">หมายเหตุสำคัญ:</h4>
                    <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                      <li>• การเปลี่ยนแปลงกิจกรรมจะถูกบันทึกในเครื่องในเดโมนี้</li>
                      <li>• การลบกิจกรรมไม่สามารถยกเลิกได้</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    ข้อมูลกิจกรรม
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>ID:</strong> {currentEvent?.id}</p>
                    <p><strong>สถานะ:</strong> {currentEvent?.status}</p>
                    <p><strong>แนะนำ:</strong> {currentEvent?.featured ? 'ใช่' : 'ไม่'}</p>
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
            ออกจากโหมดการจัดการ
          </Button>
        </div>
      </div>
    </div>
  );
}