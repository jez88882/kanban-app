import { Outlet, Link } from 'react-router-dom'
import { Page, Drawer, Navbar } from '../../components'

const Shared = () => {
  return (
    <Page title="dashboard">
      <Navbar/>
        <Outlet />
    </Page>
  );
};

export default Shared;