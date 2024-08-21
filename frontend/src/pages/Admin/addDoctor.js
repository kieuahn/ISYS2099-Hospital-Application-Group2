import React, { useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";

const AddDoctor = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [qualification, setQualification] = useState("");
  const [salary, setSalary] = useState("");
  const { authAxios } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authAxios.post("/api/admin/add-doctor", {
        name,
        email,
        department_id: departmentId,
        qualification,
        salary,
      });
      alert("Doctor added successfully!");
    } catch (error) {
      console.error("Error adding doctor:", error.response.data);
      alert("Failed to add doctor. Please try again.");
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Add New Doctor</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border" required />
        </div>
        <div>
          <label className="block">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border" required />
        </div>
        <div>
          <label className="block">Department ID</label>
          <input type="number" value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} className="w-full p-2 border" required />
        </div>
        <div>
          <label className="block">Qualification</label>
          <input type="text" value={qualification} onChange={(e) => setQualification(e.target.value)} className="w-full p-2 border" required />
        </div>
        <div>
          <label className="block">Salary</label>
          <input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full p-2 border" required />
        </div>
        <button type="submit" className="bg-green-500 text-white p-2 rounded">Add Doctor</button>
      </form>
    </div>
  );
};

export default AddDoctor;
