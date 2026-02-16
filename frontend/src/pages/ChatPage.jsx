import React from 'react'
import { useAuthStore } from '../Store/UseAuthStore'

const ChatPage = () => {
  const {logout} = useAuthStore()
  return (
    <div className='z-10'>
      ChatPage
      <button onClick={logout} className='auth-btn'>logout</button>
    </div>
  )
}

export default ChatPage