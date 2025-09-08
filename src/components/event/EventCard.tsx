import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  time: string;
  location: string;
  category: string;
  price: number;
  attendees: number;
  maxAttendees: number;
  isOnline?: boolean;
}

const EventCard = ({ 
  id, 
  title, 
  description, 
  image, 
  date, 
  time, 
  location, 
  category, 
  price, 
  attendees, 
  maxAttendees,
  isOnline = false 
}: EventCardProps) => {
  const isFree = price === 0;
  const progressPercent = (attendees / maxAttendees) * 100;

  return (
    <div className="group bg-card rounded-2xl shadow-card hover:shadow-glow transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Event Image */}
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
            {category}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          {isOnline && (
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
              Online
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title & Description */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {description}
          </p>
        </div>

        {/* Event Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 text-primary" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>

        {/* Attendees Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="w-4 h-4 text-primary" />
              <span>{attendees}/{maxAttendees} คน</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {Math.round(progressPercent)}% เต็ม
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-2">
          <div>
            {isFree ? (
              <span className="text-primary font-semibold text-lg">ฟรี</span>
            ) : (
              <span className="text-foreground font-semibold text-lg">
                ฿{price.toLocaleString()}
              </span>
            )}
          </div>
          <Link to={`/events/${id}`}>
            <Button variant="event" size="sm">
              ดูรายละเอียด
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;