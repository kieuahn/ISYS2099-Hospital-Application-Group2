import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Grid, Button } from '@mui/material';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const DoctorList = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDoctors = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('Token is missing or expired');
                }

                const response = await api.get('/patient/doctor-list');
                setDoctors(response.data);
            } catch (err) {
                setError('Error fetching doctors.');
                console.error(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    const handleViewAvailability = (doctorId) => {
        navigate(`/patient/booking-form/${doctorId}`);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Box sx={{ flexGrow: 1, p: 3, maxWidth: '1200px', mx: 'auto' }}>
            <Typography variant="h4" sx={{ mb: 4 }}>
                Available Doctors
            </Typography>
            <Grid container spacing={4}>
                {doctors.map((doctor) => (
                    <Grid item xs={12} md={4} key={doctor.staff_id}>
                        <Card sx={{ p: 2 }}>
                            <CardContent>
                                <Typography variant="h5">{doctor.staff_name}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Department: {doctor.department_name}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ mt: 2 }}
                                    onClick={() => handleViewAvailability(doctor.staff_id)}
                                >
                                    View Availability
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default DoctorList;
