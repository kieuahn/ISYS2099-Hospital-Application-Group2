import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";


const StaffList = () => {
  const [staff, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [nameOrder, setNameOrder] = useState('ASC');
  const [filter, setFilter] = useState({ name: "", department: "" });
  // const [departments, setDepartments] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newStaff, setNewStaff] = useState({
    staff_name: '',
    email: '',
    department_id: '',
    qualification: '',
    salary: '',
    job_type: 'Doctor', // Default to "Doctor"
    manager_id: '' // Only Admin will set this
  });
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate()

const fetchStaff = async () => {
  try {
    // Fetch with name order and name filter from the frontend
    const response = await api.get(`/staff/name?order=${nameOrder}&name=${filter.name}`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    setStaff(response.data);
  } catch (error) {
    console.error("Error fetching staff:", error);
  }
};

  // Fetch staff data when the component mounts and whenever nameOrder or filter changes
  useEffect(() => {
    fetchStaff();
  }, [nameOrder, filter])


  // Handle staff deletion
  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/staff/staff/${id}`);  // Update the route for deletion
      if (response.status === 200) {
        setStaff(staff.filter((s) => s.staff_id !== id));
        alert("Staff deleted successfully.");
      } else {
        alert("Failed to delete staff. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting staff:", error);
      alert(`Failed to delete staff: ${error.response?.data?.message || "An error occurred"}`);
    }
  };
  // Handle edit staff
  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setIsEditing(true);
  };

  // Handle update staff
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { staff_id, staff_name, department_id, qualification, salary, job_type } = selectedStaff;
      await api.put(`staff/staff/${staff_id}`, {
        name: staff_name,
        department_id,
        qualification,
        salary,
        job_type,
      });
      setIsEditing(false);
      setStaff(staff.map((s) => (s.staff_id === staff_id ? selectedStaff : s)));
      alert("Staff updated successfully.");
    } catch (error) {
      console.error("Error updating staff:", error);
      alert("Failed to update staff. Please try again.");
    }
  };

const handleAddStaff = async (e) => {
  e.preventDefault();
  try {
    const response = await api.post('/staff/add-staff', newStaff, {
      headers: { Authorization: `Bearer ${auth.token}` }, // Make sure you are sending the correct auth token
    });

    // Assuming your backend returns a success message
    setStaff([...staff, response.data]);
    setIsAdding(false);
    alert('Staff added successfully!');
  } catch (error) {
    console.error('Error adding staff:', error);
    alert('Failed to add staff.');
  }
};

const handleChange = (e) => {
  setNewStaff({ ...newStaff, [e.target.name]: e.target.value });
};


  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-4">Staff List</h1>

      {/* Filter Section */}
      <div className="flex justify-between mb-6">
  <div>
    <select
      value={nameOrder}
      onChange={(e) => setNameOrder(e.target.value)}  // Use setNameOrder directly
      className="border p-2 rounded mr-4"
    >
      <option value="ASC">Filter by Name (A-Z)</option>
      <option value="DESC">Filter by Name (Z-A)</option>
    </select>
  </div>
  <div>
    <button
      onClick={() => setIsAdding(true)}
      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
    >
      Add Staff
    </button>
        
      {isAdding && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-1/2">
            <h2 className="text-2xl font-bold mb-4">Add Staff</h2>
            <form onSubmit={handleAddStaff}>
              {/* Staff Name */}
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  placeholder="Name"
                  value={newStaff.name}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  value={newStaff.email}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>

              {/* Department */}
              <div className="mb-4">
                <label className="block text-gray-700">Department</label>
                <input
                  type="text"
                  value={newStaff.department_id}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>

              {/* Qualification */}
              <div className="mb-4">
                <label className="block text-gray-700">Qualification</label>
                <input
                  type="text"
                  value={newStaff.qualification}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>

              {/* Salary */}
              <div className="mb-4">
                <label className="block text-gray-700">Salary</label>
                <input
                  type="number"
                  value={newStaff.salary}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>

              {/* Manager ID (Admin only) */}
              {auth.role === 'Admin' && (
                <div className="mb-4">
                  <label className="block text-gray-700">Manager ID</label>
                  <input
                    type="text"
                    value={newStaff.manager_id}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                  />
                </div>
              )}

              {/* Job Type (Admin only) */}
              {auth.role === 'Admin' ? (
                <div className="mb-4">
                  <label className="block text-gray-700">Job Type</label>
                  <select
                    value={newStaff.job_type}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                    required
                  >
                    <option value="Doctor">Doctor</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              ) : (
                // For Manager, job_type is fixed to "Doctor"
                <input type="hidden" value="Doctor" />
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
                >
                  Add Staff
                </button>
                <button
                  onClick={() => setIsAdding(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
        </div>
      </div>
      

      {/* Table Section */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Department</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((staffMember) => (
              <tr key={staffMember.staff_id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2">{staffMember.staff_name}</td>
                <td className="px-4 py-2">{staffMember.department_id}</td>
                <td className="px-4 py-2">{staffMember.job_type}</td>
                <td className="px-4 py-2">
                  {/* Edit Button */}
                  <button
                    onClick={() => handleEdit(staffMember)}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  {/* View Button */}
                  <button
                    onClick={() => navigate(`/doctor/${staffMember.staff_id}/details`)}
                    className="bg-green-600 text-white px-4 py-2 rounded mr-2 hover:bg-green-500"
                  >
                    View
                  </button>
                  <button
                    onClick={() => navigate(`/staff/${staffMember.staff_id}/job-history`)}
                    className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
                  >
                    View Job History
                  </button>
                  {/* Delete Button (Only for Admin) */}
                    {auth.role === "Admin" && (
                    <button
                      onClick={() => handleDelete(staffMember.staff_id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal form for editing staff */}
      {isEditing && selectedStaff && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-1/2">
            <h2 className="text-2xl font-bold mb-4">Edit Staff</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  value={selectedStaff?.staff_name || ""}
                  onChange={(e) => setSelectedStaff({ ...selectedStaff, staff_name: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Department</label>
                <input
                  type="text"
                  value={selectedStaff?.department_id || ""}
                  onChange={(e) => setSelectedStaff({ ...selectedStaff, department_id: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Qualification</label>
                <input
                  type="text"
                  value={selectedStaff?.qualification || ""}
                  onChange={(e) => setSelectedStaff({ ...selectedStaff, qualification: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Salary</label>
                <input
                  type="text"
                  value={selectedStaff?.salary || ""}
                  onChange={(e) => setSelectedStaff({ ...selectedStaff, salary: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Role</label>
                <select
                  value={selectedStaff?.job_type || ""}
                  onChange={(e) => setSelectedStaff({ ...selectedStaff, job_type: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                >
                  <option value="doctor">Doctor</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
                >
                  Update
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


export default StaffList;
