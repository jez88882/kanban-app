import { useState } from "react";
import axios from 'axios';
import { FormRow, Alert } from "../../components";
import { useAppContext } from "../../context/appContext";


const ResetEmail = () => {
  const { user, displayAlert, clearAlert, showAlert } = useAppContext()
  const [email, setEmail] = useState('')

  const handleChange = (e) => {
    setEmail(e.target.value)
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { email }
    try {
      const res = await axios.put(`/api/v1/users/${user.id}`, data)
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
      <div className="m-6 p-6 w-2/12 border rounded-md">
        <form onSubmit={handleSubmit}>
          <FormRow type="email" name="email" value={email} labelText="Reset email" handleChange={handleChange}/>
          <button type="submit" className="btn btn-primary mt-4 w-full">Update Email</button>
        </form>
      </div>
    </div>
  );
};

export default ResetEmail;