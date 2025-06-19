package com.reminderApp.Reminder.App.controller;


import com.reminderApp.Reminder.App.dto.CreateReminderDto;
import com.reminderApp.Reminder.App.dto.ReminderDto;
import com.reminderApp.Reminder.App.service.ReminderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/v1/reminders") // Base path for the resource
@RequiredArgsConstructor
public class ReminderController {

    private final ReminderService reminderService;

    /**
     * Retrieves a paginated list of all reminders.
     * Path: /api/v1/reminders/all
     */
    /*@GetMapping("/all")
    public ResponseEntity<Page<ReminderDto>> getAllReminders(Pageable pageable) {
        return ResponseEntity.ok(reminderService.getAllReminders(pageable));
    }*/

    // Change the getAllReminders method to this:
    @GetMapping("/all")
    public ResponseEntity<Page<ReminderDto>> getAllReminders(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String priority,
            Pageable pageable) {
        return ResponseEntity.ok(reminderService.getAllReminders(title, priority, pageable));
    }

    /**
     * Retrieves a single reminder by its ID.
     * Path: /api/v1/reminders/get/{id}
     */
    @GetMapping("/get/{id}")
    public ResponseEntity<ReminderDto> getReminderById(@PathVariable Long id) {
        return ResponseEntity.ok(reminderService.getReminderById(id));
    }

    /**
     * Creates a new reminder.
     * Path: /api/v1/reminders/create
     */
    @PostMapping("/create")
    public ResponseEntity<ReminderDto> createReminder(@Valid @RequestBody CreateReminderDto createReminderDto) {
        ReminderDto createdReminder = reminderService.createReminder(createReminderDto);

        // Build the location URI to point to the new 'getById' endpoint
        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/api/v1/reminders/get/{id}")
                .buildAndExpand(createdReminder.getId())
                .toUri();

        return ResponseEntity.created(location).body(createdReminder);
    }

    /**
     * Updates an existing reminder.
     * Path: /api/v1/reminders/update/{id}
     */
    @PutMapping("/update/{id}")
    public ResponseEntity<ReminderDto> updateReminder(@PathVariable Long id, @Valid @RequestBody CreateReminderDto createReminderDto) {
        return ResponseEntity.ok(reminderService.updateReminder(id, createReminderDto));
    }

    /**
     * Deletes a reminder by its ID.
     * Path: /api/v1/reminders/delete/{id}
     */
    @DeleteMapping("/delete/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReminder(@PathVariable Long id) {
        reminderService.deleteReminder(id);
    }

    /**
     * Marks a reminder as completed.
     * Path: /api/v1/reminders/complete/{id}
     */
    @PatchMapping("/complete/{id}")
    public ResponseEntity<ReminderDto> markReminderAsCompleted(@PathVariable Long id) {
        return ResponseEntity.ok(reminderService.markReminderAsCompleted(id));
    }
}