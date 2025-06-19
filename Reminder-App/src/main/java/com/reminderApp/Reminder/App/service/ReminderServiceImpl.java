package com.reminderApp.Reminder.App.service;

import com.reminderApp.Reminder.App.dto.CreateReminderDto;
import com.reminderApp.Reminder.App.dto.ReminderDto;
import com.reminderApp.Reminder.App.entity.Reminder;
import com.reminderApp.Reminder.App.exception.ResourceNotFoundException;
import com.reminderApp.Reminder.App.repository.ReminderRepository;
import com.reminderApp.Reminder.App.specifications.ReminderSpecification;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ReminderServiceImpl implements ReminderService {

    private final ReminderRepository reminderRepository;
    private final ModelMapper modelMapper;

/*    @Override
    @Transactional(readOnly = true)
    public Page<ReminderDto> getAllReminders(String title, String priority, Pageable pageable) {
        Page<Reminder> reminders;
        boolean hasTitle = title != null && !title.trim().isEmpty();
        priority = StringUtils.trimToNull(priority);
        boolean hasPriority = StringUtils.isNotBlank(priority) && !StringUtils.equalsIgnoreCase(priority, "null");

        if (hasTitle && hasPriority) {
            reminders = reminderRepository.findByTitleContainingIgnoreCaseAndPriority(title, priority, pageable);
        } else if (hasTitle) {
            reminders = reminderRepository.findByTitleContainingIgnoreCase(title, pageable);
        } else if (hasPriority) {
            reminders = reminderRepository.findByPriority(priority, pageable);
        } else {
            // This 'else' block will now correctly execute when no priority is selected
            reminders = reminderRepository.findAll(pageable);
        }

        return reminders.map(reminder -> modelMapper.map(reminder, ReminderDto.class));
    }*/

    @Override
    @Transactional(readOnly = true)
    public Page<ReminderDto> getAllReminders(String title, String priority, Boolean isCompleted, Pageable pageable) {
        // Build the specification from the filters
        Specification<Reminder> spec = ReminderSpecification.getReminders(title, priority, isCompleted);

        // Use the specification to find the reminders
        Page<Reminder> reminders = reminderRepository.findAll(spec, pageable);

        return reminders.map(reminder -> modelMapper.map(reminder, ReminderDto.class));
    }

    @Override
    @Transactional(readOnly = true)
    public ReminderDto getReminderById(Long id) {
        Reminder reminder = reminderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder not found with id: " + id));
        return modelMapper.map(reminder, ReminderDto.class);
    }

    @Override
    public ReminderDto createReminder(CreateReminderDto createReminderDto) {
        Reminder reminder = modelMapper.map(createReminderDto, Reminder.class);
        Reminder savedReminder = reminderRepository.save(reminder);
        return modelMapper.map(savedReminder, ReminderDto.class);
    }

    @Override
    public ReminderDto updateReminder(Long id, CreateReminderDto createReminderDto) {
        Reminder existingReminder = reminderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder not found with id: " + id));

        existingReminder.setTitle(createReminderDto.getTitle());
        existingReminder.setDescription(createReminderDto.getDescription());
        existingReminder.setDueDate(createReminderDto.getDueDate());
        existingReminder.setPriority(createReminderDto.getPriority()); // Ensure priority is updated

        Reminder updatedReminder = reminderRepository.save(existingReminder);
        return modelMapper.map(updatedReminder, ReminderDto.class);
    }

    @Override
    public void deleteReminder(Long id) {
        if (!reminderRepository.existsById(id)) {
            throw new ResourceNotFoundException("Reminder not found with id: " + id);
        }
        reminderRepository.deleteById(id);
    }

    @Override
    public ReminderDto markReminderAsCompleted(Long id) {
        Reminder reminder = reminderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder not found with id: " + id));
        reminder.setCompleted(true);
        Reminder updatedReminder = reminderRepository.save(reminder);
        return modelMapper.map(updatedReminder, ReminderDto.class);
    }
}