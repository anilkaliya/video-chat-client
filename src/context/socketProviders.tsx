
import React, { createContext, useContext, useMemo} from "react"
import { io} from 'socket.io-client'
import { backendUrl } from "../config"

const SocketContext=createContext<any>(null)

export const useSocket=()=>{
    const socket=useContext(SocketContext)
    return socket
}
export const SocketProvider=(props:any)=>{
    const socket=useMemo(()=>io(backendUrl),[])
 return (
    <SocketContext.Provider value={socket}>{props.children}</SocketContext.Provider>
 )
}