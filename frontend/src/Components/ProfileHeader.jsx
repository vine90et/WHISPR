import React, { useRef, useState } from 'react'
import { useAuthStore } from '../Store/UseAuthStore'
import { useChatStore } from '../Store/UseChatStore';
import {Loader, LogOutIcon, Volume2Icon , VolumeOffIcon} from "lucide-react"

const mouseClickSound = new Audio("/sound/mouse-click.mp3")

const ProfileHeader = () => {
  const {logout, authUser, updateProfile, isUpdatingProfile} = useAuthStore();
  const {isSoundEnabled, toggleItem} = useChatStore();
  const [selectedImg, setSelectedImg] = useState(null)


  const handelImageUpload = (e)=>{
    const file  = e.target.files[0];
    if(!file) return

    const reader = new FileReader()
    reader.readAsDataURL(file);

    reader.onloadend = async()=>{
      const base64Image = reader.result;
      setSelectedImg(base64Image)
      await updateProfile({profilePic: base64Image})
    }
  }
  const fileInputRef = useRef(null)
  return (
    <div className='p-6 border-b border-slate-700/50'>
      <div className='flex items-center justify-between '>
        <div className='flex items-center gap-3'>
          {/* AVATAR */}
          <div className='avatar online '>
            <div className='size-12 rounded-full overflow-hidden relative group flex items-center justify-center '>
              {!isUpdatingProfile ? <button onClick={()=> fileInputRef.current.click()}>
                <img src={selectedImg || authUser.profilePic || "avatar.png"} alt="" />
                <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity '>
                  <span className='text-white text-xs'>Change</span>
                </div>
              </button>: 
                <div className='flex items-center justify-center'>
                  <Loader className='animate-spin ' />
                </div>
              }
            </div>
            <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef}
            onChange={handelImageUpload}
            className='hidden'
            />
          </div>
          {/*Username & Online */}
          <div>
            <h3 className='text-slate-200 text-base font-medium max-w-[180px] truncate'>{authUser.fullName}</h3>
            <p className='text-sm text-slate-400'>Online</p>
          </div>
        </div>
        {/*LOgout Button*/}
        <div className='gap-4 flex items-center'>
          <button 
          className='text-slate-400 hover:text-slate-200 transition-colors'
          onClick={logout}
          >
            <LogOutIcon />
          </button>
          <button
          className='text-slate-400 hover:text-slate-200 transition-colors'
          onClick={()=>{
            mouseClickSound.currentTime = 0;
            mouseClickSound.play().catch((error) => console.log("audio play failed",error));
            toggleItem()
          }}
          >
            {
              isSoundEnabled?(
                <Volume2Icon  className='size-5'/>
              ):(
                <VolumeOffIcon className='size-5' />
              )
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader