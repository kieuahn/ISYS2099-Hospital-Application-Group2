import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import api from '../../utils/api';

const BookingForm = () => {
    const { doctor_id } = useParams(); // Get doctor_id from URL
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);

    useEffect(() => {
        const fetchSlots = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('Token is missing or expired');
                }

                const response = await api.get(`/patient/booking-form/${doctor_id}`, {
                    params: { date: '2024-09-06' }, // Replace with the selected date
                });
                setSlots(response.data);
            } catch (err) {
                setError('Error fetching booking slots.');
                console.error(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSlots();
    }, [doctor_id]);

    const handleBookAppointment = (slot) => {
        setSelectedSlot(slot);
        // You can implement the booking logic here, like posting to the booking API
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Box sx={{ flexGrow: 1, p: 3, maxWidth: '1200px', mx: 'auto' }}>
            <Typography variant="h4" sx={{ mb: 4 }}>
                Booking Form
            </Typography>
            <Grid container spacing={4}>
                {slots.map((slot) => (
                    <Grid item xs={12} md={4} key={slot.slot_id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">
                                    {slot.start_time} - {slot.end_time}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color={selectedSlot === slot ? 'success' : 'primary'}
                                    onClick={() => handleBookAppointment(slot)}
                                    sx={{ mt: 2 }}
                                >
                                    {selectedSlot === slot ? 'Selected' : 'Book Appointment'}
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default BookingForm;
