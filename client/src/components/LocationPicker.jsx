import * as React from "react";
import { toast } from "react-toastify";

import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapClickHandler = ({ position, onLocationSelect }) => {
  useMapEvents({
    async click(e) {
      const latitude = e.latlng.lat;
      const longitude = e.latlng.lng;

      await onLocationSelect(latitude, longitude);
    },
  });

  if (!position) return null;

  return (
    <Marker position={[position.latitude, position.longitude]}>
      <Popup>Selected location</Popup>
    </Marker>
  );
};

const ChangeMapCenter = ({ position }) => {
  const map = useMap();

  React.useEffect(() => {
    if (position) {
      map.setView([position.latitude, position.longitude], 15);
    }
  }, [position, map]);

  return null;
};

const LocationPicker = ({
  value,
  onChange,
  defaultCenter = [34.436, 35.835], // Tripoli, Lebanon
  zoom = 13,
  height = "350px",
  showCoordinates = true,
}) => {
  const [gettingAddress, setGettingAddress] = React.useState(false);

  const getLocationName = async (latitude, longitude) => {
    try {
      setGettingAddress(true);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
      );

      const data = await response.json();

      return data.display_name || `${latitude}, ${longitude}`;
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      return `${latitude}, ${longitude}`;
    } finally {
      setGettingAddress(false);
    }
  };

  const handleLocationSelect = async (latitude, longitude) => {
    const locationName = await getLocationName(latitude, longitude);

    onChange({
      latitude,
      longitude,
      locationName,
    });
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;

        await handleLocationSelect(latitude, longitude);

        toast.success("Current location selected");
      },
      () => {
        toast.error(
          "Unable to get your location. Please allow location access.",
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  return (
    <div>
      <div className="rounded-2xl overflow-hidden border border-gray-200">
        <MapContainer
          center={value ? [value.latitude, value.longitude] : defaultCenter}
          zoom={zoom}
          scrollWheelZoom={true}
          style={{ height, width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler
            position={value}
            onLocationSelect={handleLocationSelect}
          />

          <ChangeMapCenter position={value} />
        </MapContainer>
      </div>

      <button
        type="button"
        onClick={handleUseCurrentLocation}
        className="mt-3 w-full py-3 rounded-xl bg-primary text-white font-bold hover:opacity-90 transition"
      >
        Use My Current Location
      </button>

      {value && (
        <div className="mt-3 rounded-2xl bg-bg border border-gray-200 px-4 py-3">
          <p className="text-sm text-text-muted">Selected location</p>

          <p className="font-semibold text-primary">
            {gettingAddress ? "Getting address..." : value.locationName}
          </p>

          {showCoordinates && (
            <>
              <p className="text-sm text-text-muted mt-2">
                Latitude: {value.latitude}
              </p>

              <p className="text-sm text-text-muted">
                Longitude: {value.longitude}
              </p>
            </>
          )}
        </div>
      )}

      <p className="text-sm text-text-muted mt-2">
        Click on the map to choose your location, or use your current location.
      </p>
    </div>
  );
};

export default LocationPicker;
