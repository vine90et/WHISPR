import React from 'react'
import { useChatStore } from '../Store/UseChatStore'

const ActiveTabSwitch = () => {
  const {activeTab, setActiveTab} = useChatStore();
  return (
    <div className='tabs tabs-boxed bg-transparent p-2 m-2 flex justify-evenly'>
      <button 
      onClick={()=> setActiveTab("Chats")}
      className={`tab text-lg w-1/2 ${
        activeTab === "Chats" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400" 
      }`} 
      >
        Chats
      </button>
      <button
      onClick={()=> setActiveTab("Contacts")}
      className={`tab text-lg w-1/2 ${
        activeTab === "Contacts" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400" 
      }`}
      >
        Contacts
      </button>
    </div>
  )
}

export default ActiveTabSwitch