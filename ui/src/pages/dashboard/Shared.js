
import { Outlet } from 'react-router-dom'
import { Navbar } from '../../components'

const Shared = () => {

  return (
    <>
      <Navbar/>
      <Outlet />
    </>
  );
};

export default Shared;