-- Insert into patients
INSERT INTO patients (patient_name, allergies, contact_number, dob, gender, address)
VALUES 
  ('Jane Doe', 'Peanuts', '123-456-7890', '1985-07-21', 'female', '123 Elm St, Springfield'),
  ('John Doe', 'None', '098-765-4321', '1990-01-15', 'male', '456 Oak St, Springfield'),
  ('Mary Jane', 'Penicillin', '321-654-9870', '1988-11-03', 'female', '789 Pine St, Springfield'),
  ('Alice Taylor', 'None', '111-222-3333', '1992-05-12', 'female', '12 Maple St, Springfield'),
  ('Bob Miller', 'Sulfa Drugs', '444-555-6666', '1978-02-18', 'male', '45 Cedar St, Springfield'),
  ('Chris Green', 'Peanuts', '777-888-9999', '1986-12-30', 'male', '89 Birch St, Springfield'),
  ('Diana Rose', 'None', '000-123-4567', '2000-10-01', 'female', '67 Elmwood St, Springfield');

-- Insert into departments
INSERT INTO departments (department_id, department_name)
VALUES 
('DPT001', 'Cardiology'),
('DPT002', 'Neurology'),
('DPT003', 'Pediatrics'),
('DPT004', 'Oncology'),
('DPT005', 'Orthopedics'),
('DPT006', 'Dermatology'),
('DPT007', 'Gastroenterology');

-- Insert into staff
INSERT INTO staff (staff_name, department_id, manager_id, qualification, salary, job_type, start_date)
VALUES 
  ('John Smith', NULL, NULL, 'MBA', 75000.00, 'Manager', '2024-03-01'),        -- Manager 1
  ('Michael Green', NULL, NULL, 'MBA', 78000.00, 'Manager', '2023-09-01'),     -- Manager 2
  ('Alice Johnson', NULL, NULL, 'PhD', 85000.00, 'Admin', '2024-04-01'),       -- Admin (no manager)
  ('Dr. Emily Davis', 'DPT001', 1, 'MD', 95000.00, 'Doctor', '2024-02-01'),    
  ('Dr. Robert Brown', 'DPT002', 1, 'MD', 92000.00, 'Doctor', '2024-05-01'),   
  ('Dr. Helen White', 'DPT006', 2, 'MD', 98000.00, 'Doctor', '2023-08-15'),    
  ('Laura Thompson', 'DPT001', 1, 'RN', 68000.00, 'Doctor', '2024-03-05'),     
  ('Dr. Samuel Johnson', 'DPT007', 2, 'MD', 93000.00, 'Doctor', '2023-07-01'); 

-- Insert into patient_credential (password: password1234)
INSERT INTO patient_credentials (email, password, patient_id)
VALUES 
  ('jane.doe@hospital.com', '$2a$10$NK36mKFzBhnS9Sw/AD188OjPy/77UWnoYhIksXTcwnFKuH0AiyBYW', 1),
  ('john.doe@hospital.com', '$2a$10$NK36mKFzBhnS9Sw/AD188OjPy/77UWnoYhIksXTcwnFKuH0AiyBYW', 2),
  ('mary.jane@hospital.com', '$2a$10$NK36mKFzBhnS9Sw/AD188OjPy/77UWnoYhIksXTcwnFKuH0AiyBYW', 3),
  ('alice.taylor@hospital.com', '$2a$10$NK36mKFzBhnS9Sw/AD188OjPy/77UWnoYhIksXTcwnFKuH0AiyBYW', 4),
  ('bob.miller@hospital.com', '$2a$10$NK36mKFzBhnS9Sw/AD188OjPy/77UWnoYhIksXTcwnFKuH0AiyBYW', 5),
  ('chris.green@hospital.com', '$2a$10$NK36mKFzBhnS9Sw/AD188OjPy/77UWnoYhIksXTcwnFKuH0AiyBYW', 6),
  ('diana.rose@hospital.com', '$2a$10$NK36mKFzBhnS9Sw/AD188OjPy/77UWnoYhIksXTcwnFKuH0AiyBYW', 7);

-- Insert into staff_credential (password: password1234)
INSERT INTO staff_credentials (email, password, staff_id, job_type)
VALUES 
  ('john.smith@hospital.com', '$2a$10$NK36mKFzBhnS9Sw/AD188OjPy/77UWnoYhIksXTcwnFKuH0AiyBYW', 1, 'Manager'),
  ('michael.green@hospital.com', '$2a$10$NK36mKFzBhnS9Sw/AD188OjPy/77UWnoYhIksXTcwnFKuH0AiyBYW', 2, 'Manager'),
  ('alice.johnson@hospital.com', '$2a$10$NK36mKFzBhnS9Sw/AD188OjPy/77UWnoYhIksXTcwnFKuH0AiyBYW', 3, 'Admin'),
  ('emily.davis@hospital.com', '$2a$10$NK36mKFzBhnS9Sw/AD188OjPy/77UWnoYhIksXTcwnFKuH0AiyBYW', 4, 'Doctor'),
  ('robert.brown@hospital.com', '$2a$10$NK36mKFzBhnS9Sw/AD188OjPy/77UWnoYhIksXTcwnFKuH0AiyBYW', 5, 'Doctor'),
  ('helen.white@hospital.com', '$2a$10$NK36mKFzBhnS9Sw/AD188OjPy/77UWnoYhIksXTcwnFKuH0AiyBYW', 6, 'Doctor'),
  ('laura.thompson@hospital.com', '$2a$10$NK36mKFzBhnS9Sw/AD188OjPy/77UWnoYhIksXTcwnFKuH0AiyBYW', 7, 'Doctor'),
  ('samuel.johnson@hospital.com', '$2a$10$NK36mKFzBhnS9Sw/AD188OjPy/77UWnoYhIksXTcwnFKuH0AiyBYW', 8, 'Doctor');


-- Insert into appointments
INSERT INTO appointments (patient_id, staff_id, purpose, status, start_time, end_time, payment_amount)
VALUES 
(1, 4, 'General Checkup', 'Completed', '2024-08-25 08:00:00', '2024-08-25 09:00:00', 100.00), -- Doctor 4
(1, 5, 'Dental Cleaning', 'Cancelled', '2024-11-20 10:00:00', '2024-11-20 11:00:00', 0.00),  -- Doctor 5
(2, 4, 'Flu Symptoms', 'Cancelled', '2024-08-22 14:00:00', '2024-08-22 16:00:00', 0.00),    -- Doctor 4
(1, 4, 'Routine Follow-up', 'Upcoming', '2024-11-24 15:00:00', '2024-11-24 15:30:00', 150.00), -- Doctor 4
(4, 6, 'Skin Rash', 'Upcoming', '2024-11-23 12:00:00', '2024-11-23 12:45:00', 180.00),       -- Doctor 6
(5, 5, 'Gastroenterology Consultation', 'Completed', '2024-08-05 09:30:00', '2024-11-05 10:30:00', 250.00); -- Doctor 5


-- Insert into treatments
INSERT INTO treatments (patient_id, appointment_id, diagnosis, treatment_procedure, medication, instruction)
VALUES 
(1, 1, 'Healthy', 'Blood pressure check', 'None', 'Maintain regular exercise.'),
(1, 2, 'Flu', 'Annual flu shot', 'Flu vaccine', 'Rest and hydrate well.'),
(2, 3, 'Hypertension', 'Routine blood test', 'Antihypertensives', 'Continue current medication, follow up in 3 months.'),
(1, 4, 'Dermatitis', 'Topical Cream Application', 'Hydrocortisone', 'Apply cream twice a day.'),
(4, 5, 'Gastritis', 'Endoscopy', 'Antacids', 'Avoid spicy food and alcohol.'),
(5, 6, 'Anxiety', 'Therapy Session', 'Antianxiety Medication', 'Practice relaxation techniques.');

-- Insert into doctor_schedules
INSERT INTO doctor_schedules (staff_id, shift_start, shift_end, availability_status)
VALUES 
    (4, '2024-08-25 08:00:00', '2024-08-25 09:00:00', 'Busy'),    -- Doctor 4
    (4, '2024-08-22 14:00:00', '2024-08-22 16:00:00', 'Available'), -- Doctor 4
    (4, '2024-11-24 15:00:00', '2024-11-24 15:30:00', 'Busy'),    -- Doctor 4
    (5, '2024-11-20 10:00:00', '2024-11-20 11:00:00', 'Available'), -- Doctor 5
    (5, '2024-08-05 09:30:00', '2024-11-05 10:30:00', 'Busy'),    -- Doctor 5
    (6, '2024-11-23 12:00:00', '2024-11-23 12:45:00', 'Busy'),	-- Doctor 6
    (4, '2024-11-25 08:00:00', '2024-11-25 09:00:00', 'Available'), -- Doctor 4
    (4, '2024-11-25 10:00:00', '2024-11-25 12:00:00', 'Available');        -- Doctor 4    -- Doctor 4
    
-- Insert into job_history
INSERT INTO job_history (staff_id, staff_name, department_id, manager_id, qualification, salary, job_type, updated_at)
VALUES
  (4, 'Dr. Emily Davis', 'DPT001', 1, 'MD', 95000.00, 'Doctor', '2024-08-01 10:00:00'),
  (1, 'John Smith', 'DPT001', NULL, 'MBA', 75000.00, 'Manager', '2024-08-10 12:00:00'),
  (3, 'Alice Johnson', NULL, NULL, 'PhD', 85000.00, 'Admin', '2024-08-15 14:00:00'),
  (5, 'Dr. Robert Brown', 'DPT003', 1, 'MD', 92000.00, 'Doctor', '2024-08-20 09:00:00'),
  (6, 'Dr. Helen White', 'DPT006', 2, 'MD', 98000.00, 'Doctor', '2024-09-01 11:00:00');
-- Insert into performance_rating
INSERT INTO performance_rating (doctor_id, appointment_id, performance_rating)
VALUES 
    (4, 1, 4.50),  
    (5, 2, 4.75),  
    (5, 4, 4.80),
    (6, 5, 4.90),
    (8, 6, 4.60);
