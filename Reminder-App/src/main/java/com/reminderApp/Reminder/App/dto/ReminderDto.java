package com.reminderApp.Reminder.App.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReminderDto {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime dueDate;
    private boolean completed;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}