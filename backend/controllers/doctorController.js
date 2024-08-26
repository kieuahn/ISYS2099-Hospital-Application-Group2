const mysql = require("../config/db");

// View doctor's upcoming and proceeding appointment
const doctorViewUpcomingProceedingAppointment = async (req, res) => {
    const doctor_id = req.user.user_id;

    try {
        const query = `SELECT appointment_id, purpose, status, start_time FROM appointments 
        WHERE staff_id = ? AND (status = 'upcoming' OR status = 'proceeding')`;
        const [appointments] = await mysql.promise().query(query, [doctor_id])

        if (appointments.length === 0) {
            return res.status(200).json({message: "No upcoming appointments"})
        }

        return res.status(200).json(appointments)
    } catch (err) {
        console.error("Error: ", err.stack );
        return res.status(500).json({error: err.message})
    }
}

// View doctor's past completed appoinments
const doctorViewCompletedAppointment = async (req, res) => {
    const doctor_id = req.user.user_id;

    try {
        const query = `SELECT appointment_id, purpose, status, start_time FROM appointments 
        WHERE staff_id = ? AND (status = 'completed')`;
        const [appointments] = await mysql.promise().query(query, [doctor_id])

        if (appointments.length === 0) {
            return res.status(200).json({message: "No past appointments"})
        }

        return res.status(200).json(appointments)
    } catch (err) {
        console.error("Error: ", err.stack );
        return res.status(500).json({error: err.message})
    }
}

// View treatment's note of an appoinment
const doctorViewTreatmentNote = async (req, res) => {
    const appointment_id = req.params.appointment_id;

    try {
        const query = `SELECT * FROM treatment_notes t
        WHERE t.appointment_id = ?`;
        const [note] = await mysql.promise().query(query, [appointment_id])

        if (note.length === 0) {
            return res.status(200).json({message: "No notes found"});
        }

        return res.status(200).json(note[0]);
    } catch (err) {
        console.error("Error: ", err.stack );
        return res.status(500).json({error: err.message})
    }
}

// Edit treatment note
// Include Mongodb data
const doctorUpdateTreatmentNote = (req, res) => {}

// View doctor schedule
const doctorViewSchedule = (req, res) => {}

// Update doctor schedule
const doctorUpdateSchedule = (req, res) => {}

module.exports = {
    doctorViewUpcomingProceedingAppointment,
    doctorViewCompletedAppointment,
    doctorViewTreatmentNote
}