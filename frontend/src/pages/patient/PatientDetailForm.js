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

const PatientDetailsForm = ({ info, onProfileUpdate }) => {
  const [formState, setFormState] = useState(info); // Local state for form inputs

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
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
            {/* First Name */}
            <Grid item md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>First Name</InputLabel>
                <OutlinedInput
                  name="name"
                  value={formState.name}
                  onChange={handleInputChange}
                  label="First Name"
                />
              </FormControl>
            </Grid>
            {/* Email */}
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Email Address</InputLabel>
                <OutlinedInput
                  name="email"
                  value={formState.email}
                  onChange={handleInputChange}
                  label="Email Address"
                />
              </FormControl>
            </Grid>
            {/* Phone Number */}
            <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Phone Number</InputLabel>
                <OutlinedInput
                  name="phone"
                  value={formState.phone}
                  onChange={handleInputChange}
                  label="Phone Number"
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
