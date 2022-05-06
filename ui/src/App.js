import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { UserManagement, Shared, CreateUser, Account, AllUsers, EditUser, ResetEmail, ResetPassword, AccountInfo } from './pages/dashboard'
import { Login, Error, ProtectedRoute } from './pages'
import { useEffect } from "react";
import { useAppContext } from "./context/appContext";

export default function App(props){
  const { user, fetchUser, checkGroup } = useAppContext()

  useEffect(()=>{
    fetchUser()
    // checkGroup(user.id, "admin");
  },[])

  return(
    <>
    <BrowserRouter>
      <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Shared />
            </ProtectedRoute>
          }>
            <Route path="" element={<Account/>}>
              <Route index element={<AccountInfo />}/>
              <Route path="reset-email" element={<ResetEmail/>}/>
              <Route path="reset-password" element={<ResetPassword/>}/>
            </Route>
            <Route path="users" element={<UserManagement/>}>
              <Route index element={<AllUsers />}/>
              <Route path="new" element={<CreateUser/>}/>
              <Route path="edit/:id" element={<EditUser/>}/>
            </Route>
          </Route>
          <Route path="/login" element={<Login/>}/>
          {/* <Route path="/register" element={<Register/>}/> */}
          <Route path="*" element={<Error />}/>
      </Routes>
    </BrowserRouter>
    
    </>
  )
}