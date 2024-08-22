const mysql = require("../config/db")


// Patient view their profile
const getPatientProfile = async (req, res) => {
    try {
        // Extract user ID from req.user
        const patient_id = req.user.user_id;

        const query = 'SELECT * FROM patients WHERE patient_id = ?';
        const [patient] = await mysql.promise().query(query, [patient_id]); // Retrieve the patient from table Patient

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
                    SET patient_name = ?, allergies = ?, contact_number = ?, date_of_birth = ?, gender = ?, address = ?
                    WHERE patient_id = ?`
        const [result] = await mysql.promise().query(query, [name, allergies, contact_number, date_of_birth, gender, address, patient_id])

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
const viewUpcomingProceedingAppointments = async (req, res) => {
    const patient_id = req.user.user_id;

    try {
        const query = `SELECT * FROM appointments 
                        WHERE patient_id = ? 
                        AND (status LIKE "upcoming" OR status LIKE "proceeding");`
        const [appointments] = await mysql.promise().query(query, [patient_id])

    if (appointments.length === 0) {
        return res.status(200).json({message: "No upcoming appointment yet"})
    }
    
    return res.status(200).json(appointments)
    }
    catch (err) {
        console.error("Error: ", err.stack );
        return res.status(500).json({error: err.message})
    }
}

// Patient view past appointments including cancelled and completed appointment
const viewHistoryAppointments = async (req, res) => {
    const patient_id = req.user.user_id;

    try {
        const query = `SELECT * FROM appointments 
                        WHERE patient_id = ? 
                        AND (status LIKE "completed" OR status LIKE "cancelled");`
        const [appointments] = await mysql.promise().query(query, [patient_id])

    if (appointments.length === 0) {
        return res.status(200).json({message: "No past appointment"})
    }
    
    return res.status(200).json(appointments)
    }
    catch (err) {
        console.error("Error: ", err.stack );
        return res.status(500).json({error: err.message})
    }
}

// Patient view list of all the treatments given in each appoinment
const viewTreatmentList = async (req, res) => {
    const patient_id = req.user.user_id;

    try {
        const query = `SELECT * FROM treatmentHistory 
                        WHERE patient_id = ?;`
        const [treatments] = await mysql.promise().query(query, [patient_id])

    if (treatments.length === 0) {
        return res.status(200).json({message: "No past treatment"})
    }
    
    return res.status(200).json(appointments)
    }
    catch (err) {
        console.error("Error: ", err.stack );
        return res.status(500).json({error: err.message})
    }
}

// Patient view each treatment's note
const viewTreatmentNote = async (req, res) => {
    const patient_id = req.user.user_id;
    const appointment_id = req.params.appointment_id;

    try {
        const query = `SELECT * FROM treatment_history  
            WHERE appointment_id = ? AND patient_id = ?`

        const [notesList] = await mysql.promise().query(query, [appointment_id, patient_id])
        if (notesList.length === 0) {
            return res.status(200).json({message: "No treatments yet"})
        }

        return res.status(200).json(notesList)
    }
    catch (err) {
        console.error("Error: ", err.stack );
        return res.status(500).json({error: err.message})
    }
}

// Patient view doctor list
// Retreive data for the scheduling of appointment to render the booking appointment form 
// use 
const viewDoctorList = async (req, res) => {

}

// Book appointment & create new appointment note (patient treatment at the same time)
// Use transaction
const bookAppointment = async (req, res) => {
    const patient_id = req.user.patient_id;
    const doctor_id = req.params.staff_id;

    
}

// Patient cancel an appointment, delete the patient note at the same time because the appointment has yet
// has yet to happen 
// use transaction
const cancelAppointment = async (req, res) => {
    const appointment_id = req.params.appointment_id;
}

module.exports = { getPatientProfile }