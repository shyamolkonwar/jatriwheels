import React, { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { calculateDistance } from '../utils/locationUtils';
import LocationInput from './ui/LocationInput';
import LoadingScreen from './booking/LoadingScreen';
import LocationError from './booking/LocationError';
import DistanceRestrictionModal from './booking/DistanceRestrictionModal';
import { isLocationInNortheastIndia } from '../utils/locationUtils';

const Hero = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [pickupId, setPickupId] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [dropoffId, setDropoffId] = useState('');
  const [tripType, setTripType] = useState<'oneWay' | 'roundTrip'>('oneWay');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showDistanceError, setShowDistanceError] = useState(false);
  const [showTimeError, setShowTimeError] = useState(false);

  const handleLocationChange = (type: 'pickup' | 'dropoff') => 
    (value: string, placeId?: string) => {
      if (type === 'pickup') {
        setPickup(value);
        if (placeId) setPickupId(placeId);
      } else {
        setDropoff(value);
        if (placeId) setDropoffId(placeId);
      }
    };

  const handleSubmit = async () => {
    if (!pickup || !dropoff || !date || !time || !pickupId || !dropoffId) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const [isPickupInAssam, isDropoffInAssam, distance] = await Promise.all([
        isLocationInNortheastIndia(pickupId),
        isLocationInNortheastIndia(dropoffId),
        calculateDistance(pickupId, dropoffId)
      ]);

      const selectedDateTime = new Date(`${date}T${time}`);
      const currentTime = new Date();
      const timeDifference = (selectedDateTime.getTime() - currentTime.getTime()) / (1000 * 60 * 60);

      const selectedTime = new Date(`1970-01-01T${time}`);
      const now = new Date();
      const timeDiff = (selectedTime.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (timeDiff < 1) {
        setShowTimeError(true);
        return;
      }


      if (!isPickupInAssam || !isDropoffInAssam) {
        setShowError(true);
        return;
      }

      navigate('/book', {
        state: {
          pickup,
          dropoff,
          date,
          time,
          tripType
        }
      });
    } catch (error) {
      console.error('Location validation error:', error);
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-20 bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-900 mb-4">
            Your Journey Starts with Jatri Wheels
          </h1>
          <p className="text-xl text-gray-600">
            Easy, Affordable, and Reliable Ride Solutions in Northeast India
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <LocationInput
              placeholder="Pickup Location"
              value={pickup}
              onChange={handleLocationChange('pickup')}
            />
            <LocationInput
              placeholder="Drop-off Location"
              value={dropoff}
              onChange={handleLocationChange('dropoff')}
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
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {showTimeError && (
                <DistanceRestrictionModal
                  message="Service Unavailable: Please choose a time that is at least 4 hours ahead of the current time."
                  onClose={() => setShowTimeError(false)}
                />
              )}
            </div>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-6 w-6 text-gray-400" />
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {(() => {
                  const now = new Date();
                  const selectedDate = new Date(date);
                  const today = new Date();
                  const options = [];
                  if (selectedDate.toDateString() === today.toDateString()) {
                    const currentHour = today.getHours();
                    for (let i = currentHour + 1; i <= 23; i++) {
                      const hour = i % 12 || 12;
                      const period = i < 12 ? 'AM' : 'PM';
                      options.push(`${hour}:00 ${period}`);
                      options.push(`${hour}:30 ${period}`);
                    }
                  } else {
                    for (let i = 0; i <= 23; i++) {
                      const hour = i % 12 || 12;
                      const period = i < 12 ? 'AM' : 'PM';
                      options.push(`${hour}:00 ${period}`);
                      options.push(`${hour}:30 ${period}`);
                    }
                  }
                  return options.map((timeOption) => (
                    <option key={timeOption} value={timeOption}>
                      {timeOption}
                    </option>
                  ));
                })()}
              </select>
            </div>
            {showDistanceError && (
              <DistanceRestrictionModal
                message="Service Unavailable: Please choose locations with a distance greater than 40KM."
                onClose={() => setShowDistanceError(false)}
              />
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-green-500 text-white py-4 rounded-lg text-lg font-semibold hover:bg-green-600 transition-colors"
          >
            Get a Quote
          </button>
        </div>
      </div>

      {isLoading && <LoadingScreen />}
      {showError && <LocationError onClose={() => setShowError(false)} />}
    </div>
  );
};

export default Hero;