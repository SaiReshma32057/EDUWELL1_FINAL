package com.eduwell.backendnew.repository;

import com.eduwell.backendnew.entity.Enrollment;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    List<Enrollment> findByUserId(Long userId);

    Optional<Enrollment> findByUserIdAndProgramId(Long userId, Long programId);

    @Query("select count(distinct e.userId) from Enrollment e")
    long countDistinctActiveUsers();
}
