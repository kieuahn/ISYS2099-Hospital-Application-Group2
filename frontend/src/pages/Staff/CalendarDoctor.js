import React, { useState, useEffect } from 'react';
import api from '../../utils/api'; // Assuming you're using the same API utility

const CalendarDoctor = () => {
    const [schedules, setSchedules] = useState([]);
    const [startDate, setStartDate] = useState(new Date()); // Default to current date
    const [endDate, setEndDate] = useState(new Date());

    // Fetch doctor schedules
    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                // Ensure correct date formatting
                const query = `?start_date=${startDate.toISOString().split('T')[0]}&end_date=${endDate.toISOString().split('T')[0]}`;
                
                // Make the API call
                const response = await api.get(`/staff/doctor-schedules${query}`);
                
                // Log the response to check structure
                console.log("API Response:", response.data);
                
                // Ensure we're accessing the correct part of the response
                if (response.data.length > 0 && Array.isArray(response.data[0])) {
                    setSchedules(response.data[0]); // Set the schedule data
                } else {
                    console.error("Unexpected data structure", response.data);
                }
            } catch (error) {
                console.error('Error fetching doctor schedules:', error.response?.data || error.message || error);
            }
        };

        fetchSchedules();
    }, [startDate, endDate]);


        // Group schedules by day
    const groupedSchedules = schedules.reduce((acc, schedule) => {
        const date = new Date(schedule.shift_start).toLocaleDateString();
        if (!acc[date]) acc[date] = [];
        acc[date].push(schedule);
        return acc;
    }, {});


    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Title Section */}
            <div className="text-center">
                <h1 className="text-4xl font-bold">Doctor Schedules</h1>
            </div>

            {/* Date Selector Section */}
            <div className="flex justify-between items-center">
                <div className="space-x-4">
                    <label className="font-semibold">Start Date: </label>
                    <input 
                        type="date" 
                        value={startDate.toISOString().split('T')[0]} 
                        onChange={e => setStartDate(new Date(e.target.value))}
                        className="border p-2 rounded"
                    />
                </div>
                <div className="space-x-4">
                    <label className="font-semibold">End Date: </label>
                    <input 
                        type="date" 
                        value={endDate.toISOString().split('T')[0]} 
                        onChange={e => setEndDate(new Date(e.target.value))}
                        className="border p-2 rounded"
                    />
                </div>
            </div>

            {/* Schedules Section */}
            <div className="bg-white shadow-md rounded-lg p-6">
                {Object.keys(groupedSchedules).length > 0 ? (
                    Object.keys(groupedSchedules).map((date, index) => (
                        <div key={index} className="mb-6">
                            <h2 className="text-2xl font-semibold mb-2">{date}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {groupedSchedules[date].map((schedule, idx) => (
                                    <div key={idx} className="schedule-item bg-gray-100 p-4 rounded shadow">
                                        <p><strong>Doctor:</strong> {schedule.staff_name}</p>
                                        <p><strong>Shift:</strong> {new Date(schedule.shift_start).toLocaleTimeString()} - {new Date(schedule.shift_end).toLocaleTimeString()}</p>
                                        <p><strong>Status:</strong> {schedule.availability_status}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No schedules available for the selected range.</p>
                )}
            </div>
        </div>
    );
};

export default CalendarDoctor;
