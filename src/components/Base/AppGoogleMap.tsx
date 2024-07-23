import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import AppButton from './AppButton';

const containerStyle: React.CSSProperties = {
  width: '700px',
  height: '400px',
  maxWidth: '100%',
};

interface LocationData {
  lat?: number | undefined;
  lng?: number | undefined;
  address: string;
}

interface Coordinates {
  lat: number;
  lng: number;
}

const defaultCoordinates = {
  lat: 41.9028,
  lng: 12.4964,
};

interface AppGoogleMapProps {
  locationChangeHandler: (data: LocationData) => void;
  coordinates: Coordinates;
}

const AppGoogleMap: React.FC<AppGoogleMapProps> = ({
  locationChangeHandler,
  coordinates,
}) => {
  const apiKey: string = process.env.NEXT_PUBLIC_GOOGLE_KEY || '';
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
  });

  const [map, setMap] = React.useState<google.maps.Map | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(
    null
  );
  const [markerPosition, setMarkerPosition] = useState<Coordinates>(
    coordinates || currentLocation || defaultCoordinates
  );

  const [address, setAddress] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
        setMarkerPosition({ lat: latitude, lng: longitude });
      });
    }
  }, []);

  const onLoad = React.useCallback(
    function callback(map: google.maps.Map) {
      if (currentLocation) {
        const bounds = new window.google.maps.LatLngBounds(currentLocation);
        map.fitBounds(bounds);
      }

      setMap(map);
    },
    [currentLocation]
  );

  const onUnmount = React.useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  const onMarkerDragEnd = (e: any) => {
    setMarkerPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    reverseGeocode(e.latLng.lat(), e.latLng.lng());
  };

  const reverseGeocode = (latitude: number, longitude: number) => {
    const geocoder = new window.google.maps.Geocoder();
    const latlng = { lat: latitude, lng: longitude };

    // @ts-ignore:next-line
    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === 'OK' && results && results.length > 0) {
        const formattedAddress = results[0].formatted_address;
        setAddress(formattedAddress);
      } else {
        console.error('No results found');
      }
    });
  };

  const locationHandler = () => {
    locationChangeHandler({
      address,
      lat: markerPosition?.lat,
      lng: markerPosition?.lng,
    });
  };

  const onMapClick = (e: any) => {
    reverseGeocode(e.latLng.lat(), e.latLng.lng());
    setMarkerPosition({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
  };

  return isLoaded ? (
    <div className="flex flex-col items-center gap-4">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentLocation || defaultCoordinates}
        zoom={14}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={onMapClick}
      >
        <Marker
          position={markerPosition}
          onDragEnd={onMarkerDragEnd}
          draggable={true}
        />
      </GoogleMap>
      <AppButton
        primary
        onClick={locationHandler}
        className="md:w-[300px] max-w-[300px] py-2"
      >
        Select Location
      </AppButton>
    </div>
  ) : (
    <p>Google Map is loading..</p>
  );
};

export default AppGoogleMap;
