import * as React from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

//Components
import Btn from "../components/Btn";
import LocationPicker from "../components/LocationPicker";

// MUI Icons
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import LogoutIcon from "@mui/icons-material/Logout";
import VerifiedIcon from "@mui/icons-material/Verified";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";

const Profile = () => {
  const navigate = useNavigate();
  const { backendUrl, logout } = React.useContext(AppContext);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    city: "",
    address: "",
    apartment: "",
    latitude: null,
    longitude: null,
  });

  const [selectedLocation, setSelectedLocation] = React.useState(null);
  const [showLocationPicker, setShowLocationPicker] = React.useState(false);
  const [hasExistingLocation, setHasExistingLocation] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");
  const [profileUser, setProfileUser] = React.useState(null);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await axios.get(`${backendUrl}/api/user/data`, {
        withCredentials: true,
      });

      if (data.success) {
        const user = data.userData;
        const userLocation = user.location;
        const userHasLocation =
          userLocation &&
          userLocation.latitude !== null &&
          userLocation.longitude !== null;

        setHasExistingLocation(Boolean(userHasLocation));
        setProfileUser(user);

        setFormData({
          name: user.name || "",
          email: user.email || "",
          password: "",
          phoneNumber: user.phoneNumber || "",
          city: user.location?.city || "",
          address: user.location?.address || "",
          apartment: user.location?.apartment || "",
          latitude: userLocation?.latitude ?? null,
          longitude: userLocation?.longitude ?? null,
        });
        if (userHasLocation) {
          setSelectedLocation({
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            locationName: userLocation.address || "Saved location",
            city: userLocation.city || "",
          });
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load profile information",
      );
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleLocationChange = (location) => {
    setSelectedLocation(location);

    setFormData((prev) => ({
      ...prev,
      address: location.locationName || "",
      city: location.city || "",
      latitude: location.latitude || null,
      longitude: location.longitude || null,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const payload = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        city: formData.city,
        address: formData.address,
        apartment: formData.apartment,
        latitude: formData.latitude,
        longitude: formData.longitude,
      };

      if (formData.password.trim() !== "") {
        payload.password = formData.password;
      }

      const { data } = await axios.put(
        `${backendUrl}/api/user/profile`,
        payload,
        {
          withCredentials: true,
        },
      );

      if (data.success) {
        setMessage("Profile updated successfully");
        if (data.userData) {
          setProfileUser(data.userData);
        }

        setFormData((prev) => ({
          ...prev,
          password: "",
        }));
        if (formData.latitude && formData.longitude) {
          setHasExistingLocation(true);
          setShowLocationPicker(false);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      setError("");
      setMessage("");

      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-verify-otp`,
        {},
        {
          withCredentials: true,
        },
      );

      if (data.success) {
        setMessage(data.message || "Verification code sent to your email");
        navigate("/email-verify");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send verification email",
      );
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-primary font-semibold">Loading profile...</p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 px-4 sm:px-8 lg:px-16 py-12">
      <div className="max-w-4xl mx-auto">
        <div className=" flex justify-between items-center max-w-4xl mx-auto">
          <KeyboardArrowLeftIcon
            onClick={() => navigate(-1)}
            sx={{ fontSize: 45 }}
            className="text-accent hover:text-accent-hover hover:bg-gray-700 rounded-full cursor-pointer transition"
          />
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold text-primary-light mb-2">
              My Account
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold text-primary">
              Profile Settings
            </h1>

            <p className="text-text-muted mt-3">
              Update your personal information, contact details, and address.
            </p>
          </div>
          <Btn
            type="button"
            onClick={async () => {
              logout();
            }}
            variant="danger"
            className="mt-1 h-11 w-11 shrink-0 rounded-full p-0 focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            <LogoutIcon />
          </Btn>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          {message && (
            <div className="mb-6 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-primary mb-4">
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-primary-light"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full flex-1 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-primary-light"
                      placeholder="Enter your email"
                      required
                    />
                    {!profileUser?.isAccountVerified ? (
                      <Btn
                        type="button"
                        variant="warning"
                        onClick={handleVerifyEmail}
                        className="h-12 shrink-0 rounded-xl px-5 text-sm font-semibold"
                      >
                        <MarkEmailUnreadIcon fontSize="small" />
                        Verify Email
                      </Btn>
                    ) : (
                      <div className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-green-50 px-5 text-sm font-semibold text-green-700 border border-green-200">
                        <VerifiedIcon fontSize="small" />
                        Verified
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-primary-light"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-primary-light"
                    placeholder="Leave empty to keep current password"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-primary">
                    Location Information
                  </h2>

                  <p className="text-sm text-text-muted mt-1">
                    Choose your address by clicking on the map.
                  </p>
                </div>

                <Btn
                  type="button"
                  onClick={() => setShowLocationPicker((prev) => !prev)}
                  variant="primary"
                  className="rounded-full px-6 py-3 font-semibold"
                >
                  {hasExistingLocation ? "Change Address" : "Add Address"}
                </Btn>
              </div>

              {hasExistingLocation &&
                selectedLocation &&
                !showLocationPicker && (
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
                    <p className="text-sm text-text-muted mb-1">
                      Saved location
                    </p>

                    <p className="font-semibold text-primary">
                      {selectedLocation.locationName || "Your saved address"}
                    </p>
                    {selectedLocation.city && (
                      <p className="text-sm text-text-muted mt-2">
                        City: {selectedLocation.city}
                      </p>
                    )}

                    <p className="text-sm text-text-muted mt-2">
                      Latitude: {selectedLocation.latitude}
                    </p>

                    <p className="text-sm text-text-muted">
                      Longitude: {selectedLocation.longitude}
                    </p>
                  </div>
                )}

              {showLocationPicker && (
                <div className="space-y-5">
                  <LocationPicker
                    value={selectedLocation}
                    onChange={handleLocationChange}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-primary-light"
                        placeholder="Enter your city"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Apartment
                      </label>
                      <input
                        type="text"
                        name="apartment"
                        value={formData.apartment}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-primary-light"
                        placeholder="Apartment, floor, building"
                      />
                    </div>
                  </div>
                </div>
              )}

              {!hasExistingLocation && !showLocationPicker && (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center">
                  <p className="text-primary font-semibold">
                    No address added yet
                  </p>

                  <p className="text-sm text-text-muted mt-1">
                    Click Add Address to choose your location on the map.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Btn
                type="submit"
                disabled={saving}
                variant="primary"
                className="w-full rounded-full px-8 py-3 font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Btn>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Profile;
