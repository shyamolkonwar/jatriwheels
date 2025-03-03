"use client";

import { useState, useEffect } from "react";
import { 
  Car, 
  Users, 
  Calendar, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  change?: {
    value: number;
    type: "increase" | "decrease" | "neutral";
  };
}

function StatCard({ title, value, description, icon: Icon, change }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center space-x-2">
          {change && (
            <>
              {change.type === "increase" && (
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              )}
              {change.type === "decrease" && (
                <TrendingDown className="h-4 w-4 text-rose-500" />
              )}
              {change.type === "neutral" && (
                <Minus className="h-4 w-4 text-muted-foreground" />
              )}
              <p className={`text-xs ${
                change.type === "increase" 
                  ? "text-emerald-500" 
                  : change.type === "decrease" 
                    ? "text-rose-500" 
                    : "text-muted-foreground"
              }`}>
                {change.value > 0 ? "+" : ""}{change.value}%
              </p>
            </>
          )}
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardStats() {
  const [totalBookings, setTotalBookings] = useState<{
    count: number;
    change: number;
    description: string;
  }>({
    count: 0,
    change: 0,
    description: "from last month"
  });

  const [activeUsers, setActiveUsers] = useState<{
    count: number;
    change: number;
    description: string;
  }>({
    count: 0,
    change: 0,
    description: "from last month"
  });

  const [revenue, setRevenue] = useState<{
    amount: number;
    change: number;
    description: string;
  }>({
    amount: 0,
    change: 0,
    description: "from last month"
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingStats();
    fetchUserStats();
    fetchRevenueStats();
  }, []);

  const fetchBookingStats = async () => {
    try {
      // Get the current date
      const now = new Date();
      
      // Calculate first day of current month
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      
      // Calculate first day of previous month
      const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      
      // Calculate last day of previous month
      const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      // Format dates for Supabase query
      const currentMonthStartStr = currentMonthStart.toISOString();
      const previousMonthStartStr = previousMonthStart.toISOString();
      const previousMonthEndStr = previousMonthEnd.toISOString();

      // Fetch current month bookings
      const { data: currentMonthData, error: currentError } = await supabase
        .from('bookings')
        .select('id', { count: 'exact' })
        .gte('created_at', currentMonthStartStr);

      // Fetch previous month bookings
      const { data: previousMonthData, error: previousError } = await supabase
        .from('bookings')
        .select('id', { count: 'exact' })
        .gte('created_at', previousMonthStartStr)
        .lt('created_at', currentMonthStartStr);

      if (currentError || previousError) {
        throw currentError || previousError;
      }

      const currentCount = currentMonthData?.length || 0;
      const previousCount = previousMonthData?.length || 0;

      // Calculate percentage change
      let percentageChange = 0;
      if (previousCount > 0) {
        percentageChange = Math.round(((currentCount - previousCount) / previousCount) * 100);
      }

      // Format month name for description
      const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      const currentMonthName = monthNames[now.getMonth()];

      setTotalBookings({
        count: currentCount,
        change: percentageChange,
        description: `in ${currentMonthName}`
      });
    } catch (error) {
      console.error('Error fetching booking stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      // Get the current date
      const now = new Date();
      
      // Calculate first day of current month
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      
      // Calculate first day of previous month
      const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      
      // Calculate last day of previous month
      const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      // Format dates for Supabase query
      const currentMonthStartStr = currentMonthStart.toISOString();
      const previousMonthStartStr = previousMonthStart.toISOString();
      const previousMonthEndStr = previousMonthEnd.toISOString();

      // Fetch current month users
      const { data: currentMonthData, error: currentError } = await supabase
        .from('users')
        .select('id', { count: 'exact' })
        .gte('created_at', currentMonthStartStr);

      // Fetch previous month users
      const { data: previousMonthData, error: previousError } = await supabase
        .from('users')
        .select('id', { count: 'exact' })
        .gte('created_at', previousMonthStartStr)
        .lt('created_at', currentMonthStartStr);

      if (currentError || previousError) {
        throw currentError || previousError;
      }

      const currentCount = currentMonthData?.length || 0;
      const previousCount = previousMonthData?.length || 0;

      // Calculate percentage change
      let percentageChange = 0;
      if (previousCount > 0) {
        percentageChange = Math.round(((currentCount - previousCount) / previousCount) * 100);
      }

      // Format month name for description
      const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      const currentMonthName = monthNames[now.getMonth()];

      setActiveUsers({
        count: currentCount,
        change: percentageChange,
        description: `in ${currentMonthName}`
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const fetchRevenueStats = async () => {
    try {
      // Get the current date
      const now = new Date();
      
      // Calculate first day of current month
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      
      // Calculate first day of previous month
      const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

      // Format dates for Supabase query
      const currentMonthStartStr = currentMonthStart.toISOString();
      const previousMonthStartStr = previousMonthStart.toISOString();

      // Fetch current month revenue from rides with completed payments
      const { data: currentMonthData, error: currentError } = await supabase
        .from('bookings')
        .select('total_fare')
        .eq('payment_status', 'COMPLETED')
        .gte('created_at', currentMonthStartStr);

      // Fetch previous month revenue from rides with completed payments
      const { data: previousMonthData, error: previousError } = await supabase
        .from('bookings')
        .select('total_fare')
        .eq('payment_status', 'COMPLETED')
        .gte('created_at', previousMonthStartStr)
        .lt('created_at', currentMonthStartStr);

      if (currentError || previousError) {
        throw currentError || previousError;
      }

      // Calculate total revenue for current month
      const currentRevenue = currentMonthData?.reduce((sum, booking) => 
        sum + (booking.total_fare || 0), 0) || 0;

      // Calculate total revenue for previous month
      const previousRevenue = previousMonthData?.reduce((sum, booking) => 
        sum + (booking.total_fare || 0), 0) || 0;

      // Calculate percentage change
      let percentageChange = 0;
      if (previousRevenue > 0) {
        percentageChange = Math.round(((currentRevenue - previousRevenue) / previousRevenue) * 100);
      }

      // Format month name for description
      const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      const currentMonthName = monthNames[now.getMonth()];

      setRevenue({
        amount: currentRevenue,
        change: percentageChange,
        description: `in ${currentMonthName}`
      });
    } catch (error) {
      console.error('Error fetching revenue stats:', error);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Bookings"
        value={loading ? "Loading..." : totalBookings.count.toString()}
        description={totalBookings.description}
        icon={Calendar}
        change={
          loading ? undefined : {
            value: totalBookings.change,
            type: totalBookings.change > 0 
              ? "increase" 
              : totalBookings.change < 0 
                ? "decrease" 
                : "neutral"
          }
        }
      />
      <StatCard
        title="Active Users"
        value={loading ? "Loading..." : activeUsers.count.toString()}
        description={activeUsers.description}
        icon={Users}
        change={
          loading ? undefined : {
            value: activeUsers.change,
            type: activeUsers.change > 0 
              ? "increase" 
              : activeUsers.change < 0 
                ? "decrease" 
                : "neutral"
          }
        }
      />
      <StatCard
        title="Available Vehicles"
        value="342"
        description="across all categories"
        icon={Car}
        change={{ value: 0, type: "neutral" }}
      />
      <StatCard
        title="Revenue"
        value={loading ? "Loading..." : `₹${revenue.amount.toLocaleString('en-IN', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`}
        description={revenue.description}
        icon={DollarSign}
        change={
          loading ? undefined : {
            value: revenue.change,
            type: revenue.change > 0 
              ? "increase" 
              : revenue.change < 0 
                ? "decrease" 
                : "neutral"
          }
        }
      />
    </div>
  );
}