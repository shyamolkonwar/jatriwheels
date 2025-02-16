import { getDistance } from 'geolib';

export const calculateTotalDistance = (distance: number, isRoundTrip: boolean): number => {
  return isRoundTrip ? distance * 2 : distance;
};

export const calculateTotalCost = (distance: number, pricePerKm: number, isRoundTrip: boolean): number => {
  const totalDistance = calculateTotalDistance(distance, isRoundTrip);
  return totalDistance * pricePerKm;
};

export const calculateAdvancePayment = (totalCost: number): number => {
  return totalCost * 0.2; // 20% advance payment
};

export const calculateDistanceBetweenLocations = (pickup: { lat: number; lon: number }, dropoff: { lat: number; lon: number }): number => {
  return getDistance(
    { latitude: pickup.lat, longitude: pickup.lon },
    { latitude: dropoff.lat, longitude: dropoff.lon }
  ) / 1000; // Convert meters to kilometers
};