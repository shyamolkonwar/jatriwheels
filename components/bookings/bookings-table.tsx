"use client";

import { useEffect, useState } from "react";
import { 
  ChevronDown, 
  ChevronUp, 
  MoreHorizontal, 
  Search, 
  Filter, 
  Download,
  Calendar,
  AlertCircle,
  X,
  RefreshCw
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase, getCurrentAdmin } from "@/lib/supabase";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  vehicle: {
    type: string;
  };
  payment?: {
    id: string;
    payment_method: string;
    status: string;
  };
}

interface EditBookingDialogProps {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedBooking: Booking) => void;
}

function EditBookingDialog({ booking, open, onOpenChange, onSave }: EditBookingDialogProps) {
  const [editedBooking, setEditedBooking] = useState<Booking | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  useEffect(() => {
    if (booking) {
      setEditedBooking({ ...booking });
      fetchPaymentDetails(booking.id);
    }
  }, [booking]);

  const fetchPaymentDetails = async (bookingId: string) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('payment_method, status')
        .eq('booking_id', bookingId)
        .single();

      if (error) throw error;
      if (data) {
        setPaymentMethod(data.payment_method);
      }
    } catch (error) {
      console.error('Error fetching payment details:', error);
    }
  };

  if (!editedBooking) return null;

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Start a Supabase transaction by making both updates
      const [bookingUpdate, paymentUpdate] = await Promise.all([
        // Update booking
        supabase
          .from('bookings')
          .update({
            status: editedBooking.status,
            payment_status: editedBooking.payment_status,
            pickup_location: {
              name: editedBooking.pickup_location.name,
              latitude: editedBooking.pickup_location.latitude,
              longitude: editedBooking.pickup_location.longitude
            },
            drop_location: {
              name: editedBooking.drop_location.name,
              latitude: editedBooking.drop_location.latitude,
              longitude: editedBooking.drop_location.longitude
            },
            scheduled_date: editedBooking.scheduled_date,
            scheduled_time: editedBooking.scheduled_time
          })
          .eq('id', editedBooking.id)
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
          .single(),

        // Update payment status
        supabase
          .from('payments')
          .update({
            status: editedBooking.payment_status
          })
          .eq('booking_id', editedBooking.id)
      ]);

      const [bookingData, paymentData] = [bookingUpdate.data, paymentUpdate.data];
      const [bookingError, paymentError] = [bookingUpdate.error, paymentUpdate.error];

      if (bookingError || paymentError) {
        throw bookingError || paymentError;
      }
      
      if (bookingData) {
        onSave(bookingData as Booking);
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error updating booking and payment:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Booking</DialogTitle>
          <DialogDescription>
            Update the booking details below
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Booking ID</Label>
            <div className="col-span-3">
              <Input value={editedBooking.support_code} disabled />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Status</Label>
            <Select
              value={editedBooking.status}
              onValueChange={(value) => setEditedBooking({ ...editedBooking, status: value })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">PENDING</SelectItem>
                <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                <SelectItem value="CONFIRMED">CONFIRMED</SelectItem>
                <SelectItem value="COMPLETED">COMPLETED</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Payment Status</Label>
            <Select
              value={editedBooking.payment_status}
              onValueChange={(value) => setEditedBooking({ ...editedBooking, payment_status: value })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select payment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">PENDING</SelectItem>
                <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                <SelectItem value="FAILED">FAILED</SelectItem>
                <SelectItem value="REFUNDED">REFUNDED</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Payment Method</Label>
            <div className="col-span-3">
              <Input value={paymentMethod} disabled />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Pickup Location</Label>
            <Input
              className="col-span-3"
              value={editedBooking.pickup_location.name}
              onChange={(e) => setEditedBooking({
                ...editedBooking,
                pickup_location: { ...editedBooking.pickup_location, name: e.target.value }
              })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Drop Location</Label>
            <Input
              className="col-span-3"
              value={editedBooking.drop_location.name}
              onChange={(e) => setEditedBooking({
                ...editedBooking,
                drop_location: { ...editedBooking.drop_location, name: e.target.value }
              })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Date</Label>
            <Input
              className="col-span-3"
              type="date"
              value={editedBooking.scheduled_date}
              onChange={(e) => setEditedBooking({ ...editedBooking, scheduled_date: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Time</Label>
            <Input
              className="col-span-3"
              type="time"
              value={editedBooking.scheduled_time}
              onChange={(e) => setEditedBooking({ ...editedBooking, scheduled_time: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ViewBookingDialogProps {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ViewBookingDialog({ booking, open, onOpenChange }: ViewBookingDialogProps) {
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    if (booking) {
      fetchAdditionalDetails(booking.id, booking.user_id);
    }
  }, [booking]);

  const fetchAdditionalDetails = async (bookingId: string, userId: string) => {
    try {
      // Fetch payment details
      const { data: paymentData, error: paymentError } = await supabase
        .from('payments')
        .select('*')
        .eq('booking_id', bookingId)
        .single();

      if (paymentError) throw paymentError;
      setPaymentDetails(paymentData);

      // Fetch user details
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) throw userError;
      setUserDetails(userData);
    } catch (error) {
      console.error('Error fetching additional details:', error);
    }
  };

  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
          <DialogDescription>
            Complete information about the booking
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Booking Information */}
          <div className="grid gap-4">
            <h3 className="text-lg font-semibold">Booking Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Booking ID</Label>
                <div className="mt-1 text-sm">{booking.support_code}</div>
              </div>
              <div>
                <Label>Status</Label>
                <div className="mt-1">
                  <Badge variant={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                </div>
              </div>
              <div>
                <Label>Date</Label>
                <div className="mt-1 text-sm">
                  {new Date(booking.scheduled_date).toLocaleDateString()}
                </div>
              </div>
              <div>
                <Label>Time</Label>
                <div className="mt-1 text-sm">{booking.scheduled_time}</div>
              </div>
              <div>
                <Label>Vehicle Type</Label>
                <div className="mt-1 text-sm">{booking.vehicle.type}</div>
              </div>
              <div>
                <Label>Trip Type</Label>
                <div className="mt-1 text-sm">{booking.trip_type}</div>
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="grid gap-4">
            <h3 className="text-lg font-semibold">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <div className="mt-1 text-sm">
                  {`${booking.user.first_name} ${booking.user.last_name}`}
                </div>
              </div>
              <div>
                <Label>Email</Label>
                <div className="mt-1 text-sm">{booking.user.email}</div>
              </div>
              {userDetails && (
                <>
                  <div>
                    <Label>Phone</Label>
                    <div className="mt-1 text-sm">{userDetails.phone}</div>
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <div className="mt-1 text-sm capitalize">{userDetails.gender}</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Location Information */}
          <div className="grid gap-4">
            <h3 className="text-lg font-semibold">Route Information</h3>
            <div className="grid gap-4">
              <div>
                <Label>Pickup Location</Label>
                <div className="mt-1 text-sm">{booking.pickup_location.name}</div>
              </div>
              <div>
                <Label>Drop Location</Label>
                <div className="mt-1 text-sm">{booking.drop_location.name}</div>
              </div>
              <div>
                <Label>Estimated Distance</Label>
                <div className="mt-1 text-sm">{booking.estimated_distance} km</div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="grid gap-4">
            <h3 className="text-lg font-semibold">Payment Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Payment Status</Label>
                <div className="mt-1">
                  <Badge variant={booking.payment_status === "COMPLETED" ? "default" : "secondary"}>
                    {booking.payment_status}
                  </Badge>
                </div>
              </div>
              {paymentDetails && (
                <>
                  <div>
                    <Label>Payment Method</Label>
                    <div className="mt-1 text-sm capitalize">{paymentDetails.payment_method}</div>
                  </div>
                  <div>
                    <Label>Base Fare</Label>
                    <div className="mt-1 text-sm">₹{booking.base_fare.toFixed(2)}</div>
                  </div>
                  <div>
                    <Label>Total Fare</Label>
                    <div className="mt-1 text-sm">₹{booking.total_fare.toFixed(2)}</div>
                  </div>
                </>
              )}
            </div>
          </div>
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

interface ContactCustomerDialogProps {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ContactCustomerDialog({ booking, open, onOpenChange }: ContactCustomerDialogProps) {
  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    if (booking) {
      fetchUserDetails(booking.user_id);
    }
  }, [booking]);

  const fetchUserDetails = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUserDetails(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Customer Contact Information</DialogTitle>
          <DialogDescription>
            Contact details for {booking.user.first_name} {booking.user.last_name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Full Name</Label>
            <div className="text-sm">
              {booking.user.first_name} {booking.user.last_name}
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Email</Label>
            <div className="text-sm">{booking.user.email}</div>
          </div>
          {userDetails && (
            <div className="grid gap-2">
              <Label>Phone Number</Label>
              <div className="text-sm">{userDetails.phone}</div>
            </div>
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

export function BookingsTable() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Booking>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);

  useEffect(() => {
    checkAdminAndFetchBookings();
  }, []);

  const checkAdminAndFetchBookings = async () => {
    try {
      const adminSession = getCurrentAdmin();
      console.log('Current admin session:', adminSession); // Add debugging
      
      // Check if admin exists and has Super Admin role (case-insensitive)
      const isAuthorized = adminSession?.role?.toLowerCase() === 'super admin';
      console.log('Is authorized:', isAuthorized); // Add debugging
      
      setIsAuthorized(isAuthorized);
      
      if (isAuthorized) {
        await fetchBookings();
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAuthorized(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setIsRefreshing(true);
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
        `);

      if (error) {
        console.error('Error fetching bookings:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No data returned from bookings query');
      }

      setBookings(data);
      // Optional: Show success toast/notification
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Handle error appropriately
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSort = (field: keyof Booking) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (!searchTerm.trim()) return true;
    
    const searchValue = searchTerm.toLowerCase().trim();
    
    // Create a single string of all searchable fields
    const searchableText = [
      booking.support_code,
      booking.user?.first_name,
      booking.user?.last_name,
      `${booking.user?.first_name} ${booking.user?.last_name}`, // Full name
      booking.user?.email,
      booking.pickup_location?.name,
      booking.drop_location?.name,
      booking.status,
      booking.payment_status
    ]
      .filter(Boolean) // Remove null/undefined values
      .join(' ')
      .toLowerCase();

    // Check if any part of the searchable text includes the search term
    return searchableText.includes(searchValue);
  });

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (sortField === "scheduled_date") {
      const dateA = new Date(`${a.scheduled_date} ${a.scheduled_time}`);
      const dateB = new Date(`${b.scheduled_date} ${b.scheduled_time}`);
      return sortDirection === "asc" 
        ? dateA.getTime() - dateB.getTime() 
        : dateB.getTime() - dateA.getTime();
    }
    
    const aValue = a[sortField]?.toString() || "";
    const bValue = b[sortField]?.toString() || "";
    
    return sortDirection === "asc" 
      ? aValue.localeCompare(bValue) 
      : bValue.localeCompare(aValue);
  });

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsEditDialogOpen(true);
  };

  const handleSaveBooking = (updatedBooking: Booking) => {
    setBookings(bookings.map(booking => 
      booking.id === updatedBooking.id ? updatedBooking : booking
    ));
  };

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsViewDialogOpen(true);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isAuthorized) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center text-destructive gap-2">
            <AlertCircle className="h-4 w-4" />
            You don't have permission to view this content
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
            <CardTitle>Bookings</CardTitle>
            <CardDescription>
              View and manage all ride bookings
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchBookings}
              disabled={isRefreshing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Date Range
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
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
              placeholder="Search bookings..."
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
                <TableHead className="w-[100px]">
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("support_code")}
                  >
                    ID
                    {sortField === "support_code" && (
                      sortDirection === "asc" ? 
                        <ChevronUp className="ml-1 h-4 w-4" /> : 
                        <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="w-[180px]">
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("user_id")}
                  >
                    Customer
                    {sortField === "user_id" && (
                      sortDirection === "asc" ? 
                        <ChevronUp className="ml-1 h-4 w-4" /> : 
                        <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Route</TableHead>
                <TableHead>
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("scheduled_date")}
                  >
                    Date/Time
                    {sortField === "scheduled_date" && (
                      sortDirection === "asc" ? 
                        <ChevronUp className="ml-1 h-4 w-4" /> : 
                        <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    Status
                    {sortField === "status" && (
                      sortDirection === "asc" ? 
                        <ChevronUp className="ml-1 h-4 w-4" /> : 
                        <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("total_fare")}
                  >
                    Amount
                    {sortField === "total_fare" && (
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
              {sortedBookings.length > 0 ? (
                sortedBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="w-[100px]">
                      {booking.support_code}
                    </TableCell>
                    <TableCell className="w-[180px]">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {`${booking.user.first_name[0]}${booking.user.last_name[0]}`}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                          <p className="font-medium">{`${booking.user.first_name} ${booking.user.last_name}`}</p>
                          <p className="text-muted-foreground">{booking.user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium truncate max-w-[200px]">{booking.pickup_location.name}</p>
                        <p className="text-muted-foreground truncate max-w-[200px]">{booking.drop_location.name}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">{new Date(booking.scheduled_date).toLocaleDateString()}</p>
                        <p className="text-muted-foreground">{booking.scheduled_time}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusColor(booking.status)}
                        className="capitalize"
                      >
                        {booking.status.toLowerCase().replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>₹{booking.total_fare.toFixed(2)}</TableCell>
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
                          <DropdownMenuItem onSelect={() => handleViewBooking(booking)}>
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleEditBooking(booking)}>
                            Edit booking
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onSelect={() => {
                            setSelectedBooking(booking);
                            setIsContactDialogOpen(true);
                          }}>
                            Contact customer
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {booking.status === "scheduled" && (
                            <DropdownMenuItem className="text-destructive">
                              Cancel booking
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No bookings found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing <strong>{sortedBookings.length}</strong> of{" "}
          <strong>{bookings.length}</strong> bookings
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
      <ViewBookingDialog
        booking={selectedBooking}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
      />
      <EditBookingDialog
        booking={selectedBooking}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveBooking}
      />
      <ContactCustomerDialog
        booking={selectedBooking}
        open={isContactDialogOpen}
        onOpenChange={setIsContactDialogOpen}
      />
    </Card>
  );
}