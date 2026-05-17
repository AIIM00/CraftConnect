import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "./AppContext";
import { toast } from "react-toastify";
import axios from "axios";

export const AppProvider = (props) => {
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [availability, setAvailability] = useState(true);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  const statusStyles = {
    PENDING: "bg-orange-100 text-orange-700",
    WAITING: "bg-yellow-100 text-yellow-700",
    IN_PROGRESS: "bg-blue-100 text-blue-600",
    COMPLETED: "bg-green-100 text-green-600",
    CANCELLED: "bg-red-100 text-red-700",

    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
    SUSPENDED: "bg-red-100 text-red-700",
    UNKNOWN: "bg-gray-100 text-gray-600",
  };
  const warningStyles = {
    NONE: "bg-green-100 text-green-700",
    LOW: "bg-yellow-100 text-yellow-700",
    MEDIUM: "bg-orange-100 text-orange-700",
    HIGH: "bg-red-100 text-red-700",
  };
  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`, {
        withCredentials: true,
      });
      if (data.success) {
        setUserData(data.userData);
        if (data.userData?.craftsman?.isAvailable !== undefined) {
          setAvailability(data.userData.craftsman.isAvailable);
        }

        return data.userData;
      } else {
        setUserData(false);
        return null;
      }
    } catch (err) {
      console.error(err.message);
      setUserData(false);
      return null;
    }
  };

  const logout = async (redirectTo = "/login") => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/logout`,
        {},
        {
          withCredentials: true,
        },
      );

      if (data.success) {
        setUserData(false);
        setIsLoggedIn(false);
        localStorage.removeItem("token");
        navigate(redirectTo, { replace: true });
      } else {
        toast.error(data.message || "Logout failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const getCraftsmanAvailability = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/craftsman/availability`,
        {
          withCredentials: true,
        },
      );

      setAvailability(data.isAvailable);
      return data.isAvailable;
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to load availability");
    }
  };

  const toggleCraftsmanAvailability = async () => {
    try {
      setAvailabilityLoading(true);

      const { data } = await axios.patch(
        `${backendUrl}/api/craftsman/availability/toggle`,
        {},
        {
          withCredentials: true,
        },
      );

      setAvailability(data.isAvailable);

      setUserData((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          craftsman: {
            ...prev.craftsman,
            isAvailable: data.isAvailable,
          },
        };
      });

      toast.success(data.message || "Availability updated");

      return data.isAvailable;
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update availability",
      );
    } finally {
      setAvailabilityLoading(false);
    }
  };
  useEffect(() => {
    let ignore = false;

    const checkAuth = async () => {
      setAuthLoading(true);
      try {
        const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`, {
          withCredentials: true,
        });

        if (ignore) return;

        if (data.success) {
          setIsLoggedIn(true);

          const userRes = await axios.get(`${backendUrl}/api/user/data`, {
            withCredentials: true,
          });

          if (ignore) return;

          if (userRes.data.success) {
            setUserData(userRes.data.userData);
            if (userRes.data.userData?.craftsman?.isAvailable !== undefined) {
              setAvailability(userRes.data.userData.craftsman.isAvailable);
            }
          }
        } else {
          setIsLoggedIn(false);
          setUserData(false);
        }
      } catch (err) {
        if (!ignore) {
          console.log(err.message);
          setIsLoggedIn(false);
          setUserData(false);
        }
      } finally {
        if (!ignore) {
          setAuthLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      ignore = true;
    };
  }, [backendUrl]);

  const isCustomer = userData?.role === "CUSTOMER";
  const isCraftsman = userData?.role === "CRAFTSMAN";
  const isAdmin = userData?.role === "ADMIN" || userData?.role === "SUPERADMIN";

  const value = {
    statusStyles,
    warningStyles,
    backendUrl,
    frontendUrl,
    isLoggedIn,
    setIsLoggedIn,
    logout,
    userData,
    setUserData,
    getUserData,
    authLoading,
    isCustomer,
    isCraftsman,
    isAdmin,
    availability,
    setAvailability,
    availabilityLoading,
    getCraftsmanAvailability,
    toggleCraftsmanAvailability,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
