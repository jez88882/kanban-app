import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { UserManagement, Shared, CreateUser, Account, AllUsers, EditUser, ResetEmail, ResetPassword, AccountInfo, AssignGroups, TaskManagement, AllApps, CreateApp, ShowApp, CreatePlan, ShowPlan, CreateTask, ShowTask } from './pages/dashboard'
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
            <Route path="account" element={<Account/>}>
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
            <Route path="applications" element={<TaskManagement/>}>
              <Route index element={<AllApps />}/>
              <Route path='new' element={<CreateApp />}/>
              <Route path=':app_Acronym' element={<ShowApp />}/>
              <Route path=":app_Acronym/edit" element={<CreateApp />}/>
              <Route path=":app_Acronym/plans/new" element={<CreatePlan />}/>
              <Route path=":app_Acronym/plans/:MVP_name" element={<ShowPlan />}/>
              <Route path=":app_Acronym/tasks/new" element={<CreateTask />}/>
              <Route path=":app_Acronym/tasks/:Task_id" element={<ShowTask />}/>
            </Route>
          </Route>
          <Route path="/login" element={<Login/>}/>
          <Route path="*" element={<Error />}/>
      </Routes>
    </BrowserRouter>
    
    </>
  )
}