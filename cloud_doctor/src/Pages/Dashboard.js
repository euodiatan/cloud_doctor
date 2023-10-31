import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableHead from '@mui/material/TableHead';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import docImage from '../Images/doc.jpg';
import SingaporeMap from '../Components/map';
import axios from 'axios';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import 'chartjs-plugin-zoom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CircularProgress from '@mui/material/CircularProgress';


function getUniquePatients(patients) {
  const uniquePatients = {};
  patients.forEach(patient => {
    const name = patient['Patient Name'];
    if (!uniquePatients[name] && name !== 'Unknown') {
      uniquePatients[name] = patient;
    }
  });
  return Object.values(uniquePatients);
}

function Dashboard() {
  const timeRanges = [
    { label: '10:00 AM - 11:00 AM', start: '2023-01-01 10:00:00.0', end: '2023-01-01 11:00:00.0' },
    { label: '11:00 AM - 12:00 PM', start: '2023-01-01 11:00:00.0', end: '2023-01-01 12:00:00.0' },
    { label: '12:00 AM - 13:00 PM', start: '2023-01-01 12:00:00.0', end: '2023-01-01 13:00:00.0' },
    { label: '13:00 AM - 14:00 PM', start: '2023-01-01 13:00:00.0', end: '2023-01-01 14:00:00.0' },
    { label: '15:00 AM - 16:00 PM', start: '2023-01-01 15:00:00.0', end: '2023-01-01 16:00:00.0' },
    // Add more time ranges as needed
  ];

  const defaultTimeRange = timeRanges[0];
  const [timeRange, setTimeRange] = useState(defaultTimeRange);
  const [patients, setPatients] = useState([]);
  const [unfilteredPatients, setUnfilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [heartRateChart, setHeartRateChart] = useState(null);

  useEffect(() => {
    initializeHeartRateChart();
    updateTimeRange(defaultTimeRange.start, defaultTimeRange.end, defaultTimeRange.label);
    return () => {
      if (heartRateChart) {
        heartRateChart.destroy();
      }
    };
  }, []);

  const updateTimeRange = (start, end, label) => {
    if (heartRateChart) {
      heartRateChart.options.scales.x.min = start;
      heartRateChart.options.scales.x.max = end;
      heartRateChart.update();
      setTimeRange({ start, end, label });
    }
  };

  const handlePatientSelection = (patientName) => {
    const patientData = unfilteredPatients.filter(p => p['Patient Name'] === patientName);
    if (patientData.length > 0) {
      const heartRates = patientData.map(p => p['Heart Rate Data per minute']);
      const timestamps = patientData.map(p => p['Timestamp']);
      setSelectedPatient({ heartRates, timestamps });
    } else {
      console.error("No data found for selected patient");
    }
  };

  function initializeHeartRateChart() {
    const existingChart = Chart.getChart("heartRateChart");
    if (existingChart) {
      existingChart.destroy();
    }
    const ctx = document.getElementById('heartRateChart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Heart Rate (per minute)',
          data: [],
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              parser: 'yyyy-MM-dd HH:mm:ss.S',
              unit: 'minute'
            },
            min: timeRange.start,
            max: timeRange.end
          },
          y: {
            min: 50,  // Set Y-axis minimum
            max: 120 // Set Y-axis maximum
          }
        },
        plugins: {
          zoom: {
            pan: {
              enabled: true,
              mode: 'xy'
            },
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true
              },
              mode: 'xy',
            }
          }
        }
      }
    });
    setHeartRateChart(chart);
  }

  useEffect(() => {
    if (selectedPatient && heartRateChart) {
      const data = selectedPatient.heartRates.map((rate, index) => ({
        x: new Date(selectedPatient.timestamps[index]),
        y: rate
      }));
      heartRateChart.data.labels = selectedPatient.timestamps.map(t => new Date(t));
      heartRateChart.data.datasets[0].data = data;
      heartRateChart.update();
    }
  }, [selectedPatient, heartRateChart, timeRange]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/items');
        setUnfilteredPatients(response.data);
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
      <AppBar elevation={1} position="static" style={{ backgroundColor: '#FFFFFF' }}>
        <Toolbar>
          <IconButton edge="start" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="body1" style={{ color: '#858585' }}>ABC Polyclinic</Typography>
          <div style={{ flexGrow: 1 }} />
          {/* <Typography variant="body1" style={{ color: '#858585', fontWeight: 'bold' }}>Patient Dashboard</Typography> */}
          <div style={{ flexGrow: 1 }} />
          <Avatar alt="Remy Sharp" src={docImage} />
        </Toolbar>
      </AppBar>
      <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'row' }}>
        <div style={{ flex: 1 }}>
          <SingaporeMap />
        </div>
        <div style={{ marginRight: '5rem', flex: 0.5}}>
          <TableContainer component={Paper} style={{ maxHeight: '200px', overflowY: 'auto' }}>
          <Table stickyHeader sx={{ width: 500 }} size="small" >
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold' }}>Patient Name</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Device Number</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Risk</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                {(!patients || patients.length === 0) ? (
                  <TableRow>
                    <TableCell colSpan={3} style={{ textAlign: 'center' }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                    patients
                      .slice() // Create a shallow copy of the array to avoid mutating the original array
                      .sort((a, b) => {
                        if (a['Heart Disease Risk'] === 'High' && b['Heart Disease Risk'] !== 'High') {
                          return -1; // a should come before b
                        }
                        if (b['Heart Disease Risk'] === 'High' && a['Heart Disease Risk'] !== 'High') {
                          return 1; // b should come before a
                        }
                        return 0; // a and b are equal in terms of priority
                      })
                      .map((patient) => (
                        <TableRow key={patient['Patient Name']}>
                          <TableCell component="th" scope="row">
                            <button
                              style={{ backgroundColor: 'white', borderColor: 'lightgray' }}
                              onClick={() => handlePatientSelection(patient['Patient Name'])}
                            >
                              {patient['Patient Name']}
                            </button>
                          </TableCell>
                          <TableCell>{`${patient['Device Number']}`}</TableCell>
                          <TableCell
                            style={{
                              color: patient['Heart Disease Risk'] === 'Low' ? 'green' : patient['Heart Disease Risk'] === 'High' ? 'red' : 'white',
                            }}
                          >
                            {`${patient['Heart Disease Risk']}`}
                          </TableCell>
                        </TableRow>
                      )))}
                
            </TableBody>
          </Table>
          </TableContainer>
          <FormControl fullWidth style={{ marginTop: '20px' }}>
            <InputLabel id="time-range-label">Time Range</InputLabel>
            <Select
              labelId="time-range-label"
              id="time-range-select"
              value={timeRange.label}
              label="Time Range"
              onChange={(event) => {
                const selectedRange = timeRanges.find(range => range.label === event.target.value);
                if (selectedRange) {
                  updateTimeRange(selectedRange.start, selectedRange.end, selectedRange.label);
                }
              }}
            >
              {timeRanges.map((range) => (
                <MenuItem key={range.label} value={range.label}>{range.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <div>
            <canvas id="heartRateChart" width="400" height="200"></canvas>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Dashboard;