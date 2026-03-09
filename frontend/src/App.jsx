import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Sidebar from './components/Sidebar'
import Chatbox from './components/Chatbox'
import Credits from './pages/Credits'
import Community from './pages/Community'
import { assets } from './assets/assets'
import './assets/prism.css'
import Loading from './pages/Loading'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const {pathName} = useLocation()

  if(pathName === '/loading'){
    return <Loading />
  }

  return (
    <>
      {!isMenuOpen && <img src={assets.menu_icon} className='absolute top-3 left-3 w-8 h-8 cursor-pointer
        md:hidden not-dark:invert' onClick={()=> setIsMenuOpen(true)} />}
      <div className='dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white'>
        <div className='flex h-screen w-screen'>
          <Sidebar isMenuOpen = {isMenuOpen} setIsMenuOpen = {setIsMenuOpen} />
          <Routes>
            <Route path='/' element={<Chatbox />} />
            <Route path='/login' element={<Login />} />
            <Route path='/credits' element={<Credits />} />
            <Route path='/community' element={<Community />} />
          </Routes>
        </div>
      </div>
    </>
  )
}

export default App
