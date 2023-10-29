import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableHead from '@mui/material/TableHead';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import docImage from '../Images/doc.jpg';
import SingaporeMap from '../Components/map';
import axios from 'axios';

function getUniquePatients(patients) {
  const uniquePatients = {};
  patients.forEach(patient => {
    const name = patient['Patient Name'];
    if (!uniquePatients[name] && name !='Unknown') {
      uniquePatients[name] = patient;
    }
  });
  return Object.values(uniquePatients);
}



function Dashboard() {
  const [patients, setPatients] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/items');
      const uniquePatients = getUniquePatients(response.data);
      setPatients(uniquePatients); 
    } catch (error) {
      console.error('Error fetching patient data:', error);
    }
  };

  fetchData();
}, []);

  return (
    <div>
      <AppBar elevation={2} position="static"  style={{ backgroundColor: '#FFFFFF' }}>
        <Toolbar>
        <IconButton edge="start"  aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="body1" style={{ fontFamily: 'roboto' ,color:'#858585'}}>ABC Polyclinic</Typography>
          <div style={{ flexGrow: 1 }} />
          <Typography variant="body1" style={{color:'#858585', fontWeight:'bold'}}>Patient Dashboard</Typography>
          <div style={{ flexGrow: 1 }} />
          <Avatar alt="Remy Sharp" src={docImage} />
        </Toolbar>
      </AppBar>
      <div style ={{marginTop: '5rem' , display: 'flex', flexDirection: 'row'}}>
        <div style={{flex:1}}>
          <SingaporeMap/>
        </div>
        <div style={{flex:0.5}}>
        <Table sx={{ width: 300 }} size="small" component={Paper}>
          <TableHead >
            <TableRow>
            <TableCell style={{fontWeight:'bold'}}>Patient Name</TableCell>
            <TableCell style={{fontWeight:'bold'}}>Device Number</TableCell>
            <TableCell style={{fontWeight:'bold'}}>Risk</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient['Patient Name']}>
                <TableCell component="th" scope="row">
                <Link to={`/patient/${encodeURIComponent(patient['Patient Name'])}`}>{patient['Patient Name']}</Link>
                </TableCell>
                <TableCell>{`${patient['Device Number']}`}</TableCell>
                <TableCell style={{color: patient['Heart Disease Risk'] === 'Low' ? 'green' : patient['Heart Disease Risk'] === 'High' ? 'red' : 'white'}}>
                  {`${patient['Heart Disease Risk']}`}
                </TableCell>
            </TableRow>
            ))}
          </TableBody>
      </Table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
