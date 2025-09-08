// Event API Service
const API_BASE_URL = 'http://54.169.154.143:3863';
const TICKET_API_URL = 'http://54.169.154.143:3863/event-tickets';

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

  async getAllEvents(): Promise<EventData[]> {
    console.log('🔄 Fetching events from API...');
    const response = await this.fetchApi<ApiResponse>('/events/');
    console.log('✅ API Response received:', response);
    if (Array.isArray(response) && response.length > 0) {
      const events = response[0].eventSystem.events;
      console.log('📊 Events loaded:', events.length);
      return events;
    }
    console.log('⚠️ No events found in response');
    return [];
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
}

export const eventService = new EventService();
export default eventService;