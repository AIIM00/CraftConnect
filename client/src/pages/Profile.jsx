import * as React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { AppContext } from "../context/AppContext";
import LocationPicker from "../components/LocationPicker";
import Btn from "../components/Btn";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import LogoutIcon from "@mui/icons-material/Logout";
import VerifiedIcon from "@mui/icons-material/Verified";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import PersonIcon from "@mui/icons-material/Person";
import MailIcon from "@mui/icons-material/Mail";
import PhoneIcon from "@mui/icons-material/Phone";
import LockIcon from "@mui/icons-material/Lock";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ApartmentIcon from "@mui/icons-material/Apartment";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import SaveIcon from "@mui/icons-material/Save";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";

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

      if (!data.success) return;

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
        city: userLocation?.city || "",
        address: userLocation?.address || "",
        apartment: userLocation?.apartment || "",
        latitude: userLocation?.latitude ?? null,
        longitude: userLocation?.longitude ?? null,
      });

      if (userHasLocation) {
        setSelectedLocation({
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          locationName: userLocation.address || "Saved location",
          city: userLocation.city || "",
          apartment: userLocation.apartment || "",
        });
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

      if (formData.password.trim()) {
        payload.password = formData.password;
      }

      const { data } = await axios.put(
        `${backendUrl}/api/user/profile`,
        payload,
        { withCredentials: true },
      );

      if (!data.success) return;

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
        { withCredentials: true },
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
      <section className="min-h-screen bg-background-dark bg-hero-gradient px-4 py-10">
        <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center">
          <div className="w-full rounded-2xl border border-border-soft bg-card-gradient p-10 text-center shadow-card">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card">
              <PersonIcon sx={{ fontSize: 48 }} />
            </div>

            <h1 className="font-heading text-3xl font-bold text-primary">
              Loading Profile
            </h1>

            <p className="mt-3 text-sm text-text-muted">
              Loading your profile information...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-background-dark bg-hero-gradient px-0 py-0 sm:px-4 sm:py-8">
      <div className="mx-auto max-w-container">
        <div className="mb-0 flex items-center justify-between px-4 py-4 sm:mb-6 sm:px-0 sm:py-0">
          <Btn
            type="button"
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border-soft bg-background p-0 text-primary shadow-soft transition hover:bg-background-light"
            aria-label="Go back"
          >
            <KeyboardArrowLeftIcon sx={{ fontSize: 30 }} />
          </Btn>
          <Btn
            type="button"
            variant="ghost"
            onClick={async () => logout()}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-border-soft bg-background p-0 text-danger shadow-soft transition hover:bg-red-50"
            aria-label="Logout"
          >
            <LogoutIcon sx={{ fontSize: 24 }} />
          </Btn>
        </div>

        <div className="overflow-hidden rounded-none border-0 bg-background shadow-none sm:rounded-2xl sm:border sm:border-border-soft sm:shadow-glass">
          <div className="relative overflow-hidden bg-primary-gradient px-5 py-8 text-white sm:px-10 sm:py-10 lg:px-14">
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-secondary/30 blur-3xl" />
            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-sm">
                  <AccountCircleIcon fontSize="small" />
                  <span className="text-sm font-semibold">My Account</span>
                </div>

                <h1 className="font-heading text-3xl font-bold sm:text-4xl lg:text-5xl">
                  Profile Settings
                </h1>

                <p className="mt-4 max-w-2xl text-text-muted leading-7 text-sm sm:text-md lg:text-lg">
                  Manage your personal information, email verification,
                  password, and saved service location.
                </p>
              </div>
              <div className="grid  grid-cols-2 gap-3 lg:min-w-[360px]">
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-sm text-white/70">Email status</p>
                  <p className="mt-1 flex items-center gap-2 font-semibold">
                    {profileUser?.isAccountVerified ? (
                      <>
                        <VerifiedIcon className="text-secondary" />
                        Verified
                      </>
                    ) : (
                      <>
                        <MarkEmailUnreadIcon className="text-secondary" />
                        Not verified
                      </>
                    )}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                  <p className="text-sm text-white/70">Location</p>
                  <p className="mt-1 flex items-center gap-2 font-semibold">
                    <LocationOnIcon className="text-secondary" />
                    {hasExistingLocation ? "Saved" : "Missing"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-5 sm:p-8 lg:p-12">
            {message && (
              <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-success">
                {message}
              </div>
            )}

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-danger">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <section className="rounded-2xl border border-border-soft bg-card-gradient p-5 shadow-soft sm:p-7">
                <div className="mb-6 flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-background-light text-primary shadow-soft">
                    <PersonIcon />
                  </div>

                  <div>
                    <h2 className="font-heading text-2xl font-semibold text-primary">
                      Personal Information
                    </h2>
                    <p className="mt-1 text-sm text-text-muted">
                      Keep your name, contact details, and account security up
                      to date.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-text">
                      Full Name
                    </label>

                    <div className="flex items-center gap-3 rounded-xl border border-border-soft bg-background px-4 py-3.5 text-text-muted shadow-soft transition focus-within:border-primary focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/10">
                      <PersonIcon fontSize="small" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-transparent text-text outline-none placeholder:text-text-muted"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-text">
                      Phone Number
                    </label>

                    <div className="flex items-center gap-3 rounded-xl border border-border-soft bg-background px-4 py-3.5 text-text-muted shadow-soft transition focus-within:border-primary focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/10">
                      <PhoneIcon fontSize="small" />
                      <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full bg-transparent text-text outline-none placeholder:text-text-muted"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-text">
                      Email Address
                    </label>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <div className="flex flex-1 items-center gap-3 rounded-xl border border-border-soft bg-background px-4 py-3.5 text-text-muted shadow-soft transition focus-within:border-primary focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/10">
                        <MailIcon fontSize="small" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full bg-transparent text-text outline-none placeholder:text-text-muted"
                          placeholder="Enter your email"
                          required
                        />
                      </div>

                      {!profileUser?.isAccountVerified ? (
                        <Btn
                          type="button"
                          variant="ghost"
                          onClick={handleVerifyEmail}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-secondary/30 bg-secondary/10 px-5 py-3.5 text-sm font-semibold text-secondary shadow-soft transition hover:bg-secondary/20"
                        >
                          <MarkEmailUnreadIcon fontSize="small" />
                          Verify Email
                        </Btn>
                      ) : (
                        <div className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-5 py-3.5 text-sm font-semibold text-success">
                          <VerifiedIcon fontSize="small" />
                          Verified
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-text">
                      New Password
                    </label>

                    <div className="flex items-center gap-3 rounded-xl border border-border-soft bg-background px-4 py-3.5 text-text-muted shadow-soft transition focus-within:border-primary focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/10">
                      <LockIcon fontSize="small" />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full bg-transparent text-text outline-none placeholder:text-text-muted"
                        placeholder="Leave empty to keep current password"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-border-soft bg-card-gradient p-5 shadow-soft sm:p-7">
                <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-background-light text-primary shadow-soft">
                      <LocationOnIcon />
                    </div>

                    <div>
                      <h2 className="font-heading text-2xl font-semibold text-primary">
                        Location Information
                      </h2>
                      <p className="mt-1 text-sm text-text-muted">
                        Choose your address by clicking on the map.
                      </p>
                    </div>
                  </div>

                  <Btn
                    type="button"
                    variant="ghost"
                    onClick={() => setShowLocationPicker((prev) => !prev)}
                    className="inline-flex items-center gap-2 rounded-xl border border-border-soft bg-background px-5 py-3 text-sm font-semibold text-primary shadow-soft transition hover:bg-background-light"
                  >
                    <LocationOnIcon fontSize="small" />
                    {hasExistingLocation ? "Change Address" : "Add Address"}
                  </Btn>
                </div>

                {hasExistingLocation &&
                  selectedLocation &&
                  !showLocationPicker && (
                    <div className="rounded-2xl border border-border-soft bg-background-light p-6">
                      <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
                        Saved Location
                      </p>

                      <p className="font-semibold text-text">
                        {selectedLocation.locationName || "Your saved address"}
                      </p>

                      <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-text-muted md:grid-cols-2">
                        <p>City: {selectedLocation.city || "Not added"}</p>
                        <p>
                          Apartment: {selectedLocation.apartment || "Not added"}
                        </p>
                      </div>
                    </div>
                  )}

                {showLocationPicker && (
                  <div className="rounded-2xl border border-border-soft bg-background p-4 shadow-soft">
                    <LocationPicker
                      value={selectedLocation}
                      onChange={handleLocationChange}
                    />

                    <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-text">
                          City
                        </label>

                        <div className="flex items-center gap-3 rounded-xl border border-border-soft bg-background px-4 py-3.5 text-text-muted shadow-soft transition focus-within:border-primary focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/10">
                          <HomeWorkIcon fontSize="small" />
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full bg-transparent text-text outline-none placeholder:text-text-muted"
                            placeholder="Enter your city"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-text">
                          Apartment
                        </label>

                        <div className="flex items-center gap-3 rounded-xl border border-border-soft bg-background px-4 py-3.5 text-text-muted shadow-soft transition focus-within:border-primary focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/10">
                          <ApartmentIcon fontSize="small" />
                          <input
                            type="text"
                            name="apartment"
                            value={formData.apartment}
                            onChange={handleChange}
                            className="w-full bg-transparent text-text outline-none placeholder:text-text-muted"
                            placeholder="Apartment, floor, building"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!hasExistingLocation && !showLocationPicker && (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-soft bg-background-light px-6 py-12 text-center">
                    <LocationOnIcon
                      className="text-primary"
                      sx={{ fontSize: 44 }}
                    />

                    <p className="mt-3 font-semibold text-text">
                      No address added yet
                    </p>

                    <p className="mt-1 text-sm text-text-muted">
                      Click Add Address to choose your location on the map.
                    </p>
                  </div>
                )}
              </section>

              <Btn
                type="submit"
                variant="ghost"
                disabled={saving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-gradient px-6 py-4 text-base font-semibold text-white shadow-card transition duration-300 hover:scale-[1.01] hover:shadow-elevated disabled:cursor-not-allowed disabled:opacity-60"
              >
                <SaveIcon fontSize="small" />
                {saving ? "Saving..." : "Save Changes"}
              </Btn>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
