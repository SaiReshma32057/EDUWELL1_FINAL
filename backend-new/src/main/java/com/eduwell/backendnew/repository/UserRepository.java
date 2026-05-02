package com.eduwell.backendnew.repository;

import com.eduwell.backendnew.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRoleIgnoreCase(String role);

    long countByRoleIgnoreCase(String role);

    List<User> findAllByOrderByCreatedAtDesc();

    List<User> findTop5ByOrderByCreatedAtDesc();
}
