import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import api from '../../utils/api'; // Ensure you have your API helper like Axios imported

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

const PatientAppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get('/api/patient/upcoming-appointment'); // Replace with your API endpoint
        setAppointments(response.data);  // Set the fetched data to state
        setLoading(false);  // Turn off loading
      } catch (err) {
        setError('Error fetching appointments.'); // Set error state if something goes wrong
        setLoading(false);
      }
    };

    fetchAppointments(); // Call the function to fetch data
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Display loading state
  }

  if (error) {
    return <div>{error}</div>; // Display error state
  }

  return (
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
              <StyledTableCell align="right">{appointment.staff_id}</StyledTableCell> {/* Assuming staff_id is the doctor */}
              <StyledTableCell align="right">{appointment.start_time}</StyledTableCell>
              <StyledTableCell align="right">{appointment.end_time}</StyledTableCell>
              <StyledTableCell align="right">{appointment.payment_amount}</StyledTableCell>
              <StyledTableCell align="right">{appointment.status}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PatientAppointmentList;
