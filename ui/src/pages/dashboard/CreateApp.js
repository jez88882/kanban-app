import { useEffect, useState } from 'react';
import axios from 'axios'
import { useAppContext } from '../../context/appContext';
import { FormRow } from '../../components';

const initialState = {
  apps: [],
  app_Acronym: '',
  app_Description: '',
  startDate: '',
  endDate: ''
}

const CreateApp = () => {
  const [values, setValues] = useState(initialState)
  const { user } = useAppContext()

  const fetchUncreatedApps = async () => {
    const res = await axios.get(`/api/v1/groups?name=project manager`)
    setValues({...values, apps: res.data.apps})
  }

  useEffect(()=>{
    fetchUncreatedApps()
  },[])

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { app_Acronym, app_Description, startDate, endDate } = values

    const res = await axios.post('/api/v1/applications',{ app_Acronym, app_Description, startDate, endDate })
    console.log(res.data)
  }

  const appList = values.apps.map((app) => <option key={app} value={app}/>)

  return (
    <div className='p-4'>
      <h2 className='font-bold text-2xl'>Create App</h2>
      <form className='my-2 p-6 w-4/12 border rounded-md' onSubmit={handleSubmit}>
        <div>
          <label  className='label label-text w-full max-w-xs' htmlFor="app_Acronym">App Acronym: </label>
          <input className='input input-bordered input-primary w-full' list="appList" id="app_Acronym" name="app_Acronym" onChange={handleChange}/>
        </div>
        <datalist id="appList">
          {appList}
        </datalist>
        <FormRow type="text" name="app_Description" labelText="App Description" value={values.description} handleChange={handleChange} />
        <FormRow type="date" name="startDate" labelText="Start date" value={values.description} handleChange={handleChange} />
        <FormRow type="date" name="endDate" labelText="End date" value={values.description} handleChange={handleChange} />
        <button type="submit" className='btn btn-primary my-2 btn-block'>Create</button>
      </form>
    </div>
  );
};

export default CreateApp;