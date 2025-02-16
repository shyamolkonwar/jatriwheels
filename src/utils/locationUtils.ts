import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  libraries: ['places', 'geometry']
});

export const isLocationInNortheastIndia = async (placeId: string): Promise<boolean> => {
  const northeastStates = [
    'Arunachal Pradesh',
    'Assam',
    'Manipur',
    'Nagaland',
    'Tripura',
    'Meghalaya',
    'Mizoram',
    'Sikkim'
  ].map(state => state.toLowerCase());

  const google = await loader.load();
  const geocoder = new google.maps.Geocoder();
  
  try {
    const result = await geocoder.geocode({ placeId });
    const place = result.results[0];
    
    // Check if the location is in Northeast India
    const isInNortheast = place.address_components.some(component => {
      const stateName = component.long_name.toLowerCase();
      const isStateLevel = component.types.includes('administrative_area_level_1');
      return northeastStates.includes(stateName) && isStateLevel;
    });

    // Log for debugging
    console.log('Place details:', {
      formattedAddress: place.formatted_address,
      isInNortheast,
      components: place.address_components.map(c => ({
        name: c.long_name,
        types: c.types
      }))
    });

    return isInNortheast;
  } catch (error) {
    console.error('Geocoding error:', error);
    return false;
  }
};

export const calculateDistance = async (
  originPlaceId: string,
  destinationPlaceId: string
): Promise<number> => {
  const google = await loader.load();
  const service = new google.maps.DistanceMatrixService();

  try {
    const response = await service.getDistanceMatrix({
      origins: [{ placeId: originPlaceId }],
      destinations: [{ placeId: destinationPlaceId }],
      travelMode: google.maps.TravelMode.DRIVING,
    });

    return response.rows[0].elements[0].distance.value / 1000; // Convert to kilometers
  } catch (error) {
    console.error('Distance calculation error:', error);
    return 0;
  }
};