package com.eduwell.backendnew.repository;

import com.eduwell.backendnew.entity.Program;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProgramRepository extends JpaRepository<Program, Long> {
}
