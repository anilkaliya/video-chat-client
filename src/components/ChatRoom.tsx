import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../context/socketProviders";
import ReactPlayer from "react-player";
import peer from '../service/peer'
export const ChatRoom=()=>{
    const params = useParams();
    const roomId = params.roomId as string;
    const socket = useSocket()
    const [remoteSocketId,setRemoteSocketId]=useState(null)
    const[localStream,setLocalStream]=useState<any>(null)
    const[remoteStream,setRemoteStream]=useState<any>(null)
    useEffect(()=>{
      socket.emit("room:join",{room:roomId})
  
},[])
const handleJoinRoom=(data:any)=>{
    console.log("room,joined with id",data.room)
}
 useEffect(()=>{
   socket.on("room:join",handleJoinRoom)
   return ()=>{
      socket.off("room:join",handleJoinRoom)
   }
 },[socket,handleJoinRoom])

 const handleUserJoined=(data:any)=>{
  setRemoteSocketId(data.socketId)
 }
 
 const handleIncomingCall=useCallback(async (data:any)=>{
   const {from,offer}=data
   setRemoteSocketId(from)
   const stream=await navigator.mediaDevices.getUserMedia({video:true,audio:true})
   setLocalStream(stream)
   const answer=await peer.getAnswer(offer)
   socket.emit("call:accepted",{to:from,answer})
   console.log("incoming call",offer)
 },[socket])

 const sendStream=useCallback(()=>{
   for (const track of localStream.getTracks()){
      if(peer.peer){
         peer.peer.addTrack(track,localStream)
      }
     
   }
 },[localStream])

 const handleCallAccepted=useCallback(async(data:any)=>{
   console.log("answer",data.answer)
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
      console.log("got tracks")
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
   console.log("final",answer)
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
 return(
    <div>
       you joined room with id {roomId}
      {remoteSocketId && <h1>you are connected</h1>}
      <button onClick={handleCallUser}>Call</button>
      {localStream&&<button onClick={sendStream}>send stream</button>}
      <div>
         <h1>Local stream</h1>
      {localStream&&<ReactPlayer url={localStream} playing width={500} height={500}></ReactPlayer>}
      </div>
      
      <div>
         <h1>Remote streams</h1>
         {remoteStream &&<ReactPlayer url={remoteStream} playing width={500} height={500}></ReactPlayer>}
      </div>
    </div>
 )
}