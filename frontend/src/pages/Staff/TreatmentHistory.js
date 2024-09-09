import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';

const TreatmentHistoryPage = () => {
    const { patient_id } = useParams(); // Get patient_id from URL params
    const [treatmentHistory, setTreatmentHistory] = useState([]);
    const [startDate, setStartDate] = useState('2024-01-01');
    const [endDate, setEndDate] = useState('2024-12-31');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTreatmentHistory = async () => {
            try {
                const response = await api.get(`/staff/patient/${patient_id}/treatment-history`, {
                    params: {
                        start_date: startDate,
                        end_date: endDate
                    }
                });
                setTreatmentHistory(response.data);
                setLoading(false);
            } catch (error) {
                setError(error.response?.data?.message || error.message);
                setLoading(false);
            }
        };

        fetchTreatmentHistory();
    }, [patient_id, startDate, endDate]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error fetching treatment history: {error}</p>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">Treatment History for Patient #{patient_id}</h1>
            
            <div className="mb-4 flex justify-between">
                <div>
                    <label>Start Date: </label>
                    <input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border p-2 rounded mr-4"
                    />
                </div>
                <div>
                    <label>End Date: </label>
                    <input 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border p-2 rounded"
                    />
                </div>
            </div>

            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left">Treatment ID</th>
                            <th className="px-4 py-2 text-left">Doctor</th>
                            <th className="px-4 py-2 text-left">Diagnosis</th>
                            <th className="px-4 py-2 text-left">Procedure</th>
                            <th className="px-4 py-2 text-left">Medication</th>
                            <th className="px-4 py-2 text-left">Instruction</th>
                            <th className="px-4 py-2 text-left">Treatment Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {treatmentHistory.map((treatment, index) => (
                            <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                                <td className="px-4 py-2">{treatment.treatment_id}</td>
                                <td className="px-4 py-2">{treatment.doctor_name}</td> 
                                <td className="px-4 py-2">{treatment.diagnosis}</td>
                                <td className="px-4 py-2">{treatment.treatment_procedure}</td>
                                <td className="px-4 py-2">{treatment.medication}</td>
                                <td className="px-4 py-2">{treatment.instruction}</td>
                                <td className="px-4 py-2">{new Date(treatment.treatment_date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TreatmentHistoryPage;
