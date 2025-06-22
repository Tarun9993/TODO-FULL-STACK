import React, { useState } from 'react'
import {
  Card,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
const Register = () => {
  const navigate = useNavigate()
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""

  })
  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:8080/auth/register', data)
      if (res.status === 200) {
        toast.success("Successfully Registered", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored"
        });
        navigate("/login")
      } else {
        toast.error("Login failed", {
          position: "top-right",
          autoClose: 3000,
          theme: "dark"
        });
      }
    } catch (err) {
      console.error(err)
      alert("Something went wrong ⚠️")
    }

  }
  return (
    <div className='flex justify-center'>
      <Card className="w-1/4 mt-20 py-10">
        <form onSubmit={handleSubmit}>
          <h1 className=' text-center font-bold text-2xl tracking-wider font-serif mb-3'>Register</h1>
          <CardHeader>
            <Input type="name"
              name="name"
              className="border-1 border-black"
              placeholder="Enter Name..."
              onChange={handleChange}
              value={data.name}
              required
            />
            <Input type="email"
              name="email"
              className="mt-3 border-1 border-black"
              placeholder="Enter Email..."
              onChange={handleChange}
              value={data.email}
              required
            />
            <Input type="password" name="password" className="mt-3 border-1 border-black" placeholder="Enter Password..." required onChange={handleChange} value={data.password} />

          </CardHeader>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full mt-4 cursor-pointer">Register</Button>
            <p className="text-sm mt-4 text-gray-600">
              Already have an account?
              <Link to="/login">
                <span className="text-blue-500 hover:underline ml-1">Login</span>
              </Link>
            </p>
          </CardFooter>
        </form>

      </Card>
    </div>
  )
}

export default Register
