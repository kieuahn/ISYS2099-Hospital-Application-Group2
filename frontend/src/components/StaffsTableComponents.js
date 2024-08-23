import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StaffManagement = () => {
  const [staffs, setStaffs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('staff_id');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    fetchStaffs();
  }, []);

  const fetchStaffs = async () => {
    try {
      const response = await axios.get('/api/staff'); // Fetch staff data from the API
      setStaffs(response.data); // Set the staff data in state
    } catch (error) {
      console.error('Error fetching staffs:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const filteredStaffs = staffs.filter((staff) =>
    staff.staff_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedStaffs = filteredStaffs.sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div>
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearch}
          className="px-4 py-2 border border-gray-300 rounded-md"
        />
        <div>
          <button
            onClick={() => handleSort('staff_id')}
            className="px-4 py-2 mr-2 bg-blue-500 text-white rounded-md"
          >
            Staff ID {sortColumn === 'staff_id' && (sortDirection === 'asc' ? '▲' : '▼')}
          </button>
          <button
            onClick={() => handleSort('staff_name')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Name {sortColumn === 'staff_name' && (sortDirection === 'asc' ? '▲' : '▼')}
          </button>
        </div>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border">Staff ID</th>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Position</th>
            <th className="py-2 px-4 border">Department</th>
            <th className="py-2 px-4 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedStaffs.map((staff) => (
            <tr key={staff.staff_id} className="border-b">
              <td className="py-2 px-4">{staff.staff_id}</td>
              <td className="py-2 px-4">{staff.staff_name}</td>
              <td className="py-2 px-4">{staff.job_type}</td>
              <td className="py-2 px-4">{staff.department_id}</td>
              <td className="py-2 px-4">
                <button
                  className="px-4 py-2 mr-2 bg-green-500 text-white rounded-md"
                >
                  Update
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-md"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffManagement;