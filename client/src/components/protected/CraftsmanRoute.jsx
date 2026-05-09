import * as React from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const CraftsmanRoute = ({ children }) => {
  const { isLoggedIn, userData, isCraftsman } = React.useContext(AppContext);

  // not logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // not craftsman
  if (!isCraftsman) {
    return <Navigate to="/" replace />;
  }

  // not approved yet
  if (userData?.craftsman?.status !== "APPROVED") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default CraftsmanRoute;
