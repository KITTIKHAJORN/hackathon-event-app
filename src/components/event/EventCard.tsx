import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, DollarSign } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  location: string;
  category: string;
  price: number;
  currency: string;
  attendees: number;
  maxAttendees: number;
}

interface EventCardProps {
  event: Event;
  variant?: "default" | "featured";
}

export function EventCard({ event, variant = "default" }: EventCardProps) {
  const { t } = useLanguage();

  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return t("free");
    return `${price} ${currency}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
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
    <Card className={`group overflow-hidden transition-all duration-300 hover:shadow-event-card-hover hover:-translate-y-1 ${
      variant === "featured" ? "ring-2 ring-primary/20" : ""
    }`}>
      <div className="relative overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <Badge
          className={`absolute top-3 left-3 ${getCategoryColor(event.category)}`}
        >
          {t(event.category)}
        </Badge>
        {variant === "featured" && (
          <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
            Featured
          </Badge>
        )}
      </div>

      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {event.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            {formatDate(event.date)}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            {event.location}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-2 text-primary" />
              {event.attendees}/{event.maxAttendees}
            </div>
            <div className="flex items-center text-sm font-medium text-primary">
              <DollarSign className="h-4 w-4 mr-1" />
              {formatPrice(event.price, event.currency)}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <Link to={`/events/${event.id}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}