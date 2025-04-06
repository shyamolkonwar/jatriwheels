"use client";

import { Fragment, useEffect, useState } from "react";
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


interface EditRentalDialogProps {
  rental: Rental | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedRental: Rental) => void;
}

interface ViewRentalDialogProps {
  rental: Rental | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function EditRentalDialog({ rental, open, onOpenChange, onSave }: EditRentalDialogProps) {
  const [editedRental, setEditedRental] = useState<Rental | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (rental) {
      setEditedRental({ ...rental });
    }
  }, [rental]);

  if (!editedRental) return null;

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // First update rental booking
      const { data: bookingData, error: bookingError } = await supabase
        .from('rental_booking')
        .update({
          status: editedRental.status,
          pickup_location: editedRental.pickup_location,
          pickup_date: editedRental.pickup_date,
          pickup_time: editedRental.pickup_time,
          total_price: editedRental.total_price,
          discounted_price: editedRental.discounted_price
        })
        .eq('id', editedRental.id)
        .select(`
          *,
          user:user_id (
            first_name,
            last_name,
            email
          ),
          rental_payments (
            id,
            status
          )
        `)
        .single();

      if (bookingError) throw bookingError;
      
      if (bookingData) {
        // Update payment status if changed
        if (editedRental.payment_status !== bookingData.rental_payments[0]?.status) {
          const { error: paymentError } = await supabase
            .from('rental_payments')
            .update({
              status: editedRental.payment_status
            })
            .eq('id', bookingData.rental_payments[0]?.id);

          if (paymentError) throw paymentError;
        }

        onSave(bookingData as Rental);
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error updating rental:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Rental</DialogTitle>
          <DialogDescription>
            Update the rental details below
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Rental ID</Label>
            <div className="col-span-3">
              <Input value={editedRental.rental_code} disabled />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Status</Label>
            <Select
              value={editedRental.status}
              onValueChange={(value) => setEditedRental({ ...editedRental, status: value })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Payment Status</Label>
            <Select
              value={editedRental.payment_status}
              onValueChange={(value) => setEditedRental({ ...editedRental, payment_status: value })}
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
            <Label className="text-right">Pickup Location</Label>
            <Input
              className="col-span-3"
              value={editedRental.pickup_location}
              onChange={(e) => setEditedRental({ ...editedRental, pickup_location: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Pickup Date</Label>
            <Input
              className="col-span-3"
              type="date"
              value={editedRental.pickup_date}
              onChange={(e) => setEditedRental({ ...editedRental, pickup_date: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Pickup Time</Label>
            <Input
              className="col-span-3"
              type="time"
              value={editedRental.pickup_time}
              onChange={(e) => setEditedRental({ ...editedRental, pickup_time: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Total Price</Label>
            <Input
              className="col-span-3"
              type="number"
              value={editedRental.total_price}
              onChange={(e) => setEditedRental({ ...editedRental, total_price: parseFloat(e.target.value) })}
            />
          </div>
          {editedRental.discounted_price && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Discounted Price</Label>
              <Input
                className="col-span-3"
                type="number"
                value={editedRental.discounted_price}
                onChange={(e) => setEditedRental({ ...editedRental, discounted_price: parseFloat(e.target.value) })}
              />
            </div>
          )}
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

function ViewRentalDialog({ rental, open, onOpenChange }: ViewRentalDialogProps) {
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    if (rental) {
      fetchAdditionalDetails(rental.id, rental.user_id);
    }
  }, [rental]);

  const fetchAdditionalDetails = async (rentalId: string, userId: string) => {
    try {
      // Fetch payment details from rental_payments table
      const { data: paymentData, error: paymentError } = await supabase
        .from('rental_payments')
        .select('*')
        .eq('booking_id', rentalId)
        .single();

      if (paymentError) throw paymentError;
      setPaymentDetails(paymentData);

      // Fetch user details
      const { data: userData, error: userError } = await supabase
        .from('all_users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) throw userError;
      setUserDetails(userData);
    } catch (error) {
      console.error('Error fetching additional details:', error);
    }
  };
  if (!rental) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Rental Details</DialogTitle>
          <DialogDescription>
            Complete information about the vehicle rental
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Rental Information */}
          <div className="grid gap-4">
            <h3 className="text-lg font-semibold">Rental Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Rental ID</Label>
                <div className="mt-1 text-sm">{rental.rental_code}</div>
              </div>
              <div>
                <Label>Status</Label>
                <div className="mt-1">
                  <Badge variant={getStatusColor(rental.status)}>
                    {rental.status}
                  </Badge>
                </div>
              </div>
              <div>
                <Label>Pickup Date</Label>
                <div className="mt-1 text-sm">
                  {new Date(rental.pickup_date).toLocaleDateString()}
                </div>
              </div>
              <div>
                <Label>Pickup Time</Label>
                <div className="mt-1 text-sm">
                  {rental.pickup_time}
                </div>
              </div>
              <div>
                <Label>Pickup Location</Label>
                <div className="mt-1 text-sm">{rental.pickup_location}</div>
              </div>

              {/* Destinations List */}
              <div className="col-span-2">
                <Label>Destinations</Label>
                <div className="mt-1 text-sm">
                  <ul className="list-disc pl-5 space-y-1">
                    {[
                      rental.destination_1_location,
                      rental.destination_2_location,
                      rental.destination_3_location,
                      rental.destination_4_location,
                      rental.destination_5_location,
                      rental.destination_6_location,
                      rental.destination_7_location,
                      rental.destination_8_location,
                      rental.destination_9_location,
                      rental.destination_10_location
                    ].filter(Boolean).map((destination, index) => (
                      <li key={index}>{destination}</li>
                    ))}
                  </ul>
                </div>
              </div>
              {/* {rental.destination_1_location && (
                <div>
                  <Label>Stop 1</Label>
                  <div className="mt-1 text-sm">{rental.destination_1_location}</div>
                </div>
              )}
              {rental.destination_2_location && (
                <div>
                  <Label>Stop 2</Label>
                  <div className="mt-1 text-sm">{rental.destination_2_location}</div>
                </div>
              )}
              {rental.destination_3_location && (
                <div>
                  <Label>Stop 3</Label>
                  <div className="mt-1 text-sm">{rental.destination_3_location}</div>
                </div>
              )}
              {rental.destination_4_location && (
                <div>
                  <Label>Stop 4</Label>
                  <div className="mt-1 text-sm">{rental.destination_4_location}</div>
                </div>
              )}
              {rental.destination_5_location && (
                <div>
                  <Label>Stop 5</Label>
                  <div className="mt-1 text-sm">{rental.destination_5_location}</div>
                </div>
              )}
              {rental.destination_6_location && (
                <div>
                  <Label>Stop 6</Label>
                  <div className="mt-1 text-sm">{rental.destination_6_location}</div>
                </div>
              )}
              {rental.destination_7_location && (
                <div>
                  <Label>Stop 7</Label>
                  <div className="mt-1 text-sm">{rental.destination_7_location}</div>
                </div>
              )}
              {rental.destination_8_location && (
                <div>
                  <Label>Stop 8</Label>
                  <div className="mt-1 text-sm">{rental.destination_8_location}</div>
                </div>
              )}
              {rental.destination_9_location && (
                <div>
                  <Label>Stop 9</Label>
                  <div className="mt-1 text-sm">{rental.destination_9_location}</div>
                </div>
              )}
              {rental.destination_10_location && (
                <div>
                  <Label>Stop 10</Label>
                  <div className="mt-1 text-sm">{rental.destination_10_location}</div>
                </div>
              )} */}
              <div>
                <Label>Total Price</Label>
                <div className="mt-1 text-sm">₹{rental.total_price.toFixed(2)}</div>
              </div>
              <div>
                <Label>Payment Status</Label>
                <div className="mt-1">
                  <Badge variant={rental.payment_status === "COMPLETED" ? "default" : "secondary"}>
                    {rental.payment_status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="grid gap-4">
            <h3 className="text-lg font-semibold">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <div className="mt-1 text-sm">
                  {`${rental.user.first_name} ${rental.user.last_name}`}
                </div>
              </div>
              <div>
                <Label>Email</Label>
                <div className="mt-1 text-sm">{rental.user.email}</div>
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

          {/* Payment Information */}
          {paymentDetails && (
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold">Payment Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Payment Method</Label>
                  <div className="mt-1 text-sm capitalize">{paymentDetails.payment_method}</div>
                </div>
                <div>
                  <Label>Transaction ID</Label>
                  <div className="mt-1 text-sm">{paymentDetails.transaction_id}</div>
                </div>
                <div>
                  <Label>Created On</Label>
                  <div className="mt-1 text-sm">
                    {new Date(paymentDetails.created_at).toLocaleString()}
                  </div>
                </div>
                <div>
                  <Label>Amount Payable</Label>
                  <div className="mt-1 text-sm">₹{paymentDetails.amount.toFixed(2)}</div>
                </div>
              </div>
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

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "default";
    case "active":
      return "secondary";
    case "cancelled":
      return "destructive";
    case "upcoming":
      return "outline";
    default:
      return "default";
  }
};

interface Rental {
  id: string;
  rental_code: string;
  user_id: string;
  vehicle_category: string;
  pickup_date: string;
  pickup_time: string;
  pickup_location: string;
  pickup_place_id: string;
  destination_1_location?: string;
  destination_2_location?: string;
  destination_3_location?: string;
  destination_4_location?: string;
  destination_5_location?: string;
  destination_6_location?: string;
  destination_7_location?: string;
  destination_8_location?: string;
  destination_9_location?: string;
  destination_10_location?: string;
  total_price: number;
  discounted_price?: number;
  status: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export function RentalsTable() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Rental>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    checkAdminAndFetchRentals();
  }, []);

  const handleSaveRental = (updatedRental: Rental) => {
    setRentals(prevRentals =>
      prevRentals.map(rental =>
        rental.id === updatedRental.id ? updatedRental : rental
      )
    );
  };

  const checkAdminAndFetchRentals = async () => {
    try {
      const adminSession = getCurrentAdmin();
      const isAuthorized = adminSession?.role?.toLowerCase() === 'super admin';
      setIsAuthorized(isAuthorized);
      
      if (isAuthorized) {
        await fetchRentals();
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAuthorized(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchRentals = async () => {
    try {
      setIsRefreshing(true);
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('rental_booking')
        .select(`
          *,
          user:user_id (
            first_name,
            last_name,
            email
          ),
          destination_1_location,
          destination_2_location,
          destination_3_location,
          destination_4_location,
          destination_5_location,
          destination_6_location,
          destination_7_location,
          destination_8_location,
          destination_9_location,
          destination_10_location,
          discounted_price,
          rental_payments (
            status
          )
        `);

      if (bookingsError) throw bookingsError;

      // Transform the data to match our interface
      const rentalsData = bookingsData?.map(booking => ({
        id: booking.id,
        rental_code: booking.order_code,
        user_id: booking.user_id,
        vehicle_category: booking.vehicle_category,
        pickup_date: booking.pickup_date,
        pickup_time: booking.pickup_time,
        pickup_location: booking.pickup_location,
        pickup_place_id: booking.pickup_place_id,
        destination_1_location: booking.destination_1_location,
        destination_2_location: booking.destination_2_location,
        destination_3_location: booking.destination_3_location,
        destination_4_location: booking.destination_4_location,
        destination_5_location: booking.destination_5_location,
        destination_6_location: booking.destination_6_location,
        destination_7_location: booking.destination_7_location,
        destination_8_location: booking.destination_8_location,
        destination_9_location: booking.destination_9_location,
        destination_10_location: booking.destination_10_location,
        total_price: booking.total_price,
        discounted_price: booking.discounted_price,
        status: booking.status,
        payment_status: booking.rental_payments[0]?.status || 'PENDING',
        created_at: booking.created_at,
        updated_at: booking.updated_at,
        user: {
          first_name: booking.user?.first_name || '',
          last_name: booking.user?.last_name || '',
          email: booking.user?.email || ''
        },
        vehicle: {
          make: booking.vehicle_category,
          model: '',
          license_plate: ''
        }
      }));

      if (rentalsData) setRentals(rentalsData);
    } catch (error) {
      console.error('Error fetching rentals:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSort = (field: keyof Rental) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredRentals = rentals.filter((rental) => {
    if (!searchTerm.trim()) return true;
    
    const searchValue = searchTerm.toLowerCase().trim();
    const searchableText = [
      rental.rental_code,
      rental.user?.first_name,
      rental.user?.last_name,
      `${rental.user?.first_name} ${rental.user?.last_name}`,
      rental.user?.email,
      rental.status,
      rental.payment_status
    ].filter(Boolean).join(' ').toLowerCase();

    return searchableText.includes(searchValue);
  });

  const sortedRentals = [...filteredRentals].sort((a, b) => {
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
    <>
      <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Rentals</CardTitle>
            <CardDescription>
              View and manage all vehicle rentals
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchRentals}
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
              placeholder="Search rentals..."
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
                    onClick={() => handleSort("rental_code")}
                  >
                    ID
                    {sortField === "rental_code" && (
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
                <TableHead>Addresses</TableHead>
                <TableHead>
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("start_date")}
                  >
                    Date/Time
                    {sortField === "start_date" && (
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
                    onClick={() => handleSort("total_price")}
                  >
                    Amount
                    {sortField === "total_price" && (
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
              {sortedRentals.length > 0 ? (
                sortedRentals.map((rental) => (
                  <TableRow key={rental.id}>
                    <TableCell className="w-[100px]">
                      {rental.rental_code}
                    </TableCell>
                    <TableCell className="w-[180px]">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {`${rental.user.first_name[0]}${rental.user.last_name[0]}`}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                          <p className="font-medium">{`${rental.user.first_name} ${rental.user.last_name}`}</p>
                          <p className="text-muted-foreground">{rental.user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium truncate max-w-[200px]">{rental.pickup_location}</p>
                        <p className="text-muted-foreground truncate max-w-[200px]">{rental.dropoff_location}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">{new Date(rental.start_date).toLocaleDateString()}</p>
                        <p className="text-muted-foreground">{new Date(rental.start_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusColor(rental.status)}
                        className="capitalize"
                      >
                        {rental.status.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {rental.discounted_price ? (
                        <>
                          <span className="line-through text-muted-foreground mr-2">
                            ₹{rental.total_price.toFixed(2)}
                          </span>
                          ₹{rental.discounted_price.toFixed(2)}
                        </>
                      ) : (
                        `₹${rental.total_price.toFixed(2)}`
                      )}
                    </TableCell>
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
                          <DropdownMenuItem onSelect={() => {
                            setSelectedRental(rental);
                            setIsViewDialogOpen(true);
                          }}>
                            View details
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => {
                            setSelectedRental(rental);
                            setIsEditDialogOpen(true);
                          }}>
                            Edit rental
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {rental.status === "upcoming" && (
                            <DropdownMenuItem className="text-destructive">
                              Cancel rental
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
                    No rentals found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing <strong>{sortedRentals.length}</strong> of{" "}
          <strong>{rentals.length}</strong> rentals
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
      </Card>
      <ViewRentalDialog
        rental={selectedRental}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
      />
      <EditRentalDialog
        rental={selectedRental}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveRental}
      />
    </>
  );
}
