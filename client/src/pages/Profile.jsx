import * as React from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

// Components
import LocationPicker from "../components/LocationPicker";
import Btn from "../components/Btn";

// MUI Icons
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

import {
  glassPage,
  glassCard,
  glassCardWide,
  glassNav,
  glassIconBtn,
  glassCenterIcon,
  glassTitle,
  glassSubtitle,
  glassSmallText,
  glassAlertSuccess,
  glassAlertError,
  glassDivider,
  glassSectionTitle,
  glassGrid,
  glassSpan2,
  glassInputWrap,
  glassLabel,
  glassInputBox,
  glassInput,
  glassMiniBtn,
  glassMiniBtnWarning,
  glassStatusPill,
  glassStatusSuccess,
  glassLocationCard,
  glassMuted,
  glassText,
  glassEmptyCard,
  glassSubmit,
  profileEmailInput,
  profileSectionHeader,
  profileSectionText,
  profileLocationGrid,
  profileMapWrapper,
} from "../styles/glassTailwind";

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
            apartment: userLocation.apartment || "",
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
      <div className={glassPage}>
        <div className={`${glassCard} rounded-3xl`}>
          <div className={glassCenterIcon}>
            <PersonIcon sx={{ fontSize: 56 }} />
          </div>

          <h1 className={glassTitle}>Loading</h1>

          <p className={glassSmallText}>Loading your profile information...</p>
        </div>
      </div>
    );
  }

  return (
    <section className={glassPage}>
      <div className={`${glassCardWide} rounded-3xl p-20`}>
        <div className={glassNav}>
          <Btn
            type="button"
            variant="ghost"
            onClick={() => navigate(-1)}
            className={glassIconBtn}
            aria-label="Go back"
          >
            <KeyboardArrowLeftIcon sx={{ fontSize: 30 }} />
          </Btn>

          <Btn
            type="button"
            variant="ghost"
            onClick={async () => {
              logout();
            }}
            className={glassIconBtn}
            aria-label="Logout"
          >
            <LogoutIcon sx={{ fontSize: 24 }} />
          </Btn>
        </div>

        <div className={glassCenterIcon}>
          <PersonIcon sx={{ fontSize: 58 }} />
        </div>

        <p className={`${glassSmallText} mb-2`}>My Account</p>

        <h1 className={glassTitle}>Profile Settings</h1>

        <p className={glassSubtitle}>
          Update your personal information, contact details, and address.
        </p>

        {message && <div className={glassAlertSuccess}>{message}</div>}
        {error && <div className={glassAlertError}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={glassDivider} />

          <div>
            <h2 className={glassSectionTitle}>Personal Information</h2>

            <div className={glassGrid}>
              <div className={glassInputWrap}>
                <label className={glassLabel}>Full Name</label>

                <div className={glassInputBox}>
                  <PersonIcon />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={glassInput}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div className={glassInputWrap}>
                <label className={glassLabel}>Phone Number</label>

                <div className={glassInputBox}>
                  <PhoneIcon />

                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={glassInput}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div className={`${glassInputWrap} ${glassSpan2}`}>
                <label className={glassLabel}>Email Address</label>

                <div className="mt-2 flex items-center gap-2">
                  <div className={`${glassInputBox} ${profileEmailInput}`}>
                    <MailIcon />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={glassInput}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  {!profileUser?.isAccountVerified ? (
                    <Btn
                      type="button"
                      variant="ghost"
                      onClick={handleVerifyEmail}
                      className={`${glassMiniBtn} ${glassMiniBtnWarning}`}
                    >
                      <MarkEmailUnreadIcon fontSize="small" />
                      Verify Email
                    </Btn>
                  ) : (
                    <div className={`${glassStatusPill} ${glassStatusSuccess}`}>
                      <VerifiedIcon fontSize="small" />
                      Verified
                    </div>
                  )}
                </div>
              </div>

              <div className={`${glassInputWrap} ${glassSpan2}`}>
                <label className={glassLabel}>New Password</label>

                <div className={glassInputBox}>
                  <LockIcon />

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={glassInput}
                    placeholder="Leave empty to keep current password"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={glassDivider} />

          <div>
            <div className={profileSectionHeader}>
              <div>
                <h2 className={glassSectionTitle}>Location Information</h2>

                <p className={`${glassSmallText} ${profileSectionText}`}>
                  Choose your address by clicking on the map.
                </p>
              </div>

              <Btn
                type="button"
                variant="ghost"
                onClick={() => setShowLocationPicker((prev) => !prev)}
                className={glassMiniBtn}
              >
                <LocationOnIcon fontSize="small" />
                {hasExistingLocation ? "Change Address" : "Add Address"}
              </Btn>
            </div>

            {hasExistingLocation && selectedLocation && !showLocationPicker && (
              <div className={glassLocationCard}>
                <p className={`${glassMuted} text-sm mb-2`}>Saved location</p>

                <p className={`${glassText} font-bold`}>
                  {selectedLocation.locationName || "Your saved address"}
                </p>

                {selectedLocation.city && (
                  <p className={`${glassMuted} mt-2`}>
                    City: {selectedLocation.city}
                  </p>
                )}

                <div className={profileLocationGrid}>
                  <p>Apartment: {selectedLocation.apartment}</p>
                </div>
              </div>
            )}

            {showLocationPicker && (
              <div className={profileMapWrapper}>
                <LocationPicker
                  value={selectedLocation}
                  onChange={handleLocationChange}
                />

                <div className={`${glassGrid} mt-5`}>
                  <div className={glassInputWrap}>
                    <label className={glassLabel}>City</label>

                    <div className={glassInputBox}>
                      <HomeWorkIcon />

                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={glassInput}
                        placeholder="Enter your city"
                      />
                    </div>
                  </div>

                  <div className={glassInputWrap}>
                    <label className={glassLabel}>Apartment</label>

                    <div className={glassInputBox}>
                      <ApartmentIcon />

                      <input
                        type="text"
                        name="apartment"
                        value={formData.apartment}
                        onChange={handleChange}
                        className={glassInput}
                        placeholder="Apartment, floor, building"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!hasExistingLocation && !showLocationPicker && (
              <div className={glassEmptyCard}>
                <LocationOnIcon sx={{ fontSize: 42 }} />

                <p className={`${glassText} font-bold mt-2`}>
                  No address added yet
                </p>

                <p className={`${glassMuted} mt-1`}>
                  Click Add Address to choose your location on the map.
                </p>
              </div>
            )}
          </div>

          <Btn
            type="submit"
            variant="ghost"
            disabled={saving}
            className={glassSubmit}
          >
            <SaveIcon fontSize="small" />
            {saving ? "Saving..." : "Save Changes"}
          </Btn>
        </form>
      </div>
    </section>
  );
};

export default Profile;
