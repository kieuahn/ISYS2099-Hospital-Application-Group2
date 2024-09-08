import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import api from '../../utils/api'; // Ensure your API helper like Axios is imported
import CustomPositionPage from '../../components/Layout/CustomPositionPage';
import Box from '@mui/material/Box';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const formatDateTime = (dateTime) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateTime).toLocaleString(undefined, options); // Adjust based on your locale
};

const PatientAppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabIndex, setTabIndex] = useState(0); // 0 for upcoming, 1 for past appointments

  // Fetch appointments based on the selected tab (upcoming or past)
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);

      // Determine the endpoint based on the selected tab
      const endpoint = tabIndex === 0 ? '/patient/upcoming-appointment' : '/patient/past-appointment';

      try {
        const response = await api.get(endpoint); // Fetch from the respective API route
        setAppointments(response.data); // Set the fetched data to state
      } catch (err) {
        setError('Error fetching appointments.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [tabIndex]); // Re-fetch when tab changes

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue); // Switch between upcoming and past appointments
  };

  if (loading) {
    return <div>Loading...</div>; // Display loading state
  }

  if (error) {
    return <div>{error}</div>; // Display error state
  }

  return (
    <>
    <CustomPositionPage>
      {/* Tabs for switching between upcoming and past appointments */}
     
      <Tabs value={tabIndex} onChange={handleTabChange} centered>
        <Tab label="Upcoming Appointments" />
        <Tab label="Past Appointments" />
      </Tabs>
     

      <Box sx={{ padding: '24px' }} />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Id</StyledTableCell>
              <StyledTableCell align="right">Purpose</StyledTableCell>
              <StyledTableCell align="right">Doctor</StyledTableCell>
              <StyledTableCell align="right">Start Time</StyledTableCell>
              <StyledTableCell align="right">End Time</StyledTableCell>
              <StyledTableCell align="right">Payment Amount</StyledTableCell>
              <StyledTableCell align="right">Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <StyledTableRow key={appointment.appointment_id}>
                <StyledTableCell component="th" scope="row">
                  {appointment.appointment_id}
                </StyledTableCell>
                <StyledTableCell align="right">{appointment.purpose}</StyledTableCell>
                <StyledTableCell align="right">{appointment.staff_id}</StyledTableCell> {/* You may want to map staff_id to actual doctor name */}
                <StyledTableCell align="right">{formatDateTime(appointment.start_time)}</StyledTableCell>
                <StyledTableCell align="right">{formatDateTime(appointment.end_time)}</StyledTableCell>
                <StyledTableCell align="right">{appointment.payment_amount}</StyledTableCell>
                <StyledTableCell align="right">{appointment.status}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </CustomPositionPage>
    </>
  );
};

export default PatientAppointmentList;
