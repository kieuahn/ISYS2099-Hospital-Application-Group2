import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // To get doctor_id from the URL
import api from '../../utils/api'; // Axios instance for API calls

const DoctorDetails = () => {
  const { doctor_id } = useParams(); // Get doctor_id from the route parameter
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await api.get(`/staff/doctor/${doctor_id}`);
        setDoctorDetails(response.data);
      } catch (error) {
        setError('Error fetching doctor details.');
        console.error('Error fetching doctor details:', error.response?.data || error.message || error);
      }
    };

    fetchDoctorDetails();
  }, [doctor_id]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!doctorDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6">Doctor Details</h1>
      <div className="mb-4">
        <strong>Name:</strong> {doctorDetails.staff_name}
      </div>
      <div className="mb-4">
        <strong>Manager:</strong> {doctorDetails.manager_id}
      </div>
      <div className="mb-4">
        <strong>Department:</strong> {doctorDetails.department_id}
      </div>
      <div className="mb-4">
        <strong>Job Type:</strong> {doctorDetails.job_type}
      </div>
      <div className="mb-4">
        <strong>Qualification:</strong> {doctorDetails.qualification}
      </div>
      <div className="mb-4">
        <strong>Salary:</strong> {doctorDetails.salary}
      </div>
      {/* Add any other fields that you wish to display */}
    </div>
  );
};

export default DoctorDetails;
