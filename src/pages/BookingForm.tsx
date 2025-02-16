declare global {
  interface Window {
    onRecaptchaSuccess?: () => void;
  }
}
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { calculateDistanceBetweenLocations } from '../utils/distanceCalculator';
import { Users, Briefcase, Edit } from 'lucide-react';
import LoadingScreen from '../components/booking/LoadingScreen';

const BookingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    passengers: '1',
    luggage: '0'
  });
  const [isRecaptchaVerified, setIsRecaptchaVerified] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    // Register the callback function globally
    window.onRecaptchaSuccess = () => {
      setIsRecaptchaVerified(true);
    };

    return () => {
      document.body.removeChild(script);
      delete window.onRecaptchaSuccess;
    };
  }, []);

  // Get journey details from location state
  const journeyDetails = location.state;
  const [distance, setDistance] = useState<number | null>(null);

  // Function to fetch coordinates using Google Maps Geocoding API
  const fetchCoordinates = async (address: string): Promise<{ lat: number; lon: number }> => {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`);
    const data = await response.json();
    if (data.status === 'OK') {
      const location = data.results[0].geometry.location;
      return { lat: location.lat, lon: location.lng };
    } else {
      throw new Error('Unable to fetch coordinates');
    }
  };

  useEffect(() => {
    const getCoordinatesAndCalculateDistance = async () => {
      if (
        journeyDetails &&
        journeyDetails.pickup &&
        journeyDetails.dropoff
      ) {
        try {
          const pickupCoords = await fetchCoordinates(journeyDetails.pickup);
          const dropoffCoords = await fetchCoordinates(journeyDetails.dropoff);
          const calculatedDistance = calculateDistanceBetweenLocations(pickupCoords, dropoffCoords);
          setDistance(calculatedDistance);
        } catch (error) {
          console.error('Error fetching coordinates:', error);
          alert('Failed to calculate distance.');
        }
      }
    };

    getCoordinatesAndCalculateDistance();
  }, [journeyDetails]);

  useEffect(() => {
    // Redirect to home if no journey details
    if (
      !journeyDetails ||
      !journeyDetails.pickup ||
      !journeyDetails.dropoff ||
      !journeyDetails.date ||
      !journeyDetails.time ||
      !journeyDetails.tripType
    ) {
      alert('Invalid journey details. Please re-enter your booking information.');
      navigate('/');
    }
  }, [journeyDetails, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsButtonDisabled(true);

    try {
      // Generate order number
      const orderNumber = `JW-${Math.floor(100000 + Math.random() * 900000)}`;

      // Insert booking into database
      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            pickup_location: journeyDetails.pickup,
            dropoff_location: journeyDetails.dropoff,
            journey_date: journeyDetails.date,
            journey_time: journeyDetails.time,
            passengers: parseInt(formData.passengers),
            luggage: parseInt(formData.luggage),
            trip_type: journeyDetails.tripType,
            distance: distance,
            order_number: orderNumber
          }
        ])
        .select();

      if (error) throw error;

      // Show success animation
      alert(`Booking request successfully submitted!\nOrder Number: ${orderNumber}\n\nPlease copy the order number and wait for 5 seconds for the next steps.`);

      // Wait for 5 seconds before redirecting to WhatsApp
      setTimeout(() => {
        // Create WhatsApp message
        const message = `*I want to book a ride from Jatri Wheels*%0A%0A*Here are my details*\nName: ${formData.name}%0AEmail: ${formData.email}%0APhone: ${formData.phone}%0A%0A*Journey Details*\nFrom: ${journeyDetails.pickup}%0ATo: ${journeyDetails.dropoff}%0ADate: ${journeyDetails.date}%0ATime: ${journeyDetails.time}%0ATrip Type: ${journeyDetails.tripType === 'oneWay' ? 'One Way' : 'Round Trip'}%0APassengers: ${formData.passengers}%0ALuggage: ${formData.luggage}%0ADistance: ${distance} km%0AOrder Number: ${orderNumber}`;

        // Redirect to WhatsApp
        window.location.href = `https://wa.me/+916901675772?text=${message}`;
      }, 5000);
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Failed to submit booking. Please try again.');
      setIsButtonDisabled(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (!journeyDetails) return null;

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-900 mb-8">Book Your Ride</h1>

          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            {/* Journey Details (Read-only) */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-blue-900">Journey Details</h2>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="flex items-center text-blue-900 hover:text-blue-700"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">From</p>
                    <p className="font-medium">{journeyDetails.pickup}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">To</p>
                    <p className="font-medium">{journeyDetails.dropoff}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium">{journeyDetails.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-medium">{journeyDetails.time}</p>
                  </div>
                  {distance !== null && (
                  <div>
                    <p className="text-sm text-gray-600">Distance</p>
                    <p className="font-medium">{distance} km</p>
                  </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Trip Type</p>
                    <p className="font-medium">
                      {journeyDetails.tripType === 'oneWay' ? 'One Way' : 'Round Trip'}
                    </p>
                  </div>
                </div>
              </div>
              
            {/* Personal Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-blue-900">Personal Details</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
  
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

            {/* Additional Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-blue-900">Additional Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-6 w-6 text-gray-400" />
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={formData.passengers}
                    onChange={(e) => setFormData({ ...formData, passengers: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Number of Passengers"
                  />
                </div>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 h-6 w-6 text-gray-400" />
                  <input
                    type="number"
                    min="0"
                    max="5"
                    required
                    value={formData.luggage}
                    onChange={(e) => setFormData({ ...formData, luggage: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Number of Luggage"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div
                className="g-recaptcha"
                data-sitekey="6LfMz9MqAAAAADRK8YDGTiHrv_akadZ7Syg88gK3"
                data-callback="onRecaptchaSuccess"
              ></div>
            </div>
            <button
              type="submit"
              className={`w-full py-3 rounded-lg transition-colors ${
                isButtonDisabled
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed animate-pulse'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
              disabled={!isRecaptchaVerified || isButtonDisabled}
            >
              {isButtonDisabled ? 'Processing...' : 'Submit Booking Request'}
            </button>
          </form>
        </div>
      </div>

      {isLoading && <LoadingScreen />}
    </div>
  );
};

export default BookingForm;