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
      const address = data.address || {};
      const city =
        address.city ||
        address.town ||
        address.village ||
        address.municipality ||
        address.county ||
        "";
      return {
        locationName: data.display_name || `${latitude}, ${longitude}`,
        city,
      };
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      return { locationName: `${latitude}, ${longitude}`, city: "" };
    } finally {
      setGettingAddress(false);
    }
  };

  const handleLocationSelect = async (latitude, longitude) => {
    try {
      const locationName = await getLocationName(latitude, longitude);

      onChange({
        latitude,
        longitude,
        locationName: locationName.locationName,
        city: locationName.city,
      });
    } catch (error) {
      console.error("Failed to get location name:", error);

      onChange({
        latitude,
        longitude,
        locationName: `${latitude}, ${longitude}`,
        city: "",
      });
    }
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
      <div className="pt-6 pl-6 mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-secondary">
            Location Picker
          </p>

          <h3 className="mt-1 font-heading text-xl font-bold text-primary">
            Select Your Service Location
          </h3>
        </div>
      </div>
      <div className="overflow-hidden rounded-3xl border border-border-soft bg-card-gradient shadow-soft">
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

      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="mt-4 w-fit px-24 rounded-2xl bg-primary-gradient px-5 py-4 text-sm font-bold text-white shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elevated"
        >
          Use My Current Location
        </button>
      </div>

      {value && (
        <div className="mt-4 rounded-3xl border border-border-soft bg-card-gradient p-5 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-secondary">
            Selected Location
          </p>
          <p className="mt-2 text-sm font-bold leading-6 text-primary">
            {" "}
            {gettingAddress ? "Getting address..." : value.locationName}
          </p>
          {showCoordinates && (
            <>
              <p className="text-sm text-text-muted">
                {" "}
                Latitude: {value.latitude}
              </p>

              <p className="text-sm text-text-muted">
                {" "}
                Longitude: {value.longitude}
              </p>
              <p className="text-sm text-text-muted">{value.location}</p>
              <p className="mt-3 text-sm font-semibold text-text">
                City: {value.city || "Unknown"}
              </p>
            </>
          )}
        </div>
      )}

      <p className="mt-4 text-center text-sm leading-6 text-text-muted">
        {" "}
        Click on the map to choose your location, or use your current location.
      </p>
    </div>
  );
};

export default LocationPicker;
