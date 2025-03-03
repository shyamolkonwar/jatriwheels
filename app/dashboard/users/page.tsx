"use client";

import { UsersTable } from "@/components/users/users-table";

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          View and manage user accounts in the system
        </p>
      </div>
      
      <UsersTable />
    </div>
  );
}