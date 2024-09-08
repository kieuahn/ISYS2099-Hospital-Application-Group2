import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs'; // Import dayjs
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const PatientDetailsForm = ({ info, onProfileUpdate }) => {
    const [formState, setFormState] = useState({
        ...info,
        dob: info.dob ? dayjs(info.dob) : null // Initialize Date of Birth using dayjs if available
      });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleDateChange = (newDate) => {
    setFormState((prevState) => ({
      ...prevState,
      dob: newDate ? newDate.format('YYYY-MM-DD') : null,  // Format the date for MySQL
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onProfileUpdate(formState); // Pass the updated form data to the parent
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card sx={{ p: 1, borderRadius: 2, boxShadow: 4, maxWidth: 800, minWidth: 600 }}>
        <CardHeader subheader="You can edit the information below" title="Profile" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            {/* Name */}
            <Grid item md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Name</InputLabel>
                <OutlinedInput
                  name="name"
                  value={formState.name}
                  onChange={handleInputChange}
                  label="Patient Name"
                />
              </FormControl>
            </Grid>
             {/* Date of Birth */}
            <Grid item md={6} xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date of Birth"
                  value={formState.dob ? dayjs(formState.dob) : null}  // Convert to dayjs object
                  onChange={handleDateChange}
                  renderInput={(params) => (
                    <FormControl fullWidth>
                      <OutlinedInput {...params.inputProps} />
                    </FormControl>
                  )}
                />
              </LocalizationProvider>
            </Grid>
            {/* Phone Number */}
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Phone Number</InputLabel>
                <OutlinedInput
                  name="contact_number"
                  value={formState.contact_number}
                  onChange={handleInputChange}
                  label="Contact Number"
                />
              </FormControl>
            </Grid>
            {/* Gender */}
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <OutlinedInput
                  name="gender"
                  value={formState.gender}
                  onChange={handleInputChange}
                  label="Gender"
                />
              </FormControl>
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Allergies</InputLabel>
                <OutlinedInput
                  name="allergies"
                  value={formState.allergies}
                  onChange={handleInputChange}
                  label="Allergies"
                />
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button type="submit" variant="contained">
            Save Details
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

export default PatientDetailsForm;
