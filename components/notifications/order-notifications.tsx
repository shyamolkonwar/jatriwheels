'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

export function OrderNotifications() {
  useEffect(() => {
    // Subscribe to new orders
    const subscription = supabase
      .channel('new-orders')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookings',
        },
        (payload) => {
          // Extract order details from payload
          const order = payload.new;
          
          // Show toast notification
          toast("New Order Received!", {
            description: `Order #${order.support_code} - ${order.trip_type}`,
            duration: 10000, // 10 seconds
            position: 'bottom-right',
          });
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return null; // This component doesn't render anything
} 