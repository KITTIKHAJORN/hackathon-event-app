import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onFilterToggle?: () => void;
  placeholder?: string;
  showFilter?: boolean;
}

const SearchBar = ({ 
  onSearch, 
  onFilterToggle, 
  placeholder = "ค้นหาอีเวนต์...", 
  showFilter = true 
}: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 shadow-card"
          />
        </div>
        
        {showFilter && (
          <Button 
            type="button"
            variant="outline" 
            size="lg"
            onClick={onFilterToggle}
            className="px-4 py-4 h-auto"
          >
            <Filter className="w-5 h-5" />
          </Button>
        )}
        
        <Button type="submit" variant="default" size="lg" className="px-6 py-4 h-auto">
          ค้นหา
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;