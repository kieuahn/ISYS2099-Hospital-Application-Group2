import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import api from '../../utils/api';


const WorkloadPage = () => {
  const { staff_id } = useParams(); // Get staff_id from the URL
  const [workloadData, setWorkload] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

useEffect(() => {
  const fetchWorkload = async () => {
    try {
    //   const query = `?start_date=${startDate}&end_date=${endDate}`;
    const query = `?start_date=${startDate.toISOString().split('T')[0]}&end_date=${endDate.toISOString().split('T')[0]}`;

      let response;
      if (staff_id) {
        response = await api.get(`/staff/doctor-workload/${staff_id}${query}`);
      } else {
        response = await api.get(`/staff/all-doctors-workload${query}`);
      }

      console.log('Workload data:', response.data[0]); // Access the first element of the response
      setWorkload(response.data[0]); // Set workload to the first array
    } catch (error) {
      console.error('Error fetching workload:', error.response?.data || error.message || error);
    }
  };

    fetchWorkload();
    }, [staff_id, startDate, endDate]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-4">Workload for {staff_id ? 'Selected Staff' : 'All Staff'}</h1>

      {/* Date Filter Section */}
      <div className="flex justify-between mb-6">
        <div className="flex space-x-4">
          <div>
            <label className="block text-gray-700 mb-2">Start Date:</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy-MM-dd"
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">End Date:</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="yyyy-MM-dd"
              className="border p-2 rounded w-full"
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Total Appointments</th>
                <th className="px-4 py-2 text-left">Total Minutes</th>
              </tr>
            </thead>
            <tbody>
              {workloadData && workloadData.length > 0 ? (
                workloadData.map((staff) => (
                  <tr key={staff.staff_id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-2">{staff.staff_name}</td>
                    <td className="px-4 py-2">{staff.total_appointments}</td>
                    <td className="px-4 py-2">{staff.total_minutes}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-2 text-center" colSpan="3">
                    No workload data available.
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
export default WorkloadPage;
