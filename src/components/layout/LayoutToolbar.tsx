import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Save,
  RotateCcw,
  Type,
  Tag,
  ClipboardList,
  Users,
  Layers,
  Activity
} from 'lucide-react';

interface LayoutToolbarProps {
  onSave?: () => void;
  onReset?: () => void;
  onAddHeading?: () => void;
  onAddTags?: () => void;
  onAddRequirements?: () => void;
  onAddSpeakers?: () => void;
  onAddTracks?: () => void;
  onAddActivities?: () => void;
}

export default function LayoutToolbar({
  onSave,
  onReset,
  onAddHeading,
  onAddTags,
  onAddRequirements,
  onAddSpeakers,
  onAddTracks,
  onAddActivities
}: LayoutToolbarProps) {
  return (
    <div className="h-full w-20 bg-background border-r flex flex-col items-center py-4 space-y-2 overflow-y-auto">
      {/* Main Actions */}
      <div className="flex flex-col space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSave}
          className="w-12 h-12 p-0"
          title="Save Layout"
        >
          <Save className="w-5 h-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="w-12 h-12 p-0"
          title="Reset Layout"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
      </div>

      <Separator className="w-8" />


      {/* Add Fields - Event Info */}
      <div className="flex flex-col space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddTags}
          className="w-12 h-12 p-0"
          title="Add Tags"
        >
          <Tag className="w-5 h-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddRequirements}
          className="w-12 h-12 p-0"
          title="Add Requirements"
        >
          <ClipboardList className="w-5 h-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddSpeakers}
          className="w-12 h-12 p-0"
          title="Add Speakers"
        >
          <Users className="w-5 h-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddTracks}
          className="w-12 h-12 p-0"
          title="Add Tracks"
        >
          <Layers className="w-5 h-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onAddActivities}
          className="w-12 h-12 p-0"
          title="Add Activities"
        >
          <Activity className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}