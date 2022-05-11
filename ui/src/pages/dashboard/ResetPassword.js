import { useState } from "react";
import axios from 'axios';
import { FormRow, Alert } from "../../components";
import { useAppContext } from "../../context/appContext";


const ResetEmail = () => {
  const { user, displayAlert, clearAlert, showAlert } = useAppContext()
  const [password, setPassword] = useState('')

  const handleChange = (e) => {
    setPassword(e.target.value)
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { 

      password
     }
    try {
      const res = await axios.patch(`/api/v1/users/${user.username}`, data)
      console.log(res.data)
      displayAlert('success', res.data.message)
      setTimeout(()=>{
        clearAlert();
      },10000)
      
    } catch (error) {
      console.log(error.response)
      displayAlert('error', error.response.data.errMessage)
    }
  }

  return (
    <div>
      <div className="w-3/12">
        {showAlert && <Alert />}
      </div>
      <div className="m-6 p-6 w-3/12 border rounded-md">
        <form onSubmit={handleSubmit}>
          <FormRow type="password" name="password" value={password} labelText="Reset password" handleChange={handleChange}/>
          <p className="mt-2">*Password needs to have 8 to 10 characters,	comprising of alphabets, numbers, and special characters </p>
          <button type="submit" className="btn btn-primary mt-4 w-full">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetEmail;