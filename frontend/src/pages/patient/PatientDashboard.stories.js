import React from 'react';
import PatientDashboard from './PatientDashboard';
import AuthContext from '../../context/AuthContext';

export default {
  title: 'PatientDashboard',
  component: PatientDashboard,
};

const Template = (args) => (
  <AuthContext.Provider value={{ auth: { role: 'patient' } }}>
    <PatientDashboard {...args} />
  </AuthContext.Provider>
);

export const Default = Template.bind({});
Default.args = {};