// OTP Service for Event Management
export interface OTPData {
  eventId: string;
  otp: string;
  email: string;
  createdAt: string;
  expiresAt: string;
  used: boolean;
}

export interface EventOTPInfo {
  eventId: string;
  otp: string;
  creatorEmail: string;
  createdAt: string;
}

class OTPService {
  private readonly OTP_LENGTH = 6;
  private readonly OTP_EXPIRY_MINUTES = 30; // OTP expires in 30 minutes
  private readonly STORAGE_KEY = 'event_otps';

  // Generate a random OTP
  generateOTP(): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < this.OTP_LENGTH; i++) {
      otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
  }

  // Create OTP for event
  createEventOTP(eventId: string, creatorEmail: string): EventOTPInfo {
    const otp = this.generateOTP();
    const createdAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000).toISOString();

    const otpData: OTPData = {
      eventId,
      otp,
      email: creatorEmail,
      createdAt,
      expiresAt,
      used: false
    };

    // Store in localStorage (in production, this would be stored on server)
    this.storeOTP(otpData);

    return {
      eventId,
      otp,
      creatorEmail,
      createdAt
    };
  }

  // Verify OTP for event management
  verifyEventOTP(eventId: string, inputOTP: string, email: string): boolean {
    const storedOTPs = this.getStoredOTPs();
    const otpData = storedOTPs.find(otp => 
      otp.eventId === eventId && 
      otp.email === email &&
      !otp.used
    );

    if (!otpData) {
      return false;
    }

    // Check if OTP is expired
    if (new Date() > new Date(otpData.expiresAt)) {
      return false;
    }

    // Check if OTP matches
    if (otpData.otp !== inputOTP) {
      return false;
    }

    // Mark OTP as used
    otpData.used = true;
    this.updateStoredOTPs(storedOTPs);

    return true;
  }

  // Get OTP info for an event (without revealing the actual OTP)
  getEventOTPInfo(eventId: string): Omit<OTPData, 'otp'> | null {
    const storedOTPs = this.getStoredOTPs();
    const otpData = storedOTPs.find(otp => otp.eventId === eventId);
    
    if (!otpData) {
      return null;
    }

    const { otp, ...otpInfo } = otpData;
    return otpInfo;
  }

  // Check if user has permission to manage event
  canManageEvent(eventId: string, email: string): boolean {
    const storedOTPs = this.getStoredOTPs();
    return storedOTPs.some(otp => 
      otp.eventId === eventId && 
      otp.email === email
    );
  }

  // Get all events created by a user
  getUserEvents(email: string): string[] {
    const storedOTPs = this.getStoredOTPs();
    return storedOTPs
      .filter(otp => otp.email === email)
      .map(otp => otp.eventId);
  }

  // Regenerate OTP for an event
  regenerateOTP(eventId: string, email: string): string | null {
    const storedOTPs = this.getStoredOTPs();
    const otpIndex = storedOTPs.findIndex(otp => 
      otp.eventId === eventId && 
      otp.email === email
    );

    if (otpIndex === -1) {
      return null;
    }

    const newOTP = this.generateOTP();
    const newExpiryTime = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000).toISOString();

    storedOTPs[otpIndex] = {
      ...storedOTPs[otpIndex],
      otp: newOTP,
      expiresAt: newExpiryTime,
      used: false,
      createdAt: new Date().toISOString()
    };

    this.updateStoredOTPs(storedOTPs);
    return newOTP;
  }

  // Private methods for localStorage management
  private storeOTP(otpData: OTPData): void {
    const storedOTPs = this.getStoredOTPs();
    
    // Remove any existing OTP for the same event and email
    const filteredOTPs = storedOTPs.filter(otp => 
      !(otp.eventId === otpData.eventId && otp.email === otpData.email)
    );
    
    filteredOTPs.push(otpData);
    this.updateStoredOTPs(filteredOTPs);
  }

  private getStoredOTPs(): OTPData[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading OTPs from localStorage:', error);
      return [];
    }
  }

  private updateStoredOTPs(otps: OTPData[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(otps));
    } catch (error) {
      console.error('Error storing OTPs to localStorage:', error);
    }
  }

  // Clean up expired OTPs
  cleanupExpiredOTPs(): void {
    const storedOTPs = this.getStoredOTPs();
    const now = new Date();
    const validOTPs = storedOTPs.filter(otp => new Date(otp.expiresAt) > now);
    this.updateStoredOTPs(validOTPs);
  }

  // Format OTP for display (e.g., "123 456")
  formatOTP(otp: string): string {
    return otp.replace(/(\d{3})(\d{3})/, '$1 $2');
  }

  // Validate OTP format
  isValidOTPFormat(otp: string): boolean {
    const cleanOTP = otp.replace(/\s/g, '');
    return /^\d{6}$/.test(cleanOTP);
  }
}

export const otpService = new OTPService();
export default otpService;