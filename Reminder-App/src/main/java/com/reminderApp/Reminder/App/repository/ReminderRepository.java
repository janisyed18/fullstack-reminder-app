package com.reminderApp.Reminder.App.repository;


import com.reminderApp.Reminder.App.entity.Reminder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    // This new method will handle searching by title and filtering by priority
    Page<Reminder> findByTitleContainingIgnoreCaseAndPriority(String title, String priority, Pageable pageable);

    // This method will handle searching by title only
    Page<Reminder> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    // This method will handle filtering by priority only
    Page<Reminder> findByPriority(String priority, Pageable pageable);
}