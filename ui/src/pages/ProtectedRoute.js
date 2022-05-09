import { useAppContext } from "../context/appContext";
// import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({children}) => {
  const location = useLocation()
  const { user, setLocation } = useAppContext()
  setLocation(location.pathname)
  if (!user){
    return <Navigate to="/login" />
  }
  // return <Navigate to={location.pathname} />
  return children
};

export default ProtectedRoute;