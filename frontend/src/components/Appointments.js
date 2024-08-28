import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Appointments = () => {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming'); // Track which tab is active

  useEffect(() => {
    fetchUpcomingAppointments();
    fetchPastAppointments();
  }, []);

  const fetchUpcomingAppointments = async () => {
    try {
      const response = await axios.get('/api/upcoming-appointments'); // Adjust the endpoint as necessary
      setUpcomingAppointments(response.data);
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error);
    }
  };

  const fetchPastAppointments = async () => {
    try {
      const response = await axios.get('/api/past-appointments'); // Adjust the endpoint as necessary
      setPastAppointments(response.data);
    } catch (error) {
      console.error('Error fetching past appointments:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Appointments</h2>
      <div className="mb-4">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 ${activeTab === 'upcoming' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Upcoming Appointments
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 ${activeTab === 'past' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Past Appointments
        </button>
      </div>

      {activeTab === 'upcoming' ? (
        <div>
          {upcomingAppointments.length === 0 ? (
            <p>No upcoming appointments.</p>
          ) : (
            <table className="min-w-full border">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Doctor</th>
                  <th className="border px-4 py-2">Purpose</th>
                  <th className="border px-4 py-2">Date</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Payment</th>
                </tr>
              </thead>
              <tbody>
                {upcomingAppointments.map((appointment) => (
                  <tr key={appointment.appointment_id}>
                    <td className="border px-4 py-2">{appointment.doctor_name}</td>
                    <td className="border px-4 py-2">{appointment.purpose}</td>
                    <td className="border px-4 py-2">{new Date(appointment.start_time).toLocaleString()}</td>
                    <td className="border px-4 py-2">{appointment.status}</td>
                    <td className="border px-4 py-2">{appointment.payment_amount || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div>
          {pastAppointments.length === 0 ? (
            <p>No past appointments.</p>
          ) : (
            <table className="min-w-full border">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Doctor</th>
                  <th className="border px-4 py-2">Purpose</th>
                  <th className="border px-4 py-2">Date</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Payment</th>
                </tr>
              </thead>
              <tbody>
                {pastAppointments.map((appointment) => (
                  <tr key={appointment.appointment_id}>
                    <td className="border px-4 py-2">{appointment.doctor_name}</td>
                    <td className="border px-4 py-2">{appointment.purpose}</td>
                    <td className="border px-4 py-2">{new Date(appointment.start_time).toLocaleString()}</td>
                    <td className="border px-4 py-2">{appointment.status}</td>
                    <td className="border px-4 py-2">{appointment.payment_amount || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Appointments;