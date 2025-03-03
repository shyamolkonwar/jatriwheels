"use client";

import { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { supabase } from "@/lib/supabase";

interface RevenueData {
  name: string;
  total: number;
}

export function Overview() {
  const [data, setData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      // Get the current date
      const now = new Date();
      
      // Calculate dates for the last 7 days
      const daysData = [];
      for (let i = 6; i >= 0; i--) {
        const dayStart = new Date(now);
        dayStart.setDate(now.getDate() - i);
        dayStart.setHours(0, 0, 0, 0);
        
        const dayEnd = new Date(dayStart);
        dayEnd.setHours(23, 59, 59, 999);
        
        // Format dates for Supabase query
        const dayStartStr = dayStart.toISOString();
        const dayEndStr = dayEnd.toISOString();

        // Fetch revenue for this day from completed payments
        const { data: dayData, error } = await supabase
          .from('bookings')
          .select('total_fare')
          .eq('payment_status', 'COMPLETED')
          .gte('created_at', dayStartStr)
          .lt('created_at', dayEndStr);

        if (error) throw error;

        // Calculate total revenue for the day
        const dailyRevenue = dayData?.reduce((sum, booking) => 
          sum + (booking.total_fare || 0), 0) || 0;

        // Format date
        const dateStr = dayStart.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short'
        });

        daysData.push({
          name: dateStr,
          total: dailyRevenue
        });
      }

      setData(daysData);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading chart data...</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₹${value.toLocaleString('en-IN', {
            maximumFractionDigits: 0
          })}`}
        />
        <Tooltip
          cursor={{ fill: "var(--muted)" }}
          contentStyle={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
            borderRadius: "var(--radius)",
          }}
          labelStyle={{ color: "var(--foreground)" }}
          formatter={(value: number) => [
            `₹${value.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}`,
            "Revenue"
          ]}
        />
        <Bar
          dataKey="total"
          fill="hsl(var(--chart-1))"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}