import React, { useState, useEffect } from 'react';
import { EventData, LayoutConfig } from '@/services/eventService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Building2, 
  Share2,
  ArrowLeft,
  Trash2,
  Edit,
  FileText,
  Hash,
  Mail,
  Phone,
  Link,
  ChevronDown,
  CheckSquare,
  Circle,
  Clock,
  Plus,
  Type,
  X
} from 'lucide-react';

interface EventDetailPreviewProps {
  event: EventData;
  layout?: LayoutConfig;
  fieldValues?: Record<string, string>;
  setFieldValues?: (values: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => void;
  onDeleteField?: (fieldName: string) => void;
  onDeleteSection?: (sectionType: string) => void;
  onUpdateEvent?: (updatedEvent: EventData) => void;
}

const FIELD_TYPE_ICONS = {
  text: FileText,
  textarea: FileText,
  number: Hash,
  email: Mail,
  phone: Phone,
  url: Link,
  date: Calendar,
  time: Clock,
  select: ChevronDown,
  checkbox: CheckSquare,
  radio: Circle
};

export default function EventDetailPreview({ event, layout, fieldValues: propFieldValues, setFieldValues: propSetFieldValues, onDeleteField, onDeleteSection, onUpdateEvent }: EventDetailPreviewProps) {
  const [hiddenSections, setHiddenSections] = useState<Set<string>>(new Set());
  const [editingFields, setEditingFields] = useState<Set<string>>(new Set());
  
  // Use propFieldValues if available, otherwise use local state
  const fieldValues = propFieldValues || {};
  const setFieldValues = propSetFieldValues || (() => {});

  // Sync fieldValues with event data - only when event changes
  useEffect(() => {
    if (!propSetFieldValues) return; // Only sync if we have parent setFieldValues
    
    setFieldValues(prev => {
      const newFieldValues: Record<string, string> = {};
      
      // Initialize event description
      newFieldValues['eventDescription'] = event.description;
      
      // Initialize API fields
      const apiFields = ['tags', 'requirements', 'speakers', 'tracks', 'activities'];
      apiFields.forEach(fieldName => {
        const fieldValue = (event as any)[fieldName];
        if (prev[fieldName] === undefined) {
          if (Array.isArray(fieldValue)) {
            if (fieldName === 'speakers') {
              // For speakers, join name and title
              newFieldValues[fieldName] = fieldValue.map(speaker => 
                `${speaker.name} - ${speaker.title} - ${speaker.company}`
              ).join('\n');
            } else {
              // For other arrays, join with newlines
              newFieldValues[fieldName] = fieldValue.join('\n');
            }
          } else {
            newFieldValues[fieldName] = fieldValue || '';
          }
        } else {
          newFieldValues[fieldName] = prev[fieldName];
        }
        
        // Initialize field name if not set
        if (prev[`${fieldName}_name`] === undefined) {
          newFieldValues[`${fieldName}_name`] = fieldName === 'newheading' ? 'New Heading' : fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
        } else {
          newFieldValues[`${fieldName}_name`] = prev[`${fieldName}_name`];
        }
      });
      
      // Initialize custom fields - preserve existing fieldValues if they exist
      if (event.customFields && event.customFields.length > 0) {
        event.customFields.forEach((field, index) => {
          const fieldKey = `custom_${index}`;
          const nameKey = `${fieldKey}_name`;
          
          // Only initialize if not already set in fieldValues
          if (prev[fieldKey] === undefined) {
            if (Array.isArray(field.value)) {
              // If field.value is an array of objects, extract names
              newFieldValues[fieldKey] = field.value.map(item => item.name || '').join('\n');
            } else {
              // If field.value is a string, use as is
              newFieldValues[fieldKey] = field.value || '';
            }
          } else {
            newFieldValues[fieldKey] = prev[fieldKey];
          }
          
          if (prev[nameKey] === undefined) {
            newFieldValues[nameKey] = field.name || '';
          } else {
            newFieldValues[nameKey] = prev[nameKey];
          }
        });
      }
      
      // Initialize custom heading fields
      Object.keys(event).filter(key => key.startsWith('customheading_')).forEach(fieldName => {
        const fieldValue = (event as any)[fieldName];
        if (prev[fieldName] === undefined) {
          if (Array.isArray(fieldValue)) {
            // If fieldValue is an array, join with newlines
            newFieldValues[fieldName] = fieldValue.join('\n');
          } else {
            // If fieldValue is a string, use as is
            newFieldValues[fieldName] = fieldValue || '';
          }
        } else {
          newFieldValues[fieldName] = prev[fieldName];
        }
        
        if (prev[`${fieldName}_name`] === undefined) {
          newFieldValues[`${fieldName}_name`] = 'Custom Heading';
        } else {
          newFieldValues[`${fieldName}_name`] = prev[`${fieldName}_name`];
        }
      });
      
      return { ...prev, ...newFieldValues };
    });
  }, [event.id]); // Only depend on event.id to prevent infinite loops

  const handleDeleteSection = (sectionType: string) => {
    setHiddenSections(prev => new Set([...prev, sectionType]));
    onDeleteSection?.(sectionType);
  };

  const handleEditField = (fieldName: string) => {
    setEditingFields(prev => new Set([...prev, fieldName]));
    
    // If it's a custom heading field name, also set the field as editing
    if (fieldName.endsWith('_name') && fieldName.startsWith('customheading_')) {
      const baseFieldName = fieldName.replace('_name', '');
      setEditingFields(prev => new Set([...prev, baseFieldName]));
    }
  };

  const handleSaveField = (fieldName: string) => {
    setEditingFields(prev => {
      const newSet = new Set(prev);
      newSet.delete(fieldName);
      
      // If it's a custom heading field name, also remove the base field from editing
      if (fieldName.endsWith('_name') && fieldName.startsWith('customheading_')) {
        const baseFieldName = fieldName.replace('_name', '');
        newSet.delete(baseFieldName);
      }
      
      return newSet;
    });
    
    // For custom heading fields, don't update API yet - just save to local state
    if (fieldName.startsWith('customheading_')) {
      console.log(`Custom heading field ${fieldName} saved locally with value:`, fieldValues[fieldName]);
    } else {
      console.log(`Field ${fieldName} saved with value:`, fieldValues[fieldName]);
    }
  };

  const handleCancelEdit = (fieldName: string) => {
    setEditingFields(prev => {
      const newSet = new Set(prev);
      newSet.delete(fieldName);
      
      // If it's a custom heading field name, also remove the base field from editing
      if (fieldName.endsWith('_name') && fieldName.startsWith('customheading_')) {
        const baseFieldName = fieldName.replace('_name', '');
        newSet.delete(baseFieldName);
      }
      
      return newSet;
    });
    
    // For custom heading fields, reset field value to original
    if (fieldName.startsWith('customheading_')) {
      const newValues = { ...fieldValues };
      delete newValues[fieldName];
      if (fieldName.endsWith('_name')) {
        delete newValues[fieldName];
      } else {
        delete newValues[`${fieldName}_name`];
      }
      setFieldValues(newValues);
    } else {
      // Reset field value to original
      const newValues = { ...fieldValues };
      delete newValues[fieldName];
      setFieldValues(newValues);
    }
  };

  const handleFieldValueChange = (fieldName: string, value: string) => {
    setFieldValues({
      ...fieldValues,
      [fieldName]: value
    });
    
    // If it's a field name change, don't update the event
    if (fieldName.endsWith('_name')) {
      return;
    }
    
    // Update the event data for API fields
    const apiFields = ['tags', 'requirements', 'speakers', 'tracks', 'activities'];
    if (apiFields.includes(fieldName)) {
      // Convert string back to appropriate format
      let newValue;
      if (fieldName === 'speakers') {
        // Parse speakers from "Name - Title - Company" format
        newValue = value.split('\n').map(line => {
          const parts = line.split(' - ');
          return {
            name: parts[0] || '',
            title: parts[1] || '',
            company: parts[2] || '',
            bio: '',
            image: ''
          };
        });
      } else {
        // For other fields, split by newlines and keep all items including empty ones
        newValue = value.split('\n');
      }
      
      // Update the event (this will trigger a re-render)
      const updatedEvent = {
        ...event,
        [fieldName]: newValue
      };
      
      // Call parent component to update the event
      onUpdateEvent?.(updatedEvent);
      console.log('🔄 Field value changed:', fieldName, newValue);
      console.log('📊 Updated event structure:', {
        [fieldName]: newValue
      });
    } else if (fieldName.startsWith('customheading_')) {
      // Handle custom heading fields - update both fieldValues and API
      if (fieldName.endsWith('_name')) {
        // Field name change - update the API field name
        const baseFieldName = fieldName.replace('_name', '');
        const currentFieldValue = fieldValues[baseFieldName] || '';
        const cleanFieldName = value.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        if (onUpdateEvent) {
          const updatedEvent = { ...event };
          
          // Remove old field if it exists
          Object.keys(updatedEvent).forEach(key => {
            if (key.startsWith('customheading_') || 
                (typeof updatedEvent[key] === 'object' && Array.isArray(updatedEvent[key]) && 
                 !['tags', 'requirements', 'speakers', 'tracks', 'activities'].includes(key))) {
              delete updatedEvent[key];
            }
          });
          
          // Add new field with clean name
          if (currentFieldValue.trim() !== '') {
            const arrayValue = currentFieldValue.split('\n').filter(item => item.trim() !== '');
            updatedEvent[cleanFieldName] = arrayValue;
          }
          
          onUpdateEvent(updatedEvent);
        }
        console.log('🔄 Custom heading field name changed:', fieldName, value, '→', cleanFieldName);
      } else {
        // Field value change - update the API field value
        const cleanFieldName = (fieldValues[`${fieldName}_name`] || 'Custom Heading').toLowerCase().replace(/[^a-z0-9]/g, '');
        const arrayValue = value.split('\n').filter(item => item.trim() !== '');
        
        if (onUpdateEvent) {
          const updatedEvent = { ...event };
          
          // Remove old field if it exists
          Object.keys(updatedEvent).forEach(key => {
            if (key.startsWith('customheading_') || 
                (typeof updatedEvent[key] === 'object' && Array.isArray(updatedEvent[key]) && 
                 !['tags', 'requirements', 'speakers', 'tracks', 'activities'].includes(key))) {
              delete updatedEvent[key];
            }
          });
          
          // Add new field with clean name
          if (arrayValue.length > 0) {
            updatedEvent[cleanFieldName] = arrayValue;
          }
          
          onUpdateEvent(updatedEvent);
        }
        console.log('🔄 Custom heading field value changed:', fieldName, value, '→', cleanFieldName);
      }
    } else if (fieldName.startsWith('custom_')) {
      // Handle custom fields - use id instead of name
      const fieldNameOnly = fieldName.replace('custom_', '').replace('_name', '');
      const fieldIndex = parseInt(fieldNameOnly);
      const isNameField = fieldName.endsWith('_name');
      
      // Get the field id from the current event
      const targetField = event.customFields?.[fieldIndex];
      if (!targetField) {
        console.error('❌ Custom field not found at index:', fieldIndex);
        return;
      }
      
      if (isNameField) {
        // Update field name - find by id
        const updatedEvent = {
          ...event,
          customFields: event.customFields?.map(field => 
            field.id === targetField.id 
              ? { ...field, name: value }
              : field
          ) || []
        };
        onUpdateEvent?.(updatedEvent);
        console.log('🔄 Custom field name changed for id:', targetField.id, 'to', value);
      } else {
        // Update field value - find by id and convert to array format
        const updatedEvent = {
          ...event,
          customFields: event.customFields?.map(field => 
            field.id === targetField.id 
              ? { 
                  ...field, 
                  value: value.split('\n').map(item => ({
                    name: item,
                    title: '',
                    company: '',
                    bio: '',
                    image: ''
                  }))
                }
              : field
          ) || []
        };
        onUpdateEvent?.(updatedEvent);
        console.log('🔄 Custom field value changed for id:', targetField.id, value);
      }
    }
  };
  const formatPrice = (pricing: EventData['pricing'], type: 'regular' | 'earlyBird' | 'student' | 'vip' | 'adult' = 'regular') => {
    const price = pricing[type] || pricing.regular || pricing.adult || 0;
    if (price === 0 || pricing.free === 0) return "ฟรี";
    return `${price.toLocaleString()} ${pricing.currency}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      technology: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      music: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      workshop: "bg-green-500/10 text-green-500 border-green-500/20",
      conference: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    };
    return colors[category as keyof typeof colors] || colors.technology;
  };

  return (
    <div className="bg-background min-h-full">
      {/* Header */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={event.images?.banner || event.images?.thumbnail || '/placeholder.svg'}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute top-4 left-4">
          <Button variant="secondary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
        </div>
        <div className="absolute bottom-8 left-8 text-white">
          <Badge className={`mb-4 ${getCategoryColor(event.category)}`}>
            {event.category}
          </Badge>
          <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
          <p className="text-lg opacity-90">Organized by {event.organizer.name}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Info */}
            {!hiddenSections.has('eventDetails') && (
              <Card className="group relative hover:ring-2 hover:ring-destructive/20 transition-all">
                {/* Delete Button for Event Details */}
                <div className="absolute -right-2 -top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteSection('eventDetails')}
                    className="h-8 w-8 p-0 rounded-full shadow-lg"
                    title="Delete Event Details Section"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              
              <CardHeader>
                <CardTitle className="pr-8">Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Editable Description */}
                {editingFields.has('eventDescription') ? (
                  <div className="space-y-3">
                    <Input
                      value={fieldValues.eventDescription || event.description}
                      onChange={(e) => handleFieldValueChange('eventDescription', e.target.value)}
                      placeholder="Enter event description..."
                      className="w-full"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSaveField('eventDescription')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancelEdit('eventDescription')}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="cursor-pointer hover:bg-accent/50 p-2 rounded transition-colors"
                    onClick={() => handleEditField('eventDescription')}
                    title="Click to edit description"
                  >
                    <p className="text-muted-foreground leading-relaxed">
                      {fieldValues.eventDescription || event.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Click to edit</p>
                  </div>
                )}
                
                {event.requirements && event.requirements.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Requirements</h4>
                    <ul className="text-muted-foreground list-disc list-inside space-y-1">
                      {event.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
              </Card>
            )}

            {/* Custom Fields */}
            {event.customFields && event.customFields.length > 0 && event.customFields.map((field, index) => (
              <Card key={index} className="group relative hover:ring-2 hover:ring-destructive/20 transition-all">
                {/* Delete Button for Custom Field */}
                <div className="absolute -right-2 -top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      const targetField = event.customFields?.[index];
                      if (!targetField) {
                        console.error('❌ Custom field not found at index:', index);
                        return;
                      }
                      
                      const updatedEvent = {
                        ...event,
                        customFields: event.customFields?.filter(field => field.id !== targetField.id) || []
                      };
                      onUpdateEvent?.(updatedEvent);
                      console.log('🗑️ Custom field deleted with id:', targetField.id);
                    }}
                    className="h-8 w-8 p-0 rounded-full shadow-lg"
                    title="Delete Custom Field"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Type className="h-5 w-5" />
                    {editingFields.has(`custom_${index}_name`) ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          value={fieldValues[`custom_${index}_name`] || ''}
                          onChange={(e) => handleFieldValueChange(`custom_${index}_name`, e.target.value)}
                          className="text-lg font-semibold"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          onClick={() => handleSaveField(`custom_${index}_name`)}
                          className="h-8 w-8 p-0"
                        >
                          <CheckSquare className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancelEdit(`custom_${index}_name`)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <span 
                        className="text-lg font-semibold cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                        onClick={() => handleEditField(`custom_${index}_name`)}
                      >
                        {fieldValues[`custom_${index}_name`] || field.name}
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {editingFields.has(`custom_${index}`) ? (
                    <div className="space-y-3">
                      {/* Display current items as individual input fields */}
                      {(() => {
                        const currentValue = fieldValues[`custom_${index}`] || field.value || '';
                        let items;
                        if (Array.isArray(field.value)) {
                          // If field.value is already an array of objects, extract names
                          items = field.value.map(item => item.name || '');
                        } else {
                          // If field.value is a string, split by newlines
                          items = currentValue.split('\n');
                        }
                        // Always ensure at least one item exists for display
                        const displayItems = items.length === 0 ? [''] : items;
                        return displayItems.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex gap-2 items-center">
                            <Input
                              value={item}
                              onChange={(e) => {
                                const newItems = [...displayItems];
                                newItems[itemIndex] = e.target.value;
                                // Keep all items including empty ones for display
                                handleFieldValueChange(`custom_${index}`, newItems.join('\n'));
                              }}
                              placeholder={`Enter ${fieldValues[`custom_${index}_name`] || field.name || 'Field'} item ${itemIndex + 1}...`}
                              className="flex-1"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const newItems = displayItems.filter((_, i) => i !== itemIndex);
                                // Ensure at least one empty item remains
                                const finalItems = newItems.length === 0 ? [''] : newItems;
                                handleFieldValueChange(`custom_${index}`, finalItems.join('\n'));
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ));
                      })()}
                      
                      {/* Add new item button */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const currentValue = fieldValues[`custom_${index}`] || field.value || '';
                          const currentItems = currentValue.split('\n');
                          const fieldName = fieldValues[`custom_${index}_name`] || field.name || 'Field';
                          const newItems = [...currentItems, `New ${fieldName} item`];
                          handleFieldValueChange(`custom_${index}`, newItems.join('\n'));
                        }}
                        className="w-full border-dashed border-2 border-gray-300 hover:border-gray-400"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add {fieldValues[`custom_${index}_name`] || field.name || 'Field'} item
                      </Button>
                      
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleSaveField(`custom_${index}`)}>
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleCancelEdit(`custom_${index}`)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="text-gray-600 cursor-pointer hover:bg-gray-100 p-2 rounded min-h-[100px]"
                      onClick={() => handleEditField(`custom_${index}`)}
                    >
                      {(() => {
                        if (Array.isArray(field.value)) {
                          // If field.value is an array of objects, display names
                          return field.value.map(item => item.name || '').join('\n');
                        } else {
                          // If field.value is a string, display as is
                          return fieldValues[`custom_${index}`] || field.value || field.placeholder || 'Click to edit...';
                        }
                      })()}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {/* Dynamic Event-Specific Content - NoSQL Approach (เหมือน EventDetailPage) */}
            {(() => {
              // Get all dynamic fields from the event object
              const dynamicFields = Object.keys(event).filter(key => {
                const value = (event as any)[key];
                return !['id', 'title', 'description', 'category', 'type', 'status', 'featured', 
                        'organizer', 'schedule', 'location', 'pricing', 'capacity', 'images', 
                        'tags', 'requirements', 'speakers', 'tracks', 'activities', 'newheading', 'customFields'].includes(key) && 
                       !key.startsWith('customheading_') && // Exclude custom heading fields from this section
                       value && 
                       (Array.isArray(value) ? value.length > 0 : true);
              });
              
              return dynamicFields.map(fieldKey => {
                const fieldValue = (event as any)[fieldKey];
                const fieldTitle = fieldKey.charAt(0).toUpperCase() + fieldKey.slice(1)
                  .replace(/([A-Z])/g, ' $1');
                
                // Handle different data types dynamically
                if (Array.isArray(fieldValue)) {
                  // Check if it's an array of objects (like speakers, artists)
                  if (fieldValue.length > 0 && typeof fieldValue[0] === 'object') {
                    return (
                      <Card key={fieldKey} className="group relative hover:ring-2 hover:ring-destructive/20 transition-all">
                        {/* Delete Button for Dynamic Field */}
                        <div className="absolute -right-2 -top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => console.log(`Delete ${fieldTitle} section`)}
                            className="h-8 w-8 p-0 rounded-full shadow-lg"
                            title={`Delete ${fieldTitle} Section`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <CardHeader>
                          <CardTitle className="pr-8">{fieldTitle}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {fieldValue.map((item: any, index: number) => (
                              <div key={index} className="flex gap-4">
                                {item.image && (
                                  <div className="flex-shrink-0">
                                    <img
                                      src={item.image || '/placeholder.svg'}
                                      alt={item.name || item.title || `${fieldTitle} ${index + 1}`}
                                      className="w-16 h-16 rounded-full object-cover"
                                    />
                                  </div>
                                )}
                                <div className="flex-1">
                                  {item.name && (
                                    <h4 className="font-semibold text-lg">{item.name}</h4>
                                  )}
                                  {item.title && (
                                    <p className="text-primary text-sm font-medium">{item.title}</p>
                                  )}
                                  {item.company && (
                                    <p className="text-muted-foreground text-sm">{item.company}</p>
                                  )}
                                  {item.genre && (
                                    <p className="text-primary text-sm font-medium">{item.genre}</p>
                                  )}
                                  {(item.bio || item.description) && (
                                    <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                                      {item.bio || item.description}
                                    </p>
                                  )}
                                  {item.distance && (
                                    <p className="text-muted-foreground text-sm">
                                      Distance: {item.distance}
                                      {item.startTime && ` • Start: ${item.startTime}`}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  }
                  // Handle array of strings
                  else {
                    return (
                      <Card key={fieldKey} className="group relative hover:ring-2 hover:ring-destructive/20 transition-all">
                        {/* Delete Button for Dynamic Field */}
                        <div className="absolute -right-2 -top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => console.log(`Delete ${fieldTitle} section`)}
                            className="h-8 w-8 p-0 rounded-full shadow-lg"
                            title={`Delete ${fieldTitle} Section`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <CardHeader>
                          <CardTitle className="pr-8">{fieldTitle}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {fieldKey === 'distances' ? (
                             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                               {fieldValue.map((item: string, index: number) => (
                                 <div key={index} className="p-4 rounded-lg bg-accent/10 border border-accent/20 text-center">
                                   <h4 className="font-semibold text-lg">{item}</h4>
                                 </div>
                               ))}
                             </div>
                          ) : fieldKey === 'includes' ? (
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {fieldValue.map((item: string, index: number) => (
                                <li key={index} className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {fieldValue.map((item: string, index: number) => (
                                <div key={index} className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                                  <h4 className="font-semibold">{item}</h4>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  }
                }
                return null;
              });
            })()}

            {/* API Fields */}
            {['tags', 'requirements', 'speakers', 'tracks', 'activities'].map(fieldName => {
              const fieldValue = (event as any)[fieldName];
              const isEditing = editingFields.has(fieldName);
              const currentValue = fieldValues[fieldName] || '';
              
              // Show field if it has data or is being edited
              if ((!Array.isArray(fieldValue) || fieldValue.length === 0) && !isEditing) {
                return null;
              }
              
              
              // Apply custom styles based on field type
              const getHeadingStyle = () => {
                if (fieldName === 'tags') {
                  return 'text-2xl font-bold text-primary';
                } else if (fieldName === 'requirements') {
                  return 'text-lg font-semibold text-primary';
                } else if (fieldName === 'newheading') {
                  return 'text-xl font-bold text-primary';
                }
                return 'text-base font-medium';
              };
              
              return (
                <Card key={fieldName} className="group relative hover:ring-2 hover:ring-destructive/20 transition-all">
                  {/* Delete Button - Positioned absolutely on the right side */}
                  <div className="absolute -right-2 -top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        // Remove from fieldValues
                        setFieldValues(prev => {
                          const newValues = { ...prev };
                          delete newValues[fieldName];
                          delete newValues[`${fieldName}_name`];
                          return newValues;
                        });
                        
                        // Remove from event data completely
                        const updatedEvent = {
                          ...event
                        };
                        delete updatedEvent[fieldName];
                        onUpdateEvent?.(updatedEvent);
                        
                        // Call parent to handle deletion
                        onDeleteField?.(fieldName);
                      }}
                      className="h-8 w-8 p-0 rounded-full shadow-lg"
                      title="Delete Field (will be saved when you click Save)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 pr-8">
                      {React.createElement(FIELD_TYPE_ICONS[fieldName === 'speakers' ? 'users' : fieldName === 'newheading' ? 'type' : 'text'] || FileText, { className: "w-4 h-4" })}
                      <span 
                        className="px-2 py-1"
                      >
                        {fieldValues[`${fieldName}_name`] || (fieldName === 'newheading' ? 'New Heading' : fieldName.charAt(0).toUpperCase() + fieldName.slice(1))}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div className="space-y-3">
                        {/* Display current items as individual input fields */}
                        {(() => {
                          // For newheading, treat as simple string field
                          if (fieldName === 'newheading') {
                            return (
                              <div className="flex gap-2 items-center">
                                <Input
                                  value={currentValue}
                                  onChange={(e) => {
                                    handleFieldValueChange(fieldName, e.target.value);
                                  }}
                                  placeholder="Enter heading text..."
                                  className="flex-1"
                                />
                              </div>
                            );
                          }
                          
                          // For other fields, use array format
                          const items = currentValue.split('\n');
                          // Always ensure at least one item exists for display
                          const displayItems = items.length === 0 ? [''] : items;
                          return displayItems.map((item, index) => (
                            <div key={index} className="flex gap-2 items-center">
                              <Input
                                value={item}
                                onChange={(e) => {
                                  const newItems = [...items];
                                  newItems[index] = e.target.value;
                                  // Keep all items including empty ones for display
                                  handleFieldValueChange(fieldName, newItems.join('\n'));
                                }}
                                placeholder={`Enter ${fieldName} item ${index + 1}...`}
                                className="flex-1"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const newItems = items.filter((_, i) => i !== index);
                                  // Ensure at least one empty item remains
                                  const finalItems = newItems.length === 0 ? [''] : newItems;
                                  handleFieldValueChange(fieldName, finalItems.join('\n'));
                                }}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ));
                        })()}
                        
                        {/* Add new item button - only for non-newheading fields */}
                        {fieldName !== 'newheading' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const currentItems = currentValue.split('\n');
                              const newItems = [...currentItems, `New ${fieldName} item`];
                              handleFieldValueChange(fieldName, newItems.join('\n'));
                            }}
                            className="w-full border-dashed border-2 border-gray-300 hover:border-gray-400"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add {fieldName} item
                          </Button>
                        )}
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSaveField(fieldName)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancelEdit(fieldName)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div 
                          className="cursor-pointer hover:bg-accent/50 p-2 rounded transition-colors"
                          onClick={() => handleEditField(fieldName)}
                          title="Click to edit"
                        >
                          <h3 className={getHeadingStyle()}>
                            {currentValue}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {fieldName === 'newheading' ? 'New Heading' : fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">Click to edit</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}

            {/* Custom Heading Fields - Editable and Deletable */}
            {(() => {
              // Get all custom heading fields - both ID-based and name-based
              const customFields = Object.keys(event).filter(key => {
                const value = (event as any)[key];
                return key.startsWith('customheading_') || 
                       (typeof value === 'object' && Array.isArray(value) && 
                        !['tags', 'requirements', 'speakers', 'tracks', 'activities'].includes(key) &&
                        !key.startsWith('custom_'));
              });
              
              return customFields.map(fieldName => {
                const fieldValue = (event as any)[fieldName];
                
                // Find the corresponding fieldValues key (either ID-based or name-based)
                let fieldValuesKey = fieldName;
                let fieldNameKey = `${fieldName}_name`;
                
                // If it's a name-based field, find the corresponding ID-based fieldValues key
                if (!fieldName.startsWith('customheading_')) {
                  const idBasedKey = Object.keys(fieldValues).find(key => 
                    key.startsWith('customheading_') && !key.endsWith('_name') &&
                    fieldValues[`${key}_name`]?.toLowerCase().replace(/[^a-z0-9]/g, '') === fieldName
                  );
                  if (idBasedKey) {
                    fieldValuesKey = idBasedKey;
                    fieldNameKey = `${idBasedKey}_name`;
                  } else {
                    // If no ID-based key found, create one for this field
                    const newIdKey = `customheading_${Date.now()}`;
                    fieldValuesKey = newIdKey;
                    fieldNameKey = `${newIdKey}_name`;
                    
                    // Initialize fieldValues for this field
                    if (propSetFieldValues) {
                      propSetFieldValues(prev => ({
                        ...prev,
                        [fieldValuesKey]: Array.isArray(fieldValue) ? fieldValue.join('\n') : '',
                        [fieldNameKey]: fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
                      }));
                    }
                  }
                }
                
                const isEditing = editingFields.has(fieldValuesKey) || editingFields.has(fieldNameKey);
                const currentValue = fieldValues[fieldValuesKey] || '';
                
                // Show field if it has meaningful data, is being edited, or exists in the event
                const hasMeaningfulData = Array.isArray(fieldValue) && fieldValue.length > 0 && fieldValue.some(item => item && item.trim() !== '');
                const fieldExists = fieldValue !== undefined;
                
                if (!hasMeaningfulData && !isEditing && !fieldExists) {
                  return null;
                }
              
              return (
                <Card key={fieldName} className="group relative hover:ring-2 hover:ring-destructive/20 transition-all">
                  {/* Delete Button - Positioned absolutely on the right side */}
                  <div className="absolute -right-2 -top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        // Remove from fieldValues only (local state)
                        const newValues = { ...fieldValues };
                        delete newValues[fieldValuesKey];
                        delete newValues[fieldNameKey];
                        setFieldValues(newValues);
                        
                        // Remove from editing fields
                        setEditingFields(prev => {
                          const newSet = new Set(prev);
                          newSet.delete(fieldValuesKey);
                          newSet.delete(fieldNameKey);
                          return newSet;
                        });
                        
                        // Also remove from event data (local only)
                        if (onUpdateEvent) {
                          const updatedEvent = { ...event };
                          delete updatedEvent[fieldName];
                          onUpdateEvent(updatedEvent);
                        }
                        
                        console.log('🗑️ Custom heading field deleted (local only):', fieldName);
                      }}
                      className="h-8 w-8 p-0 rounded-full shadow-lg"
                      title="Delete Custom Heading Field"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 pr-8">
                      <Type className="w-4 h-4" />
                      {editingFields.has(fieldNameKey) ? (
                        <div className="flex items-center gap-2 flex-1">
                          <Input
                            value={fieldValues[fieldNameKey] || 'Custom Heading'}
                            onChange={(e) => handleFieldValueChange(fieldNameKey, e.target.value)}
                            className="text-lg font-semibold"
                            autoFocus
                          />
                          <Button
                            size="sm"
                            onClick={() => handleSaveField(fieldNameKey)}
                            className="h-8 w-8 p-0"
                          >
                            <CheckSquare className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancelEdit(fieldNameKey)}
                            className="h-8 w-8 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <span 
                          className="text-lg font-semibold cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                          onClick={() => handleEditField(fieldNameKey)}
                        >
                          {fieldValues[fieldNameKey] || 'Custom Heading'}
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div className="space-y-3">
                        {/* Display current items as individual input fields */}
                        {(() => {
                          const items = currentValue.split('\n');
                          // Always ensure at least one item exists for display
                          const displayItems = items.length === 0 ? [''] : items;
                          return displayItems.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex gap-2 items-center">
                              <Input
                                value={item}
                                onChange={(e) => {
                                  const newItems = [...displayItems];
                                  newItems[itemIndex] = e.target.value;
                                  // Keep all items including empty ones for display
                                  handleFieldValueChange(fieldValuesKey, newItems.join('\n'));
                                }}
                                placeholder={`Enter ${fieldValues[fieldNameKey] || 'Custom Heading'} item ${itemIndex + 1}...`}
                                className="flex-1"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const newItems = displayItems.filter((_, i) => i !== itemIndex);
                                  // Ensure at least one empty item remains
                                  const finalItems = newItems.length === 0 ? [''] : newItems;
                                  handleFieldValueChange(fieldValuesKey, finalItems.join('\n'));
                                }}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ));
                        })()}
                        
                        {/* Add new item button */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const currentItems = currentValue.split('\n');
                            const newItems = [...currentItems, `New ${fieldValues[fieldNameKey] || 'Custom Heading'} item`];
                            handleFieldValueChange(fieldValuesKey, newItems.join('\n'));
                          }}
                          className="w-full border-dashed border-2 border-gray-300 hover:border-gray-400"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add {fieldValues[fieldNameKey] || 'Custom Heading'} item
                        </Button>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSaveField(fieldValuesKey)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancelEdit(fieldValuesKey)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div 
                          className="cursor-pointer hover:bg-accent/50 p-2 rounded transition-colors"
                          onClick={() => handleEditField(fieldValuesKey)}
                          title="Click to edit"
                        >
                          <h3 className="text-xl font-bold text-primary mb-2">
                            {fieldValues[fieldNameKey] || 'Custom Heading'}
                          </h3>
                          <div className="space-y-1">
                            {currentValue.split('\n').filter(item => item.trim() !== '').map((item, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary"></div>
                                <span className="text-sm">{item}</span>
                              </div>
                            ))}
                            {currentValue.split('\n').filter(item => item.trim() !== '').length === 0 && (
                              <p className="text-sm text-muted-foreground italic">Click to add content</p>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">Click to edit</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
              });
            })()}

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Info Card */}
            {!hiddenSections.has('eventInformation') && (
              <Card className="sticky top-24 group relative hover:ring-2 hover:ring-destructive/20 transition-all">
                {/* Delete Button for Event Information */}
                <div className="absolute -right-2 -top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteSection('eventInformation')}
                    className="h-8 w-8 p-0 rounded-full shadow-lg"
                    title="Delete Event Information Section"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">{formatDate(event.schedule.startDate)}</div>
                    <div className="text-sm text-muted-foreground">
                      {event.schedule.startTime} - {event.schedule.endTime}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">{event.location.venue || 'Online Event'}</div>
                    <div className="text-sm text-muted-foreground">
                      {event.location.address || 'Virtual Event'}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">
                      {event.capacity.registered}/{event.capacity.max} Attendees
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {event.capacity.available} spots left
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium text-primary text-lg">
                      {formatPrice(event.pricing)}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Organizer Information */}
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium">Organized by</div>
                    <div className="text-sm font-semibold text-primary">
                      {event.organizer.name}
                    </div>
                    {event.organizer.contact && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {event.organizer.contact}
                      </div>
                    )}
                    {event.organizer.phone && (
                      <div className="text-xs text-muted-foreground">
                        {event.organizer.phone}
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button className="w-full" size="lg">
                    Register
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}