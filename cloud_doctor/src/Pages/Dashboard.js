import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, List, ListItem, ListItemText, Container } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import docImage from '../Images/doc.jpg';
import SingaporeMap from '../Components/map'

const patients = [
  { id: 1, name: 'John Doe', age: 30 },
  { id: 2, name: 'Jane Doe', age: 25 },
  // Add more patients as needed
];

function Dashboard() {
  return (
    <div>
      <AppBar position="static"  style={{ backgroundColor: '#FFFFFF' }}>
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
        <div style={{flex:1}}>
          <List>
            {patients.map((patient) => (
              <ListItem button component={Link} to={`/patient/${patient.id}`} key={patient.id}>
                <ListItemText primary={patient.name} secondary={`Age: ${patient.age}`} />
              </ListItem>
            ))}
          </List>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
