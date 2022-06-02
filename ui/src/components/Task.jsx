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


const Task = (props) => {
  const { Task_id, Task_name, Task_creator, Task_owner, Task_createDate, Task_description, Task_state, Task_plan, Task_notes } = props.task
  const moveTask = props.moveTask
  const permits = props.permits
  const app_Acronym = props.app_Acronym
  const { displayAlert, clearAlert, user } = useAppContext()
  const [notes, setNotes] = useState([])
  const [noteContent, setNoteContent] = useState("")
  const [taskOwner, setTaskOwner ] = useState(Task_owner)

  useEffect(()=>{
    setNotes(JSON.parse(Task_notes))
  },[])

  const is_user = (currentUser, person) => {
    if (currentUser === person) {
      return "you"
    } else {
      return person
    }
  }

  const handleChange = (e) => {
    setNoteContent(e.target.value)
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('adding note')
    const res = await axios.post(`/api/v1/applications/${app_Acronym}/tasks/${Task_id}/notes`, {noteContent})
    if (res.data) {
      const updatedNotes = notes.concat(res.data.note)
      setNotes(updatedNotes)

      setNoteContent('')
      setTaskOwner(props.username)
      displayAlert('success', "updated task")
      setTimeout(()=>{
        clearAlert();
      }, 1000)
    }
  }
  
  const changeState = async (e) => {
    displayAlert('info', 'updating task state...')
    const action = { action: e.target.value}
    const res = await axios.patch(`/api/v1/applications/${app_Acronym}/tasks/${Task_id}/state`, action)
    console.log(res.data)

    const stateChanges = {
      "approve": { currentState: "Open", newState: "toDoList"},
      "work on": { currentState: "toDoList", newState: "Doing"},
      "promote": { currentState: "Doing", newState: "Done"},
      "return": { currentState: "Doing", newState: "toDoList"},
      "confirm": { currentState: "Done", newState: "Closed"},
      "demote": { currentState: "Done", newState: "Doing"},
    }
    
    const { currentState , newState } = stateChanges[e.target.value]
    if (res.data) {
      moveTask(res.data.task, currentState, newState)
      displayAlert('success', "updated task")
      setTimeout(()=>{
        clearAlert();
      }, 3000)
    }
  }

  const showCreatorOrOwner = Task_state === 'toDoList' ? 
  <>Created by <span className='font-bold'>{is_user(user.username, Task_creator)}</span></> :
  <>Owned by <span className='font-bold'>{is_user(user.username, taskOwner)}</span></>
    
  const renderButton = (state) => {
    const actions = {
      "Open": [],
      "toDoList": ["work on"],
      "Doing": ["promote", "return"],
      "Done": ["confirm", "demote"],
      "Closed": []
    }  
    const buttons = actions[state]
    
    return (
      buttons.map(action => <button key={action} className='btn btn-primary' onClick={changeState} value={action}>{action}</button>)
    )
  }

  return (
      <>
      {/** Card **/}
      <label htmlFor={Task_name} className='cursor-pointer'>
        <div className={`border mb-2 px-3 py-1 flex rounded items-center ${Task_state === 'Closed' ? "bg-white": ""}`}>
          <div className="w-3/4">
            <p className="text-lg">{Task_name}</p>
            <p className='text-sm text-gray-400'>{showCreatorOrOwner}</p>
          </div>
          <p className="">{Task_createDate}</p>
        </div>
      </label>

      {/** Modal **/}
      <input type="checkbox" id={Task_name} className="modal-toggle" />
      <label htmlFor={Task_name} className="modal cursor-pointer">
        <label className="modal-box" htmlFor="">
          <div className='flex border-b-2 mb-2 pb-3 justify-between items-center'>
            <div>
              <h2 className='font-bold text-xl'>Task: {Task_name}<span className='badge badge-primary mx-2 align-text-top'>{Task_state}</span></h2>
              <p className='text-sm ml-1 text-gray-400'>{showCreatorOrOwner}</p>
            </div>
            {permits[Task_state] && renderButton(Task_state) }
          </div>
          
          <p><span className='text-lg font-bold'>Task plan: </span>{Task_plan === "" ? "none" : Task_plan}</p>
          <p className='max-h-32 overflow-y-auto'><span className='text-lg font-bold'>Task description: </span>{Task_description}</p>
          <p className='max-h-32 overflow-y-auto'><span className='text-lg font-bold'>Task owner: </span>{taskOwner}</p>
          <div className="divider divider-vertical"></div> 
          {/** Notes */}
          <p className='text-lg font-bold'>Notes</p>
          <div className='h-64 overflow-y-auto max-h-44'>
            {notes.map((note, index)=> <Note key={index} note={note}/>)}
          </div>
          {permits[Task_state] &&
          <form onSubmit={handleSubmit}>
            <FormRow type="text" name="Task_note" value={noteContent} handleChange={handleChange} labelText=" " placeholder="Add note here"/>
            <button className='btn btn-primary btn-sm mt-2' type="submit">Add Note</button>
          </form>
          }
        </label>
      </label>
    </>
  );
};



export default Task;