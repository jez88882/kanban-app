import { Link } from 'react-router-dom';
import { useAppContext } from "../../context/appContext";

const AccountInfo = () => {
  const { user } = useAppContext()

  return (
    <div>
      <div className="m-6 p-6 w-2/12 border rounded-md">
        <div className="flex justify-between">
          <div>
            <h2 className="card-title">Email</h2>
            <p>{user.email}</p>
          </div>
          <div>
            <Link to="reset-email" className="btn btn-primary">Edit</Link>
          </div>
        </div>
        <div className="divider divider-vertical"></div> 
        <div>
          <Link  to="reset-password" className="btn btn-outline btn-primary">reset password</Link>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;