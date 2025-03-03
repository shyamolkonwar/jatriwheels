"use client";

import { useState, useEffect } from "react";
import { 
  ChevronDown, 
  ChevronUp, 
  MoreHorizontal, 
  Search, 
  UserPlus, 
  Filter, 
  Download,
  Calendar,
  MapPin
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";

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
  vehicle: {
    type: string;
  };
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  profile_picture?: string;
  created_at: string;
  updated_at: string;
  is_verified: boolean;
  auth_provider: string;
  device_token?: string;
  total_rides?: number;
}

interface RideHistoryDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

function RideHistoryDialog({ user, open, onOpenChange }: RideHistoryDialogProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserBookings(user.id);
    }
  }, [user]);

  const fetchUserBookings = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          vehicle:vehicle_type_id (
            type
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ride History</DialogTitle>
          <DialogDescription>
            Booking history for {user.first_name} {user.last_name}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-4">Loading ride history...</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-4">No rides found for this user.</div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col gap-4 p-4 border rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {new Date(booking.scheduled_date).toLocaleDateString()} at {booking.scheduled_time}
                    </span>
                  </div>
                  <Badge
                    variant={getStatusColor(booking.status)}
                    className="capitalize"
                  >
                    {booking.status.toLowerCase().replace("_", " ")}
                  </Badge>
                </div>

                <div className="grid gap-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Pickup Location</p>
                      <p className="text-sm text-muted-foreground">{booking.pickup_location.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Drop Location</p>
                      <p className="text-sm text-muted-foreground">{booking.drop_location.name}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-muted-foreground">Vehicle Type:</span>{" "}
                      <span className="font-medium">{booking.vehicle.type}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Distance:</span>{" "}
                      <span className="font-medium">{booking.estimated_distance} km</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Fare:</span>{" "}
                    <span className="font-medium">₹{booking.total_fare.toFixed(2)}</span>
                  </div>
                </div>

                {booking.status === "CANCELLED" && booking.payment_status === "REFUNDED" && (
                  <div className="text-sm text-muted-foreground">
                    Payment Status: <Badge variant="outline">Refunded</Badge>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof User>("first_name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isRideHistoryOpen, setIsRideHistoryOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // First, fetch all users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*');

      if (usersError) throw usersError;

      // Then, for each user, count their total rides from bookings
      const usersWithRides = await Promise.all(
        (usersData || []).map(async (user) => {
          const { count: ridesCount } = await supabase
            .from('bookings')
            .select('*', { count: 'exact' })
            .eq('user_id', user.id)
            .eq('status', 'COMPLETED');

          return {
            ...user,
            total_rides: ridesCount || 0
          };
        })
      );

      setUsers(usersWithRides);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone && user.phone.includes(searchTerm))
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortField === "total_rides") {
      return sortDirection === "asc" 
        ? (a.total_rides || 0) - (b.total_rides || 0)
        : (b.total_rides || 0) - (a.total_rides || 0);
    }
    
    const aValue = a[sortField]?.toString() || "";
    const bValue = b[sortField]?.toString() || "";
    
    return sortDirection === "asc" 
      ? aValue.localeCompare(bValue) 
      : bValue.localeCompare(aValue);
  });

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            Loading users...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              Manage user accounts and permissions
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("first_name")}
                  >
                    User
                    {sortField === "first_name" && (
                      sortDirection === "asc" ? 
                        <ChevronUp className="ml-1 h-4 w-4" /> : 
                        <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("is_verified")}
                  >
                    Status
                    {sortField === "is_verified" && (
                      sortDirection === "asc" ? 
                        <ChevronUp className="ml-1 h-4 w-4" /> : 
                        <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("total_rides")}
                  >
                    Total Rides
                    {sortField === "total_rides" && (
                      sortDirection === "asc" ? 
                        <ChevronUp className="ml-1 h-4 w-4" /> : 
                        <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("created_at")}
                  >
                    Joined
                    {sortField === "created_at" && (
                      sortDirection === "asc" ? 
                        <ChevronUp className="ml-1 h-4 w-4" /> : 
                        <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUsers.length > 0 ? (
                sortedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.profile_picture} />
                          <AvatarFallback>{`${user.first_name[0]}${user.last_name[0]}`}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{`${user.first_name} ${user.last_name}`}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.is_verified ? "default" : "secondary"}
                        className="capitalize"
                      >
                        {user.is_verified ? "Verified" : "Unverified"}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.total_rides || 0}</TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Edit user</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user);
                              setIsRideHistoryOpen(true);
                            }}
                          >
                            View ride history
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            {user.is_verified ? "Suspend user" : "Delete user"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing <strong>{sortedUsers.length}</strong> of{" "}
          <strong>{users.length}</strong> users
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </CardFooter>
      <RideHistoryDialog
        user={selectedUser}
        open={isRideHistoryOpen}
        onOpenChange={setIsRideHistoryOpen}
      />
    </Card>
  );
}