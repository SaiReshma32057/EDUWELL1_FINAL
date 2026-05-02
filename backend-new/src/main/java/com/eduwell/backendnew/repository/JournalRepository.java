package com.eduwell.backendnew.repository;

import com.eduwell.backendnew.entity.JournalEntry;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface JournalRepository extends JpaRepository<JournalEntry, Long> {

    List<JournalEntry> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("select count(distinct j.userId) from JournalEntry j")
    long countDistinctActiveUsers();
}
