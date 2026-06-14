import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../app/features/authSlice'

const Navbar = () => {
    const {user} = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const logoutuser = () =>{
        dispatch(logout())
        navigate('/')
    }
  
    return (
  <div className='shadow bg-white'>
    <nav className='flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5 text-slate-800 transition-all'>
      <Link to="/">
        <span className="bg-green-600 text-white text-2xl font-bold px-3 py-1 rounded">Resume<span className="text-slate-900">AI</span></span>
      </Link>
      <div className="flex items-center gap-4 text-sm">
        <p className='max-sm:hidden'>Hi, {user?.name}</p>
        <button onClick={logoutuser} className='bg-red-500 hover:bg-red-600 font-semibold border border-gray-300 rounded-2xl px-7 py-1.5'>Logout</button>
      </div>
    </nav>
  </div>
)
}

export default Navbar
