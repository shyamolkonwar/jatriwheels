import React, { useState, useEffect } from 'react';
import { Car } from '../../types/car';
import { formatCurrency } from '../../utils/formatters';
import TimerButton from './TimerButton';

interface BookingConfirmationProps {
  car: Car;
  pickup: string;
  dropoff: string;
  distance: number;
  date: string;
  time: string;
  onClose: () => void;
  onConfirm: () => void;
}

const BookingConfirmation = ({
  car,
  pickup,
  dropoff,
  distance,
  date,
  time,
  onClose,
  onConfirm
}: BookingConfirmationProps) => {
  const [timeLeft, setTimeLeft] = useState(90);
  const [isExpired, setIsExpired] = useState(false);

  // Calculate costs
  const tripCost = distance * car.pricePerKm;
  const platformFee = tripCost * 0.05; // 5% platform fee
  const totalCost = tripCost + platformFee;
  const advancePayment = totalCost * 0.2; // 20% advance payment

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setIsExpired(true);
    }
  }, [timeLeft]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-blue-900 mb-6">Booking Confirmation</h2>
        
        {/* Car Details */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2">Selected Car</h3>
          <div className="flex items-center space-x-4">
            <img 
              src={car.images[0]} 
              alt={car.name}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div>
              <p className="font-semibold">{car.name}</p>
              <p className="text-gray-600">{car.category}</p>
            </div>
          </div>
        </div>

        {/* Journey Details */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2">Journey Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">From</p>
              <p className="font-medium">{pickup}</p>
            </div>
            <div>
              <p className="text-gray-600">To</p>
              <p className="font-medium">{dropoff}</p>
            </div>
            <div>
              <p className="text-gray-600">Date</p>
              <p className="font-medium">{date}</p>
            </div>
            <div>
              <p className="text-gray-600">Time</p>
              <p className="font-medium">{time}</p>
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2">Cost Breakdown</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Distance</span>
              <span>{distance.toFixed(1)} km</span>
            </div>
            <div className="flex justify-between">
              <span>Rate per km</span>
              <span>{formatCurrency(car.pricePerKm)}</span>
            </div>
            <div className="flex justify-between">
              <span>Trip Cost</span>
              <span>{formatCurrency(tripCost)}</span>
            </div>
            <div className="flex justify-between">
              <span>Platform Fee (5%)</span>
              <span>{formatCurrency(platformFee)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total Amount</span>
              <span>{formatCurrency(totalCost)}</span>
            </div>
            <div className="flex justify-between text-green-600 font-semibold">
              <span>Advance Payment (20%)</span>
              <span>{formatCurrency(advancePayment)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel Booking
          </button>
          <TimerButton
            duration={90}
            onExpire={() => setIsExpired(true)}
            onClick={onConfirm}
            disabled={isExpired}
            amount={formatCurrency(advancePayment)}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;