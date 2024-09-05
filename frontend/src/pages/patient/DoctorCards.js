// DoctorCards.js

import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from "react-datepicker"; // Importing date picker for better date selection
import "react-datepicker/dist/react-datepicker.css"; // Importing styles for date picker

const DoctorCard = ({ doctor }) => {
  const [showForm, setShowForm] = useState(false); // State to control the visibility of the booking form
  const [selectedDate, setSelectedDate] = useState(new Date()); // State for the selected date
  const [selectedTime, setSelectedTime] = useState(null); // State for the selected time

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    try {
      const appointmentData = {
        patient_name: 'John Doe', // Replace with actual patient name
        dob: selectedDate.toISOString().split('T')[0], // Convert date to ISO format
        gender: 'Male', // Replace with actual gender
        phone_number: '123-456-7890', // Replace with actual phone number
        address: '123 Elm St, Springfield', // Replace with actual address
        symptoms: 'General Checkup', // Replace with actual symptoms
        date_of_visit: selectedDate.toISOString().split('T')[0], // Convert date to ISO format
        time_of_visit: selectedTime || 'N/A', // Set time if selected, otherwise 'N/A'
      };

      // Send a POST request to create an appointment
      await axios.post('/api/appointments', appointmentData);
      alert('Appointment booked successfully!');
      setShowForm(false); // Hide the form after booking
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again later.');
    }
  };

  return (
    <div className="border p-4 rounded-lg shadow-md mb-4">
      <img src={doctor.image} alt={doctor.name} className="w-20 h-20 rounded-full object-cover" />
      <h2 className="text-lg font-bold">{doctor.name}</h2>
      <p className="text-sm text-gray-500">{doctor.department}</p>
      <p className="text-sm text-gray-500">Performance Rating: {doctor.performanceRating} ★</p>
      <div className="flex flex-col mt-2">
        {doctor.schedule.map((time) => (
          <div key={time.time} className="flex items-center justify-between mb-1">
            <span>{time.time}</span>
            {time.status === 'Available' ? (
              <button 
                onClick={() => { 
                  setSelectedTime(time.time); 
                  setShowForm(true); 
                }} 
                className="bg-blue-500 text-white rounded-md px-4 py-1 hover:bg-blue-700"
              >
                Book
              </button>
            ) : (
              <span className="text-red-500">Busy</span>
            )}
          </div>
        ))}
      </div>

      {showForm && (
        <>
          <div className="absolute top-0 left-0 w-full h-full bg-gray-900 opacity-50" onClick={() => setShowForm(false)} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 shadow-md rounded-md">
            <h2 className="text-lg font-bold mb-4">Book Appointment</h2>
            <form onSubmit={handleBookAppointment}>
              <div className="mb-4">
                <label className="block">Patient's Name:</label>
                <input 
                  type="text" 
                  value="John Doe" 
                  className="border rounded-md p-2 w-full ml-2" 
                  readOnly 
                />
              </div>
              <div className="mb-4">
                <label className="block">Date of Birth:</label>
                <DatePicker 
                  selected={selectedDate} 
                  onChange={(date) => setSelectedDate(date)} 
                  className="border rounded-md p-2 w-full ml-2" 
                  dateFormat="MMMM d, yyyy" 
                />
              </div>
              <div className="mb-4">
                <label className="block">Gender:</label>
                <select 
                  value="Male" 
                  className="border rounded-md p-2 w-full ml-2" 
                  readOnly 
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block">Phone Number:</label>
                <input 
                  type="text" 
                  value="123-456-7890" 
                  className="border rounded-md p-2 w-full ml-2" 
                  readOnly 
                />
              </div>
              <div className="mb-4">
                <label className="block">Address:</label>
                <input 
                  type="text" 
                  value="123 Elm St, Springfield" 
                  className="border rounded-md p-2 w-full ml-2" 
                  readOnly 
                />
              </div>
              <div className="mb-4">
                <label className="block">Symptoms:</label>
                <textarea 
                  rows={3} 
                  cols={30} 
                  value="General Checkup" 
                  className="border rounded-md p-2 w-full ml-2" 
                  readOnly 
                />
              </div>
              <div className="mb-4">
                <label className="block">Date of Visit:</label>
                <span>{selectedDate.toISOString().split('T')[0]}</span>
              </div>
              <div className="mb-4">
                <label className="block">Time of Visit:</label>
                <span>{selectedTime || 'N/A'}</span>
              </div>

              <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2">Submit</button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default DoctorCard;