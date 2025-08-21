import React from "react";

const Register = () => {
  return (
    <div className="register-container min-h-screen flex justify-center items-center bg-gradient-to-r from-[#0095D8]  to-[#0259AB] p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="inner p-8">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Create your account
          </h3>
          <form className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0259AB] focus:outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0259AB] focus:outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0259AB] focus:outline-none"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="cursor-pointer w-full py-3 bg-[#0259AB] text-white font-semibold rounded-xl hover:bg-[#0978e0] transition-colors duration-300"
            >
              Register
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-6">
            Already have an account?{" "}
            <a href="#" className="text-[#0259AB] font-medium hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
