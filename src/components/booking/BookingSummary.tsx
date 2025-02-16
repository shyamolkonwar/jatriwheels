import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car } from '../../types/car';
import { formatCurrency } from '../../utils/formatters';
import { calculateTotalDistance, calculateTotalCost, calculateAdvancePayment } from '../../utils/distanceCalculator';

interface BookingSummaryProps {
  car: Car;
  pickup: string;
  dropoff: string;
  distance: number;
  date: string;
  time: string;
  tripType: 'oneWay' | 'roundTrip';
  onClose: () => void;
}

const BookingSummary = ({
  car,
  pickup,
  dropoff,
  distance,
  date,
  time,
  tripType,
  onClose
}: BookingSummaryProps) => {
  const navigate = useNavigate();
  const totalDistance = calculateTotalDistance(distance, tripType === 'roundTrip');
  const totalAmount = calculateTotalCost(distance, car.pricePerKm, tripType === 'roundTrip');
  const advancePayment = calculateAdvancePayment(totalAmount);

  const handleContinue = () => {
    navigate('/contact-form', {
      state: {
        carId: car.id,
        car: car,
        pickup,
        dropoff,
        date,
        time,
        distance: totalDistance,
        amount: advancePayment,
        tripType
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-blue-900">Booking Summary</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4 mb-6">
          <div>
            <h3 className="font-semibold text-gray-700">Selected Car</h3>
            <p className="text-gray-900">{car.name}</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700">Journey Details</h3>
            <p className="text-gray-900">From: {pickup}</p>
            <p className="text-gray-900">To: {dropoff}</p>
            <p className="text-gray-900">Trip Type: {tripType === 'oneWay' ? 'One Way' : 'Round Trip'}</p>
            <p className="text-gray-900">
              Distance: {totalDistance.toFixed(1)} km
              {tripType === 'roundTrip' && ` (${distance.toFixed(1)} km × 2)`}
            </p>
            <p className="text-gray-900">Date: {date}</p>
            <p className="text-gray-900">Time: {time}</p>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Rate per km:</span>
              <span>{formatCurrency(car.pricePerKm)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Total Amount:</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex justify-between text-green-600 font-semibold">
              <span>Advance Payment (20%):</span>
              <span>{formatCurrency(advancePayment)}</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleContinue}
            className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Continue Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;