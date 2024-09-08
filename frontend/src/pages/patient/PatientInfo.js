import React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';

const formatDateTime = (dateTime) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateTime).toLocaleString(undefined, options); // Adjust based on your locale
};

const PatientInfo = ({ info }) => {
  return (
    <Card sx={{ p: 1, borderRadius: 2, boxShadow: 4, maxWidth: 600, minWidth: 400 }}> {/* Add padding, rounded corners, and shadow */}
      <CardContent>
        <Stack spacing={2} alignItems="center">
          {/* Profile Picture */}
          <Avatar
            alt={info.name}
            src="/static/images/avatar/1.jpg"  
            sx={{ width: 100, height: 100, mb: 2 }}  
          />
          {/* Patient Info */}
          <Box sx={{ width: '100%' }}> 
            <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="body1" fontWeight="bold">
                Name
              </Typography>
              <Typography variant="body1">
                {info.patient_name}
              </Typography>
            </Box>

            {/* Date of Birth */}
            <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="body1" fontWeight="bold">
                Date of Birth
              </Typography>
              <Typography variant="body1">
                {formatDateTime(info.dob)}
              </Typography>
            </Box>

            {/* Contact */}
            <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="body1" fontWeight="bold">
                Contact
              </Typography>
              <Typography variant="body1">
                {info.contact_number}
              </Typography>
            </Box>

            {/* Allergies */}
            <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="body1" fontWeight="bold">
                Allergies
              </Typography>
              <Typography variant="body1">
                {info.allergies}
              </Typography>
            </Box>

            {/* Gender */}
            <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="body1" fontWeight="bold">
                Gender
              </Typography>
              <Typography variant="body1">
                {info.gender}
              </Typography>
            </Box>

            {/* Created */}
            <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="body1" fontWeight="bold">
                Created
              </Typography>
              <Typography variant="body1">
                {formatDateTime(info.created_at)}
              </Typography>
            </Box>

            {/* Updated */}
            <Box display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="body1" fontWeight="bold">
                Updated
              </Typography>
              <Typography variant="body1">
                {formatDateTime(info.updated_at)}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </CardContent>
      <Divider sx={{ my: 2 }} />
      <CardActions>
        <Button variant="outlined" fullWidth sx={{ borderRadius: 2 }}>
          Upload Picture
        </Button>
      </CardActions>
    </Card>
  );
};

export default PatientInfo;
