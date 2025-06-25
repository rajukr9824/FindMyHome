import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInFailure, signInSuccess } from '../redux/user/userSlice';

export default function Signin() {
  const [formData, setFormData]=useState({});
  const {loading, error}=useSelector((state)=>state.user)
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const changeHandle=(e)=>{
      setFormData({
        ...formData,
        [e.target.id]:e.target.value,
      })
  }
  const submitHandle=async(e)=>{
    e.preventDefault();
    try {
      dispatch(signInStart())
      const res=await fetch('/api/auth/signin', {
          method: 'POST',
          headers:{
            'Content-Type':'application/json',
          },
          body: JSON.stringify(formData),
        });
        const data=await res.json();
        if(data.success===false){
          dispatch(signInFailure(data.message))
          return;
        }
        dispatch(signInSuccess(data))
        navigate('/')
       console.log(data); 
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
   
  }

  
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={submitHandle} className='flex flex-col gap-4'>
        
        <input type="email" placeholder='Enter Email' className='border p-3 rounded-lg' id='email' onChange={changeHandle}/>
        <input type="password" placeholder='Enter Password' className='border p-3 rounded-lg' id='password' onChange={changeHandle}/>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading?'Loading...':'Sign in'}</button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Don't have an account?</p>
        <Link to={"/sign-up"}>
        <span className='text-blue-700'>Sign up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p> }
    </div>
  )
}
