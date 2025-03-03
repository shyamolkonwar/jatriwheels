"use client";

import { useState, useEffect } from "react";
import { 
  ChevronDown, 
  ChevronUp, 
  MoreHorizontal, 
  Search, 
  Plus, 
  Filter, 
  Download,
  Car
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
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Vehicle {
  id: string;
  type: string;
  base_fare: number;
  per_km_rate: number;
  capacity: number;
  image_url: string;
  is_active: boolean;
}

interface VehicleBookingsDialogProps {
  vehicle: Vehicle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Booking {
  id: string;
  user_id: string;
  vehicle_type_id: string;
  pickup_location: {
    name: string;
    latitude: number;
    longitude: number;
  };
  drop_location: {
    name: string;
    latitude: number;
    longitude: number;
  };
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
}

interface EditVehicleDialogProps {
  vehicle: Vehicle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedVehicle: Vehicle) => void;
}

const getStatusColor = (status: string): "default" | "destructive" | "outline" | "secondary" | null | undefined => {
  switch (status.toLowerCase()) {
    case "completed":
      return "default";
    case "in_progress":
      return "secondary";
    case "cancelled":
      return "destructive";
    case "scheduled":
      return "outline";
    case "pending":
      return "secondary";
    default:
      return "default";
  }
};

const vehicleFormSchema = z.object({
  type: z.string().min(2, {
    message: "Vehicle type must be at least 2 characters.",
  }),
  base_fare: z.coerce.number().min(0, {
    message: "Base fare must be a positive number.",
  }),
  per_km_rate: z.coerce.number().min(0, {
    message: "Per km rate must be a positive number.",
  }),
  capacity: z.coerce.number().int().min(1, {
    message: "Capacity must be at least 1.",
  }),
  image_url: z.string().url({
    message: "Please enter a valid URL for the image.",
  }),
  is_active: z.boolean().default(true),
});

function AddVehicleDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const form = useForm<z.infer<typeof vehicleFormSchema>>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      type: "",
      base_fare: 0,
      per_km_rate: 0,
      capacity: 1,
      image_url: "",
      is_active: true,
    },
  });

  async function onSubmit(values: z.infer<typeof vehicleFormSchema>) {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .insert([values])
        .select();

      if (error) throw error;
      
      toast({
        title: "Vehicle added successfully",
        description: `${values.type} has been added to the fleet.`,
      });
      
      onOpenChange(false);
      form.reset();
      
      // Refresh the vehicles list (you'll need to implement this)
      window.location.reload();
    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast({
        title: "Error",
        description: "Failed to add vehicle. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Vehicle</DialogTitle>
          <DialogDescription>
            Add a new vehicle type to your fleet.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Type</FormLabel>
                  <FormControl>
                    <Input placeholder="sedan, suv, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="base_fare"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Fare</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>Base fare in your currency</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="per_km_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Per KM Rate</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>Rate per kilometer</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>Number of passengers</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Active</FormLabel>
                    <FormDescription>
                      Is this vehicle type currently available for booking?
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Add Vehicle</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function VehicleBookingsDialog({ vehicle, open, onOpenChange }: VehicleBookingsDialogProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (vehicle) {
      fetchVehicleBookings(vehicle.id);
    }
  }, [vehicle]);

  const fetchVehicleBookings = async (vehicleId: string) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          user:user_id (
            first_name,
            last_name,
            email
          )
        `)
        .eq('vehicle_type_id', vehicleId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching vehicle bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!vehicle) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Booking History</DialogTitle>
          <DialogDescription>
            Booking history for {vehicle.type} vehicle
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-4">Loading booking history...</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-4">No bookings found for this vehicle type.</div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col gap-4 p-4 border rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-muted-foreground" />
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
                    <div className="flex-1">
                      <p className="text-sm font-medium">Customer</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.user.first_name} {booking.user.last_name} ({booking.user.email})
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium">Pickup Location</p>
                      <p className="text-sm text-muted-foreground">{booking.pickup_location.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium">Drop Location</p>
                      <p className="text-sm text-muted-foreground">{booking.drop_location.name}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-muted-foreground">Trip Type:</span>{" "}
                      <span className="font-medium">{booking.trip_type}</span>
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

function EditVehicleDialog({ vehicle, open, onOpenChange, onSave }: EditVehicleDialogProps) {
  const [formData, setFormData] = useState<Partial<Vehicle>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (vehicle) {
      setFormData({
        type: vehicle.type,
        base_fare: vehicle.base_fare,
        per_km_rate: vehicle.per_km_rate,
        capacity: vehicle.capacity,
        image_url: vehicle.image_url,
        is_active: vehicle.is_active
      });
    }
  }, [vehicle]);

  const handleChange = (field: keyof Vehicle, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!vehicle || !formData) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('vehicles')
        .update({
          type: formData.type,
          base_fare: formData.base_fare,
          per_km_rate: formData.per_km_rate,
          capacity: formData.capacity,
          image_url: formData.image_url,
          is_active: formData.is_active
        })
        .eq('id', vehicle.id);

      if (error) throw error;
      
      toast({
        title: "Vehicle updated",
        description: "The vehicle has been updated successfully.",
      });
      
      onSave({
        ...vehicle,
        ...formData
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast({
        title: "Error",
        description: "Failed to update vehicle. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!vehicle) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Vehicle</DialogTitle>
          <DialogDescription>
            Make changes to the vehicle details below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Input
              id="type"
              value={formData.type || ''}
              onChange={(e) => handleChange('type', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="base_fare" className="text-right">
              Base Fare
            </Label>
            <Input
              id="base_fare"
              type="number"
              step="0.01"
              value={formData.base_fare || 0}
              onChange={(e) => handleChange('base_fare', parseFloat(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="per_km_rate" className="text-right">
              Per KM Rate
            </Label>
            <Input
              id="per_km_rate"
              type="number"
              step="0.01"
              value={formData.per_km_rate || 0}
              onChange={(e) => handleChange('per_km_rate', parseFloat(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="capacity" className="text-right">
              Capacity
            </Label>
            <Input
              id="capacity"
              type="number"
              value={formData.capacity || 0}
              onChange={(e) => handleChange('capacity', parseInt(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image_url" className="text-right">
              Image URL
            </Label>
            <Input
              id="image_url"
              value={formData.image_url || ''}
              onChange={(e) => handleChange('image_url', e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="is_active" className="text-right">
              Status
            </Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Checkbox 
                id="is_active" 
                checked={formData.is_active} 
                onCheckedChange={(checked) => handleChange('is_active', checked === true)}
              />
              <label
                htmlFor="is_active"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Active
              </label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function VehiclesTable() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Vehicle>("type");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isBookingsOpen, setIsBookingsOpen] = useState(false);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*');

      if (error) throw error;
      setVehicles(data || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: keyof Vehicle) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    const aValue = a[sortField]?.toString() || "";
    const bValue = b[sortField]?.toString() || "";
    
    if (typeof a[sortField] === 'number' && typeof b[sortField] === 'number') {
      return sortDirection === "asc" 
        ? (a[sortField] as number) - (b[sortField] as number)
        : (b[sortField] as number) - (a[sortField] as number);
    }
    
    return sortDirection === "asc" 
      ? aValue.localeCompare(bValue) 
      : bValue.localeCompare(aValue);
  });

  const toggleVehicleStatus = async (vehicle: Vehicle) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .update({ is_active: !vehicle.is_active })
        .eq('id', vehicle.id);

      if (error) throw error;
      
      // Update local state
      setVehicles(vehicles.map(v => 
        v.id === vehicle.id ? { ...v, is_active: !v.is_active } : v
      ));
      
      toast({
        title: "Vehicle status updated",
        description: `${vehicle.type} is now ${!vehicle.is_active ? 'active' : 'inactive'}.`,
      });
    } catch (error) {
      console.error('Error updating vehicle status:', error);
      toast({
        title: "Error",
        description: "Failed to update vehicle status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsEditDialogOpen(true);
  };

  const handleSaveVehicle = (updatedVehicle: Vehicle) => {
    setVehicles(vehicles.map(v => 
      v.id === updatedVehicle.id ? updatedVehicle : v
    ));
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            Loading vehicles...
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
            <CardTitle>Vehicles</CardTitle>
            <CardDescription>
              Manage your fleet of vehicles
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
            <Button size="sm" onClick={() => setIsAddVehicleOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Vehicle
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
              placeholder="Search vehicles..."
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
                    onClick={() => handleSort("type")}
                  >
                    Vehicle Type
                    {sortField === "type" && (
                      sortDirection === "asc" ? 
                        <ChevronUp className="ml-1 h-4 w-4" /> : 
                        <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("base_fare")}
                  >
                    Base Fare
                    {sortField === "base_fare" && (
                      sortDirection === "asc" ? 
                        <ChevronUp className="ml-1 h-4 w-4" /> : 
                        <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("per_km_rate")}
                  >
                    Per KM Rate
                    {sortField === "per_km_rate" && (
                      sortDirection === "asc" ? 
                        <ChevronUp className="ml-1 h-4 w-4" /> : 
                        <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("capacity")}
                  >
                    Capacity
                    {sortField === "capacity" && (
                      sortDirection === "asc" ? 
                        <ChevronUp className="ml-1 h-4 w-4" /> : 
                        <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort("is_active")}
                  >
                    Status
                    {sortField === "is_active" && (
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
              {sortedVehicles.length > 0 ? (
                sortedVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <p className="font-medium capitalize">{vehicle.type}</p>
                      </div>
                    </TableCell>
                    <TableCell>₹{vehicle.base_fare.toFixed(2)}</TableCell>
                    <TableCell>₹{vehicle.per_km_rate.toFixed(2)}/km</TableCell>
                    <TableCell>{vehicle.capacity} passengers</TableCell>
                    <TableCell>
                      <Badge
                        variant={vehicle.is_active ? "default" : "secondary"}
                        className="capitalize"
                      >
                        {vehicle.is_active ? "Active" : "Inactive"}
                      </Badge>
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
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditVehicle(vehicle)}>
                            Edit vehicle
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedVehicle(vehicle);
                              setIsBookingsOpen(true);
                            }}
                          >
                            View booking history
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => toggleVehicleStatus(vehicle)}
                            className={vehicle.is_active ? "text-destructive" : "text-green-600"}
                          >
                            {vehicle.is_active ? "Deactivate vehicle" : "Activate vehicle"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No vehicles found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing <strong>{sortedVehicles.length}</strong> of{" "}
          <strong>{vehicles.length}</strong> vehicles
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
      <VehicleBookingsDialog
        vehicle={selectedVehicle}
        open={isBookingsOpen}
        onOpenChange={setIsBookingsOpen}
      />
      <AddVehicleDialog
        open={isAddVehicleOpen}
        onOpenChange={setIsAddVehicleOpen}
      />
      <EditVehicleDialog
        vehicle={selectedVehicle}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveVehicle}
      />
    </Card>
  );
}
