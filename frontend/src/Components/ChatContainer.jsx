import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../Store/UseChatStore'
import { useAuthStore } from '../Store/UseAuthStore';
import ChatHeader from './ChatHeader';
import NoChatHistoryPlaceHolder from './NoChatHistoryPlaceHolder';
import Loader from "./Loader"
import MessageLoadingSkeleton from './MessageLoadingSkeleton';
import MessageInput from './MessageInput';

const ChatContainer = () => {
  const {messages, selectedUser, getMessagesByUserId, isMessageLoading, subscribeToMessage, unSubscribeToMessages} = useChatStore();
  const {authUser} = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if(messageEndRef.current){
      messageEndRef.current.scrollIntoView({behavior: "smooth"})
    }
  }, [messages])
  

  useEffect(() => {
    if (!selectedUser?._id) return;
    getMessagesByUserId(selectedUser._id);
    
    subscribeToMessage();

    return () => unSubscribeToMessages();
  }, [selectedUser._id])
  
  return (
    <>
      <ChatHeader />
      <div className='chat-scroll flex-1 px-6 overflow-y-auto py-8'>
          {messages.length > 0 && !isMessageLoading
          ?(
            <div className='max-w-3xl mx-auto space-y-6'>
              {messages.map((msg)=>(
                <div 
                key={msg._id || msg.createdAt}
                className={`chat ${msg.senderId === authUser?._id ? "chat-end" : "chat-start"}`}
                >
                  <div className={`chat-bubble relative ${msg.senderId === authUser?._id ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-200"}`}>
                    {
                      msg.image && (
                      <img src={msg.image} alt="shared" className='rounded-lg h-48 object-cover'  />
                    )}
                    {msg.text && <p className='mt-2'>{msg.text}</p>}
                    <p className={`text-xs mt-1 opacity-75 flex items-center gap-1 ${msg.senderId === authUser?._id ? "justify-end" :"justify-start"}`}>
                      {new Date(msg.createdAt).toLocaleTimeString(undefined,{
                        "hour":"2-digit",
                        "minute":"2-digit"
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messageEndRef}/>
            </div>
          ) :isMessageLoading ? <MessageLoadingSkeleton />
          :(
            <NoChatHistoryPlaceHolder />
          )
        }
      </div>
      <MessageInput />
    </>
  )
}

export default ChatContainer