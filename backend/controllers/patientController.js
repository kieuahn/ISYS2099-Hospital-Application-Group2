const {poolPatient} = require("../config/db")
const treatmentDetails = require("../models/treatmentDetails")


// Patient view their profile
const getPatientProfile = async (req, res) => {
    try {
        // Extract user ID from req.user
        const patient_id = req.user.user_id;

        const query = 'SELECT * FROM patients WHERE patient_id = ?';
        const [patient] = await poolPatient.query(query, [patient_id]); // Retrieve the patient from table Patient

        // Check if the query statement return any row
        if (patient.length === 0) {
            return res.status(404).json({ message: "Sorry, No Patient Found" })
        }

        // If the data is NULL, assign value "None" to that field
        for (let key in patient[0]) {
            if (patient[0][key] === null) {
                patient[0][key] = "None";
            }
        }

        return res.status(200).json(patient[0])
    }
    catch (err) {
        console.error("Error: ", err.stack);
        return res.status(500).json({ error: err.message })
    }
}

// Edit patient profile
const editPatientProfile = async (req, res) => {
    const patient_id = req.user.user_id;
    const { name, date_of_birth, gender, address, allergies, contact_number } = req.body;

    try {
        if (!name || name.trim() === "") {
            return res.status(400).json({ error: "Name cannot be empty" })
        }

        const query = `UPDATE patients 
                    SET patient_name = ?, allergies = ?, contact_number = ?, dob = ?, gender = ?, address = ?
                    WHERE patient_id = ?`
        const [result] = await poolPatient.query(query, [name, allergies, contact_number, date_of_birth, gender, address, patient_id])

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Cannot update patient's profile" })
        }
        return res.status(200).json({ message: "Update patient profile successfully" })
    } catch (err) {
        console.error("Error: ", err.stack);
        return res.status(500).json({ error: err.message });
    }
}

// Patient view upcoming and proceeding appointments
const patientViewUpcomingProceedingAppointments = async (req, res) => {
    const patient_id = req.user.user_id;

    try {
        const query = `SELECT * FROM appointments 
                        WHERE patient_id = ? 
                        AND (status LIKE "upcoming" OR status LIKE "proceeding") AND start_time > NOW();`
        const [appointments] = await poolPatient.query(query, [patient_id])

        if (appointments.length === 0) {
            return res.status(200).json({ message: "No upcoming appointment yet" })
        }

        return res.status(200).json(appointments)
    }
    catch (err) {
        console.error("Error: ", err.stack);
        return res.status(500).json({ error: err.message })
    }
}

// Patient view past appointments including cancelled and completed appointment
const patientViewHistoryAppointments = async (req, res) => {
    const patient_id = req.user.user_id;

    try {
        const query = `SELECT * FROM appointments 
                        WHERE patient_id = ? 
                        AND (status LIKE "completed" OR status LIKE "cancelled");`
        const [appointments] = await poolPatient.query(query, [patient_id])

        if (appointments.length === 0) {
            return res.status(200).json({ message: "No past appointment" })
        }

        return res.status(200).json(appointments)
    }
    catch (err) {
        console.error("Error: ", err.stack);
        return res.status(500).json({ error: err.message })
    }
}

// Patient view list of all the treatments given in each appoinment
const patientViewTreatmentList = async (req, res) => {
    const patient_id = req.user.user_id;

    try {
        const query = `SELECT treatment_id, patient_id, appointment_id, diagnosis, treatment_date FROM treatments 
                        WHERE patient_id = ?;`
        const [treatments] = await poolPatient.query(query, [patient_id])

        if (treatments.length === 0) {
            return res.status(200).json({ message: "No past treatment" })
        }

        return res.status(200).json(treatments)
    }
    catch (err) {
        console.error("Error: ", err.stack);
        return res.status(500).json({ error: err.message })
    }
}

// Patient view each treatment's note - Include mongodb data
const patientViewTreatmentNote = async (req, res) => {
    const patient_id = req.user.user_id;
    const appointment_id = req.params.appointment_id;

    try {
        const query = `SELECT * FROM treatments  
            WHERE appointment_id = ? AND patient_id = ?`

        const [notesList] = await poolPatient.query(query, [appointment_id, patient_id])
        if (notesList.length === 0) {
            return res.status(200).json({ message: "No treatments yet" })
        }
        const treatment = notesList[0];  // Extract the treatment record

        // Query MongoDB for additional treatment details using treatment_id
        const treatmentDetailRecord = await treatmentDetails.findOne({ treatment_id: treatment.treatment_id });

        // If no Mongodb data found, return only MySQL treatment data
        if (!treatmentDetailRecord) {
            return res.status(200).json(treatment);
        }

        // Combine MySQL treatment data with MongoDB treatment details
        const combinedResult = {
            ...treatment,  // MySQL treatment data
            ...treatmentDetailRecord._doc  // MongoDB treatment details
        };

        return res.status(200).json(combinedResult);
    }
    catch (err) {
        console.error("Error: ", err.stack);
        return res.status(500).json({ error: err.message })
    }
}

// Patient view doctor list
// Retrieve data for the scheduling of appointment to render the booking appointment form 
const patientViewDoctorList = async (req, res) => {
    query = `SELECT s.staff_id, s.staff_name, d.department_name 
    FROM staff s JOIN departments d ON s.department_id = d.department_id
    WHERE job_type = 'Doctor';`

    try {
        [doctorRows] = await poolPatient.query(query)

        return res.status(200).json(doctorRows)
    }
    catch (err) {
        console.error("Error: ", err.stack);
        return res.status(500).json({ error: err.message })
    }
}

// Patient view doctor's booking form with available slots by date
// Patient can view the time slot like this "startTime - endTime"
// localhost:5000/api/patient/booking-form/3?date=2024-09-06
const patientViewDoctorBookingForm = async (req, res) => {
    const { date } = req.query;  // Get the date from query parameters
    const doctor_id = req.params.doctor_id;  

    try {
        const [slots] = await poolPatient.query('SELECT * FROM get_doctors_list_available_slots WHERE staff_id = ? AND date = ?', [doctor_id, date]);

        return res.status(200).json(slots)
    }
    catch (err) {
        console.error("Error: ", err.stack);
        return res.status(500).json({ error: err.message })
    }
}

// Book appointment & create new appointment note (patient treatment at the same time)
// Assume the type of time returned is HH:mm - HH:mm (eg: 9.00 - 10:00)
// Use transaction
const patientBookAppointment = async (req, res) => {
    const patient_id = req.user.user_id;
    const doctor_id = req.params.doctor_id;
    const {timeRange, purpose, appointment_date, patient_note } = req.body;

    const [start_time, end_time] = timeRange.split(' - ').map(time => time.trim());
    try {
        const [bookingResult] = await poolPatient.query(
            'CALL sp_book_appointment(?, ?, ?, ?, ?, ?, @treatmentId)',
            [patient_id, doctor_id, purpose, appointment_date, start_time, end_time]
        );
        console.log(bookingResult);

        // Check if there is any error from the stored procedure (SIGNAL SQLSTATE)
        if (bookingResult && bookingResult.length > 0 && bookingResult[0][0].message_text) {
            throw new Error(bookingResult[0][0].message_text);
        }

        // Extract treatmentId from output parameter from the sp_book_appointment
        const [[{ treatmentId }]] = await poolPatient.query('SELECT @treatmentId AS treatmentId');
        
        if (treatmentId === 0) {
            return res.status(400).json({ message: 'Failed to book appointment. Treatment ID is 0.' });
        }

        // Create a new document in MongoDB with the extracted treatmentId
        await treatmentDetails.create({ treatment_id: treatmentId, patient_note: patient_note});


        return res.status(200).json({message: 'Appointment booked successfully'})
    }
    catch (err) {
        console.error("Error: ", err.stack);
        return res.status(500).json({ error: err.message }) // Handle all errors including from the stored pro
    }

}

// Patient cancel an appointment, delete the patient note at the same time because the appointment has yet
// has yet to happen 
// use transaction
const patientCancelAppointment = async (req, res) => {
    const appointment_id = req.params.appointment_id;

    try {
        const [cancelResult] = await poolPatient.query('CALL sp_cancel_appointment(?, @treatmentId)',
            appointment_id
        )

        // Check if there is any error from the stored procedure (SIGNAL SQLSTATE)
        if (cancelResult && cancelResult.length > 0 && cancelResult[0][0].message_text) {
            throw new Error(cancelResult[0][0].message_text);
        }

        // Extract treatmentId from output parameter from the sp_book_appointment
        const [[{ treatmentId }]] = await poolPatient.query('SELECT @treatmentId AS treatmentId');

        // Delete treatment details
        await treatmentDetails.deleteOne({ treatment_id: treatmentId });

        return res.status(200).json({message: 'Appoinment Cancelled'})
    }
    catch (err) {
        console.error("Error: ", err.stack);
        return res.status(500).json({ error: err.message }) // Handle all errors including from the stored pro
    }
}

module.exports = {
    getPatientProfile,
    editPatientProfile,
    patientViewUpcomingProceedingAppointments,
    patientViewHistoryAppointments,
    patientViewTreatmentList,
    patientViewTreatmentNote,
    patientViewDoctorList,
    patientViewDoctorBookingForm,
    patientBookAppointment,
    patientCancelAppointment
}