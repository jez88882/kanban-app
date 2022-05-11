import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { UserManagement, Shared, CreateUser, Account, AllUsers, EditUser, ResetEmail, ResetPassword, AccountInfo, AssignGroups, TaskManagement, AllApps, CreateApp } from './pages/dashboard'
import { Login, Error, ProtectedRoute } from './pages'
import { useEffect } from "react";
import { useAppContext } from "./context/appContext";



export default function App(props){
  const { fetchUser } = useAppContext()

  useEffect(()=>{
    fetchUser()
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
              <Route path="edit/:username" element={<EditUser/>}/>
              <Route path="assign" element={<AssignGroups />}/>
            </Route>
            <Route path="task-management" element={<TaskManagement/>}>
              <Route index element={<AllApps />}/>
              <Route path='new-app' element={<CreateApp />}/>
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