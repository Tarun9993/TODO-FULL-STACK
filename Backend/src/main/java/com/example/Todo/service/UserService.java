package com.example.Todo.service;

import com.example.Todo.entity.User;
import com.example.Todo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private UserRepository userRepository;
    public boolean register(User u) {
      String pwd = passwordEncoder.encode(u.getPassword());
      u.setPassword(pwd);
      User savedUser = userRepository.save(u);
      return savedUser.getId() != null;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User u = userRepository.findByEmail(email);
        return new org.springframework.security.core.userdetails.User(u.getEmail(), u.getPassword(), Collections.emptyList());

    }
}
