import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
    const { userInfo } = useSelector(state => state.auth);

// repleace is to pass any route hispry
  return (
    userInfo && userInfo.isAdmin ? <Outlet/> : <Navigate to='/login' replace/>
  )
}

export default AdminRoute