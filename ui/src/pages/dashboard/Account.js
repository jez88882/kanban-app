import { Outlet } from 'react-router-dom';
import { useAppContext } from "../../context/appContext";
import { Page } from "../../components";
import { useState } from "react";

const Account = () => {
  const { user } = useAppContext()
  
  const initialState = {
    id: user.id,
    username: user.username,
    email: user.email,
    password: null,
  }

  const [values, setValues] = useState(initialState);

  return (
    <Page title="account">
      <h1 className="font-bold text-3xl py-10 px-6 border-b-4">Welcome, {values.username}</h1>
      <Outlet />
    </Page>
  );
};

export default Account;