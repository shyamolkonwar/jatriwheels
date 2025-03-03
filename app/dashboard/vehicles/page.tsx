"use client";

import { VehiclesTable } from "@/components/vehicles/vehicles-table";

export default function VehiclesPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vehicle Management</h1>
        <p className="text-muted-foreground">
          View and manage your fleet of vehicles
        </p>
      </div>
      
      <VehiclesTable />
    </div>
  );
} 