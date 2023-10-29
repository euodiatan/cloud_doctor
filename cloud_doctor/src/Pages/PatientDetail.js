import React from 'react';
import { useParams } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Paper } from '@mui/material';

const patients = [
  { id: 1, name: 'John Doe', age: 30, details: 'Patient details here...' },
  { id: 2, name: 'Jane Doe', age: 25, details: 'Patient details here...' },
  // Add more patients as needed
];

function PatientDetail() {
  const { id } = useParams();
  const patient = patients.find((p) => p.id === parseInt(id));

  if (!patient) {
    return <div>Patient not found</div>;
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">{patient.name}'s Details</Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Paper style={{ padding: '20px', marginTop: '20px' }}>
          <Typography variant="body1">{patient.details}</Typography>
        </Paper>
      </Container>
    </div>
  );
}

export default PatientDetail;
