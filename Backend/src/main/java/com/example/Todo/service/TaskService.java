// ✅ Secure TaskService implementation using only one class
package com.example.Todo.service;

import com.example.Todo.entity.Task;
import com.example.Todo.entity.User;
import com.example.Todo.repository.TaskRepository;
import com.example.Todo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

    public List<Task> getTasksByEmail(String email) {
        User user = userRepository.findByEmail(email);
        return taskRepository.findByUser(user);
    }

    public Task addTaskForUser(String email, Task task) {
        User user = userRepository.findByEmail(email);
        task.setUser(user);
        return taskRepository.save(task);
    }

    public boolean deleteTaskByEmail(String email, Long taskId) {
        User user = userRepository.findByEmail(email);
        Task task = taskRepository.findByIdAndUser(taskId, user);
        if (task != null) {
            taskRepository.delete(task);
            return true;
        }
        return false;
    }

    public boolean updateTaskByEmail(String email, Task updatedTask) {
        User user = userRepository.findByEmail(email);
        Task existing = taskRepository.findByIdAndUser(updatedTask.getId(), user);
        if (existing != null) {
            existing.setName(updatedTask.getName());
            existing.setDescription(updatedTask.getDescription());
            existing.setCompleted(updatedTask.isCompleted());
            existing.setPriority(updatedTask.getPriority());
            taskRepository.save(existing);
            return true;
        }
        return false;
    }
}
