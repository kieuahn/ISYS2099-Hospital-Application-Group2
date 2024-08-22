const mysql = require("../config/db")


// Patient view their profile
const getPatientProfile = async (req, res) => {
    try{
        // Extract user ID from req.user
        const patient_id = req.user.user_id;

        const query = 'SELECT * FROM patients WHERE patient_id = ?';
        const [patient] = await mysql.promise().query(query, [patient_id]); // Retrieve the patient from table Patient

        // Check if the query statement return any row
        if (patient.length === 0) {
            return res.status(404).json({message: "Sorry, No Patient Found"})
        }

        return res.status(200).json(patient[0])
    }
    catch (err) {
        console.error("Error: ", err.stack);
        return res.status(500).json({error: err.message})
    }    
}

const editPatientProfile = async (req, res) => {
    
}

module.exports = {getPatientProfile}