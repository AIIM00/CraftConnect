import * as React from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const normalize = (value) => value?.toString().toUpperCase();

const getDefaultRedirect = (userData) => {
  const role = normalize(userData?.role);
  const craftsmanStatus = normalize(userData?.craftsman?.status);
  const applicationStatus = normalize(userData?.applications?.[0]?.status);
  if (role === "ADMIN" || role === "SUPERADMIN") {
    return "/admin/dashboard";
  }

  if (role === "CRAFTSMAN") {
    if (craftsmanStatus === "APPROVED") {
      return "/craftsman/dashboard";
    }

    if (craftsmanStatus === "SUSPENDED") {
      return "/craftsman/suspended";
    }

    if (applicationStatus === "SUBMITTED") {
      return "/craftsman/pending-approval";
    }

    if (applicationStatus === "REJECTED") {
      return "/craftsman/application";
    }

    return "/craftsman/application";
  }

  return "/";
};

const ProtectedRoute = ({
  children,
  allowedRoles = [],
  allowedCraftsmanStatuses = [],
  publicOnly = false,
  redirectTo = "/login",
  fallbackRedirect,
}) => {
  const { isLoggedIn, userData, authLoading } = React.useContext(AppContext);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (publicOnly) {
    if (!isLoggedIn) {
      return children;
    }

    return <Navigate to={getDefaultRedirect(userData)} replace />;
  }

  if (!isLoggedIn) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!userData) {
    return <div>Loading user data...</div>;
  }

  const role = normalize(userData.role);
  const craftsmanStatus = normalize(userData?.craftsman?.status);

  const normalizedAllowedRoles = allowedRoles.map(normalize);
  const normalizedAllowedStatuses = allowedCraftsmanStatuses.map(normalize);

  if (
    normalizedAllowedRoles.length > 0 &&
    !normalizedAllowedRoles.includes(role)
  ) {
    return (
      <Navigate to={fallbackRedirect || getDefaultRedirect(userData)} replace />
    );
  }

  if (role === "CRAFTSMAN" && normalizedAllowedStatuses.length > 0) {
    if (!normalizedAllowedStatuses.includes(craftsmanStatus)) {
      return (
        <Navigate
          to={fallbackRedirect || getDefaultRedirect(userData)}
          replace
        />
      );
    }
  }

  return children;
};

export default ProtectedRoute;
