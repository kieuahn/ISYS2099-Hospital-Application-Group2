import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorCards = () => {
  const [doctors, setDoctors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: '',
    phone: '',
    address: '',
    symptoms: '',
    appointmentDate: '',
    appointmentTime: '',
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('/api/doctors'); // Adjust the endpoint as necessary
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: '',
      dob: '',
      gender: '',
      phone: '',
      address: '',
      symptoms: '',
      appointmentDate: '',
      appointmentTime: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/appointments', formData); // Send form data to the backend API
      alert('Appointment booked successfully!');
      closeModal();
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again later.');
    }
  };

  return (
    <div className="flex flex-wrap justify-center">
      {doctors.map((doctor) => (
        <div key={doctor.staff_id} className="m-4 p-4 border rounded-lg shadow-lg w-64">
          <img src={doctor.image || 'default-doctor.png'} alt={doctor.staff_name} className="w-full h-32 object-cover rounded-t-lg" />
          <h2 className="text-lg font-bold">{doctor.staff_name}</h2>
          <p className="text-gray-600">{doctor.qualification}</p>
          <button
            onClick={() => openModal(doctor)}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Make an Appointment
          </button>
        </div>
      ))}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-xl font-bold mb-4">Make an Appointment with {selectedDoctor.staff_name}</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="mb-4">
                <label>Date of Birth:</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="mb-4">
                <label>Gender:</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="mb-4">
                <label>Phone Number:</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="mb-4">
                <label>Address:</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="mb-4">
                <label>Symptoms:</label>
                <textarea
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="mb-4">
                <label>Schedule Appointment:</label>
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
                <input
                  type="time"
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2 mt-2"
                />
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded-md mr-2">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorCards;

// Backend API please add:
// Fetch Doctors Endpoint: /api/doctors (GET)
// Submit Appointment Endpoint: /api/appointments (POST)