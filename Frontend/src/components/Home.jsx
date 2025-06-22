import React from 'react'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <div className='flex gap-10 min-h-[80vh] px-20'>
            <div className='flex flex-col items-center h-[85vh] mt-2  p-4'>
                <h1 className="text-5xl font-bold mb-6 font-serif pt-36 tracking-wider">A simple to do list
                   <br /><span className='text-[#60dc44]'>To manage </span>it all</h1>
            <p className="text-lg text-gray-600 max-w-full ">
                Easily manage your personal tasks, family projects, and
                team’s work all in one place. Trusted by +40M people
            </p>
            <div>
                <Link to="/tasks">
            <Button className="cursor-pointer mt-7 mr-90 px-5 py-5">Add Tour Task</Button>
                 </Link>
            </div>
            </div>
            <div className='pt-30 pl-10 max-w-full '>
                <img src="ss.png" alt="" className='border p-4 shadow-lg bg-white rounded-xl drop-shadow-2xl  '/>
            </div>
        </div>
    )
}

export default Home
