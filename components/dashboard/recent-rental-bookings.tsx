"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

interface RentalBooking {
  id: string;
  user_id: string;
  pickup_location: string;
  pickup_date: string;
  pickup_time: string;
  total_price: number;
  status: string;
  created_at: string;
  vehicle_category: string;
  all_users: {
    first_name: string;
    last_name: string;
    email: string;
  };
  payment?: {
    payment_method: string;
    status: string;
    transaction_id?: string;
  };
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "default";
    case "confirmed":
      return "secondary";
    case "cancelled":
      return "destructive";
    case "pending":
      return "outline";
    default:
      return "default";
  }
};

export function RecentRentalBookings() {
  const [rentals, setRentals] = useState<RentalBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecentRentalBookings();
  }, []);

  const fetchRecentRentalBookings = async () => {
    try {
      console.log('Fetching rental bookings...');
      const { data, error, count } = await supabase
        .from('rental_bookings')
        .select(`
          *,
          users!rental_booking_user_id_fkey (
            first_name,
            last_name,
            email
          ),
          rental_payments (
            payment_method,
            status,
            transaction_id
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching recent rental bookings:', error);
        setError(error.message);
        return;
      }

      if (error) {
        console.error('Detailed query error:', error);
        setError(`Database error: ${error instanceof Error ? error.message : String(error)}`);
        return;
      }

      console.log('Fetched rental bookings:', data);
      console.log('Total bookings found:', count);

      if (data && data.length > 0) {
        setRentals(data);
      } else {
        console.log('No rental bookings found');
        setError('No rental bookings found in database');
      }
    } catch (error) {
      console.error('Error fetching recent rental bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="space-y-4">Loading recent rental bookings...</div>;
  }

  if (error) {
    return (
      <div className="space-y-4 text-destructive">
        Error: {error}
        <div className="text-xs text-muted-foreground">
          Check console for more details
        </div>
      </div>
    );
  }

  if (rentals.length === 0) {
    return (
      <div className="space-y-4">
        No recent rental bookings found.
        <div className="text-xs text-muted-foreground">
          The rental_bookings table appears to be empty
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rentals.map((rental) => (
        <div key={rental.id} className="flex items-center justify-between space-x-4 rounded-md border p-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarFallback>
                {`${rental.all_users.first_name[0]}${rental.all_users.last_name[0]}`}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">
                {`${rental.all_users.first_name} ${rental.all_users.last_name}`}
              </p>
              <p className="text-sm text-muted-foreground">{rental.all_users.email}</p>
              <div className="mt-1 flex items-center text-xs text-muted-foreground">
                <span>{rental.pickup_location}</span>
                <span className="mx-1">•</span>
                <span>{rental.vehicle_category}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge
              variant={getStatusColor(rental.status)}
              className="capitalize"
            >
              {rental.status.toLowerCase().replace("_", " ")}
            </Badge>
            <p className="text-sm font-medium">₹{rental.total_price.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(rental.pickup_date).toLocaleDateString()} {rental.pickup_time}
            </p>
            {rental.payment && (
              <p className="text-xs text-muted-foreground">
                {rental.payment.payment_method} • {rental.payment.status}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}