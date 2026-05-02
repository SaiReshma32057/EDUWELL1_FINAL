package com.eduwell.backendnew.controller;

import com.eduwell.backendnew.dto.ApiResponse;
import com.eduwell.backendnew.dto.LoginRequest;
import com.eduwell.backendnew.dto.LoginResponseData;
import com.eduwell.backendnew.dto.RegisterRequest;
import com.eduwell.backendnew.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@Valid @RequestBody RegisterRequest request) {
        LoginResponseData data = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse("success", "User registered successfully", data));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponseData data = authService.login(request);
        return ResponseEntity.ok(new ApiResponse("success", "Login successful", data));
    }
}
