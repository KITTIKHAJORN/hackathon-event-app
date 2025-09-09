import { useState, useEffect, useCallback, useRef } from "react";
import { Calendar, MapPin, Search } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { eventService, EventData } from "@/services/eventService";
import { useToast } from "@/hooks/use-toast";

interface EventSearchProps {
  searchQuery: string;
  onSelect: (event: EventData) => void;
  onClose: () => void;
}

// Custom hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function EventSearch({ searchQuery, onSelect, onClose }: EventSearchProps) {
  const { toast } = useToast();
  const [searchResults, setSearchResults] = useState<EventData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const listboxRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Debounce the search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Search function
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await eventService.searchEvents(query);
      setSearchResults(results.slice(0, 3)); // Limit to 3 results instead of 5
      setActiveIndex(-1); // Reset active index when new results come in
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to search events. Please try again.",
        variant: "destructive",
      });
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [toast]);

  // Handle selection
  const handleSelect = useCallback((event: EventData) => {
    onSelect(event);
    setActiveIndex(-1); // Reset active index after selection
  }, [onSelect]);

  // Handle mouse enter for highlighting
  const handleMouseEnter = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  // Handle mouse leave to clear highlighting
  const handleMouseLeave = useCallback(() => {
    setActiveIndex(-1);
  }, []);

  // Effect to trigger search when debounced query changes
  useEffect(() => {
    performSearch(debouncedSearchQuery);
  }, [debouncedSearchQuery, performSearch]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!searchQuery.trim() || searchResults.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex(prev => (prev > 0 ? prev - 1 : searchResults.length - 1));
          break;
        case 'Enter':
          e.preventDefault();
          if (activeIndex >= 0 && activeIndex < searchResults.length) {
            handleSelect(searchResults[activeIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchQuery, searchResults, activeIndex, onClose, handleSelect]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (listboxRef.current && !listboxRef.current.contains(e.target as Node)) {
        onClose();
        setActiveIndex(-1); // Reset selection when clicking outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [activeIndex]);


  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Only render if there's a search query
  if (!searchQuery.trim()) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 z-50 mt-2">
      <div
        ref={listboxRef}
        className="bg-popover border border-border rounded-md shadow-lg max-h-80 overflow-hidden"
        role="listbox"
        aria-label="Event search results"
      >
        <Command className="rounded-none border-0" shouldFilter={false}>
          <CommandList className="max-h-64 overflow-hidden">
            {isSearching ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                Searching...
              </div>
            ) : searchResults.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No events found.
              </div>
            ) : (
              searchResults.map((event, index) => (
                <CommandItem
                  key={`${event.id}-${index}`}
                  ref={(el) => (itemRefs.current[index] = el)}
                  value={`search-result-${event.id}-${index}`}
                  onSelect={() => handleSelect(event)}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                  className={`flex items-center gap-3 px-3 py-2 cursor-pointer border-0 rounded-none transition-colors duration-150  ${
                    activeIndex === index
                      ? 'bg-accent text-accent-foreground'
                      : ''
                  } [&:not([data-selected])]:hover:bg-accent/30`}
                  role="option"
                  aria-selected={activeIndex === index}
                  aria-activedescendant={activeIndex === index ? `event-${event.id}` : undefined}
                  id={`event-${event.id}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate text-left">{event.title}</div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(event.schedule.startDate)}</span>
                      {event.location.venue && (
                        <>
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{event.location.venue}</span>
                        </>
                      )}
                    </div>
                  </div>
                </CommandItem>
              ))
            )}
          </CommandList>
        </Command>
      </div>
    </div>
  );
}