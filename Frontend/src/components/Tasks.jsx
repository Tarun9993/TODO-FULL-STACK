import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from "@/components/ui/card"
import { Input } from './ui/input'
import { Button } from './ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import AddTask from './AddTask'
import UpdateTaskDialog from './UpdateTaskDialog'
import { toast } from 'react-toastify'
const Tasks = () => {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await axios.get("http://localhost:8080/task/my", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setData(res.data)
      console.log(res.data)
    } catch (err) {
      console.error("Error fetching tasks:", err)
      setData("Unauthorized ❌")
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/login")
    } else {
      fetchData()
    }
  }, [])

  const handleStatusChange = async (id, value) => {
    const completed = value === "completed";
    try {
      const token = localStorage.getItem("token");

      await axios.put(`http://localhost:8080/task/update-status/${id}`,
        { completed },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }

  if (typeof data === "string") {
    return (
      <div className="text-center text-red-500 mt-10 text-xl font-bold">
        {data}
      </div>
    )
  }

  const handleDelete = async (id) => {

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/task/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })
      toast.success("Task Deleted", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark"
      });
      fetchData();
    } catch (error) {
      console.log("Delete Error : ", error);
      toast.error("Failed to Delete", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark"
      });
    }
    console.log(id);

  }

  return (
    <div className="mt-10 ">
      <h1 className="text-3xl font-bold text-center mb-6">My Tasks</h1>
      <div className='flex mb-10 mx-30 justify-between '>
        <Input
          type="text"
          placeholder="Search tasks..."
          className="mb-6 w-1/3 border-1 border-black"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <AddTask onTaskAdded={fetchData} />

      </div>
      <div className="flex flex-wrap justify-start gap-6 px-20">
        {data
          .filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.priority.toLowerCase().includes(searchTerm.toLowerCase())
          ).length === 0 ? (
          <p className="text-center text-gray-500 text-lg font-semibold w-full mt-10">
            No tasks found.
          </p>
        ) : (
          data
            .filter((item) =>
              item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
              item.priority.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((item, index) => (
              <div key={index} className="w-full md:w-[calc(50%-0.75rem)] mb-10">
                <Card className="p-6 shadow-md h-full min-h-[220px]">
                  <h2 className="text-xl font-bold text-gray-800 underline tracking-wide">
                    {item.name}
                  </h2>

                  <p className="text-gray-600 text-sm font-medium mt-2">Description:</p>
                  <Input value={item.description} readOnly className="mt-1" />

                  <div className="flex items-center justify-between gap-3 mt-4">
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className={
                          item.priority === "HIGH"
                            ? "bg-red-200 text-red-800"
                            : item.priority === "MEDIUM"
                              ? "bg-yellow-200 text-yellow-800"
                              : "bg-green-200 text-green-800"
                        }
                      >
                        {item.priority}
                      </Button>

                      <Select
                        onValueChange={(value) => handleStatusChange(item.id, value)}
                        defaultValue={item.completed ? "completed" : "pending"}
                      >
                        <SelectTrigger
                          className={`w-[120px] ${item.completed
                              ? "bg-green-200 text-green-800"
                              : "bg-yellow-200 text-yellow-800"
                            }`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-3">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button className="cursor-pointer">Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your Task and remove your data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                            <AlertDialogAction className="cursor-pointer" onClick={() => handleDelete(item.id)}>
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <UpdateTaskDialog task={item} onTaskUpdated={fetchData} />
                    </div>
                  </div>
                </Card>
              </div>
            ))
        )}
      </div>

    </div>
  )
}

export default Tasks
