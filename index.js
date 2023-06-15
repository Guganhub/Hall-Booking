const express = require('express');
const app = express();
app.use(express.json());


app.get('/',(req,res)=>{
    res.status(200).send(`
    <h1>Hall Booking Api</h1>
    <p>The Route for displaying all rooms are "/rooms"</p>
    <p>The Route for displaying the booking of the room is "/bookings"</p>
    <p>The Route for diplaying the rooms with booked data is "/rooms/bookings"</p>
    <p>The Route for displaying all customers with booked data "/customers/bookings"</p>
    `)

})

// Array to store room data
const rooms = [];

// Array to store booking data
const bookings = [];

// Create a new room
app.post('/rooms', (req, res) => {
  const { roomNumber, seats, amenities, pricePerHour } = req.body;
  const newRoom = {
    roomNumber,
    seats,
    amenities,
    pricePerHour
  };
  rooms.push(newRoom);
  res.status(201).send({ message: 'Room created successfully', room: newRoom });
});

// Book a room
app.post('/bookings', (req, res) => {
  const { customerName, date, startTime, endTime, roomId } = req.body;
  const room = rooms.find((room) => room.roomNumber === roomId);
  console.log(room)

  if (!room) {
    res.status(404).send({ message: 'Room not found' });
  } else {
    // Perform any validation or checks here (e.g., room availability)

    const booking = {
      customerName,
      date,
      startTime,
      endTime,
      room
    };

    bookings.push(booking); // Save the booking

    res.status(201).send({ message: 'Booking created successfully', booking });
  }
});

// Get all rooms with booked data
app.get('/rooms/bookings', (req, res) => {
  const roomBookings = rooms.map((room) => {
    const booking = bookings.find((booking) => booking.room.roomNumber === room.roomNumber);
    
    return {
      roomName: room.roomNumber,
      booked: !!booking,
      customerName: booking ? booking.customerName : null,
      date: booking ? booking.date : null,
      startTime: booking ? booking.startTime : null,
      endTime: booking ? booking.endTime : null
    };
  });
  res.send(roomBookings);
});

// Get all customers with booked data
app.get('/customers/bookings', (req, res) => {
    const customerBookings = bookings.map((booking) => {
      return {
        customerName: booking.customerName,
        roomName: booking.room.roomNumber,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime
      };
    });
    res.send(customerBookings);
  });

// Get all rooms
app.get('/rooms', (req, res) => {
  res.send(rooms);
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
