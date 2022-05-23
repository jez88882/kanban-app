import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAppContext } from '../context/appContext'
import { FormRow, Alert } from '.'


const Task = (props) => {
  const { Task_id, Task_name, Task_creator, Task_owner, Task_createDate, Task_description, Task_state, Task_plan, Task_notes } = props.task
  const moveTask = props.moveTask
  const app_Acronym = props.app_Acronym
  const { displayAlert, showAlert, clearAlert, user } = useAppContext()
  const [showAddNote, setShowAddNote] = useState(false)
  const [notes, setNotes] = useState([])

  const is_user = (currentUser, person) => {
    if (currentUser === person) {
      return "you"
    } else {
      return person
    }
  }

  const [noteContent, setNoteContent] = useState("")

  useEffect(()=>{
    setNotes(JSON.parse(Task_notes))
  },[])
  

  const handleChange = (e) => {
    setNoteContent(e.target.value)
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('adding note')
    const res = await axios.post(`/api/v1/applications/${app_Acronym}/tasks/${Task_id}/notes`, {noteContent})
    if (res.data) {
      console.log(res.data)
      displayAlert('success', "updated task")
      setTimeout(()=>{
        clearAlert();
      }, 1000)
    }
  }
    
  const approve = async () => {
    const res = await axios.get(`/api/v1/applications/${app_Acronym}/tasks/${Task_id}/approve`)
    console.log(res.data)
    moveTask(res.data.task, "open", "toDo")
    if (res.data) {
      displayAlert('success', "approved task")
      setTimeout(()=>{
        clearAlert();
      }, 3000)
    }
  }
  
  const moveToDoing = async () => {
    const res = await axios.get(`/api/v1/applications/${app_Acronym}/tasks/${Task_id}/workOn`)
    moveTask(res.data.task, "toDo", "doing")
    if (res.data) {
      displayAlert('success', "logged task")
      setTimeout(()=>{
        clearAlert();
      }, 3000)
    }
  }

  const showCreatorOrOwner = Task_state === 'toDo' ? 
  <>Created by <span className='font-bold'>{is_user(user.username, Task_creator)}</span></> :
  <>Owned by <span className='font-bold'>{is_user(user.username, Task_owner)}</span></>
    
  const toggleAddNote = (e) => {
    setShowAddNote(!showAddNote)
  }

  const renderButton = (state) => {
    let action
    switch (state) {
      case "toDo":
        action = "Work on This"
        break
      case "doing":
        action = "Promote"
        break
      case "done":
        action = "Close"
        break
      default:
        return "no such state"
    }
    return (
      <button className='btn btn-primary' onClick={moveToDoing}>{action}</button>
    )
  }

  return (
      <>
      {/** Card **/}
      <label htmlFor={Task_name} className='cursor-pointer'>
        <div className={`border mb-2 px-3 py-1 flex rounded items-center bg-white`}>
          <div className="w-2/4">
            <p className="text-lg">{Task_name}</p>
            <p className='text-sm text-gray-400'>{showCreatorOrOwner}</p>
            
          </div>
          <p className="w-1/4">{Task_createDate}</p>
          {Task_state==="open" && <button className="btn btn-info w-1/4" onClick={approve}>Approve</button>}
        </div>
      </label>

      {/** Modal **/}
      <input type="checkbox" id={Task_name} className="modal-toggle" />
      <label htmlFor={Task_name} className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <div className='flex border-b-2 mb-2 pb-3 justify-between items-center'>
            <div>
              <h2 className='font-bold text-xl'>Task: {Task_name}<span className='badge badge-primary mx-2 align-text-top'>{Task_state}</span></h2>
              <p className='text-sm ml-1 text-gray-400'>{showCreatorOrOwner}</p>
            </div>
            {renderButton(Task_state)}
          </div>
          {showAlert && <Alert />}
          <p><span className='text-lg font-bold'>Task plan: </span>{Task_plan === "" ? "none" : Task_plan}</p>
          <p><span className='text-lg font-bold'>Task description: </span><br/>{Task_description}</p>
          {/** Notes */}
          <div>
            {notes.map(note=> <p>{note.noteContent}</p>)}
          </div>
          <form onSubmit={handleSubmit}>
            <FormRow type="text" name="Task_note" value={noteContent} handleChange={handleChange} labelText=" " placeholder="Add note here" onFocus={toggleAddNote}/>
            <button className={`btn btn-primary btn-sm mt-2 ${showAddNote ? "": "hidden"}`} type="submit">Add Note</button>
          </form>
        </label>
      </label>
    </>
  );
};

export default Task;