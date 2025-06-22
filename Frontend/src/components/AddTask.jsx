import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddTask = ({ onTaskAdded }) => {
  const [data, setData] = useState({
    name: "",
    description: "",
    priority: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handlePriorityChange = (value) => {
    setData((prevData) => ({
      ...prevData,
      priority: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:8080/task/add", data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.status === 200) {
        toast.success("Task Added", {
          position: "top-right",
          autoClose: 3000,
          theme: "dark"
        });
        setData({ name: "", description: "", priority: "" }); // clear form
        if (onTaskAdded) onTaskAdded(); // refresh task list
      } else {
        toast.error("⚠️ Oops! Something went wrong. Try again.", {
          position: "top-right",
          autoClose: 3000,
          theme: "dark"
        });
      }
    } catch (error) {
      console.error("Add task error:", error);
      toast.error("⚠️ Failed to add Task.", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark"
      });
    }
  };

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button>Add New Task</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <form onSubmit={handleSubmit}>
            <AlertDialogHeader>
              {/* <Card className="max-w-full py-10"> */}
              <h1 className='font-black mx-5'>
                New Task
              </h1>
              <Input
                placeholder="Enter Task Name.."
                className="p-5 max-w-[80%] mx-5 my-2 border-1 border-black "
                name="name"
                onChange={handleChange}
                value={data.name}
                required
              />
              <Textarea
                placeholder="Enter Description.."
                className="max-w-[80%] mx-5 my-2 border-1 border-black"
                name="description"
                onChange={handleChange}
                value={data.description}
                required
              />
              <Select onValueChange={handlePriorityChange}>
                <SelectTrigger className="w-[180px] mx-5 my-2 border-1 border-black">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW" className="cursor-pointer">Low</SelectItem>
                  <SelectItem value="MEDIUM" className="cursor-pointer">Medium</SelectItem>
                  <SelectItem value="HIGH" className="cursor-pointer">High</SelectItem>
                </SelectContent>
              </Select>
              {/* </Card> */}
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-3">
              <AlertDialogCancel className="cursor-pointer border-1 border-black">Cancel</AlertDialogCancel>
              <AlertDialogAction className="cursor-pointer" type="submit">
                Add Task
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AddTask;
