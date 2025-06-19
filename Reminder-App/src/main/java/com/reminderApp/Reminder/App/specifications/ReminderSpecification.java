package com.reminderApp.Reminder.App.specifications;

import com.reminderApp.Reminder.App.entity.Reminder;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class ReminderSpecification {

    public static Specification<Reminder> getReminders(String title, String priority, Boolean isCompleted) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (title != null && !title.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), "%" + title.toLowerCase() + "%"));
            }

            var newPriority = StringUtils.trimToNull(priority);
            boolean hasPriority = StringUtils.isNotBlank(newPriority) && !StringUtils.equalsIgnoreCase(newPriority, "null");

            if (hasPriority) {
                predicates.add(criteriaBuilder.equal(root.get("priority"), newPriority));
            }

            if (isCompleted != null) {
                predicates.add(criteriaBuilder.equal(root.get("isCompleted"), isCompleted));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}