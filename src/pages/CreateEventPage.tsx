import { useState } from "react";
import { Upload, Calendar, MapPin, Users, DollarSign, Tag, Clock, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const CreateEventPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    time: "",
    endTime: "",
    location: "",
    address: "",
    isOnline: false,
    maxAttendees: "",
    image: null,
    tickets: [{ type: "General", price: "", description: "" }],
    tags: [],
    newTag: ""
  });

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

  const steps = [
    { id: 1, title: "ข้อมูลพื้นฐาน", description: "ชื่อและรายละเอียดอีเวนต์" },
    { id: 2, title: "วันเวลาและสถานที่", description: "กำหนดการและพิกัด" },
    { id: 3, title: "ตั๋วและราคา", description: "ตัวเลือกตั๋วและราคา" },
    { id: 4, title: "รูปภาพและแท็ก", description: "ภาพประกอบและคำค้นหา" }
  ];

  const handleInputChange = (field: string, value: any) => {
    setEventData(prev => ({ ...prev, [field]: value }));
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
    if (eventData.newTag.trim()) {
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

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    console.log("Event Data:", eventData);
    // Handle form submission
    alert("อีเวนต์ได้ถูกสร้างเรียบร้อยแล้ว!");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              สร้างอีเวนต์ใหม่
            </h1>
            <p className="text-muted-foreground text-lg">
              สร้างอีเวนต์ที่น่าสนใจและเข้าถึงผู้คนได้มากขึ้น
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-10">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                />
              </div>
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    currentStep >= step.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {step.id}
                  </div>
                  <div className="text-center mt-2 max-w-24">
                    <p className="text-xs font-medium text-foreground">{step.title}</p>
                    <p className="text-xs text-muted-foreground hidden md:block">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-card rounded-2xl p-8 shadow-card">
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">ข้อมูลพื้นฐาน</h2>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    ชื่อกิจกรรม *
                  </label>
                  <input
                    type="text"
                    value={eventData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="เช่น Tech Conference Bangkok 2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    รายละเอียด *
                  </label>
                  <textarea
                    value={eventData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={5}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="อธิบายรายละเอียดของอีเวนต์..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    หมวดหมู่ *
                  </label>
                  <select
                    value={eventData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">เลือกหมวดหมู่</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">วันเวลาและสถานที่</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
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
                        className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    เวลาสิ้นสุด
                  </label>
                  <div className="relative max-w-md">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="time"
                      value={eventData.endTime}
                      onChange={(e) => handleInputChange('endTime', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
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
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="เช่น Impact Muang Thong Thani"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    ที่อยู่เต็ม
                  </label>
                  <textarea
                    value={eventData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="ที่อยู่ครบถ้วนพร้อมรหัสไปรษณีย์"
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">ตั๋วและราคา</h2>
                
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
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="1000"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">ประเภทตั๋ว</h3>
                    <Button onClick={addTicketType} variant="outline" size="sm">
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
                              ชื่อประเภทตั๋ว
                            </label>
                            <input
                              type="text"
                              value={ticket.type}
                              onChange={(e) => updateTicket(index, 'type', e.target.value)}
                              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="เช่น General, VIP, Early Bird"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              ราคา (บาท)
                            </label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <input
                                type="number"
                                value={ticket.price}
                                onChange={(e) => updateTicket(index, 'price', e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="0"
                              />
                            </div>
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
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">รูปภาพและแท็ก</h2>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    รูปปกอีเวนต์
                  </label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-foreground font-medium mb-2">คลิกเพื่ออัปโหลดรูปภาพ</p>
                    <p className="text-muted-foreground text-sm">รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 5MB</p>
                    <input type="file" className="hidden" accept="image/*" />
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
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                        className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="เพิ่มแท็ก เช่น Technology, AI, Workshop"
                      />
                    </div>
                    <Button onClick={addTag} size="sm">
                      เพิ่ม
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {eventData.tags.map((tag) => (
                      <span key={tag} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        #{tag}
                        <button onClick={() => removeTag(tag)} className="hover:text-red-500">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-muted/30 rounded-xl p-6">
                  <h3 className="font-semibold text-foreground mb-4">สรุปข้อมูลอีเวนต์</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">ชื่อกิจกรรม:</p>
                      <p className="font-medium text-foreground">{eventData.title || "-"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">หมวดหมู่:</p>
                      <p className="font-medium text-foreground">{eventData.category || "-"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">วันที่:</p>
                      <p className="font-medium text-foreground">{eventData.date || "-"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">สถานที่:</p>
                      <p className="font-medium text-foreground">{eventData.location || "-"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button 
                onClick={prevStep} 
                variant="outline"
                disabled={currentStep === 1}
              >
                ก่อนหน้า
              </Button>
              
              <div className="flex gap-3">
                {currentStep < 4 ? (
                  <Button onClick={nextStep}>
                    ถัดไป
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} size="lg">
                    สร้างอีเวนต์
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateEventPage;