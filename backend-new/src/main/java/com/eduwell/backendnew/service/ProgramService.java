package com.eduwell.backendnew.service;

import com.eduwell.backendnew.dto.EnrollRequest;
import com.eduwell.backendnew.dto.ProgramUpsertRequest;
import com.eduwell.backendnew.entity.Enrollment;
import com.eduwell.backendnew.entity.Program;
import com.eduwell.backendnew.entity.User;
import com.eduwell.backendnew.repository.EnrollmentRepository;
import com.eduwell.backendnew.repository.ProgramRepository;
import com.eduwell.backendnew.repository.UserRepository;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProgramService {

    private final ProgramRepository programRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final SubmissionEmailService submissionEmailService;

    public ProgramService(ProgramRepository programRepository,
                          EnrollmentRepository enrollmentRepository,
                          UserRepository userRepository,
                          NotificationService notificationService,
                          SubmissionEmailService submissionEmailService) {
        this.programRepository = programRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.submissionEmailService = submissionEmailService;
    }

    public void enroll(Long userId, EnrollRequest request) {
        Program program = programRepository.findById(request.getProgramId())
                .orElseThrow(() -> new IllegalArgumentException("Program not found"));

        boolean alreadyEnrolled = enrollmentRepository.findByUserIdAndProgramId(userId, program.getId()).isPresent();

        if (!alreadyEnrolled) {
            enrollmentRepository.save(new Enrollment(null, userId, program.getId(), 10));
            submissionEmailService.sendSubmissionSuccessEmail(userId, "program enrollment");
        }
    }

    public List<Map<String, Object>> getMyPrograms(Long userId) {
        List<Enrollment> enrollments = enrollmentRepository.findByUserId(userId);
        List<Map<String, Object>> result = new ArrayList<>();

        for (Enrollment enrollment : enrollments) {
            Program program = programRepository.findById(enrollment.getProgramId())
                    .orElse(null);
            if (program == null) {
                continue;
            }

            Map<String, Object> item = new HashMap<>();
            item.put("id", program.getId());
            item.put("title", program.getTitle());
            item.put("category", program.getCategory());
            item.put("progress", enrollment.getProgress());
            result.add(item);
        }

        return result;
    }

    public List<Program> getPrograms() {
        return programRepository.findAll();
    }

    public List<Program> getAdminPrograms(Long adminUserId) {
        validateAdmin(adminUserId);
        return programRepository.findAll();
    }

    public Program createProgram(Long adminUserId, ProgramUpsertRequest request) {
        validateAdmin(adminUserId);
        Program program = new Program(null, request.getTitle().trim(), request.getCategory().trim(), request.getDurationDays());
        Program saved = programRepository.save(program);
        notificationService.notifyAllStudents("Admin added a new session: " + saved.getTitle());
        return saved;
    }

    public Program updateProgram(Long adminUserId, Long programId, ProgramUpsertRequest request) {
        validateAdmin(adminUserId);
        Program program = programRepository.findById(programId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Session not found"));
        program.setTitle(request.getTitle().trim());
        program.setCategory(request.getCategory().trim());
        program.setDurationDays(request.getDurationDays());
        Program saved = programRepository.save(program);
        notificationService.notifyAllStudents("Admin updated session: " + saved.getTitle());
        return saved;
    }

    public void deleteProgram(Long adminUserId, Long programId) {
        validateAdmin(adminUserId);
        if (!programRepository.existsById(programId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Session not found");
        }
        programRepository.deleteById(programId);
    }

    private void validateAdmin(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        if (!"admin".equalsIgnoreCase(user.getRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admin users can perform this action");
        }
    }
}
