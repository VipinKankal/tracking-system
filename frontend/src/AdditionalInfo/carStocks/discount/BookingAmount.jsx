import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
  OutlinedInput,
  InputAdornment,
  Button,
} from '@mui/material';
import axios from 'axios';
import './scss/DiscountForCarAndAdditional.scss';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

export default function BookingAmount() {
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedVersion, setSelectedVersion] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedCarType, setSelectedCarType] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [bookingAmount, setBookingAmount] = useState('');
  const [allRows, setAllRows] = useState([]);
  const [realTimeMessage, setRealTimeMessage] = useState('');


  useEffect(() => {
    const fetchCars = async (filters) => {
      const { model, version, color, carType } = filters;
      const queryParams = new URLSearchParams({
        ...(model && { model }),
        ...(version && { version }),
        ...(color && { color }),
        ...(carType && { carType }),
      });

      try {
        const response = await axios.get(`http://localhost:5000/api/cars?${queryParams}`);
        setAllRows(response.data);
      } catch (error) {
        console.error('Error fetching cars:', error);
        setAllRows([]);
      }
    };

    fetchCars({
      model: selectedModel,
      version: selectedVersion,
      color: selectedColor,
      carType: selectedCarType,
    });
  }, [selectedModel, selectedVersion, selectedColor, selectedCarType]);


 // Socket.IO event listener for real-time updates
 useEffect(() => {
  socket.on('bookingUpdated', (data) => {
    setRealTimeMessage(data.message);
    // You can also re-fetch the car data if needed
    fetchCars({
      model: selectedModel,
      version: selectedVersion,
      color: selectedColor,
      carType: selectedCarType,
    });
  });

  // Clean up the event listener on component unmount
  return () => {
    socket.off('bookingUpdated');
  };
}, [selectedModel, selectedVersion, selectedColor, selectedCarType]);



  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
    setSelectedVersion('');
    setSelectedColor('');
  };

  const handleVersionChange = (event) => {
    setSelectedVersion(event.target.value);
    setSelectedColor('');
  };

  const handleColorChange = (event) => {
    setSelectedColor(event.target.value);
  };

  const handleCarTypeChange = (event) => {
    setSelectedCarType(event.target.value);
  };

  const handleDiscountAmountChange = (event) => {
    setBookingAmount(event.target.value);
  };


  const handleApplyDiscount = async () => {
    // Check if any checkboxes are selected
    if (selectedRows.length === 0) {
      alert("Please select at least one car to apply the Booking.");
      return; // Exit the function early if no checkboxes are selected
    }
  
    // Validate booking amount
    const amount = parseFloat(bookingAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid booking amount greater than zero.");
      return;
    }
  
    // Proceed with applying the discount
    const selectedCars = selectedRows.map((index) => filteredRows[index]);
  
    try {
      const response = await axios.post('http://localhost:5000/api/apply-booking', {
        selectedCars,
        bookingAmount: amount,
      });
  
      console.log('Booking Amount applied:', response.data);
      alert(`Successfully applied Booking Amount to ${selectedCars.length} cars!`);
      
      // Optionally show a Snackbar/Toast for better UX
      // Navigate to the DiscountSuccessfully page
      window.location.href = '/booking-amount';
    } catch (error) {
      console.error('Error applying Booking Amount:', error);
      alert('There was an error applying the booking amount. Please try again.');
    }
  };
  
  


  const filteredRows = allRows.filter(
    (row) =>
      (!selectedModel || row.model === selectedModel) &&
      (!selectedVersion || row.version === selectedVersion) &&
      (!selectedColor || row.color === selectedColor) &&
      (!selectedCarType || row.carType === selectedCarType)
  );

  const handleCheckboxChange = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  return (
    <>
      <div className="header-container" >
        <p>Update Booking Amount</p>

      </div>

      {realTimeMessage && (
        <Typography variant="h6" color="green">
          {realTimeMessage}
        </Typography>
      )}

      <div className="container" style={{ marginTop: '-30px' }} >
        <div className="left-panel">
          <p variant="h6"  style={{ marginTop: '0' }}>Select Car Details</p>

          <FormControl fullWidth>
            <InputLabel id="model-label">Model</InputLabel>
            <Select labelId="model-label" value={selectedModel} onChange={handleModelChange} label="Model">
              <MenuItem value="">All</MenuItem>
              {[...new Set(allRows.map((row) => row.model))].map((model) => (
                <MenuItem key={model} value={model}>
                  {model.charAt(0) + model.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth disabled={!selectedModel}>
            <InputLabel id="version-label">Version</InputLabel>
            <Select labelId="version-label" value={selectedVersion} onChange={handleVersionChange} label="Version">
              <MenuItem value="">All</MenuItem>
              {[...new Set(allRows.filter((row) => row.model === selectedModel).map((row) => row.version))].map(
                (version) => (
                  <MenuItem key={version} value={version}>
                    {version}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
          <FormControl fullWidth disabled={!selectedVersion}>
            <InputLabel id="color-label">Color</InputLabel>
            <Select labelId="color-label" value={selectedColor} onChange={handleColorChange} label="Color">
              <MenuItem value="">All</MenuItem>
              {[
                ...new Set(
                  allRows
                    .filter((row) => row.model === selectedModel && row.version === selectedVersion)
                    .map((row) => row.color)
                ),
              ].map((color) => (
                <MenuItem key={color} value={color}>
                  {color}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <p variant="h6">
            Select Car Type
          </p>
          <FormControl fullWidth>
            <InputLabel id="car-type-label">Car Type</InputLabel>
            <Select labelId="car-type-label" value={selectedCarType} onChange={handleCarTypeChange} label="Car Type">
              <MenuItem value="">All</MenuItem>
              {[...new Set(allRows.map((row) => row.carType))].map((carType) => (
                <MenuItem key={carType} value={carType}>
                  {carType}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <br />
          <div className="discount-amount-section" style={{ marginTop: '-36px' }}>
            <p variant="h6" >BOOKING AMOUNT</p><br />
            <FormControl fullWidth>
              <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                value={bookingAmount}
                onChange={handleDiscountAmountChange}
                startAdornment={<InputAdornment position="start">₹</InputAdornment>}
                label="Amount"
              />
            </FormControl>
            <div style={{ marginTop: '16px' }}>
              <Button variant="contained" onClick={handleApplyDiscount}>Submit</Button>
            </div>
          </div>

        </div>

        <div className="right-panel">

          <>
            <p variant="h6"  >
              Available Cars
            </p>
            {filteredRows.length > 0 ? (
              <TableContainer component={Paper} style={{ marginTop: '30px' }}>
                <Table>
                  <TableHead>
                    <TableRow style={{ backgroundColor: '#dbdbdb' }}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={filteredRows.every((_, index) => selectedRows.includes(index))}
                          onChange={() => {
                            if (filteredRows.every((_, index) => selectedRows.includes(index))) {
                              setSelectedRows([]);
                            } else {
                              setSelectedRows(filteredRows.map((_, index) => index));
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>Model</TableCell>
                      <TableCell>Version</TableCell>
                      <TableCell>Color</TableCell>
                      <TableCell>Car Type</TableCell>
                      <TableCell>Booking Amount</TableCell>
                      <TableCell>Showroom Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredRows.map((row, index) => (
                      <TableRow key={index} hover>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedRows.includes(index)}
                            onChange={() => handleCheckboxChange(index)}
                          />
                        </TableCell>
                        <TableCell>{row.model.charAt(0) + row.model.slice(1)}</TableCell>
                        <TableCell>{row.version}</TableCell>
                        <TableCell>{row.color}</TableCell>
                        <TableCell>{row.carType}</TableCell>
                        <TableCell>{row.bookingAmount}</TableCell>
                        <TableCell>{row.exShowroomPrice}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>No cars available for the selected criteria.</Typography>
            )}
          </>
          <>
            <div className="discount-amount-section-mobile" style={{ marginTop: '16px' }}>
              <p variant="h6" >BOOKING AMOUNT</p><br />
              <FormControl fullWidth>
                <InputLabel htmlFor="outlined-adornment-amount2">Amount</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount2"
                  value={bookingAmount}
                  onChange={handleDiscountAmountChange}
                  startAdornment={<InputAdornment position="start">₹</InputAdornment>}
                  label="Amount"
                />
              </FormControl>
              <div style={{ marginTop: '16px' }}>
                <Button variant="contained" onClick={handleApplyDiscount}>Submit</Button>
              </div>
            </div>
            <br />
          </>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-19px', marginRight: '9px' }}>
        <Button variant="contained" onClick={() => window.history.back()}>
          Back
        </Button>
      </div>
    </>

  );
}
