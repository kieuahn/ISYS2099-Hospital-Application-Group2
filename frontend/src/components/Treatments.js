import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Treatments = () => {
  const [treatments, setTreatments] = useState([]);
  const [activeTab, setActiveTab] = useState('past'); // Track which tab is active

  useEffect(() => {
    fetchTreatments();
  }, []);

  const fetchTreatments = async () => {
    try {
      const response = await axios.get('/api/treatments'); // Adjust the endpoint as necessary
      setTreatments(response.data);
    } catch (error) {
      console.error('Error fetching treatments:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Treatments</h2>
      <div className="mb-4">
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 ${activeTab === 'past' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Past Treatments
        </button>
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 ${activeTab === 'upcoming' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Upcoming Treatments
        </button>
      </div>

      {activeTab === 'past' ? (
        <div>
          {treatments.length === 0 ? (
            <p>No past treatments.</p>
          ) : (
            <table className="min-w-full border">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Doctor</th>
                  <th className="border px-4 py-2">Diagnosis</th>
                  <th className="border px-4 py-2">Treatment Date</th>
                  <th className="border px-4 py-2">Medication</th>
                  <th className="border px-4 py-2">Instructions</th>
                </tr>
              </thead>
              <tbody>
                {treatments.map((treatment) => (
                  <tr key={treatment.treatment_id}>
                    <td className="border px-4 py-2">{treatment.doctor_name}</td>
                    <td className="border px-4 py-2">{treatment.diagnosis}</td>
                    <td className="border px-4 py-2">{new Date(treatment.treatment_date).toLocaleString()}</td>
                    <td className="border px-4 py-2">{treatment.medication || 'N/A'}</td>
                    <td className="border px-4 py-2">{treatment.instruction || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div>
          {/* Upcoming Treatments logic can be added here */}
          <p>No upcoming treatments available.</p>
        </div>
      )}
    </div>
  );
};

export default Treatments;