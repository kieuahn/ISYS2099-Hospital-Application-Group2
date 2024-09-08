import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PatientInfo from './PatientInfo';
import PatientDetailsForm from './PatientDetailForm';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { useEffect, useState } from 'react';
import api from '../../utils/api';
const PatientProfile = () => {
    const [info, setInfo] = useState({
        name: '',
         dob: '',
        allergies: '',
        gender: '',
        phone: '',
        address: '',
        created: '',
        updated: '',
    });
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(false);
    
    useEffect(() => {
        const fetchInfo = async () => {
            setLoading(true);
            setError(null);
    
            try {
                // Fetch the patient profile from the API
                const response = await api.get('/patient/patient-profile');
                setInfo(response.data);
            } catch (err) {
                setError('Error fetching profile.');
            } finally {
                setLoading(false);
            }
        };
    
        fetchInfo();
    }, []);
    
    const handleProfileUpdate = async (updatedInfo) => {
        try {
            await api.post('/patient/edit-profile', updatedInfo);
            setInfo(updatedInfo);
            setEditing(false);
        } catch (err) {
            setError('Error updating profile.');
        }
    }
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

  return (
    <Box sx={{ flexGrow: 1, p: 3, maxWidth: '1200px', mx: 'auto'}}> 
    <Stack spacing={4}>
      <div>
        <Typography variant="h4" sx={{ mb: 3 }}>Account</Typography>
      </div>
      <Divider />
      <Grid
          container
          spacing={1}
          justifyContent="center"
          alignItems="flex-start"
          sx={{
            flexWrap: { xs: 'wrap', md: 'nowrap' }, // Wrap on small screens, no wrap on medium+
          }}
        >
          {/* Patient Info Section */}
          <Grid  item xs={12} md={4} sx={{ minWidth: 400 }}> {/* Full width on small screens, 4 columns on medium+ */}
            <Box sx={{ p: 4 }}>
          <PatientInfo info ={info}/>
          </Box>
        </Grid>
        <Grid
            item
            xs={12}
            md={8}
            sx={{
              flexGrow: 1, // Allow this section to grow
              maxWidth: 'calc(100% - 400px)', // Takes remaining space on large screens
              minWidth: { xs: '100%', md: 600 },
              ml: { md: 4 }, // Full width on small, at least 600px on large
            }}
          > {/* Full width on small screens, 8 columns on medium+ */}
            <Box sx={{ p: 4 }}> {/* Padding inside box */}
          <PatientDetailsForm info={info} onProfileUpdate={handleProfileUpdate}/>
        </Box>
        </Grid>
      </Grid>
    </Stack>
    </Box>
  );
}
export default PatientProfile;
