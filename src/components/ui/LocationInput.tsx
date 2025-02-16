import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { useLoadScript } from '@react-google-maps/api';

const libraries: ("places")[] = ["places"];

interface LocationInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string, placeId?: string) => void;
  className?: string;
}

const LocationInput: React.FC<LocationInputProps> = ({
  placeholder,
  value,
  onChange,
  className = "",
}) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isLoaded && !autocompleteService.current) {
      autocompleteService.current = new google.maps.places.AutocompleteService();
    }
  }, [isLoaded]);

  const handleInput = async (input: string) => {
    onChange(input);

    if (!input || !autocompleteService.current) {
      setPredictions([]);
      return;
    }

    try {
      const response = await autocompleteService.current.getPlacePredictions({
        input,
        componentRestrictions: { country: 'in' },
        bounds: {
          north: 27.9389,  // Assam's northern boundary
          south: 24.1513,  // Assam's southern boundary
          east: 96.0167,   // Assam's eastern boundary
          west: 89.7085    // Assam's western boundary
        },
        strictBounds: true
      });

      setPredictions(response?.predictions || []);
      setIsOpen(true);
    } catch (error) {
      console.error('Error fetching predictions:', error);
      setPredictions([]);
    }
  };

  const handleSelect = (prediction: google.maps.places.AutocompletePrediction) => {
    onChange(prediction.description, prediction.place_id);
    setPredictions([]);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-3 h-6 w-6 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => predictions.length > 0 && setIsOpen(true)}
          className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${className}`}
        />
      </div>

      {isOpen && predictions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-auto">
          {predictions.map((prediction) => (
            <button
              key={prediction.place_id}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
              onClick={() => handleSelect(prediction)}
            >
              <p className="text-sm text-gray-900">{prediction.structured_formatting.main_text}</p>
              <p className="text-xs text-gray-600">{prediction.structured_formatting.secondary_text}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationInput;