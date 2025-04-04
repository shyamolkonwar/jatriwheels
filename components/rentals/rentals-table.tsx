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
  vehicle_id: string;
  start_date: string;
  end_date: string;
  pickup_location: string;
  dropoff_location: string;
  total_price: number;
  status: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  vehicle: {
    make: string;
    model: string;
    license_plate: string;
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

  useEffect(() => {
    checkAdminAndFetchRentals();
  }, []);

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
      const { data, error } = await supabase
        .from('rental_booking')
        .select(`
          *,
          user:user_id (
            first_name,
            last_name,
            email
          )
        `);

      if (error) throw error;

      // Transform the data to match our interface
      const rentalsData = data?.map(booking => ({
        id: booking.id,
        rental_code: booking.order_code,
        user_id: booking.user_id,
        vehicle_id: booking.vehicle_category,
        start_date: booking.pickup_date,
        end_date: booking.pickup_date,
        pickup_location: booking.pickup_location,
        dropoff_location: booking.destination_1_location || booking.pickup_location,
        total_price: booking.total_price,
        status: booking.status,
        payment_status: booking.payments?.[0]?.status || 'pending',
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
      rental.vehicle?.make,
      rental.vehicle?.model,
      rental.vehicle?.license_plate,
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
                    <TableCell>₹{rental.total_price.toFixed(2)}</TableCell>
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
  );
}