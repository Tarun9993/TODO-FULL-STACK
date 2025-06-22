import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Footer from './components/Footer'
import { Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Tasks from './components/Tasks'
import Register from './components/Register'
import AddTask from './components/AddTask'
import { ToastContainer } from 'react-toastify'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  return (
    <div className='bg-[#F5F7F8]  min-h-screen flex flex-col'>
      <Navbar user={user} />
      <div className='flex-grow'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tasks" element={<Tasks user={user} />} />
          {/* <Route path="/add-task" element={<AddTask />} /> */}
        </Routes>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  )
}

export default App
