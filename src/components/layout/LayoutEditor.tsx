import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Type, 
  Image, 
  Edit,
  Save
} from 'lucide-react';
import { 
  LayoutConfig, 
  CustomField, 
  SectionConfig,
  EventData,
  addCustomFieldToEvent,
  updateCustomFieldInEvent,
  removeCustomFieldFromEvent,
  reorderCustomFields,
  updateEventLayoutConfig
} from '@/services/eventService';
import EventDetailPreview from '@/components/layout/EventDetailPreview';

interface LayoutEditorProps {
  eventId: string;
  currentEvent?: EventData;
  currentLayout?: LayoutConfig;
  fieldValues?: Record<string, string>;
  setFieldValues?: (values: Record<string, string>) => void;
  onLayoutChange?: (layout: LayoutConfig) => void;
  onUpdateEvent?: (updatedEvent: EventData) => void;
}

const FIELD_TYPE_ICONS = {
  text: 'Type',
  textarea: 'FileText',
  number: 'Hash',
  email: 'Mail',
  phone: 'Phone',
  url: 'Link',
  date: 'Calendar',
  time: 'Clock',
  select: 'ChevronDown',
  boolean: 'CheckSquare'
};

export default function LayoutEditor({ 
  eventId, 
  currentEvent, 
  currentLayout, 
  fieldValues,
  setFieldValues,
  onLayoutChange,
  onUpdateEvent
}: LayoutEditorProps) {
  const [layout, setLayout] = useState<LayoutConfig>(currentLayout || {
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
  });

  const [isEditing, setIsEditing] = useState(false);
  const [newField, setNewField] = useState<Partial<CustomField>>({
    name: '',
    type: 'text',
    value: '',
    required: false,
    placeholder: '',
    description: '',
    position: { x: 0, y: 0 },
    size: { width: 100, height: 20 }
  });

  const [draggedField, setDraggedField] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔄 LayoutEditor useEffect - currentLayout changed:', currentLayout);
    if (currentLayout) {
      console.log('📥 Setting layout from currentLayout prop');
      setLayout(currentLayout);
    } else {
      console.log('📝 Initializing with default layout');
      // Initialize with default layout if no currentLayout
      setLayout({
        template: 'custom',
        sections: {
          hero: { enabled: true, position: { x: 0, y: 0 }, size: { width: 100, height: 200 }, order: 1, customStyle: {} },
          pricing: { enabled: true, position: { x: 0, y: 200 }, size: { width: 100, height: 100 }, order: 2, customStyle: {} },
          schedule: { enabled: true, position: { x: 0, y: 300 }, size: { width: 100, height: 100 }, order: 3, customStyle: {} },
          organizer: { enabled: true, position: { x: 0, y: 400 }, size: { width: 100, height: 100 }, order: 4, customStyle: {} },
          gallery: { enabled: true, position: { x: 0, y: 500 }, size: { width: 100, height: 100 }, order: 5, customStyle: {} },
          speakers: { enabled: true, position: { x: 0, y: 600 }, size: { width: 100, height: 100 }, order: 6, customStyle: {} },
          location: { enabled: true, position: { x: 0, y: 700 }, size: { width: 100, height: 100 }, order: 7, customStyle: {} },
          capacity: { enabled: true, position: { x: 0, y: 800 }, size: { width: 100, height: 100 }, order: 8, customStyle: {} }
        },
        colors: {
          primary: '#3b82f6',
          secondary: '#64748b',
          background: '#ffffff',
          text: '#1e293b'
        },
        spacing: 'normal',
        customFields: []
      });
    }
  }, [currentLayout]);

  const handleAddCustomField = async () => {
    if (!newField.name?.trim()) return;

    const field: CustomField = {
      id: `field_${Date.now()}`,
      name: newField.name.trim(),
      type: newField.type as any || 'text',
      value: newField.value || '',
      required: newField.required || false,
      enabled: true,
      placeholder: newField.placeholder || '',
      description: newField.description || '',
      position: newField.position || { x: 0, y: 0 },
      size: newField.size || { width: 100, height: 20 },
      options: newField.type === 'select' ? [] : undefined,
      style: {}
    };

    try {
      await addCustomFieldToEvent(eventId, field);
      
      const updatedLayout = {
        ...layout,
        customFields: [...(layout.customFields || []), field]
      };
      
      setLayout(updatedLayout);
      onLayoutChange?.(updatedLayout);
      
      // Reset form
      setNewField({
        name: '',
        type: 'text',
        value: '',
        required: false,
        placeholder: '',
        description: '',
        position: { x: 0, y: 0 },
        size: { width: 100, height: 20 }
      });
      
      console.log('✅ Custom field added successfully');
    } catch (error) {
      console.error('❌ Error adding custom field:', error);
    }
  };

  const handleEditCustomField = (fieldName: string) => {
    const field = layout.customFields?.find(f => f.name === fieldName);
    if (field) {
      setNewField(field);
      setIsEditing(true);
    }
  };

  const handleRemoveCustomField = async (fieldName: string) => {
    try {
      await removeCustomFieldFromEvent(eventId, fieldName);
      
      const updatedLayout = {
        ...layout,
        customFields: layout.customFields?.filter(f => f.name !== fieldName) || []
      };
      
      setLayout(updatedLayout);
      onLayoutChange?.(updatedLayout);
      
      console.log('✅ Custom field removed successfully');
    } catch (error) {
      console.error('❌ Error removing custom field:', error);
    }
  };

  const handleReorderFields = async (fieldNames: string[]) => {
    try {
      await reorderCustomFields(eventId, fieldNames);
      
      const reorderedFields = fieldNames.map(name => 
        layout.customFields?.find(field => field.name === name)
      ).filter(Boolean) as CustomField[];
      
      const updatedLayout = {
        ...layout,
        customFields: reorderedFields
      };
      
      setLayout(updatedLayout);
      onLayoutChange?.(updatedLayout);
      
      console.log('✅ Custom fields reordered successfully');
    } catch (error) {
      console.error('❌ Error reordering custom fields:', error);
    }
  };

  const handleSaveLayout = async () => {
    try {
      console.log('💾 Saving layout to API...', { eventId, layout });
      await updateEventLayoutConfig(eventId, layout);
      setIsEditing(false);
      console.log('✅ Layout saved successfully to API');
      
      // Show success feedback to user
      alert('Layout saved successfully!');
    } catch (error) {
      console.error('❌ Error saving layout:', error);
      alert('Error saving layout. Please try again.');
    }
  };

  const handleDragStart = (fieldName: string) => {
    setDraggedField(fieldName);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetFieldId: string) => {
    e.preventDefault();
    
    if (!draggedField || draggedField === targetFieldId) return;
    
    const currentFields = layout.customFields || [];
    const draggedIndex = currentFields.findIndex(f => f.id === draggedField);
    const targetIndex = currentFields.findIndex(f => f.id === targetFieldId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    const newFields = [...currentFields];
    const [draggedItem] = newFields.splice(draggedIndex, 1);
    newFields.splice(targetIndex, 0, draggedItem);
    
    const fieldNames = newFields.map(f => f.name);
    handleReorderFields(fieldNames);
    setDraggedField(null);
  };

  const renderFieldIcon = (type: string) => {
    const FieldIcon = FIELD_TYPE_ICONS[type as keyof typeof FIELD_TYPE_ICONS] || Type;
    return <FieldIcon className="w-4 h-4" />;
  };

  const handleDeleteField = (fieldName: string) => {
    // Remove field from layout state immediately (UI update)
    const updatedLayout = {
      ...layout,
      customFields: layout.customFields?.filter(f => f.name !== fieldName) || []
    };
    
    setLayout(updatedLayout);
    onLayoutChange?.(updatedLayout);
    
    console.log('✅ Custom field removed from preview (will be saved when you click Save)');
  };

  return (
    <div className="w-full h-full relative">
      {/* Save Button */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          onClick={handleSaveLayout}
          className="bg-primary hover:bg-primary/90"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Layout
        </Button>
      </div>
      
      {currentEvent ? (
        <div className="h-full">
               <EventDetailPreview 
                 event={currentEvent} 
                 layout={layout}
                 fieldValues={fieldValues}
                 setFieldValues={setFieldValues}
                 onDeleteField={handleDeleteField}
                 onDeleteSection={(sectionType) => {
                   console.log(`Section ${sectionType} deleted from preview`);
                 }}
                 onUpdateEvent={onUpdateEvent}
               />
        </div>
      ) : (
        <div className="h-full flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Event data required for preview</p>
          </div>
        </div>
      )}
    </div>
  );
}