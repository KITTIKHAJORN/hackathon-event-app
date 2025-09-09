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
  date: string;
  time: string;
  endTime?: string;
  location: string;
  address?: string;
  isOnline?: boolean;
  maxAttendees: number;
  tickets: Array<{
    type: string;
    price: number;
    description?: string;
  }>;
  tags: string[];
  image?: string;
  creatorEmail: string;
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
    const events = await this.getAllEvents();
    return events.find(event => event.id === id) || null;
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
      // Generate a unique event ID
      const eventId = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Store event data locally (in production, this would be sent to backend)
      const localEvents = this.getLocalEvents();
      const newEvent: EventData = {
        id: eventId,
        title: eventData.title,
        description: eventData.description,
        category: eventData.category,
        type: 'public',
        status: 'active',
        featured: false,
        organizer: {
          name: eventData.creatorEmail.split('@')[0],
          contact: eventData.creatorEmail,
          phone: ''
        },
        schedule: {
          startDate: eventData.date,
          endDate: eventData.date,
          startTime: eventData.time,
          endTime: eventData.endTime || eventData.time,
          timezone: 'Asia/Bangkok'
        },
        location: {
          type: eventData.isOnline ? 'online' : 'onsite',
          venue: eventData.location,
          address: eventData.address
        },
        pricing: {
          currency: 'THB',
          regular: eventData.tickets[0]?.price || 0
        },
        capacity: {
          max: eventData.maxAttendees,
          registered: 0,
          available: eventData.maxAttendees
        },
        images: {
          banner: eventData.image || '/placeholder.svg',
          thumbnail: eventData.image || '/placeholder.svg',
          gallery: []
        },
        tags: eventData.tags
      };
      
      localEvents.push(newEvent);
      this.saveLocalEvents(localEvents);
      
      // Send email with Event ID (non-critical - don't fail event creation if email fails)
      await this.sendEventIdEmail(
        eventId, 
        eventData.creatorEmail, 
        eventData.title,
        eventData.date,
        eventData.location
      );
      
      return {
        success: true,
        eventId,
        message: 'Event created successfully. Event ID has been sent to your email.'
      };
    } catch (error) {
      console.error('❌ Error creating event:', error);
      throw new Error('Failed to create event');
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
      // Verify OTP first
      if (!this.verifyEventOTP(eventId, otp, email)) {
        throw new Error('Invalid OTP or unauthorized access');
      }

      const localEvents = this.getLocalEvents();
      const eventIndex = localEvents.findIndex(event => event.id === eventId);
      
      if (eventIndex === -1) {
        throw new Error('Event not found');
      }

      // Update event data
      const updatedEvent = {
        ...localEvents[eventIndex],
        title: eventData.title || localEvents[eventIndex].title,
        description: eventData.description || localEvents[eventIndex].description,
        category: eventData.category || localEvents[eventIndex].category,
        // Update other fields as needed
      };

      localEvents[eventIndex] = updatedEvent;
      this.saveLocalEvents(localEvents);

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

      const localEvents = this.getLocalEvents();
      const filteredEvents = localEvents.filter(event => event.id !== eventId);
      
      this.saveLocalEvents(filteredEvents);
      return true;
    } catch (error) {
      console.error('❌ Error deleting event:', error);
      return false;
    }
  }

  // Local storage helpers for demo purposes
  private getLocalEvents(): EventData[] {
    try {
      const stored = localStorage.getItem('local_events');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading local events:', error);
      return [];
    }
  }

  private saveLocalEvents(events: EventData[]): void {
    try {
      localStorage.setItem('local_events', JSON.stringify(events));
    } catch (error) {
      console.error('Error saving local events:', error);
    }
  }

  // Override getAllEvents to include local events
  async getAllEvents(): Promise<EventData[]> {
    console.log('🔄 Fetching events from API and local storage...');
    
    try {
      // Get events from API
      const response = await this.fetchApi<ApiResponse>('/events/');
      let apiEvents: EventData[] = [];
      
      if (Array.isArray(response) && response.length > 0) {
        apiEvents = response[0].eventSystem.events;
      }
      
      // Get local events
      const localEvents = this.getLocalEvents();
      
      // Combine both sources
      const allEvents = [...apiEvents, ...localEvents];
      console.log('📊 Total events loaded:', allEvents.length, '(API:', apiEvents.length, ', Local:', localEvents.length, ')');
      
      return allEvents;
    } catch (error) {
      console.error('❌ Error loading events, falling back to local events only:', error);
      return this.getLocalEvents();
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

export const eventService = new EventService();
export default eventService;