package com.eduwell.backendnew.service;

import com.eduwell.backendnew.dto.AppointmentRequest;
import com.eduwell.backendnew.entity.Appointment;
import com.eduwell.backendnew.repository.AppointmentRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final SubmissionEmailService submissionEmailService;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              SubmissionEmailService submissionEmailService) {
        this.appointmentRepository = appointmentRepository;
        this.submissionEmailService = submissionEmailService;
    }

    public List<Appointment> getAppointments(Long userId) {
        return appointmentRepository.findByUserIdOrderByAppointmentDateAsc(userId);
    }

    public Appointment createAppointment(Long userId, AppointmentRequest request) {
        Appointment appointment = new Appointment(null, userId, request.getCounselorName().trim(), LocalDate.parse(request.getDate()), request.getType().trim(), "scheduled");
        Appointment saved = appointmentRepository.save(appointment);
        submissionEmailService.sendSubmissionSuccessEmail(userId, "appointment booking");

        return saved;
    }
}
