import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import moment from 'moment'
import Markdown from 'react-markdown'
import Prism from 'prismjs'

const Message = ({ message }) => {
  useEffect(()=>{
    Prism.highlightAll()
  }, [message.content])
  
  return (
    <div>
      {message.role === 'user' ? (
        <div className='flex items-start justify-end my-4 gap-2'>
          <div className='flex flex-col gap-2 p-2 px-4 bg-slate-50 dark:bg-[#57317C]/30 
            border border-[#80609F]/30 rounded-md max-w-3xl'>
              <p className='text-lg dark:text-primary [word-spacing:3px]'>{message.content}</p>
              <span className='text-xs text-gray-400 dark:text-[#B1A6C0]'>{moment(message.timestamp).fromNow()}</span>
            </div>
            <img src={assets.user_icon} className='w-8 rounded-full' alt="" />
        </div>
      ) : (
        <div className='inline-flex flex-col gap-2 p-2 px-4 max-w-5xl bg-primary/20
          dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-md my-4 overflow-hidden'>
          {message.isImage ? (
            <img src={message.content} className='w-full max-w-xs mt-2 rounded-md' alt="" />
          ) : (
            <div className='text-lg dark:text-secondary reset-tw [word-spacing:3px]'>
              <Markdown>{message.content}</Markdown>
            </div>
          )}
            <span className='text-xs text-gray-400 dark:text-[#B1A6C0]'>{moment(message.timestamp).fromNow()}</span>
        </div>
      )}
    </div>
  )
}

export default Message