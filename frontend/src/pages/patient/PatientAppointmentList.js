import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/joy/Button';
import ToggleButtonGroup from '@mui/joy/ToggleButtonGroup';
import Box from '@mui/material/Box';
import api from '../../utils/api'; // Ensure your API helper is imported
import CustomPositionPage from '../../components/Layout/CustomPositionPage';
import Typography from '@mui/joy/Typography';
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
  const [view, setView] = useState('upcoming'); // Track the current view (upcoming or past)

  // Fetch appointments based on the selected view (upcoming or past)
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);

      // Determine the endpoint based on the selected view
      const endpoint = view === 'upcoming' ? '/patient/upcoming-appointment' : '/patient/past-appointment';

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
  }, [view]); // Re-fetch when view changes

  const handleViewChange = (event, newValue) => {
    if (newValue !== null) {
      setView(newValue); // Switch between upcoming and past appointments
    }
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
      {/* Toggle Button Group */}
      <Typography level="h2" sx={{paddingBottom : '16px' }}>Appointment</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'left', paddingBottom : '16px' }}>
     
        <ToggleButtonGroup
          variant="outlined"
          value={view}
          onChange={handleViewChange}
          exclusive // Ensures only one button is selected at a time
        >
          <Button value="upcoming">Upcoming</Button>
          <Button value="past">Past</Button>
        </ToggleButtonGroup>
      </Box>

      

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
