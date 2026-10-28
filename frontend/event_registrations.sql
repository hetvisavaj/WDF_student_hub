CREATE DATABASE IF NOT EXISTS studenthub
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE studenthub;

CREATE TABLE IF NOT EXISTS event_registrations (
    registration_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    attendee_name VARCHAR(100) NOT NULL,
    student_id VARCHAR(30) NOT NULL,
    attendee_email VARCHAR(150) NOT NULL,
    event_name VARCHAR(150) NOT NULL,
    event_date DATE NOT NULL,
    event_type ENUM('Workshop', 'Career', 'Seminar', 'Community', 'Competition') NOT NULL,
    registered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_student_event (student_id, event_name),
    INDEX idx_event_date (event_date),
    INDEX idx_event_type (event_type)
) ENGINE=InnoDB;
