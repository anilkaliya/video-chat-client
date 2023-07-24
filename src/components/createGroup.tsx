// CreateGroup.tsx

import React, { useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../reduxHooks';
import { createNewGroup, fetchGroups } from '../features/chatSlice';
import Modal from './modal';
import '../styles/createGroup.css'
const CreateGroup: React.FC = () => {
  const [groupName, setGroupName] = useState('');
  const navigate = useNavigate();
  const dispatch=useAppDispatch()
  const [isOpen, setIsOpen] = useState(false);
  const [nameError,setNameError]=useState<string |undefined>(undefined)

  const handleCloseModal = () => {
    setIsOpen(false);
  };
  const handleCreateGroup=()=>{
    const validPattern = /^[a-zA-Z0-9_-]+$/;
    if (groupName && validPattern.test(groupName)){
      dispatch(createNewGroup(groupName)).then(res=>{
        dispatch(fetchGroups())
        setGroupName("")
       setIsOpen(false)
       setNameError(undefined)
      })
    }
    else{
      setNameError("Allowed values are alphabets, numbers, hyphen and underscores")
    }
  }
  const footer = (
    <div className='footer-buttons'>
    <button type="button" className="btn btn-danger"  onClick={handleCloseModal}>Cancel</button>
      <button onClick={handleCreateGroup} className='btn btn-primary' disabled={groupName===undefined}>Create</button>
    </div>
  );
  const modalContent=(
    <div>
      <h2>Create  Group</h2>
       <input type="text" placeholder="Group Name"  required value={groupName} onChange={(e)=>setGroupName(e.target.value)}  />
       {nameError && <p style={{ color: 'red' }}>{nameError}</p>}

      </div>
  )
 
  
 
  return (
    <div>
      <button onClick={()=>setIsOpen(true)} style={{padding:'8px 8px',minWidth:'fit-content'}} className='btn btn-primary'>New Group</button>
      <Modal isOpen={isOpen} onClose={handleCloseModal} title="Create Group">
        {modalContent}
        {footer}
      </Modal>    
    </div>
  );
};

export default CreateGroup;
