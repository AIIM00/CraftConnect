import * as React from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const PublicHomeRoute = ({ children }) => {
  const { isLoggedIn, isCraftsman, userData, authLoading } =
    React.useContext(AppContext);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (isLoggedIn && isCraftsman) {
    if (userData?.craftsman?.status === "APPROVED") {
      return <Navigate to="/craftsman/dashboard" replace />;
    }
    if (userData?.craftsman?.status === "SUSPENDED") {
      return <Navigate to="/craftsman/suspended" replace />;
    }

    return <Navigate to="/craftsman/pending-approval" replace />;
  }

  return children;
};

export default PublicHomeRoute;
