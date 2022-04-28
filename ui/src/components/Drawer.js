import Navbar from "./Navbar"
import { Link } from 'react-router-dom'

const Drawer = (props) => {
  return (
    <div class="drawer">
      <input id="my-drawer" type="checkbox" class="drawer-toggle"/>
      <div class="drawer-content">
        <Navbar />
        {props.children}
      </div> 
      <div class="drawer-side">
        <label for="my-drawer" class="drawer-overlay"></label>
        <ul class="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
          <li><Link to="organization">Organization</Link></li>
          <li><Link to="user-management">User management</Link></li>
          <li><Link to="user-management">Admin</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default Drawer;