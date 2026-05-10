import * as React from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const CustomerOnlyRoute = ({ children }) => {
  const { isLoggedIn, isCustomer, isCraftsman, userData, authLoading } =
    React.useContext(AppContext);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (isCraftsman) {
    if (userData?.craftsman?.status === "APPROVED") {
      return <Navigate to="/craftsman/dashboard" replace />;
    }

    return <Navigate to="/craftsman/pending-approval" replace />;
  }

  if (!isCustomer) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default CustomerOnlyRoute;
