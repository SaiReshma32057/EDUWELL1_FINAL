package com.eduwell.backendnew.service;

import com.eduwell.backendnew.dto.LoginRequest;
import com.eduwell.backendnew.dto.LoginResponseData;
import com.eduwell.backendnew.dto.RegisterRequest;
import com.eduwell.backendnew.config.JwtService;
import com.eduwell.backendnew.entity.User;
import com.eduwell.backendnew.exception.DuplicateEmailException;
import com.eduwell.backendnew.exception.InvalidCredentialsException;
import com.eduwell.backendnew.repository.UserRepository;
import java.time.LocalDateTime;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final SubmissionEmailService submissionEmailService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       SubmissionEmailService submissionEmailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.submissionEmailService = submissionEmailService;
    }

    public LoginResponseData register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        String requestedRole = request.getRole() == null ? "student" : request.getRole().trim().toLowerCase();
        String role = "admin".equals(requestedRole) ? "ADMIN" : "STUDENT";
        Integer age = request.getAge() == null ? 18 : request.getAge();

        if (userRepository.existsByEmail(email)) {
            throw new DuplicateEmailException("Email is already registered");
        }

        User user = new User(null, request.getName().trim(), email, passwordEncoder.encode(request.getPassword()), age, role);
        user.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(savedUser.getId(), savedUser.getEmail(), role);
        submissionEmailService.sendSignupSuccessEmail(savedUser);

        return new LoginResponseData(savedUser.getId(), savedUser.getName(), savedUser.getEmail(), role, token);
    }

    public LoginResponseData login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        String normalizedRole = user.getRole() == null ? "STUDENT" : user.getRole().toUpperCase();
        String token = jwtService.generateToken(user.getId(), user.getEmail(), normalizedRole);
        submissionEmailService.sendLoginSuccessEmail(user);

        return new LoginResponseData(user.getId(), user.getName(), user.getEmail(), normalizedRole, token);
    }
}
