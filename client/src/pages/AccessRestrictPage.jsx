import React from 'react'
import { useNavigate } from 'react-router-dom'

const AccessRestrictPage = () => {

    const navigate = useNavigate();

  return (
    <div className='min-h-screen w-full flex justify-center items-center'>
        <div className="container">
            <div className="content-section flex flex-col justify-center items-center">
                <h1 className='text-6xl text-red-500'>Access Restricted</h1>
                <p className='text-lg text-black'>You are not allowed to access this page</p>
                <a onClick={() => navigate('/login')} className='px-4 py-2 mt-4 cursor-pointer hover:bg-red-500 hover:text-white transition-colors text-md border bg-transparent text-black rounded-md'>Go Back</a>
            </div>
        </div>
    </div>
  )
}

export default AccessRestrictPage