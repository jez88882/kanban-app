import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAppContext } from '../context/appContext'
import { FormRow, Alert } from '.'


const Note = (props) => {
  const { creator, content, createdAt, state } = props.note
  return (
    <div className='border rounded my-2 p-2'>
      <p className='text-lg'>{content}</p>
      <p className='text-sm text-gray-500'>{creator}, at {createdAt.toLocaleString()}</p>
    </div>
  )
}

const OpenTask = (props) => {
  const { Task_id, Task_name, Task_creator, Task_createDate, Task_description, Task_state, Task_plan, Task_notes, Task_owner } = props.task
  const moveTask = props.moveTask
  const app_Acronym = props.app_Acronym
  const permits = props.permits
  const { displayAlert, showAlert, clearAlert, user } = useAppContext()
  const [disabled, setDisabled] = useState(true)
  const [noteContent, setNoteContent] = useState("")
  const [notes, setNotes] = useState([])
  const [taskOwner, setTaskOwner ] = useState(Task_owner)

  const is_creator = user.username === Task_creator

  useEffect(()=>{
    setNotes(JSON.parse(Task_notes))
  },[])
  
  const handleNoteContent = (e) => {
    setNoteContent(e.target.value)
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    toggle()
    
    const res = await axios.post(`/api/v1/applications/${app_Acronym}/tasks/${Task_id}/notes`, {noteContent})

    if (res.data) {
      const updatedNotes = notes.concat(res.data.note)
      setNotes(updatedNotes)
      setNoteContent('')
      console.log(props.username)
      setTaskOwner(props.username)

      displayAlert('success', "added note")
      setTimeout(()=>{
        clearAlert();
      }, 1000)
    }
  }
    
  const toggle = () => {
    setDisabled(!disabled)
  }
    
  const approve = async () => {
    const res = await axios.get(`/api/v1/applications/${app_Acronym}/tasks/${Task_id}/approve`)
    console.log(res.data)
    moveTask(res.data.task, "Open", "toDoList")
    if (res.data) {
      displayAlert('success', "approved task")
      setTimeout(()=>{
        clearAlert();
      }, 3000)
    }
  }

  return (
    <>
    {/** Card **/}
      <label htmlFor={Task_name} className='cursor-pointer'>
        <div className={`border mb-2 px-3 py-1 flex rounded items-center`}>
          <div className="w-1/4">
            <p className="text-lg">{Task_name}</p>
          </div>
          <div className="w-1/4">
            <p className="text-lg text-slate-500">{is_creator? "you" : Task_creator}</p>
          </div>
          <p className="w-1/4">{Task_createDate}</p>
          {permits[Task_state] &&
          <button className="btn btn-info w-1/4" onClick={approve}>Approve</button>
          }
        </div>
      </label>
      {/** Modal **/}
      <input type="checkbox" id={Task_name} className="modal-toggle" />
      <label htmlFor={Task_name} className="modal cursor-pointer">
        <label className="modal-box w-11/12 max-w-5xl overflow-hidden" htmlFor="">
        <div className='flex border-b-2 mb-2 pb-3 justify-between items-center'>
            <div>
              <h2 className='font-bold text-xl'>Task: {Task_name}<span className='badge badge-primary mx-2 align-text-top'>{Task_state}</span></h2>
            </div>
           
          </div>
          
          <p><span className='text-lg font-bold'>Task plan: </span>{Task_plan === "" ? "none" : Task_plan}</p>
          <p className='max-h-32 overflow-y-auto'><span className='text-lg font-bold'>Task description: </span>{Task_description}</p>
          <p className='max-h-32 overflow-y-auto'><span className='text-lg font-bold'>Task owner: </span>{taskOwner}</p>
          <div className="divider divider-vertical"></div> 
          <p className='text-lg font-bold'>Notes</p>
          <div className='h-64 overflow-y-auto'>
            {notes.map((note, index)=> <Note key={index} note={note}/>)}
          </div>
          {permits[Task_state] &&
          <form onSubmit={handleSubmit}>
            <FormRow type="text" name="Task_note" value={noteContent} handleChange={handleNoteContent} labelText=" " placeholder="Add note here"/>
            <button className='btn btn-primary btn-sm mt-2' type="submit">Add Note</button>
          </form>}
        </label>
      </label>
    </>
  );
};

export default OpenTask;