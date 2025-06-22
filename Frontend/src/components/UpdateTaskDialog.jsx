import React, { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'react-toastify';

const UpdateTaskDialog = ({ task, onTaskUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: ''
  });

  useEffect(() => {
    if (task) {
      setFormData({
         id: task.id,
        name: task.name,
        description: task.description,
        priority: task.priority
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePriorityChange = (value) => {
    setFormData(prev => ({ ...prev, priority: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`http://localhost:8080/task/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.status === 200) {
        toast.success("Task Updated", {
         position: "top-right",
         autoClose: 3000,
         theme: "dark"
       });
        onTaskUpdated(); // refresh task list
      } else {
        toast.error("Update failed", {
         position: "top-right",
         autoClose: 3000,
         theme: "dark"
       });
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="cursor-pointer">Update</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <form onSubmit={handleSubmit}>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Task</AlertDialogTitle>
            <Input
              className="my-2 border-1 border-black"
              placeholder="Task Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <Textarea
              className="my-2 border-1 border-black"
              placeholder="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
            <Select onValueChange={handlePriorityChange} defaultValue={formData.priority}>
              <SelectTrigger className="w-[180px] my-2 border-1 border-black">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
              </SelectContent>
            </Select>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 ">
            <AlertDialogCancel className="border-1 border-black">Cancel</AlertDialogCancel>
            <AlertDialogAction type="submit">Save</AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UpdateTaskDialog;
