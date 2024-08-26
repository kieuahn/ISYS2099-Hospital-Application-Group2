-- Insert into patients
INSERT INTO patients (patient_name, allergies, contact_number, dob, gender, address)
VALUES 
  ('Jane Doe', 'Peanuts', '123-456-7890', '1985-07-21', 'female', '123 Elm St, Springfield'),
  ('John Doe', 'None', '098-765-4321', '1990-01-15', 'male', '456 Oak St, Springfield'),
  ('Mary Jane', 'Penicillin', '321-654-9870', '1988-11-03', 'female', '789 Pine St, Springfield');

-- Insert into departments
INSERT INTO departments (department_id, department_name)
VALUES 
('DPT001', 'Cardiology'),
('DPT002', 'Neurology'),
('DPT003', 'Pediatrics'),
('DPT004', 'Oncology'),
('DPT005', 'Orthopedics');

-- Insert into staffs
INSERT INTO staff (staff_name, department_id, manager_id, qualification, salary, job_type, start_date)
VALUES 
  ('Dr. Emily Davis', 'DPT001', 2, 'MD', 95000.00, 'Doctor', '2024-02-01'),  
  ('John Smith', NULL, NULL, 'MBA', 75000.00, 'Manager', '2024-03-01'),       
  ('Alice Johnson', NULL, NULL, 'PhD', 85000.00, 'Admin', '2024-04-01'),      
  ('Dr. Robert Brown', 'DPT002', 2, 'MD', 92000.00, 'Doctor', '2024-05-01'); 


-- Insert into patient_credential (password: password1234)
INSERT INTO patient_credentials (email, password, patient_id)
VALUES 
  ('jane.doe@hospital.com', '$2a$10$NK36mKFzBhnS9Sw/AD188OjPy/77UWnoYhIksXTcwnFKuH0AiyBYW', 1),
  ('john.doe@hospital.com', '$2a$10$NK36mKFzBhnS9Sw/AD188OjPy/77UWnoYhIksXTcwnFKuH0AiyBYW', 2),
  ('mary.jane@hospital.com', '$2a$10$NK36mKFzBhnS9Sw/AD188OjPy/77UWnoYhIksXTcwnFKuH0AiyBYW', 3);

-- Insert into staff_credential (password: password1234)
INSERT INTO staff_credentials (email, password, staff_id, job_type)
VALUES 
  ('emily.davis@hospital.com', '$2a$10$NK36mKFzBhnS9Sw/AD188OjPy/77UWnoYhIksXTcwnFKuH0AiyBYW', 1, 'Doctor'),
  ('john.smith@hospital.com', '$2a$10$NK36mKFzBhnS9Sw/AD188OjPy/77UWnoYhIksXTcwnFKuH0AiyBYW', 2, 'Manager'),
  ('alice.johnson@hospital.com', '$2a$10$NK36mKFzBhnS9Sw/AD188OjPy/77UWnoYhIksXTcwnFKuH0AiyBYW', 3, 'Admin'),
  ('robert.brown@hospital.com', '$2a$10$NK36mKFzBhnS9Sw/AD188OjPy/77UWnoYhIksXTcwnFKuH0AiyBYW', 4, 'Doctor');

INSERT INTO appointments (patient_id, staff_id, purpose, status, start_time, end_time, payment_amount)
VALUES 
(1, 1, 'General Checkup', 'Upcoming', '2024-08-25 08:00:00', '2024-08-25 09:00:00', 100.00),
(1, 4, 'Dental Cleaning', 'Completed', '2024-08-20 10:00:00', '2024-08-20 11:00:00', 200.00),
(2, 1, 'Flu Symptoms', 'Cancelled', '2024-08-22 14:00:00', NULL, 0.00),
(3, 4, 'Routine Follow-up', 'Proceeding', '2024-08-24 15:00:00', '2024-08-24 15:30:00', 150.00);

INSERT INTO treatments (patient_id, appointment_id, diagnosis, treatment_procedure, medication, instruction)
VALUES 
(1, 1, 'Healthy', 'Blood pressure check', 'None', 'Maintain regular exercise.'),
(1, 2, 'Flu', 'Annual flu shot', 'Flu vaccine', 'Rest and hydrate well.'),
(3, 4, 'Hypertension', 'Routine blood test', 'Antihypertensives', 'Continue current medication, follow up in 3 months.');

INSERT INTO doctor_schedules (staff_id, shift_start, shift_end, availability_status)
VALUES 
    -- Doctor 1's schedule
    (1, '2024-08-25 08:00:00', '2024-08-25 09:00:00', 'Available'), 
    (1, '2024-08-25 10:00:00', '2024-08-25 11:00:00', 'Available'), 

    -- Doctor 4's schedule
    (2, '2024-08-25 09:00:00', '2024-08-25 10:00:00', 'Busy'), 
    (2, '2024-08-25 11:00:00', '2024-08-25 12:00:00', 'Available'); 


INSERT INTO job_history (staff_id, staff_name, department_id, manager_id, qualification, salary, job_type, updated_at)
VALUES
  (1, 'Dr. Emily Davis', 'DPT001', 2, 'MD', 95000.00, 'Doctor', '2024-08-01 10:00:00'),
  (2, 'John Smith', 'DPT001', 3, 'MBA', 75000.00, 'Doctor', '2024-08-10 12:00:00'),
  (3, 'Alice Johnson', NULL, NULL, 'PhD', 85000.00, 'Manager', '2024-08-15 14:00:00'),
  (4, 'Dr. Robert Brown', 'DPT003', 2, 'MD', 92000.00, 'Doctor', '2024-08-20 09:00:00');

INSERT INTO performance_rating (doctor_id, appointment_id, performance_rating)
VALUES 
    (1, 1, 4.50),  
    (4, 2, 4.75),  
    (4, 4, 4.80); 
