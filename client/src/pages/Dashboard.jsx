import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../slices/authSlice';
import { useDispatch } from 'react-redux';

const Dashboard = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = () => {
        dispatch(logout());   
        navigate("/login");   
    };

    return (
        <div className='bg-black text-white p-2'>
            <div className="container flex justify-between items-center">
                <div className="logo">
                    <h1 className='text-4xl tracking-tighter'>MERN AUTH</h1>
                </div>
                <div className="auth-links">
                    <button onClick={logoutHandler} className='px-5 py-1 bg-transparent text-white border border-white rounded-2xl cursor-pointer'>Logout</button>
                </div>
            </div>

        </div>
    )
}

export default Dashboard