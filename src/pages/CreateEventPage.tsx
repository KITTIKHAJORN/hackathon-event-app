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
import { Calendar, MapPin, Users, DollarSign, ChevronLeft, ChevronRight, Upload, Mail, Lock, CheckCircle, FileText, Image, Plus, Trash2, Ticket, Clock } from "lucide-react";
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
  const totalSteps = 6; // Updated to 6 steps

  const [formData, setFormData] = useState({
    // Step 1: Organizer Information
    organizer: {
      name: "",
      contact: "",
      phone: ""
    },
    
    // Step 2: Basic Information
    title: "",
    description: "",
    category: "",
    type: "",
    status: "active",
    featured: false,
    
    // Step 3: Schedule
    schedule: {
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      timezone: "Asia/Bangkok"
    },
    
    // Step 4: Location
    location: {
      type: "onsite" as 'onsite' | 'online' | 'hybrid',
      venue: "",
      address: "",
      coordinates: {
        lat: 0,
        lng: 0
      },
      onlineLink: ""
    },
    
    // Step 5: Pricing & Capacity
    pricing: {
      currency: "THB"
    },
    tickets: [] as Array<{
      type: string;
      name: string;
      price: number;
      description?: string;
    }>,
    capacity: {
      max: 0,
      registered: 0,
      available: 0
    },
    
    // Step 6: Additional Information
    images: {
      banner: "",
      thumbnail: "",
      gallery: [] as string[]
    },
    tags: [] as string[],
    requirements: [] as string[],
    speakers: [] as Array<{
      name: string;
      title: string;
      company: string;
      bio: string;
      image: string;
    }>,
    tracks: [] as string[],
    activities: [] as string[],
    includes: [] as string[],
    distances: [] as string[],
    artists: [] as Array<{
      name: string;
      instrument: string;
      country: string;
    }>,
    
    // Form helpers
    newTag: "",
    newRequirement: "",
    newSpeaker: {
      name: "",
      title: "",
      company: "",
      bio: "",
      image: ""
    },
    newTrack: "",
    newActivity: "",
    newInclude: "",
    newDistance: "",
    newArtist: {
      name: "",
      instrument: "",
      country: ""
    }
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Ticket management functions
  const addTicket = () => {
    const newTicket = {
      type: `ticket_${Date.now()}`,
      name: "",
      price: 0,
      description: ""
    };
    setFormData(prev => ({
      ...prev,
      tickets: [...prev.tickets, newTicket]
    }));
  };

  const updateTicket = (index: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      tickets: prev.tickets.map((ticket, i) => 
        i === index ? { ...ticket, [field]: value } : ticket
      )
    }));
  };

  const removeTicket = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tickets: prev.tickets.filter((_, i) => i !== index)
    }));
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
    t("organizerInfo"),
    t("basicInfo"),
    t("schedule"),
    t("location"),
    t("pricingCapacity"),
    t("additionalInfo")
  ];

  // Category options
  const categories = [
    { value: "conference", label: t("conference") },
    { value: "workshop", label: t("workshop") },
    { value: "networking", label: t("networking") },
    { value: "entertainment", label: t("entertainment") },
    { value: "sports", label: t("sportsFitness") },
    { value: "cultural", label: t("culturalEvent") },
    { value: "other", label: t("other") }
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


  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return formData.organizer.name && formData.organizer.contact && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.organizer.contact);
      case 2:
        return formData.title && formData.description && formData.category && formData.type;
      case 3:
        return formData.schedule.startDate && formData.schedule.startTime && formData.schedule.endDate && formData.schedule.endTime;
      case 4:
        return formData.location.type && (formData.location.venue || formData.location.onlineLink);
      case 5:
        return formData.capacity.max > 0 && formData.tickets.length > 0 && formData.tickets.every(ticket => ticket.name && ticket.price >= 0);
      case 6:
        return true; // Additional information is optional
      default:
        return false;
    }
  };

  const handleCreateEvent = async () => {
    if (!validateCurrentStep()) {
      toast({
        title: t("error"),
        description: t("requiredField"),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Convert tickets to pricing format
      const pricingFromTickets = formData.tickets.reduce((acc, ticket) => {
        if (ticket.name && ticket.price !== undefined) {
          acc[ticket.name.toLowerCase().replace(/\s+/g, '')] = ticket.price;
        }
        return acc;
      }, { currency: formData.pricing.currency });

      const eventData: CreateEventRequest = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        type: formData.type,
        status: formData.status,
        featured: formData.featured,
        organizer: formData.organizer,
        schedule: formData.schedule,
        location: formData.location,
        pricing: pricingFromTickets,
        capacity: {
          max: formData.capacity.max,
          registered: 0,
          available: formData.capacity.max
        },
        images: formData.images,
        tags: formData.tags,
        requirements: formData.requirements,
        speakers: formData.speakers,
        tracks: formData.tracks,
        activities: formData.activities,
        includes: formData.includes,
        distances: formData.distances,
        artists: formData.artists
      };

      const response = await eventService.createEvent(eventData);
      
      if (response.success) {
        setEventId(response.eventId);
        setEventCreated(true);
        toast({
          title: t("eventCreated"),
          description: `${t("eventId")} ${t("sentTo")} ${formData.organizer.contact}.`,
        });
      }
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: t("error"),
        description: t("failedToCreate"),
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
              <Label htmlFor="organizerName">{t("organizerName")} *</Label>
              <Input
                id="organizerName"
                placeholder={t("enterOrganizerName")}
                value={formData.organizer.name}
                onChange={(e) => updateFormData("organizer", { ...formData.organizer, name: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="organizerEmail">{t("organizerEmail")} *</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="organizerEmail"
                  type="email"
                  placeholder="organizer@example.com"
                  value={formData.organizer.contact}
                  onChange={(e) => updateFormData("organizer", { ...formData.organizer, contact: e.target.value })}
                  className="pl-10"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {t("emailForEventId")}
              </p>
            </div>

            <div>
              <Label htmlFor="organizerPhone">{t("phoneNumber")}</Label>
              <Input
                id="organizerPhone"
                placeholder="+66-2-xxx-xxxx"
                value={formData.organizer.phone}
                onChange={(e) => updateFormData("organizer", { ...formData.organizer, phone: e.target.value })}
                className="mt-2"
              />
            </div>
            
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Lock className="h-5 w-5 text-primary mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-medium text-primary">{t("secureEventManagement")}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t("secureEventManagementDesc")}
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• {t("enterEventIdEmail")}</li>
                    <li>• {t("requestOTP")}</li>
                    <li>• {t("enterOTP")}</li>
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
              <Label htmlFor="title">{t("eventTitle")} *</Label>
              <Input
                id="title"
                placeholder={t("enterEventTitle")}
                value={formData.title}
                onChange={(e) => updateFormData("title", e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="description">{t("description")} *</Label>
              <Textarea
                id="description"
                placeholder={t("describeEvent")}
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
                className="mt-2"
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">{t("category")} *</Label>
                <Select value={formData.category} onValueChange={(value) => updateFormData("category", value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder={t("selectCategory")} />
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

              <div>
                <Label htmlFor="type">{t("eventType")} *</Label>
                <Select value={formData.type} onValueChange={(value) => updateFormData("type", value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder={t("selectEventType")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="workshop">{t("workshop")}</SelectItem>
                    <SelectItem value="conference">{t("conference")}</SelectItem>
                    <SelectItem value="networking">{t("networking")}</SelectItem>
                    <SelectItem value="concert">Concert</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="festival">Festival</SelectItem>
                    <SelectItem value="seminar">Seminar</SelectItem>
                    <SelectItem value="exhibition">Exhibition</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => updateFormData("featured", e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="featured">{t("featuredEvent")}</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="status"
                  checked={formData.status === "active"}
                  onChange={(e) => updateFormData("status", e.target.checked ? "active" : "inactive")}
                  className="rounded"
                />
                <Label htmlFor="status">{t("activeEvent")}</Label>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">{t("startDate")} *</Label>
                <div className="relative mt-2">
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.schedule.startDate}
                    onChange={(e) => {
                      // Format date to ensure DD/MM/YYYY format
                      const date = e.target.value;
                      if (date) {
                        const [year, month, day] = date.split('-');
                        if (year.length <= 4 && month.length <= 2 && day.length <= 2) {
                          updateFormData("schedule", { ...formData.schedule, startDate: date });
                        }
                      } else {
                        updateFormData("schedule", { ...formData.schedule, startDate: date });
                      }
                    }}
                    onClick={() => handleTimeIconClick('startDate')}
                    className="w-full cursor-pointer pr-12 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-clear-button]:hidden"
                    style={{ colorScheme: 'light' }}
                    max="9999-12-31"
                    min="2024-01-01"
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
                <Label htmlFor="startTime">{t("startTime")} *</Label>
                <div className="relative mt-2">
                  <Input
                    id="startTime"
                    type="text"
                    placeholder="h:mm AM/PM"
                    value={formatTime12Hour(formData.schedule.startTime)}
                    onChange={(e) => {
                      const time24 = formatTime24Hour(e.target.value);
                      updateFormData("schedule", { ...formData.schedule, startTime: time24 });
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
                    value={formData.schedule.startTime}
                    onChange={(e) => {
                      updateFormData("schedule", { ...formData.schedule, startTime: e.target.value });
                    }}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    style={{ zIndex: 10 }}
                  />
                  <div 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer pointer-events-none"
                    style={{ zIndex: 20 }}
                  >
                    <Clock className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="endDate">{t("endDate")} *</Label>
                <div className="relative mt-2">
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.schedule.endDate}
                    onChange={(e) => {
                      // Format date to ensure DD/MM/YYYY format
                      const date = e.target.value;
                      if (date) {
                        const [year, month, day] = date.split('-');
                        if (year.length <= 4 && month.length <= 2 && day.length <= 2) {
                          updateFormData("schedule", { ...formData.schedule, endDate: date });
                        }
                      } else {
                        updateFormData("schedule", { ...formData.schedule, endDate: date });
                      }
                    }}
                    onClick={() => handleTimeIconClick('endDate')}
                    className="w-full cursor-pointer pr-12 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-inner-spin-button]:hidden [&::-webkit-clear-button]:hidden"
                    style={{ colorScheme: 'light' }}
                    max="9999-12-31"
                    min="2024-01-01"
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
                <Label htmlFor="endTime">{t("endTime")} *</Label>
                <div className="relative mt-2">
                  <Input
                    id="endTime"
                    type="text"
                    placeholder="h:mm AM/PM"
                    value={formatTime12Hour(formData.schedule.endTime)}
                    onChange={(e) => {
                      const time24 = formatTime24Hour(e.target.value);
                      updateFormData("schedule", { ...formData.schedule, endTime: time24 });
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
                    value={formData.schedule.endTime}
                    onChange={(e) => {
                      updateFormData("schedule", { ...formData.schedule, endTime: e.target.value });
                    }}
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    style={{ zIndex: 10 }}
                  />
                  <div 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer pointer-events-none"
                    style={{ zIndex: 20 }}
                  >
                    <Clock className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="timezone">{t("timezone")}</Label>
              <Select value={formData.schedule.timezone} onValueChange={(value) => updateFormData("schedule", { ...formData.schedule, timezone: value })}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Bangkok">Asia/Bangkok (GMT+7)</SelectItem>
                  <SelectItem value="Asia/Singapore">Asia/Singapore (GMT+8)</SelectItem>
                  <SelectItem value="Asia/Tokyo">Asia/Tokyo (GMT+9)</SelectItem>
                  <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                  <SelectItem value="America/New_York">America/New_York (GMT-5)</SelectItem>
                  <SelectItem value="Europe/London">Europe/London (GMT+0)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="locationType">{t("locationType")} *</Label>
              <Select value={formData.location.type} onValueChange={(value) => updateFormData("location", { ...formData.location, type: value as 'onsite' | 'online' | 'hybrid' })}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder={t("selectLocationType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onsite">{t("onsite")}</SelectItem>
                  <SelectItem value="online">{t("online")}</SelectItem>
                  <SelectItem value="hybrid">{t("hybrid")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {formData.location.type !== 'online' && (
              <div>
                <Label htmlFor="venue">{t("venue")} *</Label>
                <div className="relative mt-2">
                  <Input
                    id="venue"
                    placeholder={t("enterVenueName")}
                    value={formData.location.venue}
                    onChange={(e) => updateFormData("location", { ...formData.location, venue: e.target.value })}
                    className="w-full cursor-text"
                  />
                </div>
                
                {/* Location suggestions based on category */}
                {locationSuggestions.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-2">Suggested locations for {categories.find(c => c.value === formData.category)?.label || "this category"}:</p>
                    <div className="flex flex-wrap gap-2">
                      {locationSuggestions.map((location, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => updateFormData("location", { ...formData.location, venue: location })}
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
            )}
            
            {formData.location.type !== 'online' && (
              <div>
                <Label htmlFor="address">{t("fullAddress")}</Label>
                <div className="relative mt-2">
                  <Textarea
                    id="address"
                    placeholder={t("completeAddress")}
                    value={formData.location.address}
                    onChange={(e) => updateFormData("location", { ...formData.location, address: e.target.value })}
                    className="w-full cursor-text resize-none"
                    rows={3}
                  />
                </div>
              </div>
            )}
            
            {formData.location.type !== 'onsite' && (
              <div>
                <Label htmlFor="onlineLink">{t("onlineLink")} *</Label>
                <div className="relative mt-2">
                  <Input
                    id="onlineLink"
                    placeholder="https://zoom.us/j/example123"
                    value={formData.location.onlineLink}
                    onChange={(e) => updateFormData("location", { ...formData.location, onlineLink: e.target.value })}
                    className="w-full cursor-text"
                  />
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">{t("latitude")}</Label>
                <div className="relative mt-2">
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    placeholder="13.7205"
                    value={formData.location.coordinates.lat || ''}
                    onChange={(e) => updateFormData("location", { 
                      ...formData.location, 
                      coordinates: { 
                        ...formData.location.coordinates, 
                        lat: parseFloat(e.target.value) || 0 
                      } 
                    })}
                    className="w-full cursor-pointer"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="longitude">{t("longitude")}</Label>
                <div className="relative mt-2">
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    placeholder="100.5592"
                    value={formData.location.coordinates.lng || ''}
                    onChange={(e) => updateFormData("location", { 
                      ...formData.location, 
                      coordinates: { 
                        ...formData.location.coordinates, 
                        lng: parseFloat(e.target.value) || 0 
                      } 
                    })}
                    className="w-full cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="maxCapacity">{t("maximumCapacity")} *</Label>
              <Input
                id="maxCapacity"
                type="number"
                placeholder={t("enterMaxAttendees")}
                value={formData.capacity.max}
                onChange={(e) => updateFormData("capacity", { ...formData.capacity, max: parseInt(e.target.value) || 0 })}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="currency">{t("currency")}</Label>
              <Select value={formData.pricing.currency} onValueChange={(value) => updateFormData("pricing", { ...formData.pricing, currency: value })}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder={t("selectCurrency")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="THB">THB (Thai Baht)</SelectItem>
                  <SelectItem value="USD">USD (US Dollar)</SelectItem>
                  <SelectItem value="EUR">EUR (Euro)</SelectItem>
                  <SelectItem value="SGD">SGD (Singapore Dollar)</SelectItem>
                  <SelectItem value="JPY">JPY (Japanese Yen)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dynamic Ticket Types */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Ticket Types</Label>
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
              </div>

              {formData.tickets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Ticket className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{t("noTicketTypes")}</p>
                  <p className="text-sm">{t("clickAddTicket")}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.tickets.map((ticket, index) => (
                    <Card key={ticket.type} className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="font-medium">{t("ticket")} #{index + 1}</h4>
                        <Button
                          type="button"
                          onClick={() => removeTicket(index)}
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          {t("remove")}
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`ticketName-${index}`}>{t("ticketName")} *</Label>
                          <Input
                            id={`ticketName-${index}`}
                            placeholder="e.g., Early Bird, VIP, Student"
                            value={ticket.name}
                            onChange={(e) => updateTicket(index, 'name', e.target.value)}
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`ticketPrice-${index}`}>{t("price")} ({formData.pricing.currency}) *</Label>
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
                        <Label htmlFor={`ticketDescription-${index}`}>{t("describeTicket")}</Label>
                        <Textarea
                          id={`ticketDescription-${index}`}
                          placeholder={t("describeTicket")}
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

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="bannerImage">{t("bannerImageUrl")}</Label>
              <Input
                id="bannerImage"
                placeholder="https://example.com/images/banner.jpg"
                value={formData.images.banner}
                onChange={(e) => updateFormData("images", { ...formData.images, banner: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="thumbnailImage">{t("thumbnailImageUrl")}</Label>
              <Input
                id="thumbnailImage"
                placeholder="https://example.com/images/thumbnail.jpg"
                value={formData.images.thumbnail}
                onChange={(e) => updateFormData("images", { ...formData.images, thumbnail: e.target.value })}
                className="mt-2"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <Label>{t("tags")}</Label>
                <Button type="button" variant="outline" size="sm" onClick={addTag}>
                  {t("addTag")}
                </Button>
              </div>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder={t("enterTag")}
                  value={formData.newTag}
                  onChange={(e) => updateFormData("newTag", e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded text-sm flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-primary hover:text-primary/70"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <Label>{t("requirements")}</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => {
                  if (formData.newRequirement.trim()) {
                    updateFormData("requirements", [...formData.requirements, formData.newRequirement.trim()]);
                    updateFormData("newRequirement", "");
                  }
                }}>
                  {t("addRequirement")}
                </Button>
              </div>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder={t("enterRequirement")}
                  value={formData.newRequirement}
                  onChange={(e) => updateFormData("newRequirement", e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (() => {
                    if (formData.newRequirement.trim()) {
                      updateFormData("requirements", [...formData.requirements, formData.newRequirement.trim()]);
                      updateFormData("newRequirement", "");
                    }
                  })()}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.requirements.map((req, index) => (
                  <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm flex items-center gap-1">
                    {req}
                    <button
                      type="button"
                      onClick={() => updateFormData("requirements", formData.requirements.filter((_, i) => i !== index))}
                      className="text-green-800 hover:text-green-600"
                    >
                      ×
                    </button>
                  </span>
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
             <h1 className="text-3xl font-bold mb-4 text-primary">{t("eventCreated")}</h1>
             <p className="text-muted-foreground">
               {t("eventCreatedDesc")} {t("sentTo")} {formData.organizer.contact}
             </p>
           </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">{t("yourEventId")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-primary/5 border-2 border-dashed border-primary rounded-xl p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">{t("eventId")}</p>
                  <p className="text-3xl font-bold tracking-wider text-primary">{eventId}</p>
                  <p className="text-xs text-muted-foreground mt-2">{t("saveEventId")}</p>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{t("eventDetails")}:</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p><strong>{t("eventTitle")}:</strong> {formData.title}</p>
                    <p><strong>{t("startDate")}:</strong> {formData.schedule.startDate} {t("at")} {formData.schedule.startTime}</p>
                    <p><strong>{t("location")}:</strong> {formData.location.venue || formData.location.onlineLink || 'TBD'}</p>
                    <p><strong>{t("organizer")}:</strong> {formData.organizer.name}</p>
                    <p><strong>{t("category")}:</strong> {formData.category}</p>
                    <p><strong>{t("eventType")}:</strong> {formData.type}</p>
                  </div>
                </div>
                
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 text-primary">{t("manageEventInstructions")}</h3>
                  <ol className="text-sm text-muted-foreground space-y-2 ml-4 list-decimal">
                    <li>{t("goToManageEvent")}</li>
                    <li>{t("enterEventIdEmail")}</li>
                    <li>{t("requestOTP")}</li>
                    <li>{t("checkEmailOTP")}</li>
                    <li>{t("enterOTP")}</li>
                  </ol>
                </div>
              </div>
              
              <div className="flex gap-4 mt-6">
                <Button onClick={() => navigate('/events')} className="flex-1">
                  {t("viewAllEvents")}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEventCreated(false);
                    setEventId("");
                    setCurrentStep(1);
                    setFormData({
                      organizer: {
                        name: "",
                        contact: "",
                        phone: ""
                      },
                      title: "",
                      description: "",
                      category: "",
                      type: "",
                      status: "active",
                      featured: false,
                      schedule: {
                        startDate: "",
                        endDate: "",
                        startTime: "",
                        endTime: "",
                        timezone: "Asia/Bangkok"
                      },
                      location: {
                        type: "onsite" as 'onsite' | 'online' | 'hybrid',
                        venue: "",
                        address: "",
                        coordinates: {
                          lat: 0,
                          lng: 0
                        },
                        onlineLink: ""
                      },
                      pricing: {
                        currency: "THB"
                      },
                      tickets: [],
                      capacity: {
                        max: 0,
                        registered: 0,
                        available: 0
                      },
                      images: {
                        banner: "",
                        thumbnail: "",
                        gallery: [] as string[]
                      },
                      tags: [] as string[],
                      requirements: [] as string[],
                      speakers: [] as Array<{
                        name: string;
                        title: string;
                        company: string;
                        bio: string;
                        image: string;
                      }>,
                      tracks: [] as string[],
                      activities: [] as string[],
                      includes: [] as string[],
                      distances: [] as string[],
                      artists: [] as Array<{
                        name: string;
                        instrument: string;
                        country: string;
                      }>,
                      newTag: "",
                      newRequirement: "",
                      newSpeaker: {
                        name: "",
                        title: "",
                        company: "",
                        bio: "",
                        image: ""
                      },
                      newTrack: "",
                      newActivity: "",
                      newInclude: "",
                      newDistance: "",
                      newArtist: {
                        name: "",
                        instrument: "",
                        country: ""
                      }
                    });
                  }}
                  className="flex-1"
                >
                  {t("createAnotherEvent")}
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
            {t("createEventSubtitle")}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              {t("step")} {currentStep} {t("of")} {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% {t("completed")}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentStep === 1 && <Users className="h-5 w-5" />}
              {currentStep === 2 && <FileText className="h-5 w-5" />}
              {currentStep === 3 && <Calendar className="h-5 w-5" />}
              {currentStep === 4 && <MapPin className="h-5 w-5" />}
              {currentStep === 5 && <DollarSign className="h-5 w-5" />}
              {currentStep === 6 && <Image className="h-5 w-5" />}
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
                {t("previous")}
              </Button>
              
              {currentStep === totalSteps ? (
                <Button
                  onClick={handleCreateEvent}
                  disabled={!validateCurrentStep() || loading}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                >
                  {loading ? t("creating") : t("createEvent")}
                  <Upload className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  disabled={!validateCurrentStep() || loading}
                  className="flex items-center gap-2"
                >
                  {t("next")}
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