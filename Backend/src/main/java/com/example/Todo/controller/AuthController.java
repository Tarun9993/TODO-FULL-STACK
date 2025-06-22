package com.example.Todo.controller;

import com.example.Todo.JWT.JwtService;
import com.example.Todo.entity.User;
import com.example.Todo.repository.UserRepository;
import com.example.Todo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User u){
        boolean status = userService.register(u);
        if(status){
            return new ResponseEntity<>("Sucess",HttpStatus.OK);
        }else{
            return new ResponseEntity<>("Failed",HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User u) {
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(u.getEmail(), u.getPassword());
        Authentication auth = authenticationManager.authenticate(token);

        if (auth.isAuthenticated()) {
            User dbUser = userRepository.findByEmail(u.getEmail()); //  get full user
            String jwt = jwtService.generateToken(dbUser);

            Map<String, String> response = new HashMap<>();
            response.put("token", jwt);
            response.put("name", dbUser.getName()); // optional: return name separately too

            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Failed Login", HttpStatus.UNAUTHORIZED);
        }
    }
    @GetMapping("/greet")
    public String greet(){
        return "Hello";
    }
}
