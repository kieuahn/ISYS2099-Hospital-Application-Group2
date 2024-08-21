import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthContext";

const StaffList = () => {
  const [staff, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filter, setFilter] = useState({ department: "", name: "", role: "" });
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get("/api/admin/staff", {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        setStaff(response.data);
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    };

    fetchStaff();
  }, [auth.token]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/admin/delete-staff/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setStaff(staff.filter((s) => s.staff_id !== id));
    } catch (error) {
      console.error("Error deleting staff:", error);
      alert("Failed to delete staff. Please try again.");
    }
  };

  const handleEdit = (staff) => {
    setSelectedStaff(staff);
    setIsEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { staff_id, staff_name, department_id, qualification, salary, job_type } = selectedStaff;
      await axios.put(`/api/admin/update-staff/${staff_id}`, {
        name: staff_name,
        department_id,
        qualification,
        salary,
        role: job_type,
      }, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setIsEditing(false);
      setStaff(staff.map((s) => (s.staff_id === staff_id ? selectedStaff : s)));
    } catch (error) {
      console.error("Error updating staff:", error);
      alert("Failed to update staff. Please try again.");
    }
  };

  const filteredStaff = staff.filter((s) => {
    const matchesDepartment = !filter.department || s.department_id.toString() === filter.department;
    const matchesName = !filter.name || s.staff_name.toLowerCase().includes(filter.name.toLowerCase());
    const matchesRole = !filter.role || s.job_type === filter.role;

    return matchesDepartment && matchesName && matchesRole;
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Staff List</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by name"
          value={filter.name}
          onChange={(e) => setFilter({ ...filter, name: e.target.value })}
          className="border p-2 rounded mr-2"
        />
        <input
          type="text"
          placeholder="Filter by department"
          value={filter.department}
          onChange={(e) => setFilter({ ...filter, department: e.target.value })}
          className="border p-2 rounded mr-2"
        />
        <select
          value={filter.role}
          onChange={(e) => setFilter({ ...filter, role: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Filter by Role</option>
          <option value="doctor">Doctor</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">Department</th>
            <th className="py-2">Role</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStaff.map((staff) => (
            <tr key={staff.staff_id}>
              <td className="py-2">{staff.staff_name}</td>
              <td className="py-2">{staff.department_id}</td>
              <td className="py-2">{staff.job_type}</td>
              <td className="py-2">
                <button
                  onClick={() => handleEdit(staff)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(staff.staff_id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isEditing && selectedStaff && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit Staff</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  value={selectedStaff.staff_name}
                  onChange={(e) =>
                    setSelectedStaff({ ...selectedStaff, staff_name: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Department</label>
                <input
                  type="text"
                  value={selectedStaff.department_id}
                  onChange={(e) =>
                    setSelectedStaff({ ...selectedStaff, department_id: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Qualification</label>
                <input
                  type="text"
                  value={selectedStaff.qualification}
                  onChange={(e) =>
                    setSelectedStaff({ ...selectedStaff, qualification: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Salary</label>
                <input
                  type="text"
                  value={selectedStaff.salary}
                  onChange={(e) =>
                    setSelectedStaff({ ...selectedStaff, salary: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Role</label>
                <select
                  value={selectedStaff.job_type}
                  onChange={(e) =>
                    setSelectedStaff({ ...selectedStaff, job_type: e.target.value })
                  }
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
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                >
                  Update
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
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
