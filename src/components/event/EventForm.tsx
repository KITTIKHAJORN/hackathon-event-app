import { useState } from "react";
import { Upload, Calendar, MapPin, Users, DollarSign, Tag, Clock, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventFormProps {
  onSubmit: (eventData: any) => void;
  initialData?: any;
  isEditing?: boolean;
}

const EventForm = ({ onSubmit, initialData = {}, isEditing = false }: EventFormProps) => {
  const [eventData, setEventData] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    category: initialData.category || "",
    date: initialData.date || "",
    time: initialData.time || "",
    endTime: initialData.endTime || "",
    location: initialData.location || "",
    address: initialData.address || "",
    isOnline: initialData.isOnline || false,
    maxAttendees: initialData.maxAttendees || "",
    image: initialData.image || null,
    tickets: initialData.tickets || [{ type: "General", price: "", description: "" }],
    tags: initialData.tags || [],
    newTag: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    "การประชุม",
    "อบรม", 
    "คอนเสิร์ต",
    "นิทรรศการ",
    "กีฬา",
    "การกุศล",
    "เทศกาล",
    "ธุรกิจ"
  ];

  const handleInputChange = (field: string, value: any) => {
    setEventData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const addTicketType = () => {
    setEventData(prev => ({
      ...prev,
      tickets: [...prev.tickets, { type: "", price: "", description: "" }]
    }));
  };

  const removeTicketType = (index: number) => {
    if (eventData.tickets.length > 1) {
      setEventData(prev => ({
        ...prev,
        tickets: prev.tickets.filter((_, i) => i !== index)
      }));
    }
  };

  const updateTicket = (index: number, field: string, value: string) => {
    setEventData(prev => ({
      ...prev,
      tickets: prev.tickets.map((ticket, i) => 
        i === index ? { ...ticket, [field]: value } : ticket
      )
    }));
  };

  const addTag = () => {
    if (eventData.newTag.trim() && !eventData.tags.includes(eventData.newTag.trim())) {
      setEventData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: ""
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEventData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!eventData.title.trim()) newErrors.title = "กรุณาใส่ชื่อกิจกรรม";
    if (!eventData.description.trim()) newErrors.description = "กรุณาใส่รายละเอียด";
    if (!eventData.category) newErrors.category = "กรุณาเลือกหมวดหมู่";
    if (!eventData.date) newErrors.date = "กรุณาเลือกวันที่";
    if (!eventData.time) newErrors.time = "กรุณาใส่เวลาเริ่ม";
    if (!eventData.location.trim()) newErrors.location = "กรุณาใส่สถานที่";
    if (!eventData.maxAttendees || parseInt(eventData.maxAttendees) <= 0) {
      newErrors.maxAttendees = "กรุณาใส่จำนวนผู้เข้าร่วมที่ถูกต้อง";
    }

    // Validate tickets
    eventData.tickets.forEach((ticket, index) => {
      if (!ticket.type.trim()) {
        newErrors[`ticket_type_${index}`] = "กรุณาใส่ชื่อประเภทตั๋ว";
      }
      if (!ticket.price || parseFloat(ticket.price) < 0) {
        newErrors[`ticket_price_${index}`] = "กรุณาใส่ราคาที่ถูกต้อง";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(eventData);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload to a server
      const reader = new FileReader();
      reader.onload = (e) => {
        setEventData(prev => ({ ...prev, image: e.target?.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-card rounded-2xl p-6 shadow-card">
        <h2 className="text-xl font-bold text-foreground mb-6">ข้อมูลพื้นฐาน</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              ชื่อกิจกรรม *
            </label>
            <input
              type="text"
              value={eventData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.title ? 'border-red-500' : 'border-border'
              }`}
              placeholder="เช่น Tech Conference Bangkok 2024"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              รายละเอียด *
            </label>
            <textarea
              value={eventData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className={`w-full px-4 py-3 border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none ${
                errors.description ? 'border-red-500' : 'border-border'
              }`}
              placeholder="อธิบายรายละเอียดของอีเวนต์..."
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              หมวดหมู่ *
            </label>
            <select
              value={eventData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.category ? 'border-red-500' : 'border-border'
              }`}
            >
              <option value="">เลือกหมวดหมู่</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>
        </div>
      </div>

      {/* Date, Time & Location */}
      <div className="bg-card rounded-2xl p-6 shadow-card">
        <h2 className="text-xl font-bold text-foreground mb-6">วันเวลาและสถานที่</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                วันที่ *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="date"
                  value={eventData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.date ? 'border-red-500' : 'border-border'
                  }`}
                />
              </div>
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                เวลาเริ่ม *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="time"
                  value={eventData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.time ? 'border-red-500' : 'border-border'
                  }`}
                />
              </div>
              {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                เวลาสิ้นสุด
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="time"
                  value={eventData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isOnline"
              checked={eventData.isOnline}
              onChange={(e) => handleInputChange('isOnline', e.target.checked)}
              className="w-4 h-4 text-primary border-border focus:ring-primary rounded"
            />
            <label htmlFor="isOnline" className="text-sm font-medium text-foreground">
              กิจกรรมออนไลน์
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              สถานที่ *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={eventData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.location ? 'border-red-500' : 'border-border'
                }`}
                placeholder="เช่น Impact Muang Thong Thani"
              />
            </div>
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              ที่อยู่เต็ม
            </label>
            <textarea
              value={eventData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              rows={2}
              className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="ที่อยู่ครบถ้วนพร้อมรหัสไปรษณีย์"
            />
          </div>
        </div>
      </div>

      {/* Capacity & Tickets */}
      <div className="bg-card rounded-2xl p-6 shadow-card">
        <h2 className="text-xl font-bold text-foreground mb-6">จำนวนผู้เข้าร่วมและตั๋ว</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              จำนวนผู้เข้าร่วมสูงสุด *
            </label>
            <div className="relative max-w-md">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="number"
                value={eventData.maxAttendees}
                onChange={(e) => handleInputChange('maxAttendees', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.maxAttendees ? 'border-red-500' : 'border-border'
                }`}
                placeholder="1000"
                min="1"
              />
            </div>
            {errors.maxAttendees && <p className="text-red-500 text-sm mt-1">{errors.maxAttendees}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">ประเภทตั๋ว</h3>
              <Button type="button" onClick={addTicketType} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                เพิ่มประเภทตั๋ว
              </Button>
            </div>
            
            <div className="space-y-4">
              {eventData.tickets.map((ticket, index) => (
                <div key={index} className="border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-foreground">ตั๋วประเภทที่ {index + 1}</h4>
                    {eventData.tickets.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeTicketType(index)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        ชื่อประเภทตั๋ว *
                      </label>
                      <input
                        type="text"
                        value={ticket.type}
                        onChange={(e) => updateTicket(index, 'type', e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                          errors[`ticket_type_${index}`] ? 'border-red-500' : 'border-border'
                        }`}
                        placeholder="เช่น General, VIP, Early Bird"
                      />
                      {errors[`ticket_type_${index}`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`ticket_type_${index}`]}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        ราคา (บาท) *
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="number"
                          value={ticket.price}
                          onChange={(e) => updateTicket(index, 'price', e.target.value)}
                          className={`w-full pl-10 pr-4 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                            errors[`ticket_price_${index}`] ? 'border-red-500' : 'border-border'
                          }`}
                          placeholder="0"
                          min="0"
                        />
                      </div>
                      {errors[`ticket_price_${index}`] && (
                        <p className="text-red-500 text-sm mt-1">{errors[`ticket_price_${index}`]}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      รายละเอียดตั๋ว
                    </label>
                    <textarea
                      value={ticket.description}
                      onChange={(e) => updateTicket(index, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      placeholder="อธิบายสิ่งที่รวมในตั๋วประเภทนี้"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Image & Tags */}
      <div className="bg-card rounded-2xl p-6 shadow-card">
        <h2 className="text-xl font-bold text-foreground mb-6">รูปภาพและแท็ก</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              รูปปกอีเวนต์
            </label>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer">
              {eventData.image ? (
                <div className="relative">
                  <img 
                    src={eventData.image} 
                    alt="Event preview" 
                    className="max-h-48 mx-auto rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleInputChange('image', null)}
                    className="absolute top-2 right-2 bg-red-500 text-white hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-foreground font-medium mb-2">คลิกเพื่ออัปโหลดรูปภาพ</p>
                  <p className="text-muted-foreground text-sm">รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 5MB</p>
                </>
              )}
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              แท็ก (คำค้นหา)
            </label>
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={eventData.newTag}
                  onChange={(e) => handleInputChange('newTag', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="เพิ่มแท็ก เช่น Technology, AI, Workshop"
                />
              </div>
              <Button type="button" onClick={addTag} size="sm">
                เพิ่ม
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {eventData.tags.map((tag) => (
                <span key={tag} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  #{tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" size="lg">
          {isEditing ? 'อัปเดตอีเวนต์' : 'สร้างอีเวนต์'}
        </Button>
      </div>
    </form>
  );
};

export default EventForm;