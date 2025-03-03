"use client";

import { BookingsTable } from "@/components/bookings/bookings-table";

export default function BookingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Booking Management</h1>
        <p className="text-muted-foreground">
          View and manage all ride bookings in the system
        </p>
      </div>
      
      <BookingsTable />
    </div>
  );
}