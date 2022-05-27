
import { Outlet } from 'react-router-dom'
import { Navbar, Alert } from '../../components'
import { useAppContext } from '../../context/appContext';

const Shared = () => {
  const { showAlert } = useAppContext()
  return (
    <>
      {showAlert && <Alert />}
      <Navbar/>
      <Outlet />
    </>
  );
};

export default Shared;