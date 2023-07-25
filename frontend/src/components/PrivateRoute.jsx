import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
    const { userInfo } = useSelector(state => state.auth);

// repleace is to pass any route hispry
  return (
    userInfo ? <Outlet/> : <Navigate to='/login' replace/>
  )
}

export default PrivateRoute