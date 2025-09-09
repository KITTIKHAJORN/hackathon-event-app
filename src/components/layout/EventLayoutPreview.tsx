import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar,
  MapPin,
  Users,
  CreditCard,
  Clock,
  User,
  Camera,
  Image,
  Type,
  Settings
} from 'lucide-react';
import { EventData, LayoutConfig, CustomField } from '@/services/eventService';

interface EventLayoutPreviewProps {
  event: EventData;
  layout?: LayoutConfig;
}

const SECTION_ICONS = {
  hero: Image,
  pricing: CreditCard,
  schedule: Clock,
  organizer: User,
  gallery: Camera,
  speakers: Users,
  location: MapPin,
  capacity: Users
};

const FIELD_TYPE_ICONS = {
  text: Type,
  number: Type,
  boolean: Settings,
  date: Calendar,
  url: Type,
  image: Image,
  select: Settings,
  textarea: Type
};

export default function EventLayoutPreview({ event, layout }: EventLayoutPreviewProps) {
  if (!layout) {
    // Default layout rendering
    return (
      <div className="space-y-6">
        <DefaultEventLayout event={event} />
      </div>
    );
  }

  const renderSection = (sectionKey: string, section: any) => {
    if (!section.enabled) return null;

    const SectionIcon = SECTION_ICONS[sectionKey as keyof typeof SECTION_ICONS] || Settings;
    
    return (
      <Card 
        key={sectionKey}
        className="relative"
        style={{
          backgroundColor: section.customStyle?.backgroundColor || layout.colors.background,
          borderColor: section.customStyle?.borderColor || layout.colors.primary,
          borderRadius: section.customStyle?.borderRadius || 8,
          order: section.order
        }}
      >
        <CardHeader className="pb-3">
          <CardTitle 
            className="flex items-center gap-2 text-lg"
            style={{
              color: section.customStyle?.textColor || layout.colors.text
            }}
          >
            <SectionIcon className="w-5 h-5" />
            {sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderSectionContent(sectionKey, event)}
        </CardContent>
      </Card>
    );
  };

  const renderSectionContent = (sectionKey: string, event: EventData) => {
    switch (sectionKey) {
      case 'hero':
        return (
          <div className="space-y-3">
            <h2 className="text-2xl font-bold">{event.title}</h2>
            <p className="text-muted-foreground">{event.description}</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{event.category}</Badge>
              <Badge variant="outline">{event.type}</Badge>
              {event.featured && <Badge>Featured</Badge>}
            </div>
          </div>
        );
      
      case 'schedule':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{event.schedule.startDate} - {event.schedule.endDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{event.schedule.startTime} - {event.schedule.endTime}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Timezone: {event.schedule.timezone}
            </div>
          </div>
        );
      
      case 'location':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="font-medium">{event.location.type}</span>
            </div>
            {event.location.venue && (
              <div className="text-sm">{event.location.venue}</div>
            )}
            {event.location.address && (
              <div className="text-sm text-muted-foreground">{event.location.address}</div>
            )}
            {event.location.onlineLink && (
              <div className="text-sm text-blue-600">Online Link Available</div>
            )}
          </div>
        );
      
      case 'pricing':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="font-medium">Currency: {event.pricing.currency}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(event.pricing).map(([key, value]) => {
                if (key === 'currency' || value === undefined || value === 0) return null;
                return (
                  <div key={key} className="flex justify-between">
                    <span className="text-sm">{key}:</span>
                    <span className="text-sm font-medium">{value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      
      case 'capacity':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="font-medium">Capacity Management</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Max:</span>
                <div className="font-medium">{event.capacity.max}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Registered:</span>
                <div className="font-medium">{event.capacity.registered}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Available:</span>
                <div className="font-medium">{event.capacity.available}</div>
              </div>
            </div>
          </div>
        );
      
      case 'organizer':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="font-medium">{event.organizer.name}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              <div>Email: {event.organizer.contact}</div>
              <div>Phone: {event.organizer.phone}</div>
            </div>
          </div>
        );
      
      case 'gallery':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              <span className="font-medium">Event Gallery</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Banner: {event.images.banner ? 'Available' : 'Not set'}
            </div>
            <div className="text-sm text-muted-foreground">
              Gallery Images: {event.images.gallery?.length || 0}
            </div>
          </div>
        );
      
      case 'speakers':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="font-medium">Speakers</span>
            </div>
            {event.speakers && event.speakers.length > 0 ? (
              <div className="space-y-2">
                {event.speakers.map((speaker, index) => (
                  <div key={index} className="text-sm">
                    <div className="font-medium">{speaker.name}</div>
                    <div className="text-muted-foreground">{speaker.title} at {speaker.company}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No speakers added</div>
            )}
          </div>
        );
      
      default:
        return <div className="text-sm text-muted-foreground">Content for {sectionKey}</div>;
    }
  };

  const renderCustomField = (field: CustomField) => {
    const FieldIcon = FIELD_TYPE_ICONS[field.type] || Type;
    
    return (
      <Card 
        key={field.id}
        className="relative"
        style={{
          backgroundColor: field.style?.backgroundColor || 'transparent',
          borderColor: field.style?.borderColor || layout.colors.primary,
          borderRadius: field.style?.borderRadius || 4,
        }}
      >
        <CardHeader className="pb-2">
          <CardTitle 
            className="flex items-center gap-2"
            style={{
              fontSize: field.style?.fontSize || 16,
              fontWeight: field.style?.fontWeight || 'normal',
              color: field.style?.color || layout.colors.text
            }}
          >
            <FieldIcon className="w-4 h-4" />
            {field.name}
            {field.required && <Badge variant="secondary" className="text-xs">Required</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
            <div className="text-sm">
              <span className="text-muted-foreground">Type: </span>
              <Badge variant="outline">{field.type}</Badge>
            </div>
            {field.value && (
              <div className="text-sm">
                <span className="text-muted-foreground">Value: </span>
                <span className="font-medium">{String(field.value)}</span>
              </div>
            )}
            {field.placeholder && (
              <div className="text-sm text-muted-foreground italic">
                Placeholder: "{field.placeholder}"
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Sort sections by order
  const sortedSections = Object.entries(layout.sections)
    .filter(([_, section]) => section.enabled)
    .sort(([_, a], [__, b]) => a.order - b.order);

  return (
    <div 
      className="space-y-4"
      style={{
        backgroundColor: layout.colors.background,
        color: layout.colors.text,
        padding: layout.spacing === 'compact' ? '1rem' : layout.spacing === 'spacious' ? '2rem' : '1.5rem'
      }}
    >
      {/* Render enabled sections in order */}
      {sortedSections.map(([sectionKey, section]) => 
        renderSection(sectionKey, section)
      )}

      {/* Render custom fields */}
      {layout.customFields && layout.customFields.length > 0 && (
        <>
          <Separator className="my-6" />
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Custom Fields</h3>
            {layout.customFields.map(field => renderCustomField(field))}
          </div>
        </>
      )}
    </div>
  );
}

function DefaultEventLayout({ event }: { event: EventData }) {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="w-5 h-5" />
            Event Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold">{event.title}</h2>
            <p className="text-muted-foreground">{event.description}</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{event.category}</Badge>
              <Badge variant="outline">{event.type}</Badge>
              {event.featured && <Badge>Featured</Badge>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule & Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{event.schedule.startDate} - {event.schedule.endDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{event.schedule.startTime} - {event.schedule.endTime}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">{event.location.type}</span>
              </div>
              {event.location.venue && (
                <div className="text-sm">{event.location.venue}</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pricing & Capacity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Pricing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                <span className="font-medium">Currency: {event.pricing.currency}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(event.pricing).map(([key, value]) => {
                  if (key === 'currency' || value === undefined || value === 0) return null;
                  return (
                    <div key={key} className="flex justify-between">
                      <span className="text-sm">{key}:</span>
                      <span className="text-sm font-medium">{value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Capacity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Max:</span>
                <div className="font-medium">{event.capacity.max}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Registered:</span>
                <div className="font-medium">{event.capacity.registered}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Available:</span>
                <div className="font-medium">{event.capacity.available}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
