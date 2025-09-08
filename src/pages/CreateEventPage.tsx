import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, MapPin, Users, DollarSign, ChevronLeft, ChevronRight, Upload } from "lucide-react";

export function CreateEventPage() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    title: "",
    description: "",
    category: "",
    
    // Step 2: Date & Location
    date: "",
    time: "",
    location: "",
    address: "",
    
    // Step 3: Pricing & Capacity
    price: "",
    currency: "THB",
    maxAttendees: "",
    
    // Step 4: Additional Details
    image: null,
    requirements: "",
    contact: "",
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
    "Basic Information",
    "Date & Location",
    "Pricing & Capacity",
    "Additional Details"
  ];

  const categories = [
    { value: "technology", label: t("technology") },
    { value: "music", label: t("music") },
    { value: "workshop", label: t("workshop") },
    { value: "conference", label: t("conference") },
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                placeholder="Enter your event title"
                value={formData.title}
                onChange={(e) => updateFormData("title", e.target.value)}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your event"
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
                className="mt-2"
                rows={4}
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => updateFormData("category", value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select a category" />
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
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Event Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => updateFormData("date", e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="time">Event Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => updateFormData("time", e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="Event location name"
                value={formData.location}
                onChange={(e) => updateFormData("location", e.target.value)}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="address">Full Address</Label>
              <Textarea
                id="address"
                placeholder="Complete address with directions"
                value={formData.address}
                onChange={(e) => updateFormData("address", e.target.value)}
                className="mt-2"
                rows={3}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0 for free event"
                  value={formData.price}
                  onChange={(e) => updateFormData("price", e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select value={formData.currency} onValueChange={(value) => updateFormData("currency", value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="THB">THB</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="maxAttendees">Maximum Attendees *</Label>
              <Input
                id="maxAttendees"
                type="number"
                placeholder="Enter maximum number of attendees"
                value={formData.maxAttendees}
                onChange={(e) => updateFormData("maxAttendees", e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="image">Event Image</Label>
              <div className="mt-2 border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to upload event image or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG up to 10MB
                </p>
              </div>
            </div>
            
            <div>
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                placeholder="Any requirements for attendees (optional)"
                value={formData.requirements}
                onChange={(e) => updateFormData("requirements", e.target.value)}
                className="mt-2"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="contact">Contact Information *</Label>
              <Input
                id="contact"
                placeholder="Email or phone number"
                value={formData.contact}
                onChange={(e) => updateFormData("contact", e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{t("createEvent")}</h1>
          <p className="text-muted-foreground">
            Create your event in a few simple steps
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentStep === 1 && <Calendar className="h-5 w-5" />}
              {currentStep === 2 && <MapPin className="h-5 w-5" />}
              {currentStep === 3 && <DollarSign className="h-5 w-5" />}
              {currentStep === 4 && <Users className="h-5 w-5" />}
              {stepTitles[currentStep - 1]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStep()}

            <div className="flex justify-between pt-6 mt-6 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              {currentStep === totalSteps ? (
                <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90">
                  Create Event
                  <Upload className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  className="flex items-center gap-2"
                >
                  Next
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