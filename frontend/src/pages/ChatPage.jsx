import React from 'react'
import { useAuthStore } from '../Store/UseAuthStore'
import { useChatStore } from '../Store/UseChatStore'
import BoarderAnimatedContainer from "../Components/BoarderAnimatedContainer"
import ProfileHeader from '../Components/ProfileHeader'
import ActiveTabSwitch from '../Components/ActiveTabSwitch'
import ContactList from "../Components/ContactList"
import ChatContainer from "../Components/ChatContainer"
import NoConversationPlaceHolder from "../Components/NoConversationPlaceHolder"
import ChatsList from '../Components/ChatsList'

const ChatPage = () => {
  const {activeTab, selectedUser} = useChatStore();
  return (
    <div className='relative w-full max-w-6xl h-[650px] '>
      <BoarderAnimatedContainer>
        {/*LEFT SIDE */}
        <div className={`
              ${selectedUser ? "hidden md:flex" : "flex"}
              w-full md:w-80
              bg-slate-800/50
              backdrop-blur-sm
              flex-col
            `}>
          <ProfileHeader />
          <ActiveTabSwitch />
          <div className='chat-scroll flex-1 overflow-y-auto p-4 space-y-4'> 
            {activeTab === "Chats" ? <ChatsList /> : <ContactList />}
          </div>
        </div> 
        
        {/*RIGHT SIDE*/}
        <div className={`
              ${selectedUser ? "flex" : "hidden md:flex"}
              flex
              flex-1
              flex-col
              bg-slate-900/50
              backdrop-blur-sm`} >
          {selectedUser ? <ChatContainer />: <NoConversationPlaceHolder />}
        </div>
      </BoarderAnimatedContainer>
    </div>
  )
}

export default ChatPage