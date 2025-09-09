// Event API Service
import { otpService, EventOTPInfo } from './otpService';

const API_BASE_URL = 'http://54.169.154.143:3863';
const TICKET_API_URL = 'http://54.169.154.143:3863/event-tickets';
const EMAIL_SERVICE_URL = 'http://localhost:3001'; // Backend email service

export interface EventData {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  status: string;
  featured: boolean;
  organizer: {
    name: string;
    contact: string;
    phone: string;
  };
  schedule: {
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    timezone: string;
  };
  location: {
    type: 'onsite' | 'online' | 'hybrid';
    venue?: string;
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    onlineLink?: string;
  };
  pricing: {
    currency: string;
    earlyBird?: number;
    regular?: number;
    student?: number;
    group?: number;
    vip?: number;
    adult?: number;
    child?: number;
    senior?: number;
    free?: number;
  };
  capacity: {
    max: number;
    registered: number;
    available: number;
  };
  images: {
    banner: string;
    thumbnail: string;
    gallery: string[];
  };
  tags: string[];
  requirements?: string[];
  speakers?: Array<{
    name: string;
    title: string;
    company: string;
    bio: string;
    image: string;
  }>;
  tracks?: string[];
  activities?: string[];
  layoutConfig?: LayoutConfig;
  customFields?: CustomField[];
}

export interface LayoutConfig {
  template: 'grid' | 'list' | 'card' | 'timeline' | 'custom';
  sections: {
    hero: SectionConfig;
    pricing: SectionConfig;
    schedule: SectionConfig;
    organizer: SectionConfig;
    gallery: SectionConfig;
    speakers: SectionConfig;
    location: SectionConfig;
    capacity: SectionConfig;
  };
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  spacing: 'compact' | 'normal' | 'spacious';
  customFields?: CustomField[];
}

export interface SectionConfig {
  enabled: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  order: number;
  customStyle?: {
    backgroundColor?: string;
    textColor?: string;
    borderColor?: string;
    borderRadius?: number;
    padding?: number;
    margin?: number;
  };
}

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'boolean' | 'date' | 'url' | 'image' | 'select' | 'textarea';
  value: any;
  required: boolean;
  enabled: boolean;
  options?: string[]; // สำหรับ select type
  placeholder?: string;
  description?: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style?: {
    fontSize?: number;
    fontWeight?: string;
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderRadius?: number;
  };
}

export interface EventSystemResponse {
  id: string;
  eventSystem: {
    systemInfo: {
      name: string;
      version: string;
      lastUpdated: string;
      totalEvents: number;
    };
    categories: Array<{
      id: string;
      name: string;
      description: string;
      color: string;
    }>;
    events: EventData[];
    metadata: {
      pagination: {
        currentPage: number;
        totalPages: number;
        itemsPerPage: number;
        totalItems: number;
      };
      filters: {
        categories: string[];
        priceRanges: Array<{
          min: number;
          max: number | null;
        }>;
        locations: string[];
        dateRanges: string[];
      };
      searchableFields: string[];
      sortOptions: Array<{
        field: string;
        order: 'asc' | 'desc';
        label: string;
      }>;
    };
  };
}

export type ApiResponse = EventSystemResponse[];

export interface TicketData {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  ticketType: string;
  quantity: number;
  totalAmount: number;
  currency: string;
  purchaseDate: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'used';
  qrCode?: string;
  additionalInfo?: {
    company?: string;
    dietaryRequirements?: string;
    notes?: string;
  };
}

export interface TicketApiResponse {
  value: TicketData[];
  Count: number;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  category: string;
    type: string;
  status?: string;
  featured?: boolean;
  organizer: {
    name: string;
    contact: string;
    phone: string;
  };
  schedule: {
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    timezone: string;
  };
  location: {
    type: 'onsite' | 'online' | 'hybrid';
    venue?: string;
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    onlineLink?: string;
  };
  pricing: {
    currency: string;
    earlyBird?: number;
    regular?: number;
    student?: number;
    group?: number;
    vip?: number;
    adult?: number;
    child?: number;
    senior?: number;
    free?: number;
  };
  capacity: {
    max: number;
    registered?: number;
    available?: number;
  };
  images: {
    banner?: string;
    thumbnail?: string;
    gallery?: string[];
  };
  tags: string[];
  requirements?: string[];
  speakers?: Array<{
    name: string;
    title: string;
    company: string;
    bio: string;
    image: string;
  }>;
  tracks?: string[];
  activities?: string[];
  includes?: string[];
  distances?: string[];
  artists?: Array<{
    name: string;
    instrument: string;
    country: string;
  }>;
}

export interface CreateEventResponse {
  success: boolean;
  eventId: string;
  message: string;
}

// Location data based on categories
interface LocationByCategory {
  [category: string]: string[];
}

class EventService {
  private eventSystemId: string | null = null;

  private async fetchApi<T>(endpoint: string): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('🌐 Making API request to:', url);
    try {
      const response = await fetch(url);
      console.log('📡 Response status:', response.status, response.statusText);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('📦 Response data type:', typeof data, 'Array?', Array.isArray(data));
      console.log('📦 Response data length:', Array.isArray(data) ? data.length : 'N/A');
      console.log('📦 First item structure:', data[0] ? Object.keys(data[0]) : 'No first item');
      return data;
    } catch (error) {
      console.error('❌ API Error:', error);
      throw error;
    }
  }

  // Get the event system ID from API
  private async getEventSystemId(): Promise<string> {
    if (this.eventSystemId) {
      return this.eventSystemId;
    }

    try {
      const response = await this.fetchApi<ApiResponse>('/events/');
      if (Array.isArray(response) && response.length > 0) {
        this.eventSystemId = response[0].id;
        console.log('🎯 Found event system ID:', this.eventSystemId);
        return this.eventSystemId;
      }
      throw new Error('No event system found');
    } catch (error) {
      console.error('❌ Error getting event system ID:', error);
      throw new Error('Failed to get event system ID');
    }
  }

  // Get locations based on category
  // In a real application, this would fetch from an API endpoint like `/locations?category=${category}`
  getLocationSuggestionsByCategory(category: string): string[] {
    // This is sample data based on the API response
    // In a real application, this would come from an API endpoint
    const locationsByCategory: LocationByCategory = {
      "conference": [
        "BITEC Bangna",
        "Queen Sirikit National Convention Center",
        "Impact Challenger",
        "Centara Grand at CentralWorld",
        "Anantara Siam Bangkok Hotel",
        "The Berkeley Hotel Pratunam"
      ],
      "workshop": [
        "Lebua State Tower",
        "The Commons",
        "Hubba Hubba",
        "True Digital Park",
        "Knowledge Park",
        "TechHub Bangkok"
      ],
      "networking": [
        "Somerset Lake Point",
        "The Roof @38th Bar",
        "Above Eleven",
        "Octave Rooftop Lounge",
        "Red Sky Bar",
        "Gaggan Anand"
      ],
      "entertainment": [
        "Lumpini Park Amphitheater",
        "Sanam Luang",
        "Lumphini Park",
        "Siam Paragon",
        "CentralWorld",
        "ICONSIAM"
      ],
      "sports": [
        "Lumpini Park",
        "Benjakitti Park",
        "Suan Lum Ratchad",
        "Huai Khwang Stadium",
        "Suphachalasai Stadium",
        "Rajamangala Stadium"
      ],
      "cultural": [
        "Wat Phra Kaew",
        "Grand Palace",
        "Wat Arun",
        "Wat Pho",
        "National Museum",
        "Bangkok Art and Culture Centre"
      ],
      "default": [
        "Central Business District",
        "Silom",
        "Sukhumvit",
        "Sathorn",
        "Ratchada",
        "Thonglor"
      ]
    };

    return locationsByCategory[category] || locationsByCategory["default"] || [];
  }

  async getEventById(id: string): Promise<EventData | null> {
    console.log('🔍 Looking for event with ID:', id);
    const events = await this.getAllEvents();
    console.log('📋 Available event IDs:', events.map(e => e.id));
    const foundEvent = events.find(event => event.id === id);
    console.log('🎯 Found event:', foundEvent ? foundEvent.title : 'NOT FOUND');
    return foundEvent || null;
  }

  async getFeaturedEvents(): Promise<EventData[]> {
    const events = await this.getAllEvents();
    return events.filter(event => event.featured);
  }

  async getEventsByCategory(category: string): Promise<EventData[]> {
    const events = await this.getAllEvents();
    return events.filter(event => event.category === category);
  }

  async searchEvents(query: string): Promise<EventData[]> {
    const events = await this.getAllEvents();
    const searchTerm = query.toLowerCase();
    
    return events.filter(event => 
      event.title.toLowerCase().includes(searchTerm) ||
      event.description.toLowerCase().includes(searchTerm) ||
      event.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      event.organizer.name.toLowerCase().includes(searchTerm) ||
      (event.location.venue && event.location.venue.toLowerCase().includes(searchTerm))
    );
  }

  async getCategories(): Promise<Array<{id: string; name: string; description: string; color: string}>> {
    const response = await this.fetchApi<ApiResponse>('/events/');
    if (Array.isArray(response) && response.length > 0) {
      return response[0].eventSystem.categories;
    }
    return [];
  }

  async getSystemInfo(): Promise<{name: string; version: string; lastUpdated: string; totalEvents: number} | null> {
    const response = await this.fetchApi<ApiResponse>('/events/');
    if (Array.isArray(response) && response.length > 0) {
      return response[0].eventSystem.systemInfo;
    }
    return null;
  }

  // Helper method to format price
  formatPrice(pricing: EventData['pricing'], type: 'regular' | 'earlyBird' | 'student' | 'vip' | 'adult' | 'child' | 'senior' = 'regular'): string {
    const price = pricing[type] || pricing.regular || pricing.adult || 0;
    if (price === 0 || pricing.free === 0) {
      return 'ฟรี';
    }
    return `${price.toLocaleString()} ${pricing.currency}`;
  }

  // Helper method to format date
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  // Helper method to format time
  formatTime(timeString: string): string {
    return timeString;
  }

  // Ticket Management Methods
  async getAllTickets(): Promise<TicketData[]> {
    try {
      const response = await fetch(TICKET_API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: TicketApiResponse = await response.json();
      return data.value || [];
    } catch (error) {
      console.error('❌ Error fetching tickets:', error);
      return [];
    }
  }

  async getTicketsByEventId(eventId: string): Promise<TicketData[]> {
    const tickets = await this.getAllTickets();
    return tickets.filter(ticket => ticket.eventId === eventId);
  }

  async getTicketsByUserId(userId: string): Promise<TicketData[]> {
    const tickets = await this.getAllTickets();
    return tickets.filter(ticket => ticket.userId === userId);
  }

  async createTicket(ticketData: Omit<TicketData, 'id' | 'purchaseDate' | 'status'>): Promise<TicketData | null> {
    try {
      const newTicket: TicketData = {
        ...ticketData,
        id: `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        purchaseDate: new Date().toISOString(),
        status: 'pending'
      };

      const response = await fetch(TICKET_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTicket)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return newTicket;
    } catch (error) {
      console.error('❌ Error creating ticket:', error);
      return null;
    }
  }

  async updateTicketStatus(ticketId: string, status: TicketData['status']): Promise<boolean> {
    try {
      const response = await fetch(`${TICKET_API_URL}/${ticketId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });

      return response.ok;
    } catch (error) {
      console.error('❌ Error updating ticket status:', error);
      return false;
    }
  }

  // Event Management with OTP
  async createEvent(eventData: CreateEventRequest): Promise<CreateEventResponse> {
    try {
      // Generate a unique event ID in the format evt_XXX
      const eventId = `evt_${String(Date.now()).slice(-3)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
      
      // Create event data in API format
      const newEvent: EventData = {
        id: eventId,
        title: eventData.title,
        description: eventData.description,
        category: eventData.category,
        type: eventData.type || eventData.category,
        status: eventData.status || 'active',
        featured: eventData.featured || false,
        organizer: {
          name: eventData.organizer.name,
          contact: eventData.organizer.contact,
          phone: eventData.organizer.phone
        },
        schedule: {
          startDate: eventData.schedule.startDate,
          endDate: eventData.schedule.endDate,
          startTime: eventData.schedule.startTime,
          endTime: eventData.schedule.endTime,
          timezone: eventData.schedule.timezone || 'Asia/Bangkok'
        },
        location: {
          type: eventData.location.type,
          venue: eventData.location.venue,
          address: eventData.location.address,
          coordinates: eventData.location.coordinates,
          onlineLink: eventData.location.onlineLink
        },
        pricing: {
          currency: eventData.pricing.currency || 'THB',
          // Include all pricing fields dynamically from user input
          ...Object.keys(eventData.pricing).reduce((acc, key) => {
            if (key !== 'currency' && eventData.pricing[key] !== undefined) {
              acc[key] = eventData.pricing[key];
            }
            return acc;
          }, {} as any)
        },
        capacity: {
          max: eventData.capacity.max,
          registered: eventData.capacity.registered || 0,
          available: eventData.capacity.available || eventData.capacity.max
        },
        images: {
          banner: eventData.images.banner || '/placeholder.svg',
          thumbnail: eventData.images.thumbnail || '/placeholder.svg',
          gallery: eventData.images.gallery || []
        },
        tags: eventData.tags,
        requirements: eventData.requirements,
        speakers: eventData.speakers,
        tracks: eventData.tracks,
        activities: eventData.activities
      };
      
      // Log pricing information
      console.log('💰 Event pricing details:', {
        eventId,
        pricing: newEvent.pricing,
        pricingKeys: Object.keys(newEvent.pricing),
        pricingValues: Object.values(newEvent.pricing)
      });
      
      // Send to external API
      try {
        await this.sendEventToAPI(newEvent);
        console.log('✅ Event sent to external API successfully');
      } catch (apiError) {
        console.warn('⚠️ Failed to send to external API, but event creation continues:', apiError);
        // Continue with event creation even if API fails
      }
      
      // Send email with Event ID (non-critical - don't fail event creation if email fails)
      await this.sendEventIdEmail(
        eventId, 
        eventData.organizer.contact, 
        eventData.title,
        eventData.schedule.startDate,
        eventData.location.venue || eventData.location.address || 'Online'
      );
      
      return {
        success: true,
        eventId,
        message: 'Event created successfully. Event ID has been sent to your email.'
      };
    } catch (error) {
      console.error('❌ Error creating event:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to create event: ${error.message}`);
      } else {
        throw new Error('Failed to create event: Unknown error occurred');
      }
    }
  }

  // Request OTP for event management
  async requestEventOTP(eventId: string, email: string): Promise<EventOTPInfo | null> {
    try {
      // Check if event exists
      const event = await this.getEventById(eventId);
      if (!event) {
        return null;
      }
      
      // Check if email matches the event creator
      if (event.organizer.contact !== email) {
        return null;
      }
      
      // Create OTP for the event
      const otpInfo = otpService.createEventOTP(eventId, email);
      
      // Send OTP email
      const emailSent = await this.sendOTPEmail(eventId, email, otpInfo.otp, event.title);
      
      if (!emailSent) {
        // If email failed, we should handle this appropriately
        console.warn('⚠️ Failed to send OTP email. User may need to request OTP again.');
        return null;
      }
      
      return otpInfo;
    } catch (error) {
      console.error('❌ Error requesting OTP:', error);
      return null;
    }
  }

  async verifyEventOTP(eventId: string, otp: string, email: string): Promise<boolean> {
    return otpService.verifyEventOTP(eventId, otp, email);
  }

  async regenerateEventOTP(eventId: string, email: string): Promise<string | null> {
    return otpService.regenerateOTP(eventId, email);
  }

  canManageEvent(eventId: string, email: string): boolean {
    return otpService.canManageEvent(eventId, email);
  }

  getUserEvents(email: string): string[] {
    return otpService.getUserEvents(email);
  }

  async updateEvent(eventId: string, eventData: Partial<CreateEventRequest>, otp: string, email: string): Promise<boolean> {
    try {
      console.log('🔄 Starting event update process...');
      console.log('📝 Event ID:', eventId);
      console.log('📝 Update data:', eventData);
      console.log('📝 OTP:', otp);
      console.log('📝 Email:', email);
      
      // Verify OTP first
      if (!this.verifyEventOTP(eventId, otp, email)) {
        console.error('❌ OTP verification failed');
        throw new Error('Invalid OTP or unauthorized access');
      }
      console.log('✅ OTP verification passed');

      // Get current event data from API
      const currentEvent = await this.getEventById(eventId);
      if (!currentEvent) {
        throw new Error('Event not found');
      }

      // Update event data - only update fields that are provided
      console.log('🔄 Updating event with data:', eventData);
      console.log('📋 Current event:', currentEvent.title);
      
      const updatedEvent: EventData = {
        ...currentEvent,
        // Only update if the field is provided in eventData
        ...(eventData.title && { title: eventData.title }),
        ...(eventData.description && { description: eventData.description }),
        ...(eventData.category && { category: eventData.category }),
        ...(eventData.type && { type: eventData.type }),
        ...(eventData.status && { status: eventData.status }),
        ...(eventData.featured !== undefined && { featured: eventData.featured }),
        
        // Update organizer only if provided
        ...(eventData.organizer && {
          organizer: {
            ...currentEvent.organizer,
            ...(eventData.organizer.name && { name: eventData.organizer.name }),
            ...(eventData.organizer.contact && { contact: eventData.organizer.contact }),
            ...(eventData.organizer.phone && { phone: eventData.organizer.phone })
          }
        }),
        
        // Update schedule only if provided
        ...(eventData.schedule && {
          schedule: {
            ...currentEvent.schedule,
            ...(eventData.schedule.startDate && { startDate: eventData.schedule.startDate }),
            ...(eventData.schedule.endDate && { endDate: eventData.schedule.endDate }),
            ...(eventData.schedule.startTime && { startTime: eventData.schedule.startTime }),
            ...(eventData.schedule.endTime && { endTime: eventData.schedule.endTime }),
            ...(eventData.schedule.timezone && { timezone: eventData.schedule.timezone })
          }
        }),
        
        // Update location only if provided
        ...(eventData.location && {
          location: {
            ...currentEvent.location,
            ...(eventData.location.type && { type: eventData.location.type }),
            ...(eventData.location.venue !== undefined && { venue: eventData.location.venue }),
            ...(eventData.location.address !== undefined && { address: eventData.location.address }),
            ...(eventData.location.coordinates && { coordinates: eventData.location.coordinates }),
            ...(eventData.location.onlineLink !== undefined && { onlineLink: eventData.location.onlineLink })
          }
        }),
        
        // Update pricing only if provided
        ...(eventData.pricing && {
          pricing: {
            // Start with only currency from current event
            currency: eventData.pricing.currency || currentEvent.pricing.currency,
            // Add only the pricing fields that user provided
            ...Object.keys(eventData.pricing).reduce((acc, key) => {
              if (key !== 'currency' && eventData.pricing[key] !== undefined) {
                acc[key] = eventData.pricing[key];
              }
              return acc;
            }, {} as any)
          }
        }),
        
        // Update capacity only if provided
        ...(eventData.capacity && {
          capacity: {
            ...currentEvent.capacity,
            ...(eventData.capacity.max !== undefined && { max: eventData.capacity.max }),
            ...(eventData.capacity.registered !== undefined && { registered: eventData.capacity.registered }),
            ...(eventData.capacity.available !== undefined && { available: eventData.capacity.available })
          }
        }),
        
        // Update images only if provided
        ...(eventData.images && {
          images: {
            ...currentEvent.images,
            ...(eventData.images.banner && { banner: eventData.images.banner }),
            ...(eventData.images.thumbnail && { thumbnail: eventData.images.thumbnail }),
            ...(eventData.images.gallery && { gallery: eventData.images.gallery })
          }
        }),
        
        // Update arrays only if provided
        ...(eventData.tags && { tags: eventData.tags }),
        ...(eventData.requirements && { requirements: eventData.requirements }),
        ...(eventData.speakers && { speakers: eventData.speakers }),
        ...(eventData.tracks && { tracks: eventData.tracks }),
        ...(eventData.activities && { activities: eventData.activities })
      };

      console.log('✅ Updated event data:', {
        title: updatedEvent.title,
        description: updatedEvent.description,
        category: updatedEvent.category,
        pricing: updatedEvent.pricing
      });
      
      console.log('💰 Pricing update details:', {
        originalPricing: currentEvent.pricing,
        newPricing: eventData.pricing,
        finalPricing: updatedEvent.pricing,
        pricingFieldsRemoved: Object.keys(currentEvent.pricing).filter(key => 
          key !== 'currency' && !(key in eventData.pricing)
        ),
        pricingFieldsAdded: Object.keys(eventData.pricing).filter(key => 
          key !== 'currency' && !(key in currentEvent.pricing)
        )
      });

      // Update in external API
      await this.updateEventInAPI(eventId, updatedEvent);
      console.log('✅ Event updated in external API successfully');

      return true;
    } catch (error) {
      console.error('❌ Error updating event:', error);
      return false;
    }
  }

  async deleteEvent(eventId: string, otp: string, email: string): Promise<boolean> {
    try {
      // Verify OTP first
      if (!this.verifyEventOTP(eventId, otp, email)) {
        throw new Error('Invalid OTP or unauthorized access');
      }

      // Delete from external API
      await this.deleteEventFromAPI(eventId);
      console.log('✅ Event deleted from external API successfully');
      
      return true;
    } catch (error) {
      console.error('❌ Error deleting event:', error);
      return false;
    }
  }


  // Get all events from API only
  async getAllEvents(): Promise<EventData[]> {
    console.log('🔄 Fetching events from API...');
    
    try {
      // Get events from API
      const response = await this.fetchApi<ApiResponse>('/events/');
      let apiEvents: EventData[] = [];
      
      
      if (Array.isArray(response) && response.length > 0) {
        // Only get events from the main event system (eventSystem.events)
        if (response[0].eventSystem && response[0].eventSystem.events) {
          apiEvents = response[0].eventSystem.events;
        }
      }
      
      console.log('📊 Total events loaded from eventSystem.events:', apiEvents.length);
      console.log('📋 Events:', apiEvents.map(e => e.id));
      
      return apiEvents;
    } catch (error) {
      console.error('❌ Error loading events from API:', error);
      throw error; // Don't fallback to local storage
    }
  }

  // Send event to external API
  private async sendEventToAPI(eventData: EventData): Promise<void> {
    try {
      // Get the event system ID dynamically
      const eventSystemId = await this.getEventSystemId();
      
      // Create the event data in the format expected by the API
      const apiEventData = {
        id: eventData.id,
        title: eventData.title,
        description: eventData.description,
        category: eventData.category,
        type: eventData.type,
        status: eventData.status,
        featured: eventData.featured,
        organizer: eventData.organizer,
        schedule: eventData.schedule,
        location: eventData.location,
        pricing: eventData.pricing,
        capacity: eventData.capacity,
        images: eventData.images,
        tags: eventData.tags,
        requirements: eventData.requirements,
        speakers: eventData.speakers,
        tracks: eventData.tracks,
        activities: eventData.activities
      };

      console.log('🌐 Sending event to API:', apiEventData.id);
      console.log('💰 Pricing data being sent:', {
        pricing: apiEventData.pricing,
        pricingKeys: Object.keys(apiEventData.pricing),
        pricingValues: Object.values(apiEventData.pricing)
      });
      console.log('📤 Full event data:', JSON.stringify(apiEventData, null, 2));
      
      // Get current event system data first
      const currentResponse = await fetch(`${API_BASE_URL}/events/${eventSystemId}`);
      const currentData = await currentResponse.json();
      
      // Add new event to the existing events array
      const updatedEventSystem = {
        ...currentData,
        eventSystem: {
          ...currentData.eventSystem,
          events: [...currentData.eventSystem.events, apiEventData],
          systemInfo: {
            ...currentData.eventSystem.systemInfo,
            totalEvents: currentData.eventSystem.systemInfo.totalEvents + 1,
            lastUpdated: new Date().toISOString().split('T')[0]
          }
        }
      };

      // Send PUT request to update the event system
      const response = await fetch(`${API_BASE_URL}/events/${eventSystemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEventSystem)
      });

      console.log('📡 API Response Status:', response.status);
      console.log('📡 API Response Headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ API Response:', result);
      
    } catch (error) {
      console.error('❌ Error sending event to API:', error);
      throw error;
    }
  }

  // Update event in external API
  public async updateEventInAPI(eventId: string, eventData: EventData): Promise<void> {
    try {
      console.log('🌐 Updating event in API:', eventId);
      
      // Get the event system ID dynamically
      const eventSystemId = await this.getEventSystemId();
      
      // Get current event system data
      const currentResponse = await fetch(`${API_BASE_URL}/events/${eventSystemId}`);
      const currentData = await currentResponse.json();
      
      // Update the specific event in the events array
      const updatedEvents = currentData.eventSystem.events.map((event: EventData) => 
        event.id === eventId ? eventData : event
      );
      
      console.log('🔄 Event update in API:', {
        eventId,
        originalEvent: currentData.eventSystem.events.find((e: EventData) => e.id === eventId),
        updatedEvent: eventData,
        pricingComparison: {
          original: currentData.eventSystem.events.find((e: EventData) => e.id === eventId)?.pricing,
          new: eventData.pricing
        },
        pricingFieldsRemoved: Object.keys(currentData.eventSystem.events.find((e: EventData) => e.id === eventId)?.pricing || {}).filter(key => 
          key !== 'currency' && !(key in eventData.pricing)
        ),
        pricingFieldsAdded: Object.keys(eventData.pricing).filter(key => 
          key !== 'currency' && !(key in currentData.eventSystem.events.find((e: EventData) => e.id === eventId)?.pricing || {})
        )
      });
      
      const updatedEventSystem = {
        ...currentData,
        eventSystem: {
          ...currentData.eventSystem,
          events: updatedEvents,
          systemInfo: {
            ...currentData.eventSystem.systemInfo,
            lastUpdated: new Date().toISOString().split('T')[0]
          }
        }
      };

      const response = await fetch(`${API_BASE_URL}/events/${eventSystemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEventSystem)
      });

      if (!response.ok) {
        throw new Error(`API update failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ API Update Response:', result);
      
    } catch (error) {
      console.error('❌ Error updating event in API:', error);
      throw error;
    }
  }

  // Delete event from external API
  private async deleteEventFromAPI(eventId: string): Promise<void> {
    try {
      console.log('🌐 Deleting event from API:', eventId);
      
      // Get the event system ID dynamically
      const eventSystemId = await this.getEventSystemId();
      
      // Get current event system data
      const currentResponse = await fetch(`${API_BASE_URL}/events/${eventSystemId}`);
      const currentData = await currentResponse.json();
      
      // Remove the specific event from the events array
      const updatedEvents = currentData.eventSystem.events.filter((event: EventData) => 
        event.id !== eventId
      );
      
      const updatedEventSystem = {
        ...currentData,
        eventSystem: {
          ...currentData.eventSystem,
          events: updatedEvents,
          systemInfo: {
            ...currentData.eventSystem.systemInfo,
            totalEvents: currentData.eventSystem.systemInfo.totalEvents - 1,
            lastUpdated: new Date().toISOString().split('T')[0]
          }
        }
      };

      const response = await fetch(`${API_BASE_URL}/events/${eventSystemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEventSystem)
      });

      if (!response.ok) {
        throw new Error(`API delete failed: ${response.status} ${response.statusText}`);
      }

      console.log('✅ Event deleted from API successfully');
      
    } catch (error) {
      console.error('❌ Error deleting event from API:', error);
      throw error;
    }
  }

  // Test function to update event directly
  async testUpdateEvent(eventId: string, updateData: Partial<CreateEventRequest>): Promise<boolean> {
    try {
      console.log('🧪 Testing event update...');
      console.log('📝 Event ID:', eventId);
      console.log('📝 Update data:', updateData);
      
      // Get current event
      const currentEvent = await this.getEventById(eventId);
      if (!currentEvent) {
        console.error('❌ Event not found');
        return false;
      }
      
      console.log('📋 Current event:', currentEvent.title);
      
      // Create updated event
      const updatedEvent: EventData = {
        ...currentEvent,
        ...(updateData.title && { title: updateData.title }),
        ...(updateData.description && { description: updateData.description }),
        ...(updateData.category && { category: updateData.category }),
        ...(updateData.type && { type: updateData.type }),
        ...(updateData.status && { status: updateData.status }),
        ...(updateData.featured !== undefined && { featured: updateData.featured })
      };
      
      console.log('✅ Updated event:', updatedEvent.title);
      
      // Update in API
      await this.updateEventInAPI(eventId, updatedEvent);
      console.log('✅ Event updated in API successfully');
      
      return true;
    } catch (error) {
      console.error('❌ Test update failed:', error);
      return false;
    }
  }

  // Send Event ID email
  private async sendEventIdEmail(eventId: string, email: string, eventName: string, eventDate?: string, eventLocation?: string) {
    try {
      const response = await fetch(`${EMAIL_SERVICE_URL}/send-event-id`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId,
          email,
          eventName,
          eventDate,
          eventLocation
        })
      });

      const result = await response.json();
      if (result.success) {
        console.log('📧 Event ID email sent successfully');
      } else {
        console.warn('⚠️ Email service warning:', result.message || result.error);
      }
      return result.success;
    } catch (error) {
      console.warn('⚠️ Failed to send Event ID email (email service may not be configured):', error);
      // Don't treat this as a critical error - the event was still created
      return true;
    }
  }

  // Send OTP email
  private async sendOTPEmail(eventId: string, email: string, otp: string, eventName: string) {
    try {
      const response = await fetch(`${EMAIL_SERVICE_URL}/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId,
          email,
          otp,
          eventName
        })
      });

      const result = await response.json();
      if (result.success) {
        console.log('📧 OTP email sent successfully');
      } else {
        console.error('❌ Failed to send OTP email:', result.error);
      }
      return result.success;
    } catch (error) {
      console.error('❌ Error sending OTP email:', error);
      return false;
    }
  }
}

// Layout Configuration Management Functions
export async function updateEventLayoutConfig(eventId: string, layoutConfig: LayoutConfig): Promise<void> {
  try {
    console.log('🎨 Updating layout configuration for event:', eventId);
    console.log('📋 Layout config:', layoutConfig);

    // Get current event data
    const currentEvent = await eventService.getEventById(eventId);
    if (!currentEvent) {
      throw new Error('Event not found');
    }

    // Update the event with new layout configuration
    const updatedEvent = {
      ...currentEvent,
      layoutConfig: layoutConfig
    };

    // Send to API - Note: Layout updates don't require email/OTP in this context
    const result = await eventService.updateEventInAPI(eventId, updatedEvent);
    
    console.log('✅ Layout configuration updated successfully');
  } catch (error) {
    console.error('❌ Error updating layout configuration:', error);
    throw error;
  }
}

export async function addCustomFieldToEvent(eventId: string, customField: CustomField): Promise<void> {
  try {
    console.log('➕ Adding custom field to event:', eventId);
    console.log('📝 Custom field:', customField);

    // Get current event data
    const currentEvent = await eventService.getEventById(eventId);
    if (!currentEvent) {
      throw new Error('Event not found');
    }

    // Initialize layoutConfig if it doesn't exist
    const layoutConfig = currentEvent.layoutConfig || {
      template: 'custom',
      sections: {
        hero: { enabled: true, position: { x: 0, y: 0 }, size: { width: 100, height: 20 }, order: 1 },
        pricing: { enabled: true, position: { x: 0, y: 20 }, size: { width: 50, height: 20 }, order: 2 },
        schedule: { enabled: true, position: { x: 50, y: 20 }, size: { width: 50, height: 20 }, order: 3 },
        organizer: { enabled: true, position: { x: 0, y: 40 }, size: { width: 50, height: 20 }, order: 4 },
        gallery: { enabled: true, position: { x: 50, y: 40 }, size: { width: 50, height: 20 }, order: 5 },
        speakers: { enabled: true, position: { x: 0, y: 60 }, size: { width: 50, height: 20 }, order: 6 },
        location: { enabled: true, position: { x: 50, y: 60 }, size: { width: 50, height: 20 }, order: 7 },
        capacity: { enabled: true, position: { x: 0, y: 80 }, size: { width: 50, height: 20 }, order: 8 }
      },
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        background: '#ffffff',
        text: '#1e293b'
      },
      spacing: 'normal',
      customFields: []
    };

    // Add the new custom field
    const updatedCustomFields = [...(layoutConfig.customFields || []), customField];
    
    const updatedLayoutConfig = {
      ...layoutConfig,
      customFields: updatedCustomFields
    };

    // Update the event
    const updatedEvent = {
      ...currentEvent,
      layoutConfig: updatedLayoutConfig
    };

    // Send to API - Note: Custom field updates don't require email/OTP in this context
    await eventService.updateEventInAPI(eventId, updatedEvent);
    
    console.log('✅ Custom field added successfully');
  } catch (error) {
    console.error('❌ Error adding custom field:', error);
    throw error;
  }
}

export async function updateCustomFieldInEvent(eventId: string, fieldId: string, updatedField: Partial<CustomField>): Promise<void> {
  try {
    console.log('✏️ Updating custom field in event:', eventId, 'field:', fieldId);

    // Get current event data
    const currentEvent = await eventService.getEventById(eventId);
    if (!currentEvent || !currentEvent.layoutConfig) {
      throw new Error('Event or layout config not found');
    }

    // Update the custom field
    const updatedCustomFields = currentEvent.layoutConfig.customFields?.map(field => 
      field.id === fieldId ? { ...field, ...updatedField } : field
    ) || [];

    const updatedLayoutConfig = {
      ...currentEvent.layoutConfig,
      customFields: updatedCustomFields
    };

    // Update the event
    const updatedEvent = {
      ...currentEvent,
      layoutConfig: updatedLayoutConfig
    };

    // Send to API - Note: Custom field updates don't require email/OTP in this context
    await eventService.updateEventInAPI(eventId, updatedEvent);
    
    console.log('✅ Custom field updated successfully');
  } catch (error) {
    console.error('❌ Error updating custom field:', error);
    throw error;
  }
}

export async function removeCustomFieldFromEvent(eventId: string, fieldId: string): Promise<void> {
  try {
    console.log('🗑️ Removing custom field from event:', eventId, 'field:', fieldId);

    // Get current event data
    const currentEvent = await eventService.getEventById(eventId);
    if (!currentEvent || !currentEvent.layoutConfig) {
      throw new Error('Event or layout config not found');
    }

    // Remove the custom field
    const updatedCustomFields = currentEvent.layoutConfig.customFields?.filter(field => field.id !== fieldId) || [];

    const updatedLayoutConfig = {
      ...currentEvent.layoutConfig,
      customFields: updatedCustomFields
    };

    // Update the event
    const updatedEvent = {
      ...currentEvent,
      layoutConfig: updatedLayoutConfig
    };

    // Send to API - Note: Custom field updates don't require email/OTP in this context
    await eventService.updateEventInAPI(eventId, updatedEvent);
    
    console.log('✅ Custom field removed successfully');
  } catch (error) {
    console.error('❌ Error removing custom field:', error);
    throw error;
  }
}

export async function reorderCustomFields(eventId: string, fieldIds: string[]): Promise<void> {
  try {
    console.log('🔄 Reordering custom fields for event:', eventId);

    // Get current event data
    const currentEvent = await eventService.getEventById(eventId);
    if (!currentEvent || !currentEvent.layoutConfig) {
      throw new Error('Event or layout config not found');
    }

    // Reorder custom fields based on the provided order
    const reorderedFields = fieldIds.map(id => 
      currentEvent.layoutConfig!.customFields?.find(field => field.id === id)
    ).filter(Boolean) as CustomField[];

    const updatedLayoutConfig = {
      ...currentEvent.layoutConfig,
      customFields: reorderedFields
    };

    // Update the event
    const updatedEvent = {
      ...currentEvent,
      layoutConfig: updatedLayoutConfig
    };

    // Send to API - Note: Custom field updates don't require email/OTP in this context
    await eventService.updateEventInAPI(eventId, updatedEvent);
    
    console.log('✅ Custom fields reordered successfully');
  } catch (error) {
    console.error('❌ Error reordering custom fields:', error);
    throw error;
  }
}

// Function to clean up custom heading fields from an event
export async function cleanupCustomHeadingFields(eventId: string): Promise<void> {
  try {
    console.log('🧹 Cleaning up custom heading fields for event:', eventId);
    
    // Get current event data
    const currentEvent = await eventService.getEventById(eventId);
    if (!currentEvent) {
      throw new Error('Event not found');
    }
    
    // Create a clean event object without custom heading fields
    const cleanEvent = { ...currentEvent };
    
    // Remove all custom heading fields
    Object.keys(cleanEvent).forEach(key => {
      if (key.startsWith('customheading_')) {
        delete cleanEvent[key];
        console.log('🗑️ Removed field:', key);
      }
    });
    
    // Update the event in API
    await eventService.updateEventInAPI(eventId, cleanEvent);
    
    console.log('✅ Custom heading fields cleaned up successfully');
  } catch (error) {
    console.error('❌ Error cleaning up custom heading fields:', error);
    throw error;
  }
}

export const eventService = new EventService();
export default eventService;