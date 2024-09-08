import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import CustomContentPage from '../../components/Layout/CustomPositionPage';


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
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


const PatientAppointmentList = () => {
    const [appointments, setAppointments] = useState([]);
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    // Fetch the appointments from the API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("/upcoming-appointment", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer YOUR_TOKEN_HERE`,
          },
        });
    
        // Log the raw response
        const textResponse = await response.text();
        console.log("Response:", textResponse);
    
        // Parse the JSON if possible
        const data = JSON.parse(textResponse);
        setAppointments(data); 
    
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <>
    <CustomContentPage>
     <Box
      sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 1000 }}
    >
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
            <Tab label="Past" value="past" />
            <Tab label="Current" value="current" />
          </Tabs>
        </Box>
        <TabPanel value="past">
        { <CustomContentPage> 
<TableContainer component={Paper}>
  <Table sx={{ minWidth: 800 }} aria-label="customized table">
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
          <StyledTableCell align="right">{appointment.staff_id}</StyledTableCell> 
          <StyledTableCell align="right">{appointment.start_time}</StyledTableCell>
          <StyledTableCell align="right">{appointment.end_time}</StyledTableCell>
          <StyledTableCell align="right">{appointment.payment_amount}</StyledTableCell>
          <StyledTableCell align="right">{appointment.status}</StyledTableCell>
        </StyledTableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>

</CustomContentPage> }
        </TabPanel>
        <TabPanel value="current">Item Two</TabPanel>
      </TabContext>
    </Box>
    </CustomContentPage>
   
    </>
   
  );
};

export default PatientAppointmentList;

