import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
      const fetchPatients = async () => {
          try {
              const response = await api.get('/staff/patients');
              console.log('Patient data:', response.data);
              setPatients(response.data);
          } catch (error) {
              console.error('Error fetching patients:', error.response?.data || error.message || error);
          }
      };

      fetchPatients();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-4">Patient List</h1>

      {/* Filter/Search Section */}
      <div className="flex justify-between mb-6">
        <input
          type="text"
          placeholder="Search by Name or ID"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Patient ID</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Gender</th>
                <th className="px-4 py-2 text-left">Contact Number</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.length > 0 ? (
                patients.map((patient) => (
                  <tr key={patient.patient_id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-2">{patient.patient_id}</td>
                    <td className="px-4 py-2">{patient.patient_name}</td>
                    <td className="px-4 py-2">{patient.gender}</td>
                    <td className="px-4 py-2">{patient.contact_number}</td>
                    <td className="px-4 py-2">
                      <button 
                          onClick={() => navigate(`/patient/${patient.patient_id}/treatment-history`)}
                          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      >
                          View Treatment History
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-2 text-center" colSpan="3">
                    No patients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PatientList;
