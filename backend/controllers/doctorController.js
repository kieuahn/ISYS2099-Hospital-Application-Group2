const {poolDoctor} = require("../config/db");
const treatmentDetails = require("../models/treatmentDetails");

// View doctor's upcoming and proceeding appointment
const doctorViewUpcomingProceedingAppointment = async (req, res) => {
    const doctor_id = req.user.user_id;

    try {
        const query = `SELECT appointment_id, purpose, status, start_time FROM appointments 
        WHERE staff_id = ? AND (status = 'upcoming' OR status = 'proceeding')`;
        const [appointments] = await poolDoctor.query(query, [doctor_id])

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
        const [appointments] = await poolDoctor.query(query, [doctor_id])

        if (appointments.length === 0) {
            return res.status(200).json({message: "No past appointments"})
        }

        return res.status(200).json(appointments)
    } catch (err) {
        console.error("Error: ", err.stack );
        return res.status(500).json({error: err.message})
    }
}

// View treatment's note of an appoinment - Include Mongodb data
const doctorViewTreatmentNote = async (req, res) => {
    const appointment_id = req.params.appointment_id;

    try {
        const query = `SELECT * FROM treatments 
        WHERE appointment_id = ?`;
        const [note] = await poolDoctor.query(query, [appointment_id])

        if (note.length === 0) {
            return res.status(200).json({message: "No notes found"});
        }

        const treatmentId = note[0].treatment_id;

        // Query the MongoDB collection to retrieve the associated treatment details
        const treatmentData = await treatmentDetails.findOne({ treatment_id: treatmentId });

        if (!treatmentData) {
            return res.status(200).json({
                message: "No additional treatment details found in MongoDB",
                treatmentNote: note[0]
            });
        }
        // Combine MySQL treatment data with MongoDB treatment details
        const combinedResult = {
            ...note[0],  // MySQL treatment data
            ...treatmentData._doc  // MongoDB treatment details
        };


        return res.status(200).json(combinedResult);
    } catch (err) {
        console.error("Error: ", err.stack );
        return res.status(500).json({error: err.message})
    }
}

// Edit treatment note 
const doctorUpdateTreatmentNote = async (req, res) => {
    const treatmentId = req.params.treatment_id; 
    const { diagnosis, treatmentProcedure, medication, instruction, doctor_notes, lab_results, prescriptions } = req.body;
    const diagnostic_image = req.file ? req.file.path : null;   // Check if there is any image return

    try {
        // Update the treatment 
        const [result] = await poolDoctor.query(
            `UPDATE treatments 
             SET diagnosis = ?, 
                 treatment_procedure = ?, 
                 medication = ?, 
                 instruction = ? 
             WHERE treatment_id = ?`,
            [diagnosis, treatmentProcedure, medication, instruction, treatmentId]
        );

        // Check if any rows were affected
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Treatment note not found or no changes made' });
        }

        // Update the treatment details
        await treatmentDetails.updateOne(
            { treatment_id: treatmentId }, // Filter condition
            {
                $set: {
                    doctor_notes: doctor_notes,
                    lab_results: lab_results,
                    prescriptions: prescriptions
                }
            }
        );

        // Check if there is a URL link for the image
        if (diagnostic_image) {
            // If image URL is provided, add it to diagnostic_images array
            await treatmentDetails.updateOne(
                { treatment_id: treatmentId }, // Filter condition
                {
                    $push: { diagnostic_images: { url: diagnostic_image } }
                }
            );
        }

        return res.status(200).json({ message: 'Treatment note updated successfully' });
    } catch (error) {
        console.error("Error: ", err.stack );
        res.status(500).json({ message: 'Error updating treatment note', error: error.message });
    }
};


// View doctor schedule - table Schedule
const viewDoctorSchedules = async (req, res) => {
    const doctorId = req.user.user_id; 

    try {
        const [schedules] = await poolDoctor.query(
            `SELECT schedule_id, shift_start, shift_end, availability_status 
             FROM doctor_schedules 
             WHERE staff_id = ? 
             ORDER BY shift_start ASC`,
            [doctorId]
        );

        if (schedules.length === 0) {
            return res.status(404).json({ message: 'No schedules found for this doctor.' });
        }

        res.status(200).json({ schedules });
    } catch (error) {
        console.error('Error fetching doctor schedules:', error);
        res.status(500).json({ message: 'An error occurred while fetching schedules.' });
    }
};



// Doctor add new schedule
// Assume the shiftStart and shiftEnd are of thie format '2024-09-06 08:00:00', '2024-09-06 17:00:00'
const doctorAddSchedule = async (req, res) => {
    const doctorId = req.user.user_id;
    const {shiftStart, shiftEnd} = req.body;
    console.log(doctorId);
    console.log(shiftStart, shiftEnd)

    try {
        const [result] = await poolDoctor.query('CALL sp_add_doctor_schedule(?, ?, ?)',
            [doctorId, shiftStart, shiftEnd]
        )

        // Check if there is any error from the stored procedure (SIGNAL SQLSTATE)
        if (result && result.length > 0 && result[0][0].message_text) {
            throw new Error(result[0][0].message_text);
        }
        console.log('Procedure Output:', result);

        return res.status(200).json({message: 'Schedule added successfully'})

    }catch (err) {
        console.error("Error: ", err.stack);
        return res.status(500).json({ error: err.message }) // Handle all errors including from the stored pro
    }
}

// Doctor delete a schedule
const doctorDeleteSchedule = async (req, res) => {
    const scheduleId = req.params.schedule_id;
    const doctorId = req.user.user_id;

    try {
        const [result] = await poolDoctor.query('CALL sp_delete_doctor_schedule(?, ?)', [doctorId, scheduleId]);


        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Schedule not found' });
        }

        return res.status(200).json({ message: 'Schedule deleted successfully' });
    } catch (err) {
        console.error("Error: ", err.stack);
        return res.status(500).json({ error: err.message });
    }
};


module.exports = {
    doctorViewUpcomingProceedingAppointment,
    doctorViewCompletedAppointment,
    doctorViewTreatmentNote,
    doctorUpdateTreatmentNote,
    viewDoctorSchedules,
    doctorAddSchedule,
    doctorDeleteSchedule
}