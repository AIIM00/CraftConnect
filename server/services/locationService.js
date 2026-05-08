// services/locationService.js
import axios from "axios";

export const validateLebanonAddress = async (address) => {
  if (!address || address.trim().length < 3) {
    return {
      valid: false,
      message: "Please enter a valid location.",
    };
  }

  const response = await axios.get(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        q: address,
        format: "json",
        addressdetails: 1,
        limit: 5,
        countrycodes: "lb",
      },
      headers: {
        "User-Agent": "EquiServe/1.0 ali22ibrahim12@gmail.com",
      },
    },
  );

  const results = response.data;

  if (!results || results.length === 0) {
    return {
      valid: false,
      message: "Location not found in Lebanon.",
    };
  }

  const bestMatch = results[0];

  const countryCode = bestMatch.address?.country_code;

  if (countryCode !== "lb") {
    return {
      valid: false,
      message: "Location must be inside Lebanon.",
    };
  }

  return {
    valid: true,
    formattedAddress: bestMatch.display_name,
    latitude: Number(bestMatch.lat),
    longitude: Number(bestMatch.lon),
    raw: bestMatch,
  };
};
