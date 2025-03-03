"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

interface Location {
  name: string;
  latitude: number;
  longitude: number;
}

interface Booking {
  id: string;
  support_code: string;
  user_id: string;
  vehicle_type_id: string;
  pickup_location: Location;
  drop_location: Location;
  scheduled_date: string;
  scheduled_time: string;
  trip_type: string;
  estimated_distance: number;
  base_fare: number;
  total_fare: number;
  status: string;
  payment_status: string;
  created_at: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  vehicle: {
    type: string;
  };
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "default";
    case "in_progress":
      return "secondary";
    case "cancelled":
      return "destructive";
    case "scheduled":
      return "outline";
    default:
      return "default";
  }
};

export function RecentBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentBookings();
  }, []);

  const fetchRecentBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          user:user_id (
            first_name,
            last_name,
            email
          ),
          vehicle:vehicle_type_id (
            type
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching recent bookings:', error);
        return;
      }

      if (data) {
        setBookings(data);
      }
    } catch (error) {
      console.error('Error fetching recent bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="space-y-4">Loading recent bookings...</div>;
  }

  if (bookings.length === 0) {
    return <div className="space-y-4">No recent bookings found.</div>;
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div key={booking.id} className="flex items-center justify-between space-x-4 rounded-md border p-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarFallback>
                {`${booking.user.first_name[0]}${booking.user.last_name[0]}`}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">
                {`${booking.user.first_name} ${booking.user.last_name}`}
              </p>
              <p className="text-sm text-muted-foreground">{booking.user.email}</p>
              <div className="mt-1 flex items-center text-xs text-muted-foreground">
                <span className="truncate max-w-[120px]">{booking.pickup_location.name}</span>
                <span className="mx-1">→</span>
                <span className="truncate max-w-[120px]">{booking.drop_location.name}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge
              variant={getStatusColor(booking.status)}
              className="capitalize"
            >
              {booking.status.toLowerCase().replace("_", " ")}
            </Badge>
            <p className="text-sm font-medium">₹{booking.total_fare.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(booking.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}