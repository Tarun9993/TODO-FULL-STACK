package com.example.Todo.repository;

import com.example.Todo.entity.Task;
import com.example.Todo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task,Long> {

    List<Task> findByUser(User user);

    Task findByIdAndUser(Long id, User user);
}
