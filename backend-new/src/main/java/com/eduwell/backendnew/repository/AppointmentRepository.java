package com.eduwell.backendnew.repository;

import com.eduwell.backendnew.entity.Appointment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByUserIdOrderByAppointmentDateAsc(Long userId);

    @Query("select count(distinct a.counselorName) from Appointment a where a.counselorName is not null and a.counselorName <> ''")
    long countDistinctCounselors();

    @Query("select count(distinct a.userId) from Appointment a")
    long countDistinctActiveUsers();
}
