import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Overview, Admin, UserManagement, Shared } from './pages/dashboard'
import { Dashboard, Login, Register, Error, ProtectedRoute } from './pages'
import { useEffect } from "react";
import { useAppContext } from "./context/appContext";

export default function App(props){
  const { fetchUser } = useAppContext()

  useEffect(()=>{
    fetchUser();
  },[])

  return(
    <BrowserRouter>
      <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Shared />
            </ProtectedRoute>
          }>
            <Route index element={<Overview/>}/>
            <Route path="admin" element={<Admin/>}/>
            <Route path="user-management" element={<UserManagement/>}/>
          </Route>
          <Route path="/login" element={<Login/>}/>
          {/* <Route path="/register" element={<Register/>}/> */}
          <Route path="*" element={<Error />}/>
      </Routes>
    </BrowserRouter>
  )
}