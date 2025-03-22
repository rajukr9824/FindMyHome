import { useState } from 'react'
import {useSelector} from 'react-redux'
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserFailure, signOutUserStart, signOutUserSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'
import {Link, useNavigate} from 'react-router-dom'
export default function Profile() {
  
  const {currentUser, loading, error}=useSelector((state)=>state.user)
  const [formData, setFormData]=useState({});
  const dispatch=useDispatch();
  const [updateSuccess, setUpdateSuccess]=useState(false);
  const [showListingError, setShowListingError]=useState(false);
  const [userListing, setUserListing]=useState([])
  const navigate=useNavigate();
const handleChange=(e)=>{
  setFormData({...formData, [e.target.id]:e.target.value})
}


const handleSubmit=async(e)=>{
  e.preventDefault();
  try{
   
     dispatch(updateUserStart());
     const res=await fetch(`/api/user/update/${currentUser._id}`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify(formData),
     })
     const data=await res.json();
     
     if(data.success===false){
      dispatch(updateUserFailure(data.message));
      return;
     }
     dispatch(updateUserSuccess(data));
     setUpdateSuccess(true);
    
  }catch(error){
      dispatch(updateUserFailure(error.message))
  }
}
const handleDeleteUser=async()=>{
  try {
    dispatch(deleteUserStart());
    const res=await fetch(`/api/user/delete/${currentUser._id}`,{
      method:'DELETE'
    });
    const data=await res.json();
    if(data.success===false){
      dispatch(deleteUserFailure(data.message));
      return;
    }
    dispatch(deleteUserSuccess(data));
  } catch (error) {
    dispatch(deleteUserFailure(error.message))
  }
}
const handleSignOut=async()=>{
    try {
      dispatch(signOutUserStart())
      const res=await fetch('/api/auth/signout')
      const data=await res.json();
      if(data.success===false){
        dispatch(signOutUserFailure(data.message))
        return;
      }
      dispatch(signOutUserSuccess(data));
      navigate('/sign-in'); 
    } catch (error) {
      dispatch(signOutUserFailure(data.message))
    }
}
const handleShowListing=async()=>{
  try {
    const res=await fetch(`/api/user/listing/${currentUser._id}`);
    const data=await res.json();
    if(data.success===false){
      setShowListingError(true);
      return;
    }
    setUserListing(data)
  } catch (error) {
    setShowListingError(true)
  }
}
console.log(userListing);

const handleListingDelete=async(listingId)=>{
  try {
    const res=await fetch(`/api/listing/delete/${listingId}`,{
      method:'DELETE',
    })
    const data=await res.json();
    if(data.success===false){
      console.log(data.message);
      return;
    }
    setUserListing((prev)=>prev.filter((listing)=>listing._id!==listingId))
  } catch (error) {
    console.log(error.message);
    
  }
}
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
       
        <img src={currentUser.avatar} alt="profilepic" className='rounded-full h-24 w-24 object-cover self-center mt-2' />
        <input type="text" placeholder='username' id='username' defaultValue={currentUser.username} onChange={handleChange} className='border p-3 rounded-lg'/>
        <input type="email" placeholder='email' id='email' defaultValue={currentUser.email} onChange={handleChange} className='border p-3 rounded-lg'/>
        <input type="password" placeholder='password' id='password' onChange={handleChange} className='border p-3 rounded-lg'/>
        <button disabled={loading} className='bg-slate-800 text-white p-3 rounded-lg uppercase hover:opacity-75 disabled:opacity-80'>{loading?'Loading...':'Update'}</button>
         <Link className='bg-green-800 text-white p-3 rounded-lg uppercase text-center hover:opacity-85' to={"/create-listing"}>Create Listing</Link>
      </form>
      <div className='flex justify-between mt-5'>
        <button onClick={handleDeleteUser} className='text-white bg-red-600 p-3 rounded-lg cursor-pointer hover:opacity-75'>Delete account</button>
        <button onClick={handleSignOut} className='bg-blue-900 text-white p-3 rounded-lg cursor-pointer hover:opacity-75'>Sign out</button>
      </div>
      <p className='text-red-700 mt-5'>{error?error:''}</p>
      <p className='text-green-800 mt-5'>{updateSuccess?'User is updated successfully!':''}</p>
      <button onClick={handleShowListing} className='text-green-800 font-bold border bg-gray-300 rounded-lg p-3 uppercase hover:opacity-75 w-full'>Show Listing</button>
      <p className='text-red-700 mt-5'>{showListingError ? 'Error showing listing':''}</p>
      {userListing && userListing.length>0 && (
           <div className='flex flex-col gap-4'>
            <h1 className='text-center text-2xl mt-7 font-semibold'>Your listings</h1>
         {userListing.map((listing)=>(
          <div key={listing._id} className='border rounded-lg p-3 flex justify-between items-center gap-4'>
            <Link to={`/listing/${listing._id}`}>
              <img src={listing.imageUrls[0]} alt="listing cover" className='h-16 w-16 object-contain'/>
            </Link>
            <Link className='flex-1' to={`/listing/${listing._id}`}>
            <p className='text-slate-700 font-semibold flex-1 hover:underline truncate'>{listing.name}</p>
            </Link>
              <div className='flex flex-col items-center'>
                <button onClick={()=>handleListingDelete(listing._id)} className='text-red-700 uppercase'>Delete</button>
                <Link to={`/update-listing/${listing._id}`}>
                <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
          </div>
         ))}</div>
      )}
    </div>
  )
}
