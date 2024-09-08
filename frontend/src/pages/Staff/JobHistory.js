import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';  

const JobHistoryPage = () => {
  const { doctor_id } = useParams();  // Get doctor_id from route params
  const [jobHistory, setJobHistory] = useState([]);

  useEffect(() => {
    const fetchJobHistory = async () => {
      try {
        const response = await api.get(`/staff/${doctor_id}/job-history`);
        setJobHistory(response.data);  // Set the job history from the response
      } catch (error) {
        console.error('Error fetching job history:', error.response?.data || error.message);
      }
    };

    fetchJobHistory();
  }, [doctor_id]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Job History for Doctor ID {doctor_id}</h1>
      {jobHistory.length > 0 ? (
        <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Staff Name</th>
              <th className="px-4 py-2 text-left">Department</th>
              <th className="px-4 py-2 text-left">Manager</th>
              <th className="px-4 py-2 text-left">Qualification</th>
              <th className="px-4 py-2 text-left">Salary</th>
              <th className="px-4 py-2 text-left">Job Type</th>
              <th className="px-4 py-2 text-left">Updated At</th>
            </tr>
          </thead>
          <tbody>
            {jobHistory.map((historyItem) => (
              <tr key={historyItem.staff_id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2">{historyItem.staff_name}</td>
                <td className="px-4 py-2">{historyItem.department_name || 'N/A'}</td>
                <td className="px-4 py-2">{historyItem.manager_name || 'N/A'}</td>
                <td className="px-4 py-2">{historyItem.qualification}</td>
                <td className="px-4 py-2">{historyItem.salary}</td>
                <td className="px-4 py-2">{historyItem.job_type}</td>
                <td className="px-4 py-2">{new Date(historyItem.updated_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No job history found for this doctor.</p>
      )}
    </div>
  );
};

export default JobHistoryPage;
