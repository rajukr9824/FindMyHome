import React, { useState } from 'react';
import {useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';
export default function CreateListing() {
    const navigate=useNavigate()
    const {currentUser}=useSelector(state=>state.user)
    const [imageUrls, setImageUrls] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [error, setError]=useState(false);
    const [loading, setLoading]=useState(false)
    const [formData, setFormData] = useState({
        imageUrls: [],
        name:'',
        description:'',
        address:'',
        type:'rent',
        bedrooms:1,
        bathrooms:1,
        regularPrice:1000,
        discountPrice:0,
        offer:false,
        parking:false,
        furnished:false,
    });
    console.log(formData);

    const handleImageSubmit = () => {
        if (imageUrl) {
            setImageUrls((prev) => [...prev, imageUrl]);
            setFormData((prev) => ({
                ...prev,
                imageUrls: [...prev.imageUrls, imageUrl],
            }));
            setImageUrl('');
        }
    };

    const handleDeleteImage = (index) => {
        const updatedImages = imageUrls.filter((_, i) => i !== index);
        setImageUrls(updatedImages);
        setFormData({ ...formData, imageUrls: updatedImages });
    };
    const handleChange=(e)=>{
        if(e.target.id==='sale' || e.target.id==='rent'){
            setFormData({
                ...formData,
                type:e.target.id
            })
        }
        if(e.target.id==='parking' || e.target.id==='furnished' || e.target.id==='offer'){
            setFormData({
                ...formData,
                [e.target.id]:e.target.checked
            })
        }
        if(e.target.type==='number' || e.target.type==='text' || e.target.type==='textarea'){
            setFormData({
                ...formData,
                [e.target.id]:e.target.value
            })
        }
    }
    
    const handleSubmit=async(e)=>{
        e.preventDefault();
        try {
            if(formData.imageUrls.length<1) return setError('You must upload at least one image')
            if(+formData.regularPrice< +formData.discountPrice) return setError('Discount price must be lower than regular price')
            setLoading(true);
            setError(false);
            const res=await fetch( '/api/listing/create',{
                 method:'POST',
                 headers:{
                    'Content-Type':'application/json',
                 },
                 body:JSON.stringify({
                    ...formData,
                    userRef: currentUser._id
            }),
            });
            const data=await res.json();
            setLoading(false);
            if(data.success===false){
                setError(data.message)
            }
            navigate(`/listing/${data._id}`)
        } catch (error) {
            setError(error.message);
            setLoading(false)
        }
    }    

    return (
        <main className='p-6 max-w-4xl mx-auto'>
            <h1 className='text-4xl font-bold text-center my-6 text-gray-800'>Create a Listing</h1>
            <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-6'>
                <div className='flex flex-col gap-4 flex-1'>
                    <input type="text" placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength='62' minLength='10' onChange={handleChange} value={formData.name} required />
                    <textarea placeholder='Description' className='border p-3 rounded-lg' id='description' onChange={handleChange} value={formData.description} required />
                    <input type="text" placeholder='Address' className='border p-3 rounded-lg' id='address' onChange={handleChange} value={formData.address} required />
                    <div className='flex flex-wrap gap-6'>
                        <div className='flex items-center gap-2'>
                            <input type="checkbox" id='sale' className='w-5' onChange={handleChange} checked={formData.type==='sale'} />
                            <span>Sell</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type="checkbox" id='rent' className='w-5' onChange={handleChange} checked={formData.type==='rent'}/>
                            <span>Rent</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type="checkbox" id='parking' className='w-5' onChange={handleChange} checked={formData.parking}/>
                            <span>Parking spot</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type="checkbox" id='furnished' className='w-5' onChange={handleChange} checked={formData.furnished}/>
                            <span>Furnished</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type="checkbox" id='offer' className='w-5' onChange={handleChange} checked={formData.offer}/>
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-6'>
                        <div className='flex items-center gap-2'>
                            <input type="number" id='bedrooms' min='1' max='10' required className='p-3 border rounded-lg w-full ' onChange={handleChange} value={formData.bedrooms}/>
                            <p>Beds</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type="number" id='bathrooms' min='1' max='10' required className='p-3 border rounded-lg w-full' onChange={handleChange} value={formData.bathrooms} />
                            <p>Baths</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input type="number" id='regularPrice' min='1000' max='30000' required className='p-3 border rounded-lg w-full' onChange={handleChange} value={formData.regularPrice}/>
                            <div className='flex flex-col items-center'>
                                <p>Regular price</p>
                                <span className='text-xs'>₹ / month</span>
                            </div>
                        </div>
                        {formData.offer && (
                        <div className='flex items-center gap-2'>
                            <input type="number" id='discountPrice' min='0' required className='p-3 border rounded-lg w-full' onChange={handleChange} value={formData.discountPrice}/>
                            <div className='flex flex-col items-center'>
                                <p>Discounted price</p>
                                <span className='text-xs'>₹ / month</span>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
                <div className='flex flex-col flex-1 gap-4'>
                    <p className='font-semibold text-lg'>Images:
                        <span className='font-normal text-gray-600 ml-2 text-sm'>Provide multiple image URLs</span>
                    </p>
                    <div className='flex gap-4'>
                        <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className='p-3 border rounded-lg w-full focus:ring focus:ring-blue-300' type="text" id='imageUrl' placeholder='Enter Image URL' />
                        <button type='button' onClick={handleImageSubmit} className='p-3 text-white uppercase bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md transition-all'>Upload</button>
                    </div>
                    <div className='grid grid-cols-3 gap-4 mt-4'>
                        {imageUrls.map((url, index) => (
                            <div key={index} className='relative group'>
                                <img src={url} alt={`Uploaded ${index}`} className='w-32 h-32 object-cover rounded-lg border shadow-md' />
                                <button onClick={() => handleDeleteImage(index)} className='absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all'>X</button>
                            </div>
                        ))}
                    </div>
                    <button disabled={loading} className='p-3 bg-green-700 text-white rounded-lg uppercase hover:bg-green-800 shadow-lg transition-all'>
                       {loading?'Creating...':'Create listing'}
                    </button>
                    {error && <p className='text-red-700 text-sm'>{error}</p>}
                </div>
            </form>
        </main>
    );
}