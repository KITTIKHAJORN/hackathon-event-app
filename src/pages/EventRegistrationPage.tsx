import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CreditCard, User, Mail, Phone, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { eventService, EventData } from "@/services/eventService";

export function EventRegistrationPage() {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userPhone: '',
    company: '',
    ticketType: '',
    quantity: 1,
    dietaryRequirements: '',
    notes: ''
  });

  useEffect(() => {
    const loadEvent = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const eventData = await eventService.getEventById(id);
        setEvent(eventData);
      } catch (error) {
        console.error('Error loading event:', error);
        toast({
          title: t("error"),
          description: t("failedToLoadEvent"),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id, toast]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getTicketPrice = (type: string): number => {
    if (!event?.pricing || !type) return 0;
    return (event.pricing as any)[type] || 0;
  };

  const getTotalAmount = (): number => {
    const price = getTicketPrice(formData.ticketType);
    return price * formData.quantity;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!event || !formData.userName || !formData.userEmail || !formData.userPhone || !formData.ticketType) {
      toast({
        title: t("error"),
        description: t("fillRequiredFields"),
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      
      const ticketData = {
        eventId: event.id,
        userId: `user_${Date.now()}`, // In real app, this would come from auth
        userName: formData.userName,
        userEmail: formData.userEmail,
        userPhone: formData.userPhone,
        ticketType: formData.ticketType,
        quantity: formData.quantity,
        totalAmount: getTotalAmount(),
        currency: event.pricing.currency,
        additionalInfo: {
          company: formData.company,
          dietaryRequirements: formData.dietaryRequirements,
          notes: formData.notes
        }
      };

      const result = await eventService.createTicket(ticketData);
      
      if (result) {
        toast({
          title: t("success"),
          description: t("registrationSubmitted"),
        });
        navigate(`/events/${event.id}`);
      } else {
        throw new Error('Failed to create ticket');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: t("error"),
        description: t("registrationFailed"),
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">ไม่พบกิจกรรม</h1>
          <Button onClick={() => navigate('/events')}>กลับไปยังกิจกรรม</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(`/events/${event.id}`)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับไปยังกิจกรรม
          </Button>
          <h1 className="text-3xl font-bold mb-2">การลงทะเบียนกิจกรรม</h1>
          <p className="text-muted-foreground">{event.title}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Registration Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  รายละเอียดการลงทะเบียน
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">ข้อมูลส่วนตัว</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="userName">ชื่อเต็ม *</Label>
                        <Input
                          id="userName"
                          value={formData.userName}
                          onChange={(e) => handleInputChange('userName', e.target.value)}
                          placeholder="ป้อนชื่อเต็มของคุณ"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="userEmail">ที่อยู่อีเมล *</Label>
                        <Input
                          id="userEmail"
                          type="email"
                          value={formData.userEmail}
                          onChange={(e) => handleInputChange('userEmail', e.target.value)}
                          placeholder="ป้อนอีเมลของคุณ"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="userPhone">หมายเลขโทรศัพท์ *</Label>
                        <Input
                          id="userPhone"
                          value={formData.userPhone}
                          onChange={(e) => handleInputChange('userPhone', e.target.value)}
                          placeholder="ป้อนหมายเลขโทรศัพท์ของคุณ"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="company">บริษัท/องค์กร</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          placeholder="ป้อนชื่อบริษัทของคุณ"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Ticket Selection */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">การเลือกตั๋ว</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="ticketType">ประเภทตั๋ว *</Label>
                        <Select value={formData.ticketType} onValueChange={(value) => handleInputChange('ticketType', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกประเภทตั๋ว" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(event.pricing)
                              .filter(([key, value]) => {
                                // Dynamic filtering for NoSQL data
                                return key !== 'currency' && 
                                       value !== undefined && 
                                       value !== null && 
                                       typeof value === 'number' && 
                                       value > 0;
                              })
                              .map(([key, value]) => {
                                // Dynamic display name generation for NoSQL fields
                                const getDisplayName = (fieldKey: string): string => {
                                  // Predefined mappings for known fields
                                  const fieldMappings: Record<string, string> = {
                                    'earlyBird': 'Early Bird',
                                    'fullMarathon': 'Full Marathon (42.195km)',
                                    'halfMarathon': 'Half Marathon (21.1km)',
                                    'miniMarathon': 'Mini Marathon (10km)',
                                    'funRun': 'Fun Run (5km)',
                                    'member': 'Member Price',
                                    'general': 'General Admission',
                                    'premium': 'Premium Ticket',
                                    'adult': 'Adult Ticket',
                                    'child': 'Child Ticket',
                                    'senior': 'Senior Ticket',
                                    'free': 'Free Entry',
                                    'regular': 'Regular',
                                    'student': 'Student',
                                    'group': 'Group',
                                    'vip': 'VIP'
                                  };
                                  
                                  // Return predefined mapping if exists
                                  if (fieldMappings[fieldKey]) {
                                    return fieldMappings[fieldKey];
                                  }
                                  
                                  // Dynamic formatting for unknown fields
                                  return fieldKey
                                    .replace(/([A-Z])/g, ' $1')
                                    .replace(/^./, str => str.toUpperCase())
                                    .trim();
                                };
                                
                                const displayName = getDisplayName(key);
                                
                                return (
                                  <SelectItem key={key} value={key}>
                                    {displayName} - {(value as number).toLocaleString()} {event.pricing.currency}
                                  </SelectItem>
                                );
                              })
                            }
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="quantity">จำนวน</Label>
                        <Select value={formData.quantity.toString()} onValueChange={(value) => handleInputChange('quantity', parseInt(value))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map(num => (
                              <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Additional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">ข้อมูลเพิ่มเติม</h3>

                    <div>
                      <Label htmlFor="dietaryRequirements">ข้อกำหนดด้านอาหาร</Label>
                      <Input
                        id="dietaryRequirements"
                        value={formData.dietaryRequirements}
                        onChange={(e) => handleInputChange('dietaryRequirements', e.target.value)}
                        placeholder="ข้อจำกัดด้านอาหารหรือความชอบใดๆ"
                      />
                    </div>

                    <div>
                      <Label htmlFor="notes">หมายเหตุเพิ่มเติม</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        placeholder="ข้อมูลเพิ่มเติมหรือคำขอพิเศษใดๆ"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate(`/events/${event.id}`)}
                      className="flex-1"
                    >
                      ยกเลิก
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="flex-1"
                    >
                      {submitting ? 'กำลังส่ง...' : 'เสร็จสิ้นการลงทะเบียน'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  สรุปคำสั่งซื้อ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">{event.organizer.name}</p>
                </div>

                <Separator />

                {formData.ticketType && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>ประเภทตั๋ว:</span>
                      <span className="capitalize">{formData.ticketType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ราคาต่อตั๋ว:</span>
                      <span>{getTicketPrice(formData.ticketType).toLocaleString()} {event.pricing.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>จำนวน:</span>
                      <span>{formData.quantity}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between font-semibold text-lg">
                      <span>รวม:</span>
                      <span>{getTotalAmount().toLocaleString()} {event.pricing.currency}</span>
                    </div>
                  </div>
                )}

                {!formData.ticketType && (
                  <p className="text-muted-foreground text-center py-4">
                    กรุณาเลือกประเภทตั๋วเพื่อดูราคา
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}