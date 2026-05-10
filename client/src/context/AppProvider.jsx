import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "./AppContext";
import { toast } from "react-toastify";
import axios from "axios";

export const AppProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`);
      data.success ? setUserData(data.userData) : toast.error(data.message);
    } catch (err) {
      console.error(err.message);
      setUserData(false);
      setIsLoggedIn(false);
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
    backendUrl,
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
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
