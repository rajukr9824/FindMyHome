import React, { useEffect, useState } from 'react'
import {FaSearch} from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import {useSelector} from 'react-redux'

export default function Header() {
  const {currentUser} = useSelector(state=>state.user)
  //console.log(currentUser?.avatar);
  const navigate=useNavigate();
   const [searchTerm, setSearchTerm]=useState('')
   const handleSubmit=(e)=>{
    e.preventDefault();
    const urlParams=new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery=urlParams.toString();
    navigate(`/search?${searchQuery}`);
   };
   useEffect(()=>{
    const urlParams=new URLSearchParams(location.search);
    const searchTermFromUrl=urlParams.get('searchTerm');
    if(searchTermFromUrl){
      setSearchTerm(searchTermFromUrl)
    }
   },[location.search])
  return (
    <header className='bg-gray-800 shadow-md'>  
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
            <Link to='/'>
      <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
        <span className='text-orange-500'>Find</span>
        <span className='text-gray-100'>My</span>
        <span className='text-green-500'>Home</span>
      </h1>
      </Link>
      <form onSubmit={handleSubmit} className='bg-gray-600 p-3 rounded-lg flex items-center'>
        <input type="text" placeholder='Search...' className='bg-transparent text-white focus:outline-none w-24 sm:w-64' value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}/>
        <button><FaSearch className='text-white'/></button>
      </form>
      <ul className='flex gap-4'>
        <Link to='/'>
        <li className='hidden sm:inline text-white hover:bg-gray-600 rounded p-2 transition-all duration-[200ms]'>Home</li>
        </Link>
        <Link to='/about'>
        <li className='hidden sm:inline text-white hover:bg-gray-600 rounded p-2 transition-all duration-[200ms]'>About</li>
        </Link>
        <Link to='/profile'>
        { currentUser ?(<img className='rounded-full h-7 w-7 object-cover' src={currentUser?.avatar} alt='profile'/>):(
             <li className='text-white hover:text-gray-500 hover:underline rounded transition-all duration-[200ms]'>Sign in</li>
        )

        }
        </Link>
       
       
      </ul>
      </div>
    </header>
  )
}
