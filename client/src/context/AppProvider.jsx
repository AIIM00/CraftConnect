import { useEffect, useState } from "react";
import { AppContext } from "./AppContext";
import { toast } from "react-toastify";
import axios from "axios";

export const AppProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);

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
  useEffect(() => {
    let ignore = false;

    const checkAuth = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`);

        if (ignore) return;

        if (data.success) {
          setIsLoggedIn(true);

          const userRes = await axios.get(`${backendUrl}/api/user/data`);

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
      }
    };

    checkAuth();

    return () => {
      ignore = true;
    };
  }, [backendUrl]);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
