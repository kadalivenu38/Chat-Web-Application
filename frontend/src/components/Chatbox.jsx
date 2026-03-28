import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import Message from './Message'
import toast from 'react-hot-toast'

const Chatbox = () => {
  const { selectedChat, theme, axios, user, token, fetchUserChats } = useAppContext()
  
  const containerRef = useRef(null)

  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [mode, setMode] = useState("text")
  const [isPublished, setIsPublished] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    
    if (!prompt.trim()) {
      toast.error('Please enter a prompt')
      return
    }

    if (!user) {
      toast.error('Please login first')
      return
    }

    if (user.credits < 1) {
      toast.error('Insufficient credits. Please purchase credits.')
      return
    }

    if (mode === 'image' && user.credits < 2) {
      toast.error('Image generation requires 2 credits. You have ' + user.credits)
      return
    }

    setLoading(true)
    const currentPrompt = prompt
    setPrompt("")

    try {
      const endpoint = mode === 'text' ? '/message/text' : '/message/image'
      
      const { data } = await axios.post(endpoint, {
        chatId: selectedChat._id,
        prompt: currentPrompt,
        isPublished: isPublished && mode === 'image'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      // Update messages locally with user and assistant messages
      const userMessage = { 
        role: 'user', 
        content: currentPrompt, 
        timestamp: Date.now(), 
        isImage: false 
      }
      
      setMessages(prev => [...prev, userMessage, data.reply])
      
      // Update selected chat with new messages
      if (selectedChat) {
        selectedChat.messages = [...(selectedChat.messages || []), userMessage, data.reply]
      }

      // Refresh user data to get updated credits and chats
      await fetchUserChats()

      setIsPublished(false)
      toast.success(`${mode === 'image' ? 'Image' : 'Message'} generated successfully!`)
    } catch (err) {
      console.error(err)
      
      if (err.response?.status === 429) {
        toast.error('Rate limit exceeded. Please try again in a few seconds.')
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message)
      } else {
        toast.error(err.message || 'Failed to generate response. Please try again.')
      }
      
      // Restore prompt on error
      setPrompt(currentPrompt)
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{
    if(selectedChat){
      setMessages(selectedChat.messages || [])
    }
  }, [selectedChat])

  useEffect(()=>{
    if(containerRef.current){
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth"
      })
    }
  }, [messages])

  return (
    <div className='flex-1 flex flex-col justify-between md:m-3 xl:mx-20 max-md:mt-14'>
      {/* Chat messages */}
      <div ref={containerRef} className='flex-1 mb-5 overflow-y-scroll'>
        {messages.length === 0 && (
          <div className='h-full flex flex-col items-center justify-center gap-2 text-primary'>
            <img src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark} className='w-full max-w-56 sm:max-w-68' alt="" />
            <p className='mt-5 text-4xl sm:text-6xl text-center text-gray-400 dark:text-white'>Ask me anything...</p>
          </div>
        )}

        {messages.map((message, index)=> <Message key={index} message={message} />)}

        {/* Loading animation */}
        {
          loading && <div className='loader flex items-center gap-1.5'>
            <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
            <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
            <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
          </div>
        }
      </div>

      {mode === 'image' && (
        <label className='inline-flex items-center gap-2 mb-2 text-sm mx-auto'>
          <p className='text-xs'>Publish Generated Image to Community</p>
          <input type="checkbox" className='cursor-pointer' checked={isPublished} onChange={(e)=>setIsPublished(e.target.checked)} />
        </label>
      )}

      {/* Prompt input box */}
      <form onSubmit={onSubmit} className='bg-primary/20 dark:bg-[#583C79]/30 border border-primary
        dark:border-[#80609F]/30 rounded-full w-full max-w-4xl p-1 mx-auto flex gap-2 items-center'>
        <select onChange={(e)=> setMode(e.target.value)} value={mode} disabled={loading} className='text-md py-2 px-2.5 outline-none
          rounded-[25px] hover:bg-purple-400 dark:hover:bg-purple-600 cursor-pointer disabled:opacity-50'>
          <option className='dark:bg-gray-800 bg-gray-300' value="text">Text</option>
          <option className='dark:bg-gray-800 bg-gray-300' value="image">Image</option>
        </select>
        <input type="text" placeholder='Type your prompt here...' value={prompt} onChange={(e)=> setPrompt(e.target.value)}
          disabled={loading} className='flex-1 w-full text-md outline-none [word-spacing:1px] disabled:opacity-50' required />
        <button disabled={loading} type="submit">
          <img src={loading ? assets.stop_icon : assets.send_icon} className='w-10 cursor-pointer' alt="" />
        </button>
      </form>
    </div>
  )
}

export default Chatbox