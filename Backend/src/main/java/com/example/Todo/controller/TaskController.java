//package com.example.Todo.controller;
//
//import com.example.Todo.entity.Task;
//import com.example.Todo.service.TaskService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/task")
//public class TaskController {
//
//    @Autowired
//    private TaskService taskService;
//
//    @PostMapping("/add")
//    public ResponseEntity<Task> addTask(@RequestBody Task t) {
//        Task save = taskService.addTask(t);
//        return new ResponseEntity<>(save, HttpStatus.OK);
//    }
//
//
//    @GetMapping("/user/{userId}")
//    public ResponseEntity<List<Task>> getTasksByUser(@PathVariable Long userId) {
//        List<Task> tasks = taskService.getAllTasks(userId);
//        return new ResponseEntity<>(tasks, HttpStatus.OK);
//    }
//
//
//
//    @DeleteMapping("/deleteTask/{userId}/{taskId}")
//    public ResponseEntity<String> deleteTask(@PathVariable Long userId, @PathVariable Long taskId) {
//        boolean result = taskService.deleteTaskByUser(userId, taskId);
//        if (result) {
//            return new ResponseEntity<>("Task deleted successfully.", HttpStatus.OK);
//        } else {
//            return new ResponseEntity<>("Task not found or does not belong to user.", HttpStatus.NOT_FOUND);
//        }
//    }
//
//
//    @PutMapping("/update/{userId}")
//    public ResponseEntity<?> updateTask(@PathVariable Long userId, @RequestBody Task t) {
//        if (t.getId() == null) {
//            return ResponseEntity.badRequest().body("Task ID is required for update.");
//        }
//        boolean updated = taskService.updateTaskByUser(userId, t);
//        if (updated) {
//            return ResponseEntity.ok("Task updated successfully.");
//        } else {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found or doesn't belong to user.");
//        }
//    }
//
//
//}

// ✅ Secure TaskController using JWT (no userId in URL)
package com.example.Todo.controller;

import com.example.Todo.JWT.JwtService;
import com.example.Todo.entity.Task;
import com.example.Todo.repository.TaskRepository;
import com.example.Todo.repository.UserRepository;
import com.example.Todo.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/task")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;
    @PostMapping("/add")
    public ResponseEntity<Task> addTask(@RequestBody Task task) {
        String email = getCurrentUserEmail();
        Task saved = taskService.addTaskForUser(email, task);
        return new ResponseEntity<>(saved, HttpStatus.OK);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Task>> getMyTasks() {
        String email = getCurrentUserEmail();
        List<Task> tasks = taskService.getTasksByEmail(email);
        return new ResponseEntity<>(tasks, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{taskId}")
    public ResponseEntity<String> deleteMyTask(@PathVariable Long taskId) {
        String email = getCurrentUserEmail();
        boolean result = taskService.deleteTaskByEmail(email, taskId);
        if (result) {
            return new ResponseEntity<>("Task deleted successfully.", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Task not found or doesn't belong to user.", HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateMyTask(@RequestBody Task task) {
        if (task.getId() == null) {
            return ResponseEntity.badRequest().body("Task ID is required for update.");
        }
        String email = getCurrentUserEmail();
        boolean updated = taskService.updateTaskByEmail(email, task);
        if (updated) {
            return ResponseEntity.ok("Task updated successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found or doesn't belong to user.");
        }
    }

    private String getCurrentUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName(); // sub from JWT (email)
    }
    @PutMapping("/update-status/{id}")
    public ResponseEntity<?> updateTaskStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> statusMap,
            @RequestHeader("Authorization") String token
    ) {
        boolean completed = statusMap.get("completed");
        Task task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));


        task.setCompleted(completed);
        taskRepository.save(task);
        return ResponseEntity.ok("Task status updated successfully");
    }

}

