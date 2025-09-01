import React, { useState } from "react";
import { registerForm } from "../slices/authSlice";
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner";
import PacmanLoader from "react-spinners/PacmanLoader";
import { ClipLoader } from "react-spinners";

const Register = () => {

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!form.name || !form.email || !form.password) {
        toast.error("Please fill all the fields");
        return;
      }
      const data = await dispatch(registerForm(form)).unwrap();
      toast.success(data.message)
      setForm({
        name: "",
        email: "",
        password: ""
      })
    } catch (error) {
      console.log(error, "message form register")
      toast.error(error);
    }
    console.log(form, "from register jsx");

  }

  return (

    <div className="register-container min-h-screen flex justify-center items-center bg-gradient-to-r from-[#0095D8]  to-[#0259AB] p-6">
      {
        loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
            <ClipLoader color="#ffffff" size={25} />
          </div>
        )
      }
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="inner p-8">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Create your account
          </h3>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0259AB] focus:outline-none"
                value={form.name}
                name="name"
                onChange={handleChange}
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
                value={form.email}
                name="email"
                onChange={handleChange}
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
                name="password"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className={`${loading ? " bg-gray-400 text-white cursor-not-allowed" : "bg-[#0259AB] text-white  hover:bg-[#0978e0] cursor-pointer"}  w-full py-3 font-semibold rounded-xl transition-colors duration-300`}
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
