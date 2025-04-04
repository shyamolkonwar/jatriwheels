"use client";

import { RentalsTable } from "@/components/rentals/rentals-table";

export default function RentalsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Vehicle Rentals
        </h2>
      </div>
      <RentalsTable />
    </div>
  );
}