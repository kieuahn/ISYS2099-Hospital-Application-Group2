import React, { useState } from 'react';
// import Appointments from '../../components/Appointments'; // Import the Appointments component
import Treatments from './Treatments'; // Import the Treatments component

const PatientDashboard = () => {
  const [activeSection, setActiveSection] = useState('profile');

  return (
    <div className="flex">
      <div className="w-1/4 p-4 bg-gray-200">
        <h2 className="text-xl font-bold">Patient Dashboard</h2>
        <nav className="mt-4">
          <ul>
            <li className="my-2" onClick={() => setActiveSection('profile')}>
              <a className="text-blue-500 cursor-pointer">My Profile</a>
            </li>
            <li className="my-2" onClick={() => setActiveSection('appointments')}>
              <a className="text-blue-500 cursor-pointer">Appointments</a>
            </li>
            <li className="my-2" onClick={() => setActiveSection('doctors')}>
              <a className="text-blue-500 cursor-pointer">Doctor List</a>
            </li>
            <li className="my-2" onClick={() => setActiveSection('treatments')}>
              <a className="text-blue-500 cursor-pointer">Treatments</a>
            </li>
            <li className="my-2"><a className="text-blue-500">Help</a></li>
            <li className="my-2"><a className="text-blue-500">Logout</a></li>
          </ul>
        </nav>
      </div>


    </div>
  );
};

export default PatientDashboard;