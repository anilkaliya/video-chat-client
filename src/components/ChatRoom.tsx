import { useCallback,useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../context/socketProviders";
import ReactPlayer from "react-player";
import peer from '../service/peer'
import { useAppSelector } from "../reduxHooks";
import Modal from "./modal";
import '../styles/chatroom.css'
export const ChatRoom=()=>{
   const params = useParams();
   const roomId = params.roomId as string;
   const socket = useSocket()
   const[isOpen,setIsOpen]=useState(false)
   const [remoteSocketId,setRemoteSocketId]=useState(null)
   const[localStream,setLocalStream]=useState<any>(null)
   const[remoteStream,setRemoteStream]=useState<any>(null)
   const groupList=useAppSelector(state=>state.chat.groups)
   const [incomingCall,setIncomingCall]=useState(false)
   const [from,setFrom]=useState(null)
   const [offer,setOffer]=useState(null)
   const handleJoinRoom=(data:any)=>{
     console.log("room joined",roomId)
   }
   useEffect(()=>{
      socket.emit("room:join",{room:roomId})
  
},[])
   useEffect(()=>{
   socket.on("room:join",handleJoinRoom)
   return ()=>{
      socket.off("room:join",handleJoinRoom)
   }
   },[])

   const handleUserJoined=(data:any)=>{
   setRemoteSocketId(data.socketId)
   }

 const handleIncomingCall=useCallback(async (data:any)=>{
   const {from,offer}=data
   console.log("incoming call",from,offer)
   setIncomingCall(true)
   setFrom(from)
   setOffer(offer)
   // setRemoteSocketId(from)
   // const stream=await navigator.mediaDevices.getUserMedia({video:true,audio:true})
   // setLocalStream(stream)
   // const answer=await peer.getAnswer(offer)
   // console.log("incoming call",offer)
   // socket.emit("call:accepted",{to:from,answer})
   
 },[socket])

 const sendStream=useCallback(()=>{
   
      for (const track of localStream.getTracks()){
         if(peer.peer){
            peer.peer.addTrack(track,localStream)
         }
        
      }


 },[localStream])

 const handleCallAccepted=useCallback(async(data:any)=>{
   peer.setLocalDescription(data.answer)
   if (localStream)
      sendStream()
   console.log("call Accepted")
 },[sendStream])

 const handleNegoNeeded=useCallback(async()=>{
   const offer=await peer.getOffer()
   socket.emit("peer:nego:needed",{to:remoteSocketId,offer})
 },[remoteSocketId, socket])

useEffect(()=>{
   peer.peer?.addEventListener("negotiationneeded",handleNegoNeeded)
   return () => {
      peer.peer?.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
},[handleNegoNeeded])

 useEffect(()=>{
   peer.peer?.addEventListener("track",async(ev:any)=>{
      console.log(ev.streams)
      setRemoteStream(ev.streams[0])
   })
 },[])
 const handleNegoIncoming=useCallback(async(data:any)=>{
   const {offer,from}=data
   const answer=await peer.getAnswer(offer)
   socket.emit("peer:nego:done",{answer,to:from})   
 },[socket])

 const handleNegoFinal=useCallback(async(data:any)=>{
   const {answer}=data
   await peer.setLocalDescription(answer)
 },[])

 useEffect(()=>{
   socket.on("user:joined",handleUserJoined)
   socket.on("incoming:call",handleIncomingCall)
   socket.on("call:accepted",handleCallAccepted)
   socket.on("peer:nego:needed",handleNegoIncoming)
   socket.on("peer:nego:final",handleNegoFinal)
   return ()=>{
      socket.off("user:joined",handleUserJoined)
      socket.off("incoming:call",handleIncomingCall)
      socket.off("call:accepted",handleCallAccepted)
      socket.off("peer:nego:needed",handleNegoIncoming)
      socket.off("peer:nego:final",handleNegoFinal)
   }
},[socket,handleUserJoined,handleIncomingCall,handleCallAccepted,handleNegoIncoming,handleNegoFinal])

const handleCallUser=async()=>{
   const localStream=await navigator.mediaDevices.getUserMedia({video:true,audio:true})
   setLocalStream(localStream)
   const offer=await peer.getOffer()
   socket.emit("user:call",{to:remoteSocketId,offer})
}
 const acceptIncomingCall=async()=>{
   setRemoteSocketId(from)
   console.log("setted offer",from,offer)
   const answer=await peer.getAnswer(offer)
   const stream=await navigator.mediaDevices.getUserMedia({video:true,audio:true})
   setLocalStream(stream)
   socket.emit("call:accepted",{to:from,answer})
   setIncomingCall(false)
   sendStream()
 }
const modalContent=(
   <div className="incoming-call-modal">
      Incoming call
   </div>
)

const footer = (
   <div className="incoming-call-footer">
     <button className="btn btn-danger" onClick={()=>setIncomingCall(false)}>Close</button>
     <button onClick={acceptIncomingCall} className="btn btn-success" >Accept</button>
   </div>
 );
 return(
    <div className="chat-room"> 
      {remoteSocketId && <h1>You are connected ..</h1>}
      <div>
         <h1>You</h1>
      {localStream&&<ReactPlayer url={localStream} playing width='60vw' height='30vh' muted></ReactPlayer>}
      </div>
      
      <div>
         <h1>Your Friend</h1>
         {remoteStream &&<ReactPlayer url={remoteStream} playing width='60vw' height='30vh'></ReactPlayer>}
      </div>
      <Modal isOpen={incomingCall} onClose={()=>setIsOpen(false)} title="Incoming call">
        {modalContent}
        {footer}
    </Modal> 
    <button type="button" className="btn btn-success" onClick={handleCallUser}>Call</button>
    {localStream&&<button onClick={sendStream}>send stream</button>}
    </div>
 )
}