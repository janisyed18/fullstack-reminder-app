package com.reminderApp.Reminder.App.service;


import com.reminderApp.Reminder.App.dto.CreateReminderDto;
import com.reminderApp.Reminder.App.dto.ReminderDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ReminderService {


    // Add the new isCompleted parameter
    Page<ReminderDto> getAllReminders(String title, String priority, Boolean isCompleted, Pageable pageable);

    ReminderDto getReminderById(Long id);

    ReminderDto createReminder(CreateReminderDto createReminderDto);

    ReminderDto updateReminder(Long id, CreateReminderDto createReminderDto);

    void deleteReminder(Long id);

    ReminderDto markReminderAsCompleted(Long id);
}