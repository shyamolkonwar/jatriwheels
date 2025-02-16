export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: number;
          name: string;
          email: string;
          phone: string;
          pickup_location: string;
          dropoff_location: string;
          journey_date: string;
          journey_time: string;
          passengers: number;
          luggage: number;
          trip_type: string;
        };
        Insert: {
          name: string;
          email: string;
          phone: string;
          pickup_location: string;
          dropoff_location: string;
          journey_date: string;
          journey_time: string;
          passengers: number;
          luggage: number;
          trip_type: string;
        };
        Update: {
          id?: number;
          name?: string;
          email?: string;
          phone?: string;
          pickup_location?: string;
          dropoff_location?: string;
          journey_date?: string;
          journey_time?: string;
          passengers?: number;
          luggage?: number;
          trip_type?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}