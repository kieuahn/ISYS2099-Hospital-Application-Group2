import React, { useState, useEffect } from "react";
import axios from "axios";
import CenterContentPage from "../../components/CenterContentPage";

const ViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  // Fetch appointment data
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("/staff/appointments");
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointment data", error);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <CenterContentPage>
      <div className="p-6">
        <h1 className="text-xl font-bold mb-6">All Appointments</h1>
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Patient</th>
              <th className="px-4 py-2">Doctor</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td className="border px-4 py-2">{appointment.patient}</td>
                <td className="border px-4 py-2">{appointment.doctor}</td>
                <td className="border px-4 py-2">{appointment.date}</td>
                <td className="border px-4 py-2">{appointment.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CenterContentPage>
  );
};

export default ViewAppointments;
