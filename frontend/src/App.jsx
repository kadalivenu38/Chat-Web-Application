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
import { useAppContext } from './context/AppContext'
import { Toaster } from 'react-hot-toast';

function App() {
  const {user, loadingUser} = useAppContext()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const {pathname} = useLocation()

  if(pathname === '/loading' || loadingUser){
    return <Loading />
  }

  return (
    <>
      <Toaster />
      {!isMenuOpen && <img src={assets.menu_icon} className='absolute top-3 left-3 w-8 h-8 cursor-pointer
        md:hidden not-dark:invert' onClick={()=> setIsMenuOpen(true)} />}
      {user ? (
        <div className='dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white'>
          <div className='flex h-screen w-screen'>
            <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            <Routes>
              <Route path='/' element={<Chatbox />} />
              <Route path='/credits' element={<Credits />} />
              <Route path='/community' element={<Community />} />
            </Routes>
          </div>
        </div>
      ) : (
        <div className='bg-gradient-to-b from-[#7B1FA2] to-[#C0C0C0] flex items-center justify-center h-screen w-screen'>
          <Login />
        </div>
      )}
    </>
  )
}

export default App