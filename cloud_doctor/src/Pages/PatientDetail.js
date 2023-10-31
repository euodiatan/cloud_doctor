import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';


function PatientDetail() {
  const { name } = useParams();
  const decodedName = decodeURIComponent(name);

  const [patient, setPatient] = useState(null);
  const [patientDetails, setPatientDetails] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [heartRateChart, setHeartRateChart] = useState(null);

  
  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        // Using the patient's name to fetch details. Update the endpoint as needed.
        const response = await axios.get(`http://localhost:3001/items?name=${decodedName}`);
        const patientData = response.data.find(p => p['Patient Name'] === name);
        if (patientData) {
          setPatient(patientData);
          setPatientDetails(response.data); 
          console.log(response.data)
        }
      } catch (error) {
        console.error('Error fetching patient details:', error);
      }
    };

    fetchPatientDetails();
  }, [name]);

  if (!patient) {
    return <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center' }}>
    <CircularProgress />
    </Box>;
  }

  return (
    <div>
      <AppBar style={{ backgroundColor: '#FFFFFF' }} position="static">
        <Toolbar>
        <div style={{ flexGrow: 0.5 }} />
          <Typography variant="body1" style={{ fontWeight:'bold' ,color:'#858585'}}>{patient['Patient Name']}'s Details</Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Paper style={{ padding: '20px', marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{fontWeight:'bold'}}>Date</TableCell>
                <TableCell style={{fontWeight:'bold'}}>Time</TableCell>
                <TableCell style={{fontWeight:'bold'}}>Heart Rate (per minute)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patientDetails.map((detail, index) => (
                <TableRow key={index}>
                  <TableCell>{detail.Date}</TableCell>
                  <TableCell>{detail.Time}</TableCell>
                  <TableCell>{detail['Heart Rate Data per minute']}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Container>
    </div>
  );
}

export default PatientDetail;
