import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';

const ContactForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails = location.state;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [error, setError] = useState('');

  if (!bookingDetails) {
    navigate('/');
    return null;
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.phone.match(/^[0-9]{10}$/)) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Create WhatsApp message with booking details
    const message = `*New Booking Request from Jatri Wheels*%0A
%0A*Customer Details*
Name: ${formData.name}%0A
Email: ${formData.email}%0A
Phone: ${formData.phone}%0A
%0A*Journey Details*
Car: ${bookingDetails.car.name}%0A
From: ${bookingDetails.pickup}%0A
To: ${bookingDetails.dropoff}%0A
Date: ${bookingDetails.date}%0A
Time: ${bookingDetails.time}%0A
Distance: ${bookingDetails.distance.toFixed(1)} km%0A
Trip Type: ${bookingDetails.tripType === 'oneWay' ? 'One Way' : 'Round Trip'}%0A
Amount to Pay: ${formatCurrency(bookingDetails.amount)}`;

    // Redirect to WhatsApp with the message
    // Replace '919876543210' with your actual customer support WhatsApp number
    window.location.href = `https://wa.me/9394608300?text=${message}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-900 mb-8">Complete Your Booking</h1>
          
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
            <div className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

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

              <button
                type="submit"
                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors"
              >
                Continue to WhatsApp
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;