import React, { useEffect } from 'react'
import { useChatStore } from '../Store/UseChatStore'
import { XIcon } from 'lucide-react';
import NoConversationPlaceHolder from './NoConversationPlaceHolder';
import { useAuthStore } from '../Store/UseAuthStore';

const ChatHeader = () => {
    const {selectedUser, setSelectedUser} = useChatStore();
    const {onlineUsers} = useAuthStore();
    
    const isOnline = onlineUsers.includes(selectedUser._id)


    useEffect(() => {
        const handelEscape = (e)=>{
            if(e.key == "Escape") setSelectedUser(null)
        }
        window.addEventListener("keydown", handelEscape)

        return window.removeEventListener("keydown", handelEscape)
    }, [selectedUser])
    
  return (
    <div className='flex justify-between items-center bg-slate-800/50 border-b border-slate-700/50 max-h-[84px] px-6 flex-1 '>
        <div className='flex item-center space-x-3'>
            <div className={`avatar ${isOnline ? "online" : "offline"}`}>
            <div className='rounded-full w-12'>
                <img src={`${selectedUser.profilePic || "/avatar.png"}`} alt={selectedUser.fullName} />
            </div>
        </div>

        <div>
            <h3 className='text-slate-200 font-medium'>{selectedUser.fullName}</h3>
            <p className='text-slate-400 text-sm'>{`${isOnline ? "online" : "offline"}`}</p>
        </div>
        </div>

        <button onClick={()=> setSelectedUser(null) }>
            <XIcon className='w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer ' />
        </button>
        
    </div>
  )
}

export default ChatHeader