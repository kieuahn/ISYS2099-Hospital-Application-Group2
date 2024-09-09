import React, { useState, useEffect } from 'react';
import api from '../../utils/api'; // Make sure this points to your API handling utility (Axios, etc.)

const DoctorPerformance = () => {
    const [ratingsData, setRatingsData] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPerformanceRatings = async () => {
            try {
                // Fetch data from the correct backend route
                const response = await api.get('/staff/doctor-performance');
                setRatingsData(response.data);
            } catch (error) {
                setError('Error fetching doctor performance ratings.');
                console.error('Error fetching doctor performance ratings:', error.response?.data || error.message || error);
            }
        };
        fetchPerformanceRatings();
    }, []);

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-4xl font-bold mb-6 text-center">Doctor Performance Ratings</h1>

            {error && <p className="text-red-500">{error}</p>}

            <div className="overflow-x-auto bg-white shadow-md rounded-lg p-6">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left">Doctor Name</th>
                            <th className="px-4 py-2 text-left">Performance Rating</th>
                            <th className="px-4 py-2 text-left">Appointment ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ratingsData.map((rating, index) => (
                            <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                                <td className="px-4 py-2">{rating.doctor_name}</td>
                                <td className="px-4 py-2">{rating.performance_rating}</td>
                                <td className="px-4 py-2">{rating.appointment_id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DoctorPerformance;
