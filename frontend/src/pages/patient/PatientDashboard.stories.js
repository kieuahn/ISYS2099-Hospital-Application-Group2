import React from 'react';
import PatientDashboard from './PatientDashboard';

export default {
  title: 'PatientDashboard',
  component: PatientDashboard,
};

const Template = (args) => <PatientDashboard {...args} />;

export const Default = Template.bind({});
Default.args = {
  // Pass any necessary props to the PatientDashboard component
};