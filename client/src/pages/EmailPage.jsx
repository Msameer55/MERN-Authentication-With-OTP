import React from 'react'

const EmailPage = () => {
    return (
        <div className="email-page min-h-screen flex justify-center items-center bg-gradient-to-r from-[#0095D8]  to-[#0259AB] p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="inner p-8">
                    <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
                        Enter your email for verification
                    </h3>
                    <form className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="hidden text-sm font-medium text-gray-600 mb-1">
                                Enter Email 
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your Email"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0259AB] focus:outline-none"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EmailPage