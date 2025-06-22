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
import { jwtDecode } from 'jwt-decode'
import { toast } from 'react-toastify'
const Login = ({ setUser }) => {

  const navigate = useNavigate()

  const [data, setData] = useState({
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
      const res = await axios.post('http://localhost:8080/auth/login', data)
      const token = res.data.token
      const decoded = jwtDecode(token)
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(decoded))
      setUser(decoded)
      console.log(decoded);
      toast.success(`Welcome, ${decoded.name || decoded.sub}`, {
        position: "top-right",
        autoClose: 3000,
        theme: "colored"
      });

      navigate("/tasks")

    } catch (err) {
      console.error(err)
      toast.error("Oops! Something went wrong. Try again.", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark"
      });

    }
    console.log(data);

  }
  return (
    <div className='flex justify-center'>
      <Card className="w-1/4 mt-20 py-10">
        <form onSubmit={handleSubmit}>
          <h1 className=' text-center font-bold text-2xl tracking-wider font-serif mb-3'>Login</h1>
          <CardHeader>
            <Input type="email"
              name="email"
              className="border-1 border-black"
              placeholder="Enter Email..."
              onChange={handleChange}
              value={data.email}
              required
            />
            <Input type="password" name="password" className="mt-3 border-1 border-black" placeholder="Enter Password..." required onChange={handleChange} value={data.password} />

          </CardHeader>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full mt-3 cursor-pointer">Login</Button>
            <p className="text-sm mt-3 text-gray-600">
              Don't have an account?
              <Link to="/register">
                <span className="text-blue-500 hover:underline ml-1">Register</span>
              </Link>
            </p>
          </CardFooter>
        </form>

      </Card>
    </div>
  )
}

export default Login
