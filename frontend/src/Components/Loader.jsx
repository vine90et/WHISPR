import React from 'react'
import {LoaderIcon} from "lucide-react"

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-md flex justify-center items-center z-50 ">
        <LoaderIcon className="size-10 animate-spin " />
    </div>
  )
}

export default Loader