// GroupList.tsx

import React, { useEffect,  useState } from 'react';
import { Link } from 'react-router-dom';
import "../styles/listGroup.css"
import { useAppDispatch, useAppSelector } from '../reduxHooks';
import { deleteGroup, fetchGroups } from '../features/chatSlice';
import {ReactComponent as DeleteIcon } from '../assets/delete-icon.svg'
import Modal from './modal';
const GroupList: React.FC = () => {
  const groupList=useAppSelector(state=>state.chat.groups)
  const [groups, setGroups] = useState<[{id:string,name:string}] |[]>(groupList);
  const[isOpen,setIsOpen]=useState(false)
  const dispatch=useAppDispatch()
  const [deleteId,setDeleteId]=useState<string>("")
  useEffect(()=>{
    dispatch(fetchGroups())
  },[])
  useEffect(()=>{
    setGroups(groupList)
  },[groupList.length])
  const handleCloseModal=()=>{
  setIsOpen(false)
  }
  const modalContent=(
     <div>
      Are you sure you want to delete group
     </div>
    )
  const handleDeleteGroup=(groupId:string)=>{
    setDeleteId(groupId)
    setIsOpen(true)
  }
  const deleteGroupWithId=()=>{
    dispatch(deleteGroup(deleteId)).then(res=>{
    dispatch(fetchGroups())
     setIsOpen(false)
    })
  }

    const footer = (
      <>
        <button onClick={handleCloseModal}>Close</button>
        <button onClick={deleteGroupWithId} >Delete Group</button>
      </>
    );
  const NoGroupFound=()=>(
    <div style={{display:'flex',flexWrap:'wrap',padding:'8px 8px'}}>
      <p> No group found....</p>
       <p>Create new group and chat with your friends.</p>
    </div>
  )
  return (
    <>
    <div className='group-list-wrapper'>
      {groups.length===0? <NoGroupFound/>:
      <>
      <div className='group-list-header'>All Groups</div>
        {groups&&groups.map((group) => (
          <div className='list-item'>
            <Link to={`/groups/${group.id}/video-chat`}>
              {group.name}
            </Link>
            <DeleteIcon style={{padding:"0px 12px",cursor:"pointer"}} onClick={()=>handleDeleteGroup(group.id)}/>
            </div>
          
        ))} 
        </>
} 
    </div>
        <Modal isOpen={isOpen} onClose={handleCloseModal} title="Delete Group">
        {modalContent}
        {footer}
    </Modal>  
    </>
        
  );
};

export default GroupList;
