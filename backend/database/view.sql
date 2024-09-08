CREATE VIEW StaffDetails AS
SELECT 
    s.staff_id,
    s.staff_name,
    s.department_id,
    d.department_name,
    s.manager_id,
    m.staff_name AS manager_name,
    s.qualification,
    s.salary,
    s.job_type,
    s.start_date
FROM 
    staff s
LEFT JOIN 
    departments d ON s.department_id = d.department_id
LEFT JOIN 
    staff m ON s.manager_id = m.staff_id;


CREATE OR REPLACE VIEW StaffByDepartment AS
SELECT 
    s.staff_id,
    s.staff_name,
    s.department_id,
    d.department_name,
    s.manager_id,  -- Add manager_id here
    s.qualification,
    s.salary,
    s.job_type,
    s.start_date
FROM 
    staff s
LEFT JOIN 
    departments d ON s.department_id = d.department_id;


CREATE VIEW PatientDetails AS
SELECT 
    patient_id, 
    patient_name, 
    contact_number, 
    dob, 
    gender, 
    address
FROM 
    patients;
    
CREATE VIEW PatientPaymentReport AS
SELECT
    p.patient_id,
    p.patient_name,
    SUM(a.payment_amount) AS total_payment
FROM
    patients p
JOIN
    appointments a ON p.patient_id = a.patient_id
GROUP BY
    p.patient_id, p.patient_name;
