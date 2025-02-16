import React, { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Car } from '../types/car';
import LocationInput from './ui/LocationInput';

interface BookingFormProps {
  car?: Car;
}

const BookingForm = ({ car }: BookingFormProps) => {
  const [tripType, setTripType] = useState<'oneWay' | 'roundTrip'>('oneWay');
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-blue-900 mb-6">
        {car ? `Book ${car.name}` : 'Book Your Ride'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <LocationInput
          placeholder="Pickup Location"
          value={pickup}
          onChange={setPickup}
        />
        <LocationInput
          placeholder="Drop-off Location"
          value={dropoff}
          onChange={setDropoff}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center justify-center space-x-4 bg-gray-50 rounded-lg p-3">
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
              tripType === 'oneWay'
                ? 'bg-blue-900 text-white'
                : 'text-blue-900'
            }`}
            onClick={() => setTripType('oneWay')}
          >
            One-Way
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
              tripType === 'roundTrip'
                ? 'bg-blue-900 text-white'
                : 'text-blue-900'
            }`}
            onClick={() => setTripType('roundTrip')}
          >
            Round Trip
          </button>
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-3 h-6 w-6 text-gray-400" />
          <input
            type="date"
            className="w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="relative">
          <Clock className="absolute left-3 top-3 h-6 w-6 text-gray-400" />
          <input
            type="time"
            className="w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <button className="w-full bg-green-500 text-white py-4 rounded-lg text-lg font-semibold hover:bg-green-600 transition-colors">
        Check Rates
      </button>
    </div>
  );
};

export default BookingForm;