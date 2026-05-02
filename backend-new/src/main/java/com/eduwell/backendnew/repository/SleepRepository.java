package com.eduwell.backendnew.repository;

import com.eduwell.backendnew.entity.SleepEntry;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SleepRepository extends JpaRepository<SleepEntry, Long> {
    List<SleepEntry> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("select count(distinct s.userId) from SleepEntry s")
    long countDistinctActiveUsers();
}
