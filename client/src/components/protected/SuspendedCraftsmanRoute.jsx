import * as React from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const SuspendedCraftsmanRoute = ({ children }) => {
  const { isLoggedIn, isCraftsman, userData, authLoading } =
    React.useContext(AppContext);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!isCraftsman) {
    return <Navigate to="/" replace />;
  }

  const status = userData?.craftsman?.status;

  if (status === "APPROVED") {
    return <Navigate to="/craftsman/dashboard" replace />;
  }

  if (status !== "SUSPENDED") {
    return <Navigate to="/craftsman/pending-approval" replace />;
  }

  return children;
};

export default SuspendedCraftsmanRoute;
