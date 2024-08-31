import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from "react-datepicker"; // Importing date picker for better date selection
import "react-datepicker/dist/react-datepicker.css"; // Importing styles for date picker
import './PatientDashboard.css'; // Importing the CSS file

const PatientDashboard = () => {
  const [patientData, setPatientData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    patient_name: '',
    contact_number: '',
    email: '',
    gender: '',
    address: '',
  });
  const [showProfile, setShowProfile] = useState(false);

  // State for custom date picker
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchPatientProfile();
  }, []);

  const fetchPatientProfile = async () => {
    try {
      const response = await axios.get('/api/patient-profile'); // Adjust the endpoint as necessary
      setPatientData(response.data);
      setFormData({
        patient_name: response.data.patient_name,
        contact_number: response.data.contact_number,
        email: response.data.email,
        gender: response.data.gender,
        address: response.data.address,
      });

      // Set the initial date of birth based on fetched data
      const dob = new Date(response.data.dob);
      setSelectedYear(dob.getFullYear());
      setSelectedDate(dob);
    } catch (error) {
      console.error('Error fetching patient profile:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      // Construct the date of birth from selected year and date
      const dob = new Date(selectedYear, selectedDate.getMonth(), selectedDate.getDate());
      await axios.post('/api/edit-profile', { ...formData, dob }); // Adjust the endpoint as necessary
      alert('Profile updated successfully!');
      setIsEditing(false);
      fetchPatientProfile(); // Refresh the profile data
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again later.');
    }
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    // Update selectedDate to keep the month and day consistent with the new year
    const newDate = new Date(year, selectedDate.getMonth(), selectedDate.getDate());
    setSelectedDate(newDate);
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear - 100; year <= currentYear; year++) {
      years.push(year);
    }
    return years;
  };

  return (
    <div className="flex">
      <div className="sidebar p-4">
        <h2 className="text-2xl font-bold mb-4">Patient Dashboard</h2>
        <nav className="mt-4">
          <ul>
            <li className="my-2">
              <a 
                href="#my-profile" 
                onClick={(e) => {
                  e.preventDefault();
                  setShowProfile(!showProfile);
                }} 
                className="text-blue-500 cursor-pointer"
              >
                My Profile
              </a>
            </li>
            <li className="my-2"><a href="#appointments" className="text-blue-500">Appointments</a></li>
            <li className="my-2"><a href="#treatments" className="text-blue-500">Treatments</a></li>
            <li className="my-2"><a href="#doctors" className="text-blue-500">Doctor List</a></li>
            <li className="my-2"><a href="#help" className="text-blue-500">Help</a></li>
            <li className="my-2"><a href="#logout" className="text-blue-500">Logout</a></li>
          </ul>
        </nav>

        {/* Help and Logout Section */}
        <div className="fixed-bottom">
          <ul>
            <li className="my-2"><a href="#help" className="text-blue-500">Help</a></li>
            <li className="my-2"><a href="#logout" className="text-blue-500">Logout</a></li>
          </ul>
        </div>
      </div>

      <div className="main-content">
        {showProfile && (
          <div className="profile-box">
            <h2 className="text-2xl font-bold mb-4">My Profile</h2>
            {isEditing ? (
              <form onSubmit={handleUpdateProfile}>
                <div className="mb-4">
                  <label className="block">Name:</label>
                  <input
                    type="text"
                    name="patient_name"
                    value={formData.patient_name}
                    onChange={handleInputChange}
                    className="border rounded-md p-2 w-full ml-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block">Date of Birth:</label>
                  <div className="flex space-x-2">
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      className="border rounded-md p-2 w-1/2"
                      dateFormat="MMMM d"
                      showMonthDropdown
                      showDayDropdown
                      dropdownMode="select"
                    />
                    <select 
                      value={selectedYear} 
                      onChange={(e) => handleYearChange(Number(e.target.value))} 
                      className="border rounded-md p-2 w-1/2 ml-2"
                    >
                      {generateYears().map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block">Mobile Number:</label>
                  <input
                    type="text"
                    name="contact_number"
                    value={formData.contact_number}
                    onChange={handleInputChange}
                    className="border rounded-md p-2 w-full ml-2"
                    required
                    pattern="[\+0-9]*"
                    title="Please enter a valid phone number, starting with a + sign if applicable."
                  />
                </div>
                <div className="mb-4">
                  <label className="block">Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="border rounded-md p-2 w-full ml-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block">Gender:</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="border rounded-md p-2 w-full ml-2"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block">Address:</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="border rounded-md p-2 w-full ml-2"
                    required
                  />
                </div>
                <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2">Update</button>
                <button type="button" onClick={handleEditToggle} className="bg-gray-300 text-black rounded-md px-4 py-2 ml-2">Cancel</button>
              </form>
            ) : (
              <div>
                <p><strong>Name:</strong> <span className="ml-2">{patientData?.patient_name}</span></p>
                <p><strong>Date of Birth:</strong> <span className="ml-2">{patientData?.dob}</span></p>
                <p><strong>Mobile Number:</strong> <span className="ml-2">{patientData?.contact_number}</span></p>
                <p><strong>Email:</strong> <span className="ml-2">{patientData?.email}</span></p>
                <p><strong>Gender:</strong> <span className="ml-2">{patientData?.gender}</span></p>
                <p><strong>Address:</strong> <span className="ml-2">{patientData?.address}</span></p>
                <button onClick={handleEditToggle} className="bg-blue-500 text-white rounded-md px-4 py-2 mt-4">Edit Profile</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;