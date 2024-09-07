import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from "react-datepicker"; // Importing date picker for better date selection
import "react-datepicker/dist/react-datepicker.css"; // Importing styles for date picker
import "./PatientDashboard.css" // Importing the CSS file
import DoctorCard from './DoctorCards'; // Adjust the path as necessary

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
  const [showAppointments, setShowAppointments] = useState(false);
  const [showTreatments, setShowTreatments] = useState(false); // State for showing treatments
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming'); // Track which tab is active
  const [treatments, setTreatments] = useState([]); // State for treatments

  // State for custom date picker
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [showDoctorList, setShowDoctorList] = useState(false); // State for showing doctor list
  const [doctors, setDoctors] = useState([]); // State for doctors

  useEffect(() => {
    // Use mock data instead of API calls
    fetchMockData();
  }, []);

  const fetchMockData = () => {
    // Mock patient profile
    setPatientData(mockPatientProfile);
    setFormData({
      patient_name: mockPatientProfile.patient_name,
      contact_number: mockPatientProfile.contact_number,
      email: mockPatientProfile.email,
      gender: mockPatientProfile.gender,
      address: mockPatientProfile.address,
    });
    const dob = new Date(mockPatientProfile.dob);
    setSelectedYear(dob.getFullYear());
    setSelectedDate(dob);

    // Mock appointments
    setUpcomingAppointments(mockUpcomingAppointments);
    setPastAppointments(mockPastAppointments);

    // Mock treatments
    setTreatments(mockTreatments);

    // Mock doctors
    setDoctors(mockDoctors);
  };


  const fetchDoctors = async () => {
    try {
      const response = await axios.get('/api/doctors'); // Replace with your actual API endpoint
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

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

      const dob = new Date(response.data.dob);
      setSelectedYear(dob.getFullYear());
      setSelectedDate(dob);
    } catch (error) {
      console.error('Error fetching patient profile:', error);
    }
  };

  const fetchUpcomingAppointments = async () => {
    try {
      const response = await axios.get('/api/upcoming-appointments'); // Adjust the endpoint as necessary
      setUpcomingAppointments(response.data);
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error);
    }
  };

  const fetchPastAppointments = async () => {
    try {
      const response = await axios.get('/api/past-appointments'); // Adjust the endpoint as necessary
      setPastAppointments(response.data);
    } catch (error) {
      console.error('Error fetching past appointments:', error);
    }
  };

  const fetchTreatments = async () => {
    try {
      const response = await axios.get('/api/treatments'); // Adjust the endpoint as necessary
      setTreatments(response.data);
    } catch (error) {
      console.error('Error fetching treatments:', error);
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
      <div className="w-1/4 p-4 bg-gray-200">
        <h2 className="text-xl font-bold">Patient Dashboard</h2>
        <nav className="mt-4">
          <ul>
            <li className="my-2" onClick={() => {
              setShowProfile(true);
              setShowAppointments(false); // Hide appointments when clicking on My Profile
              setShowTreatments(false); // Hide treatments
              setShowDoctorList(false); // Hide doctor list
            }}>
              <a className="text-blue-500 cursor-pointer">My Profile</a>
            </li>
            <li className="my-2" onClick={() => {
              setShowAppointments(true);
              setShowProfile(false); // Hide profile when clicking on Appointments
              setShowTreatments(false); // Hide treatments
              setShowDoctorList(false); // Hide doctor list
            }}>
              <a className="text-blue-500 cursor-pointer">Appointments</a>
            </li>
            <li className="my-2" onClick={() => {
              setShowTreatments(true);
              setShowProfile(false); // Hide profile when clicking on Treatments
              setShowAppointments(false); // Hide appointments when clicking on Treatments
              setShowDoctorList(false); // Hide doctor list
            }}>
              <a className="text-blue-500 cursor-pointer">Treatments</a>
            </li>
            <li className="my-2" onClick={() => {
              setShowDoctorList(true);
              setShowProfile(false); // Hide profile when clicking on Doctor List
              setShowAppointments(false); // Hide appointments
              setShowTreatments(false); // Hide treatments
            }}>
              <a className="text-blue-500 cursor-pointer">Doctor List</a>
            </li>
            <li className="my-2"><a className="text-blue-500">Help</a></li>
            <li className="my-2"><a className="text-blue-500">Logout</a></li>
          </ul>
        </nav>
      </div>

      <div className="w-3/4 p-4">
        {showProfile && (
          <div className="border p-4 rounded-lg shadow-md mb-4">
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

        {showAppointments && (
          <div className="border p-4 rounded-lg shadow-md mb-4">
            <h2 className="text-2xl font-bold mb-4">Appointments</h2>
            <div className="mb-4">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-4 py-2 ${activeTab === 'upcoming' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Upcoming Appointments
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-4 py-2 ${activeTab === 'past' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Past Appointments
              </button>
            </div>

            {activeTab === 'upcoming' ? (
              <div>
                {upcomingAppointments.length === 0 ? (
                  <p>No upcoming appointments.</p>
                ) : (
                  <table className="min-w-full border">
                    <thead>
                      <tr>
                        <th className="border px-4 py-2">Doctor</th>
                        <th className="border px-4 py-2">Purpose</th>
                        <th className="border px-4 py-2">Date</th>
                        <th className="border px-4 py-2">Status</th>
                        <th className="border px-4 py-2">Payment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingAppointments.map((appointment) => (
                        <tr key={appointment.appointment_id}>
                          <td className="border px-4 py-2">{appointment.doctor_name}</td>
                          <td className="border px-4 py-2">{appointment.purpose}</td>
                          <td className="border px-4 py-2">{new Date(appointment.start_time).toLocaleString()}</td>
                          <td className="border px-4 py-2">{appointment.status}</td>
                          <td className="border px-4 py-2">{appointment.payment_amount || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ) : (
              <div>
                {pastAppointments.length === 0 ? (
                  <p>No past appointments.</p>
                ) : (
                  <table className="min-w-full border">
                    <thead>
                      <tr>
                        <th className="border px-4 py-2">Doctor</th>
                        <th className="border px-4 py-2">Purpose</th>
                        <th className="border px-4 py-2">Date</th>
                        <th className="border px-4 py-2">Status</th>
                        <th className="border px-4 py-2">Payment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pastAppointments.map((appointment) => (
                        <tr key={appointment.appointment_id}>
                          <td className="border px-4 py-2">{appointment.doctor_name}</td>
                          <td className="border px-4 py-2">{appointment.purpose}</td>
                          <td className="border px-4 py-2">{new Date(appointment.start_time).toLocaleString()}</td>
                          <td className="border px-4 py-2">{appointment.status}</td>
                          <td className="border px-4 py-2">{appointment.payment_amount || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        )}

        {showTreatments && (
          <div className="border p-4 rounded-lg shadow-md mb-4">
            <h2 className="text-2xl font-bold mb-4">Treatments</h2>
            {treatments.length === 0 ? (
              <p>No treatments yet.</p>
            ) : (
              <table className="min-w-full border">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Treatment ID</th>
                    <th className="border px-4 py-2">Diagnosis</th>
                    <th className="border px-4 py-2">Treatment Date</th>
                  </tr>
                </thead>
                <tbody>
                  {treatments.map((treatment) => (
                    <tr key={treatment.treatment_id}>
                      <td className="border px-4 py-2">{treatment.treatment_id}</td>
                      <td className="border px-4 py-2">{treatment.diagnosis}</td>
                      <td className="border px-4 py-2">{new Date(treatment.treatment_date).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}


        {showDoctorList && (
          <div className="border p-4 rounded-lg shadow-md mb-4">
            <h2 className="text-2xl font-bold mb-4">Doctor List</h2>
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.doctor_id} doctor={doctor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Mock Data for Testing
const mockPatientProfile = {
  patient_name: "John Doe",
  contact_number: "+1234567890",
  email: "john.doe@hospital.com",
  gender: "Male",
  address: "1234 Elm Street",
  dob: "1980-04-12",
};

const mockUpcomingAppointments = [
  {
    appointment_id: 1,
    doctor_name: "Dr. Smith",
    purpose: "Check-up",
    start_time: new Date().toISOString(),
    status: "Confirmed",
    payment_amount: 50.0,
  },
];

const mockPastAppointments = [
  {
    appointment_id: 2,
    doctor_name: "Dr. Jane Doe",
    purpose: "Follow-up",
    start_time: "2023-05-21T10:30:00Z",
    status: "Completed",
    payment_amount: 45.0,
  },
];

const mockTreatments = [
  {
    treatment_id: 1,
    diagnosis: "Common Cold",
    treatment_date: "2023-03-14T14:00:00Z",
  },
];

const mockDoctors = [
  {
    doctor_id: 1,
    staff_name: "Dr. John Smith",
    qualification: "Cardiologist",
    image: "doctor1.jpg",
  },
  {
    doctor_id: 2,
    staff_name: "Dr. Emily Johnson",
    qualification: "Dermatologist",
    image: "doctor2.jpg",
  },
];

export default PatientDashboard;