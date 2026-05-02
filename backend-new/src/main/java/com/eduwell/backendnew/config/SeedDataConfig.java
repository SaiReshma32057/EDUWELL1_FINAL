package com.eduwell.backendnew.config;

import com.eduwell.backendnew.entity.Program;
import com.eduwell.backendnew.entity.ResourceItem;
import com.eduwell.backendnew.entity.User;
import com.eduwell.backendnew.repository.ProgramRepository;
import com.eduwell.backendnew.repository.ResourceRepository;
import com.eduwell.backendnew.repository.UserRepository;
import java.util.List;
import java.util.Map;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SeedDataConfig {

    private static final Map<String, String> DEFAULT_RESOURCE_LINKS = Map.of(
            "Managing Exam Stress", "https://www.cdc.gov/mental-health/living-with/stress-coping.html",
            "10-Minute Morning Yoga", "https://www.youtube.com/watch?v=v7AYKMP6rOE",
            "Healthy Meal Prep for Students", "https://www.eatright.org/food/planning-and-prep/cook-at-home/meal-planning-for-beginners",
            "Better Sleep Habits", "https://www.sleepfoundation.org/sleep-hygiene"
    );

    @Bean
    CommandLineRunner seedData(UserRepository userRepository,
                               ProgramRepository programRepository,
                               ResourceRepository resourceRepository,
                               PasswordEncoder passwordEncoder) {
        return args -> {
            if (!userRepository.existsByEmail("student@eduwell.com")) {
                userRepository.save(new User(null, "Student User", "student@eduwell.com", passwordEncoder.encode("student123"), 20, "STUDENT"));
            }

            if (!userRepository.existsByEmail("admin@eduwell.com")) {
                userRepository.save(new User(null, "Admin User", "admin@eduwell.com", passwordEncoder.encode("admin123"), 30, "ADMIN"));
            }

            if (programRepository.count() == 0) {
                programRepository.save(new Program(null, "30-Day Mindfulness Reset", "Mental Health", 30));
                programRepository.save(new Program(null, "Fitness Foundation Bootcamp", "Fitness", 21));
                programRepository.save(new Program(null, "Sleep Optimization Journey", "Sleep", 14));
            }

            if (resourceRepository.count() == 0) {
                resourceRepository.save(new ResourceItem(null, "Managing Exam Stress", "Mental Health", "article",
                        "Tips for staying calm during finals.", "https://www.cdc.gov/mental-health/living-with/stress-coping.html", true, true, 0L));
                resourceRepository.save(new ResourceItem(null, "10-Minute Morning Yoga", "Fitness", "video",
                        "A quick routine to start your day.", "https://www.youtube.com/watch?v=v7AYKMP6rOE", true, true, 0L));
                resourceRepository.save(new ResourceItem(null, "Healthy Meal Prep for Students", "Nutrition", "pdf",
                        "Budget-friendly recipes.", "https://www.eatright.org/food/planning-and-prep/cook-at-home/meal-planning-for-beginners", true, true, 0L));
                resourceRepository.save(new ResourceItem(null, "Better Sleep Habits", "Sleep Improvement", "article",
                        "Improve your academic performance with rest.", "https://www.sleepfoundation.org/sleep-hygiene", true, true, 0L));
            }

            List<ResourceItem> existingResources = resourceRepository.findAll();
            boolean hasUpdates = false;
            for (ResourceItem resource : existingResources) {
                String defaultUrl = DEFAULT_RESOURCE_LINKS.get(resource.getTitle());
                if (defaultUrl != null && isInvalidUrl(resource.getContentUrl())) {
                    resource.setContentUrl(defaultUrl);
                    hasUpdates = true;
                }

                if (resource.getDescription() == null || resource.getDescription().isBlank()) {
                    resource.setDescription("Helpful wellness guidance curated for students.");
                    hasUpdates = true;
                }
            }

            if (hasUpdates) {
                resourceRepository.saveAll(existingResources);
            }
        };
    }

    private boolean isInvalidUrl(String url) {
        if (url == null) {
            return true;
        }

        String normalized = url.trim().toLowerCase();
        if (normalized.isEmpty() || "#".equals(normalized)) {
            return true;
        }

        return normalized.contains("example.com");
    }
}
