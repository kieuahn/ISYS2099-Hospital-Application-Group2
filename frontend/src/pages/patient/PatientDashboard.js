import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PatientDashboard = () => {
  const [patientData, setPatientData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    patient_name: '',
    dob: '',
    contact_number: '',
    email: '',
    gender: '',
    address: '',
  });

  useEffect(() => {
    fetchPatientProfile();
  }, []);

  const fetchPatientProfile = async () => {
    try {
      const response = await axios.get('/api/patient-profile'); // Adjust the endpoint as necessary
      setPatientData(response.data);
      setFormData({
        patient_name: response.data.patient_name,
        dob: response.data.dob,
        contact_number: response.data.contact_number,
        email: response.data.email,
        gender: response.data.gender,
        address: response.data.address,
      });
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
      await axios.post('/api/edit-profile', formData); // Adjust the endpoint as necessary
      alert('Profile updated successfully!');
      setIsEditing(false);
      fetchPatientProfile(); // Refresh the profile data
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again later.');
    }
  };

  return (
    <div className="flex">
      <div className="w-1/4 p-4 bg-gray-200">
        <h2 className="text-xl font-bold">Patient Dashboard</h2>
        <nav className="mt-4">
          <ul>
            <li className="my-2"><a href="#profile" className="text-blue-500">My Profile</a></li>
            <li className="my-2"><a href="#appointments" className="text-blue-500">Appointments</a></li>
            <li className="my-2"><a href="#treatments" className="text-blue-500">Treatments</a></li>
            <li className="my-2"><a href="#doctors" className="text-blue-500">Doctor List</a></li>
            <li className="my-2"><a href="#help" className="text-blue-500">Help</a></li>
            <li className="my-2"><a href="#logout" className="text-blue-500">Logout</a></li>
          </ul>
        </nav>
      </div>

      <div className="w-3/4 p-4">
        <h2 className="text-2xl font-bold mb-4" id="profile">My Profile</h2>
        {isEditing ? (
          <form onSubmit={handleUpdateProfile}>
            <div className="mb-4">
              <label className="block">Name:</label>
              <input
                type="text"
                name="patient_name"
                value={formData.patient_name}
                onChange={handleInputChange}
                className="border rounded-md p-2 w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block">Date of Birth:</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className="border rounded-md p-2 w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block">Mobile Number:</label>
              <input
                type="text"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleInputChange}
                className="border rounded-md p-2 w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="border rounded-md p-2 w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block">Gender:</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="border rounded-md p-2 w-full"
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
                className="border rounded-md p-2 w-full"
                required
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2">Update</button>
            <button type="button" onClick={handleEditToggle} className="bg-gray-300 text-black rounded-md px-4 py-2 ml-2">Cancel</button>
          </form>
        ) : (
          <div>
            <p><strong>Name:</strong> {patientData?.patient_name}</p>
            <p><strong>Date of Birth:</strong> {patientData?.dob}</p>
            <p><strong>Mobile Number:</strong> {patientData?.contact_number}</p>
            <p><strong>Email:</strong> {patientData?.email}</p>
            <p><strong>Gender:</strong> {patientData?.gender}</p>
            <p><strong>Address:</strong> {patientData?.address}</p>
            <button onClick={handleEditToggle} className="bg-blue-500 text-white rounded-md px-4 py-2 mt-4">Edit Profile</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;